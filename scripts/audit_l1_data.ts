import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function auditL1Data() {
    console.log('=== L1 Data Quality Audit ===\n');

    // 1. Audit Parks (Nature Category)
    console.log('--- Nature Category (Park) Audit ---');
    const { data: parks, error: parkError } = await supabase
        .from('l1_places')
        .select('name, tags, station_id')
        .eq('category', 'nature');

    if (parkError) console.error('Error fetching parks:', parkError);
    else {
        const suspiciousParks = parks.filter(p => {
            const tags = p.tags as any;
            // Major parks usually have wikipedia/wikidata or are named with "Park" (恩賜公園, etc)
            // Community parks are often just "XXX Park" (XXX公園) without fame tags
            const isFamous = tags.wikipedia || tags.wikidata;
            const isLarge = tags.leisure === 'park' && (tags.name.includes('恩賜') || tags.name.includes('御苑') || tags.name.includes('皇居'));
            return !isFamous && !isLarge;
        });

        console.log(`Total Parks: ${parks.length}`);
        console.log(`Small/Community Parks detected: ${suspiciousParks.length}`);
        console.log('Sample of small parks:');
        suspiciousParks.slice(0, 10).forEach(p => console.log(`  - ${p.name} (Station: ${p.station_id})`));
    }

    // 2. Audit Duplicates across Stations
    console.log('\n--- Cross-Station Duplicate Audit ---');
    const { data: allPlaces, error: allPlacesError } = await supabase
        .from('l1_places')
        .select('osm_id, name, station_id');

    if (allPlacesError) console.error('Error fetching all places:', allPlacesError);
    else {
        const osmIdToStations: Record<string, string[]> = {};
        allPlaces.forEach(p => {
            if (!osmIdToStations[p.osm_id]) osmIdToStations[p.osm_id] = [];
            osmIdToStations[p.osm_id].push(p.station_id);
        });

        const duplicates = Object.entries(osmIdToStations).filter(([_, stations]) => stations.length > 1);
        console.log(`Duplicate POIs across multiple stations: ${duplicates.length}`);

        console.log('Top duplicates:');
        duplicates.slice(0, 5).forEach(([id, stations]) => {
            const name = allPlaces.find(p => p.osm_id === id)?.name;
            console.log(`  - ${name} (${id}): [${stations.join(', ')}]`);
        });

        // Count duplicates specifically for the suspicious Ueno triangle
        const uenoTriangle = ['odpt.Station:Toei.Oedo.UenoOkachimachi', 'odpt.Station:TokyoMetro.Ginza.UenoHirokoji', 'odpt:Station:JR-East.Okachimachi', 'odpt.Station:TokyoMetro.Chiyoda.Yushima'];
        const triangleDuplicates = duplicates.filter(([_, stations]) =>
            stations.some(s => uenoTriangle.includes(s))
        );
        console.log(`\nDuplicates involving Ueno/Okachimachi/Yushima stations: ${triangleDuplicates.length}`);
    }
}

auditL1Data();
