
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

async function checkCompletion() {
    const ids = [
        'odpt:Station:TokyoMetro.Hiroo',
        'odpt:Station:TokyoMetro.Roppongi',
        'odpt:Station:TokyoMetro.Akasakamitsuke',
        'odpt:Station:Toei.Kachidoki',
        'odpt:Station:Toei.Tsukishima',
        'odpt:Station:Toei.Oedo.Roppongi',
        'odpt:Station:JR-East.Hamamatsucho',
        'odpt:Station:TokyoMetro.Shimbashi'
    ];

    console.log('--- Verification Report ---');
    for (const id of ids) {
        // Check L1
        const { count: l1 } = await supabase.from('l1_places').select('*', { count: 'exact', head: true }).eq('station_id', id);

        // Check L3
        // JR uses stations_static.l3_services
        // Others use l3_facilities
        let l3 = 0;
        if (id.includes('JR-East')) {
            const { data } = await supabase.from('stations_static').select('l3_services').eq('station_id', id).single();
            l3 = data?.l3_services?.length || 0;
        } else {
            const { count } = await supabase.from('l3_facilities').select('*', { count: 'exact', head: true }).eq('station_id', id);
            l3 = count || 0;
        }

        console.log(`${id}: L1=${l1}, L3=${l3}`);
    }
}
checkCompletion();
