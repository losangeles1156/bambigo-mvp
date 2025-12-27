import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Use Service Key for full access (bypass RLS) if available, otherwise Anon
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function monitorProgress() {
    console.log('=== L1 Ingestion Monitor ===');
    console.log(`Time: ${new Date().toLocaleTimeString()}`);

    // 1. Get Total Active Stations (The "Goal")
    // Filter by same logic as Workflow V24 (JR-East, TokyoMetro, Toei, Keisei, Tsukuba)
    const { data: nodes, error: nodesError } = await supabase
        .from('nodes')
        .select('id')
        .eq('is_active', true);

    if (nodesError) {
        console.error('Error fetching nodes:', nodesError);
        return;
    }

    const targetOperators = ['JR-East', 'TokyoMetro', 'Toei', 'Keisei', 'TsukubaExpress', 'jr'];
    const targetNodes = nodes.filter((n: any) =>
        targetOperators.some(op => n.id.toLowerCase().includes(op.toLowerCase()))
    );

    console.log(`\n🎯 Target Context: ${targetNodes.length} Stations`);

    // 2. Get Ingested Stations (Status)
    // We count distinct station_ids in l1_places
    // Supabase JS doesn't support .distinct() easily on select count, so we use RPC or raw query if possible across all rows.
    // Or we fetch all distinct station_ids. Since it's only ~128 stations max, fetching the list of IDs is fine.

    // Efficient way:
    const { data: places, error: placesError } = await supabase
        .from('l1_places')
        .select('station_id');

    if (placesError) {
        console.error('Error fetching places:', placesError);
        return;
    }

    // Count unique station IDs
    // Also track count per station
    const stationsWithData = new Set<string>();
    const countsPerStation: Record<string, number> = {};

    places.forEach((p: any) => {
        stationsWithData.add(p.station_id);
        countsPerStation[p.station_id] = (countsPerStation[p.station_id] || 0) + 1;
    });

    const ingestedCount = stationsWithData.size;
    const progress = Math.round((ingestedCount / targetNodes.length) * 100);

    console.log(`📊 Progress: ${ingestedCount} / ${targetNodes.length} (${progress}%) Stations have data.`);
    console.log(`📦 Total Items: ${places.length} POIs stored.`);

    // 3. Status Breakdown
    const missing = targetNodes.filter((n: any) => !stationsWithData.has(n.id));

    // Sort completed by count
    const completedList = Object.entries(countsPerStation)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10); // Top 10

    console.log('\n🏆 Top Ingested Stations (by POI count):');
    completedList.forEach(([id, count]) => {
        console.log(`  - ${id}: ${count} items`);
    });

    if (missing.length > 0) {
        console.log(`\n⏳ Pending Stations (${missing.length} remaining):`);
        // Show first 5 and last 5
        missing.slice(0, 5).forEach((n: any) => console.log(`  [ ] ${n.id}`));
        if (missing.length > 10) console.log('  ...');
        missing.slice(-5).forEach((n: any) => console.log(`  [ ] ${n.id}`));
    } else {
        console.log('\n✅ All target stations have at least some data!');
    }

    // 4. Fallback Detection (The "Ueno" Bug)
    const fallbackIds = ['tokyo.jr.ueno', 'tokyo.jr.tokyo', 'tokyo.jr.akihabara', 'tokyo.metro.asakusa'];
    const detectedFallbacks = Object.keys(countsPerStation).filter(id => fallbackIds.includes(id));

    if (detectedFallbacks.length > 0) {
        console.log('\n⚠️  WARNING: Detected Fallback/Legacy IDs (Please Delete):');
        detectedFallbacks.forEach(id => console.log(`  xxxx ${id}`));
        console.log('Run SQL: DELETE FROM l1_places WHERE station_id IN (\'' + detectedFallbacks.join("', '") + '\');');
    }
}

monitorProgress();
