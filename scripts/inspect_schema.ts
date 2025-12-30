import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const table = process.argv[2] || 'nodes';
    console.log(`Inspecting table: ${table}`);
    
    const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log('Available Columns:', Object.keys(data[0]));
        console.log('Sample Data:', data[0]);
    } else {
        console.log('Table empty or no access.');
    }
}

main();
