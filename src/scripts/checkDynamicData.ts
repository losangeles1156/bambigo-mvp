
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
    // Dynamic import to load env vars first
    const { supabaseAdmin } = await import('../lib/supabase');

    console.log('🔍 Checking transit_dynamic_snapshot for recent updates...');

    const { data, error } = await supabaseAdmin
        .from('transit_dynamic_snapshot')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('❌ Error fetching data:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.warn('⚠️  No data found in transit_dynamic_snapshot. Workflow might not have run or failed to write.');
    } else {
        console.log('\n✨ L2 DYNAMIC DATA PREVIEW (Database Record) ✨\n');
        data.forEach(row => {
            const w = row.weather_info || {};
            const isDelay = row.status_code !== 'NORMAL';

            console.log(`╔════════════════════════════════════════╗`);
            console.log(`║ STATION: ${row.station_id.padEnd(29)} ║`);
            console.log(`╠════════════════════════════════════════╣`);
            console.log(`║ 🌤️  WEATHER                            ║`);
            console.log(`║ Temp: ${String(w.temp).padEnd(5)} °C   Condition: ${String(w.condition).padEnd(10)} ║`);
            console.log(`╠════════════════════════════════════════╣`);
            console.log(`║ 🚃 TRAIN STATUS                        ║`);
            console.log(`║ Status: ${isDelay ? '🔴 DELAY' : '🟢 NORMAL'.padEnd(23)}        ║`);
            if (isDelay) {
                console.log(`║ Reason: ${(row.reason_ja || 'N/A').padEnd(23)}        ║`);
            }
            console.log(`╠════════════════════════════════════════╣`);
            console.log(`║ 🕒 Updated: ${new Date(row.updated_at).toLocaleTimeString().padEnd(22)}     ║`);
            console.log(`╚════════════════════════════════════════╝\n`);
        });
    }
}

check();
