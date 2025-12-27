
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUeno() {
    const { data, error } = await supabase
        .from('l1_places')
        .select('category, name')
        .eq('station_id', 'tokyo.jr.ueno');

    if (error) {
        console.error('Error:', error);
        return;
    }

    const counts: Record<string, number> = {};
    data.forEach(row => {
        counts[row.category] = (counts[row.category] || 0) + 1;
    });

    console.log('=== Ueno Station L1 Status ===');
    console.log(`Total POIs: ${data.length}`);
    console.table(counts);
}

checkUeno();
