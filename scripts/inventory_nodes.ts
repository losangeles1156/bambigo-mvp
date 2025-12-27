
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function inventory() {
    // First, just get one row to inspect structure
    const { data: sample, error: sampleError } = await supabase
        .from('nodes')
        .select('*')
        .limit(1);

    if (sampleError) {
        console.error('Sample Error:', sampleError);
    } else if (sample && sample.length > 0) {
        console.log('Sample Keys:', Object.keys(sample[0]));
    }

    // Then get all IDs and Names
    const { data: nodes, error } = await supabase
        .from('nodes')
        .select('id, name');

    if (error) {
        console.error(error);
        return;
    }

    console.log(`=== Node Inventory (${nodes.length}) ===`);
    nodes.forEach(node => {
        console.log(`${node.id} | ${JSON.stringify(node.name)}`);
    });
}

inventory();
