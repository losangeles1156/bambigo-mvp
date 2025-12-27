
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkGlobalProgress() {
    const { count, error } = await supabase
        .from('l1_places')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`=== Global L1 Data Count ===`);
    console.log(`Total Places: ${count}`);

    // Also check distinct stations
    const { data, error: distinctError } = await supabase
        .from('l1_places')
        .select('station_id');

    if (!distinctError && data) {
        const stations = new Set(data.map(d => d.station_id));
        console.log(`Covering Stations: ${stations.size}`);
        console.log(`Station IDs:`, Array.from(stations).slice(0, 5), '...');
    }
}

checkGlobalProgress();
