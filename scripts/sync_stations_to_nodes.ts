
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
    console.log('--- Syncing stations_static to nodes ---');

    // 1. Fetch all from stations_static
    const { data: stations, error: sError } = await supabase
        .from('stations_static')
        .select('*');

    if (sError || !stations) {
        console.error('Error fetching stations:', sError);
        return;
    }

    console.log(`Found ${stations.length} stations in stations_static.`);

    // 2. Map to nodes schema
    const nodesToUpsert = stations.map(s => {
        // Extract lat/lon from location (can be WKT or GeoJSON)
        let lat = 0, lon = 0;
        if (typeof s.location === 'string') {
            const m = s.location.match(/POINT\(([-0-9\.]+) ([-0-9\.]+)\)/);
            if (m) { lon = parseFloat(m[1]); lat = parseFloat(m[2]); }
        } else if (s.location?.coordinates) {
            [lon, lat] = s.location.coordinates;
        }

        return {
            id: s.id,
            city_id: s.city_id || 'tokyo_core',
            name: s.name,
            coordinates: `POINT(${lon} ${lat})`,
            node_type: s.type || 'station',
            is_active: true,
            // zone: s.zone || 'core', // Temporarily disabled as column is missing in nodes table
            updated_at: new Date().toISOString()
        };
    }).filter(n => {
        // Basic validation: must have coords
        const hasCoords = n.coordinates !== 'POINT(0 0)';
        if (!hasCoords) console.warn(`⚠️ Skipping ${n.id} due to missing coordinates.`);
        return hasCoords;
    });

    console.log(`Prepared ${nodesToUpsert.length} nodes for upsert.`);

    // 3. Upsert into nodes
    // We do it in chunks to avoid header overflow or payload limits
    const CHUNK_SIZE = 50;
    for (let i = 0; i < nodesToUpsert.length; i += CHUNK_SIZE) {
        const chunk = nodesToUpsert.slice(i, i + CHUNK_SIZE);
        const { error: nError } = await supabase
            .from('nodes')
            .upsert(chunk, { onConflict: 'id' });

        if (nError) {
            console.error(`Error upserting chunk ${i / CHUNK_SIZE}:`, nError);
        } else {
            console.log(`✅ Upserted chunk ${i / CHUNK_SIZE + 1}/${Math.ceil(nodesToUpsert.length / CHUNK_SIZE)}`);
        }
    }

    console.log('--- Sync complete ---');
}

sync().catch(console.error);
