import { createClient } from '@supabase/supabase-js';

// Mock env if needed, or rely on process.env from run_command
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase Env Vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkL2Data() {
    console.log('--- Checking L2 Train Data (transit_dynamic_snapshot) ---');

    // Check for Tokyo Station (JR)
    const tokyoId = 'odpt:Station:JR-East.Tokyo';
    const { data: tokyoData, error: tokyoError } = await supabase
        .from('transit_dynamic_snapshot')
        .select('*')
        .eq('station_id', tokyoId);

    if (tokyoError) console.error('Error fetching Tokyo:', tokyoError);
    else {
        console.log(`Found ${tokyoData?.length} records for Tokyo (${tokyoId})`);
        if (tokyoData && tokyoData.length > 0) {
            console.log('Latest Tokyo Data:', JSON.stringify(tokyoData[0], null, 2));
        } else {
            // Try Physical ID if logical failed
            console.log('Trying Physical ID for Tokyo...');
            const { data: phyData } = await supabase
                .from('transit_dynamic_snapshot')
                .select('*')
                .eq('station_id', 'odpt.Station:JR-East.Yamanote.Tokyo');
            console.log('Physical ID Results:', phyData?.length);
        }
    }

    // Check for global recent updates
    const { data: recent, error: recentError } = await supabase
        .from('transit_dynamic_snapshot')
        .select('station_id, updated_at, status_code')
        .order('updated_at', { ascending: false })
        .limit(5);

    console.log('\n--- 5 Most Recent Updates ---');
    if (recent) {
        recent.forEach(r => console.log(`${r.updated_at} | ${r.station_id} | ${r.status_code}`));
    } else {
        console.error('Error fetching recent:', recentError);
    }
}

checkL2Data();
