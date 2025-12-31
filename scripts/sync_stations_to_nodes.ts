
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function normalizeLonLat(lonRaw: unknown, latRaw: unknown): [number, number] | null {
    const lon = Number(lonRaw);
    const lat = Number(latRaw);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    if (lon === 0 && lat === 0) return null;

    if (Math.abs(lon) <= 180 && Math.abs(lat) <= 90) return [lon, lat];
    if (Math.abs(lat) <= 180 && Math.abs(lon) <= 90) return [lat, lon];
    return null;
}

function extractLonLat(value: any): [number, number] | null {
    if (!value) return null;

    if (typeof value === 'string') {
        const m = value.match(/POINT\s*\(\s*([-0-9\.]+)\s+([-0-9\.]+)\s*\)/i);
        if (!m) return null;
        return normalizeLonLat(m[1], m[2]);
    }

    if (Array.isArray(value) && value.length >= 2) {
        return normalizeLonLat(value[0], value[1]);
    }

    const coords =
        (Array.isArray(value?.coordinates?.coordinates) ? value.coordinates.coordinates : null) ??
        (Array.isArray(value?.coordinates) ? value.coordinates : null) ??
        (Array.isArray(value?.geometry?.coordinates) ? value.geometry.coordinates : null);

    if (Array.isArray(coords) && coords.length >= 2) {
        return normalizeLonLat(coords[0], coords[1]);
    }

    return null;
}

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
        const id = String((s as any).id ?? (s as any).station_id ?? '');
        const lonLat = extractLonLat((s as any).location);

        return {
            id,
            city_id: (s as any).city_id || 'tokyo_core',
            name: s.name,
            coordinates: lonLat ? { type: 'Point', coordinates: lonLat } : null,
            node_type: (s as any).type || (s as any).node_type || 'station',
            is_active: true,
            // zone: s.zone || 'core', // Temporarily disabled as column is missing in nodes table
            updated_at: new Date().toISOString()
        };
    }).filter(n => {
        const ok = Boolean(n.id) && Boolean(n.name) && Boolean(n.coordinates);
        if (!ok) console.warn(`⚠️ Skipping ${n.id || '(missing id)'} due to invalid data.`);
        return ok;
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
