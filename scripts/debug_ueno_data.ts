
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

async function main() {
    console.log("--- Debugging Ueno Data ---");

    // 0. Inspect l1_places Schema
    const { data: l1Sample, error: l1SchemaError } = await supabase.from('l1_places').select('*').limit(1);
    if (l1Sample && l1Sample.length > 0) {
        console.log("L1 Places Schema Keys:", Object.keys(l1Sample[0]));
    } else {
        console.log("L1 Places Table seems empty or inaccessible.", l1SchemaError);
    }

    // 1. Find Ueno Node
    const { data: nodes, error: nodeError } = await supabase
        .from('nodes')
        .select('*')
        .or('id.ilike.%Ueno%,name->>en.ilike.%Ueno%')
        .limit(10);

    if (nodeError) {
        console.error("Error fetching nodes:", nodeError);
        return;
    }

    console.log(`Found ${nodes.length} nodes matching 'Ueno':`);

    for (const node of nodes) {
        console.log(`\n[Node] ID: ${node.id}, Name: ${JSON.stringify(node.name)}`);

        // 2. Check L3 Facilities
        const { count: l3Count, error: l3Error } = await supabase
            .from('l3_facilities')
            .select('*', { count: 'exact', head: true })
            .eq('station_id', node.id);

        console.log(`   - L3 Facilities Count: ${l3Count} (Error: ${l3Error?.message || 'None'})`);

        // 3. check L1 count for this node (if station_id or node_id exists)
        if (l1Sample && l1Sample.length > 0) {
            const hasStationId = 'station_id' in l1Sample[0];
            const hasNodeId = 'node_id' in l1Sample[0];

            if (hasStationId) {
                const { count } = await supabase.from('l1_places').select('*', { count: 'exact', head: true }).eq('station_id', node.id);
                console.log(`   - L1 Places (by station_id): ${count}`);
            } else if (hasNodeId) {
                const { count } = await supabase.from('l1_places').select('*', { count: 'exact', head: true }).eq('node_id', node.id);
                console.log(`   - L1 Places (by node_id): ${count}`);
            } else {
                console.log("   - Cannot link L1 directly by ID (needs geo query)");
            }
        }
    }
}

main().catch(console.error);
