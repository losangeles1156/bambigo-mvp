
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { resolveNodeInheritance } from '../src/lib/nodes/inheritance';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugNodeData() {
    console.log('--- Debugging Node Data ---');

    const uenoId = 'odpt:Station:TokyoMetro.Ueno';
    const inarichoId = 'odpt:Station:TokyoMetro.Inaricho';

    const uenoResolved = await resolveNodeInheritance({ nodeId: uenoId, client: supabase });
    console.log('\n--- Node (Ueno) ---');
    console.log(JSON.stringify(uenoResolved, null, 2));

    const inarichoResolved = await resolveNodeInheritance({ nodeId: inarichoId, client: supabase });
    if (inarichoResolved) {
        console.log('\n--- Node (Inaricho) ---');
        console.log(JSON.stringify(inarichoResolved, null, 2));
    } else {
        console.log('\n⚠️ Inaricho not found.');
    }
}

debugNodeData();
