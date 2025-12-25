
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugNodeData() {
    console.log('--- Debugging Node Data ---');

    // 1. Fetch Ueno (Hub -> parent_hub_id should be NULL)
    const { data: ueno } = await supabase
        .from('nodes')
        .select('id, name, parent_hub_id, node_type')
        .eq('id', 'odpt:Station:TokyoMetro.Ueno')
        .single();

    // 2. Fetch Inaricho (Spoke -> parent_hub_id should be SET)
    const { data: inaricho } = await supabase
        .from('nodes')
        .select('id, name, parent_hub_id, node_type')
        .eq('id', 'odpt:Station:TokyoMetro.Inaricho') // Assuming this ID exists from seed
        .single();

    console.log('\n--- Working Node (Ueno) ---');
    console.log(JSON.stringify(ueno, null, 2));

    if (inaricho) {
        console.log('\n--- Spoke Node (Inaricho) ---');
        console.log(JSON.stringify(inaricho, null, 2));
    } else {
        console.log('\n⚠️ Inaricho not found.');
    }
}

debugNodeData();
