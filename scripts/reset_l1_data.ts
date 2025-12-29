
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function resetL1Data() {
    console.log('🚨 WARNING: This will DELETE ALL DATA from l1_places table.');
    console.log('Starting in 5 seconds...');
    await new Promise(r => setTimeout(r, 5000));

    console.log('Deleting...');
    const { count, error } = await supabase
        .from('l1_places')
        .delete()
        .neq('station_id', 'PLACEHOLDER_FOR_DELETE_ALL'); // .delete() requires a filter usually, generic filter to match all

    if (error) {
        console.error('❌ Error deleting l1_places:', error.message);
    } else {
        console.log(`✅ Deleted ${count ?? 'all'} rows from l1_places.`);
    }
}

resetL1Data();
