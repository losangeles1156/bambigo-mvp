import { getStationClusters } from './station_registry';
import { analyzeWiki } from './wiki_analyzer';
import { fetchOsmData, CategoryStat } from './osm_fetcher';
import { getStationProfile } from './hub_profiles';
import fs from 'fs';
import path from 'path';

const OUTPUT_FILE = path.join(__dirname, 'output', 'l1_pipeline_result.json');
const DELAY_MS = 2000; // Delay between stations to be nice to APIs

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const args = process.argv.slice(2);
    const runAll = args.includes('--all');
    
    console.log(`🚀 Starting L1 Pipeline v3.1 (Hub Station Enhanced)${runAll ? ' - FULL MODE' : ''}...`);

    // 1. Get Clusters
    const clusters = getStationClusters(runAll);
    console.log(`📦 Loaded ${clusters.length} station clusters.`);

    let results: any[] = [];
    
    // Load existing results to resume
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            results = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
            console.log(`📂 Loaded ${results.length} existing results. Resuming...`);
        } catch (e) {
            console.warn('⚠️ Could not parse existing output file. Starting fresh.');
        }
    }

    const processedIds = new Set(results.map(r => r.clusterId));

    // 2. Process each cluster
    for (const cluster of clusters) {
        if (processedIds.has(cluster.primaryId)) {
            // console.log(`⏭️ Skipping ${cluster.primaryId} (Already processed)`);
            continue;
        }

        console.log(`\n📍 Processing Cluster: ${cluster.primaryId} (${cluster.ward})...`);
        
        // A. Identify Profile
        const profile = getStationProfile(cluster.primaryId);
        if (profile) {
            console.log(`   💎 Identified as HUB Station: ${profile.name} (${profile.core_vibes.join(', ')})`);
        }

        // B. Wiki Analysis (with Profile context)
        const stationName = typeof cluster.stations[0].name === 'string' 
            ? cluster.stations[0].name 
            : cluster.stations[0].name.ja;
            
        const wikiTitle = cluster.stations[0].wikiTitle || stationName.replace(/駅$/, '') + '駅';
        
        let wikiData;
        try {
            wikiData = await analyzeWiki(wikiTitle, profile);
            console.log(`   📖 Wiki Summary: ${wikiData.summary.substring(0, 50)}...`);
            if (wikiData.seasonalFlags.length > 0) {
                console.log(`   🌸 Seasonal Flags: ${wikiData.seasonalFlags.join(', ')}`);
            }
        } catch (error) {
            console.error(`   ❌ Wiki Error: ${error}`);
            wikiData = { summary: '', seasonalFlags: [] as string[], weightedKeywords: [] };
        }

        // C. OSM Fetching (with Profile overrides)
        const center = cluster.center;
        let categoryStats: CategoryStat[] = [];
        try {
            categoryStats = await fetchOsmData(center.lat, center.lng, wikiData.seasonalFlags, profile);
        } catch (error) {
            console.error(`   ❌ OSM Error: ${error}`);
            // Continue with empty stats rather than crashing
        }

        // D. Vibe Tag Generation (Enhanced)
        const vibeTags = new Set<string>();

        // 1. From Wiki/Profile (High Confidence)
        wikiData.weightedKeywords.forEach(k => vibeTags.add(k.word));
        
        // 2. From OSM Density
        const dining = categoryStats.find(c => c.categoryId === 'dining');
        const shopping = categoryStats.find(c => c.categoryId === 'shopping');
        const nature = categoryStats.find(c => c.categoryId === 'nature');
        const culture = categoryStats.find(c => c.categoryId === 'culture');
        const business = categoryStats.find(c => c.categoryId === 'business');

        if (dining && dining.totalCount >= 50) vibeTags.add('Gourmet Battleground (激戦区)');
        if (shopping && shopping.totalCount >= 50) vibeTags.add('Shoppers Heaven');
        if (business && business.totalCount >= 50) vibeTags.add('Business District');
        if (culture && culture.totalCount >= 10) vibeTags.add('Cultural Hub');

        // 3. Seasonal Logic
        if (wikiData.seasonalFlags.includes('Sakura') && nature && nature.totalCount > 2) {
             // Lower threshold if wiki confirms it
            vibeTags.add('Sakura Spot 🌸');
        }

        results.push({
            clusterId: cluster.primaryId,
            name: cluster.stations[0].name,
            ward: cluster.ward,
            isHub: !!profile,
            profileName: profile?.name,
            location: center,
            wikiAnalysis: wikiData,
            vibeTags: Array.from(vibeTags),
            osmStats: categoryStats.map(s => ({
                category: s.categoryId,
                total: s.totalCount,
                saved: s.savedCount
            })),
            poiSample: categoryStats.flatMap(s => s.places.slice(0, 3)) // Sample 3 per category
        });

        // Save progress incrementally
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
        
        // Sleep to respect rate limits
        await sleep(DELAY_MS);
    }

    console.log(`\n✅ Pipeline Completed! Results saved to: ${OUTPUT_FILE}`);
}

main().catch(console.error);
