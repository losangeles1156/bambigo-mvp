import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectLocation() {
    const { data, error } = await supabase
        .from('nodes')
        .select('id, name, location')
        .limit(5);

    if (error) {
        console.error(error);
        return;
    }

    console.log('Raw Data Samples:');
    data.forEach(row => {
        console.log(`ID: ${row.id}`);
        console.log(`Location Type: ${typeof row.location}`);
        console.log(`Location Value:`, row.location);
        console.log('---');
    });
}

inspectLocation();
