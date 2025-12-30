
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

async function main() {
    console.log('=== Syncing stations_static to nodes ===');

    // 1. Fetch stations_static
    const { data: stations, error } = await supabase
        .from('stations_static')
        .select('*');

    if (error || !stations) {
        console.error('Fetch Error:', error);
        return;
    }

    console.log(`Found ${stations.length} stations in static table.`);

    const toUpsert: any[] = [];

    for (const s of stations) {
        if (!s.name) {
            console.warn(`Skipping ${s.id} due to missing name`);
            continue;
        }

        // Map to nodes schema
        // nodes: id, name (jsonb), coordinates (geo), city_id, node_type, is_active, updated_at
        
        // Parse location
        let coords: any = null;
        if (typeof s.location === 'string') {
            // WKT POINT(lon lat)
            const m = s.location.match(/POINT\(([-0-9\.]+) ([-0-9\.]+)\)/);
            if (m) {
                coords = {
                    type: 'Point',
                    coordinates: [parseFloat(m[1]), parseFloat(m[2])]
                };
            }
        } else {
            coords = s.location; // Assuming already GeoJSON
        }

        toUpsert.push({
            id: s.id,
            name: s.name,
            coordinates: coords,
            city_id: s.city_id || 'tokyo_core',
            node_type: s.type || 'station',
            is_active: true,
            updated_at: new Date().toISOString()
        });
    }

    // 2. Upsert to nodes
    if (toUpsert.length > 0) {
        // Batch in chunks of 100
        const CHUNK_SIZE = 100;
        for (let i = 0; i < toUpsert.length; i += CHUNK_SIZE) {
            const chunk = toUpsert.slice(i, i + CHUNK_SIZE);
            const { error: upsertErr } = await supabase
                .from('nodes')
                .upsert(chunk, { onConflict: 'id' });
            
            if (upsertErr) {
                console.error(`Error syncing chunk ${i}:`, upsertErr.message);
            } else {
                console.log(`Synced ${chunk.length} nodes (batch ${i}).`);
            }
        }
    }
    
    console.log('Sync complete.');
}

main();
