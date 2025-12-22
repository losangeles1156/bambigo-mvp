
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyHybridSnapshot() {
    console.log('--- Verifying Hybrid Dynamic Snapshot ---');

    const { data, error } = await supabase
        .from('transit_dynamic_snapshot')
        .select(`
            *,
            stations_static (
                l1_ai_personality_summary
            )
        `)
        .order('updated_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error('❌ Error fetching snapshot:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('✅ Found latest snapshot:');
        console.log(JSON.stringify(data[0], null, 2));
    } else {
        console.log('⚠️ No data found in transit_dynamic_snapshot.');
        console.log('This might be normal if n8n has not executed or no delays triggered.');
    }
}

verifyHybridSnapshot();
