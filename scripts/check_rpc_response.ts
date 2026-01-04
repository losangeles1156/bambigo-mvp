/**
 * Check nearby_nodes RPC response format
 * Run: npx tsx scripts/check_rpc_response.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function main() {
    if (!supabaseUrl || !supabaseKey) {
        console.log('❌ Missing Supabase credentials');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('='.repeat(60));
    console.log('Checking nearby_nodes RPC Response');
    console.log('='.repeat(60));

    // Call nearby_nodes (the working fallback)
    const { data, error } = await supabase
        .rpc('nearby_nodes', {
            center_lat: 35.7138,
            center_lon: 139.7773,
            radius_meters: 50000  // 50km to get more nodes
        });

    if (error) {
        console.log('❌ Error:', error.message);
        return;
    }

    console.log(`\n✓ Returned ${(data || []).length} nodes`);
    console.log('-'.repeat(60));

    if (data && data.length > 0) {
        // Show first node structure
        const firstNode = data[0] as any;
        console.log('\nFirst node keys:', Object.keys(firstNode));
        console.log('\nFirst node data:');
        Object.entries(firstNode).forEach(([key, value]) => {
            if (key === 'location') {
                console.log(`  ${key}:`, JSON.stringify(value).substring(0, 100));
            } else if (key === 'parent_hub_id') {
                console.log(`  ${key}:`, value === null ? 'null' : value);
            } else {
                console.log(`  ${key}:`, String(value).substring(0, 50));
            }
        });

        // Analyze parent_hub_id distribution
        const withParent = data.filter((n: any) => n.parent_hub_id !== null).length;
        const withoutParent = data.filter((n: any) => n.parent_hub_id === null).length;

        console.log('\n' + '-'.repeat(60));
        console.log('Visibility Analysis:');
        console.log(`  Nodes with parent_hub_id: ${withParent}`);
        console.log(`  Nodes without parent_hub_id (visible): ${withoutParent}`);

        if (withParent > 0) {
            console.log('\n  Sample nodes with parent_hub_id:');
            data.filter((n: any) => n.parent_hub_id !== null).slice(0, 3).forEach((n: any) => {
                console.log(`    - ${n.id?.substring(0, 50)}...`);
                console.log(`      parent_hub_id: ${n.parent_hub_id?.substring(0, 30)}...`);
            });
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('Conclusion:');
    console.log('='.repeat(60));

    if (data && (data as any[]).length > 0) {
        const visibleCount = (data as any[]).filter((n: any) => n.parent_hub_id === null).length;
        if (visibleCount === 0) {
            console.log('\n  🚨 All returned nodes have parent_hub_id set!');
            console.log('     This means HubNodeLayer will hide all of them!');
        } else {
            console.log(`\n  ✓ ${visibleCount} nodes would be visible`);
        }
    }
}

main().catch(console.error);
