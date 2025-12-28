
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { supabase } from '../src/lib/supabase';

async function main() {
    const { data: cols, error } = await supabase
        .rpc('get_table_info', { table_name: 'nodes' }); // RPC fallback if direct access fails, but let's try direct SQL via rpc or just inferred from response?
    // Supabase-js doesn't allow direct raw SQL usually unless RPC.
    // Let's just try to insert one and fail, or infer from previous error?
    // Actually, listing types via information_schema requires admin or specific permissions often not exposed via PostgREST.

    // innovative approach: just try to read the 'coordinates' of an existing node to see its format.
    const { data } = await supabase
        .from('nodes')
        .select('coordinates')
        .limit(1);

    if (data && data.length > 0) {
        console.log('Coordinates sample:', JSON.stringify(data[0].coordinates));
        console.log('Type of coordinates:', typeof data[0].coordinates);
    } else {
        console.log('No data to inspect coordinates.');
    }
}

main();
