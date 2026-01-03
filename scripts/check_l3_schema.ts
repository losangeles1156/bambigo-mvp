
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

async function checkL3Schema() {
    console.log('--- Checking L3 Facilities Schema ---');
    const { data, error } = await supabase
        .from('l3_facilities')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error selecting from l3_facilities:', error);
    } else if (data && data.length > 0) {
        console.log('Sample row keys:', Object.keys(data[0]));
    } else {
        console.log('Table l3_facilities is empty, cannot infer keys from data.');
    }
}

checkL3Schema();
