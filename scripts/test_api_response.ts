/**
 * Simulate API call to /api/nodes/viewport
 * Run: npx tsx scripts/test_api_response.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Simulate the API's fetch logic
async function simulateAPICall() {
    if (!supabaseUrl || !supabaseKey) {
        console.log('❌ Missing Supabase credentials');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('='.repeat(60));
    console.log('Simulating /api/nodes/viewport API Call');
    console.log('='.repeat(60));

    // These are the parameters the API uses
    const center = { lat: 35.7138, lon: 139.7773 }; // Ueno
    const radiusMeters = 50000; // 50km
    const maxResults = 8000;

    console.log(`\nParameters:`);
    console.log(`  Center: ${center.lat}, ${center.lon}`);
    console.log(`  Radius: ${radiusMeters}m`);
    console.log(`  Max Results: ${maxResults}`);

    // Step 1: Try nearby_nodes_v2 (new RPC)
    console.log('\n[1] Trying nearby_nodes_v2...');
    let candidates: any[] = [];
    let source: 'supabase' | 'fallback' = 'supabase';
    let degraded = false;

    try {
        const { data, error } = await supabase
            .rpc('nearby_nodes_v2', {
                center_lat: center.lat,
                center_lon: center.lon,
                radius_meters: radiusMeters,
                max_results: maxResults
            });

        if (error) {
            console.log(`     ❌ Error: ${error.message.substring(0, 60)}...`);
        } else {
            candidates = (data as any[]) || [];
            console.log(`     ✓ Success! Got ${candidates.length} nodes`);
        }
    } catch (err: any) {
        console.log(`     ❌ Exception: ${err.message}`);
    }

    // Step 2: Fall back to nearby_nodes if v2 fails
    if (candidates.length === 0) {
        console.log('\n[2] Falling back to nearby_nodes...');
        try {
            const { data, error } = await supabase
                .rpc('nearby_nodes', {
                    center_lat: center.lat,
                    center_lon: center.lon,
                    radius_meters: radiusMeters
                });

            if (error) {
                console.log(`     ❌ Error: ${error.message.substring(0, 60)}...`);
            } else {
                candidates = (data as any[]) || [];
                console.log(`     ✓ Success! Got ${candidates.length} nodes`);
            }
        } catch (err: any) {
            console.log(`     ❌ Exception: ${err.message}`);
        }
    }

    // Step 3: Filter to show only hub nodes (hubsOnly=true)
    console.log('\n[3] Filtering for hubsOnly=true...');
    console.log(`     Before filter: ${candidates.length} nodes`);

    const filtered = candidates
        .map((n: any) => {
            const parentHubId = n.parent_hub_id;
            const hasParentHub = parentHubId !== null && parentHubId !== undefined;
            const isHub = !hasParentHub;

            return {
                ...n,
                is_hub: isHub,
                parent_hub_id: parentHubId,
                // Simulate parseLocation
                location: n.coordinates ? {
                    coordinates: [n.coordinates.coordinates?.[0] || 0, n.coordinates.coordinates?.[1] || 0]
                } : { coordinates: [0, 0] }
            };
        })
        .filter((n: any) => {
            // Filter out invalid coordinates
            const [lon, lat] = n.location.coordinates;
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
            if (lat === 0 && lon === 0) return false;

            // Filter out child nodes (hubsOnly=true)
            const hasParent = n.parent_hub_id !== null && n.parent_hub_id !== undefined;
            if (hasParent) return false;

            return true;
        });

    console.log(`     After filter: ${filtered.length} nodes`);

    // Step 4: Show results
    console.log('\n[4] Visible Nodes (will be shown on map):');
    console.log('-'.repeat(60));

    if (filtered.length === 0) {
        console.log('     🚨 No nodes would be visible!');
        console.log('\n     Possible causes:');
        console.log('       1. All nodes have parent_hub_id set');
        console.log('       2. Coordinates are invalid');
        console.log('       3. Viewport/radius parameters are wrong');
    } else {
        filtered.slice(0, 10).forEach((n: any) => {
            const name = n.name?.['zh-TW'] || n.name?.['ja'] || n.name || 'Unknown';
            console.log(`     ✓ ${name}`);
            console.log(`       ID: ${n.id?.substring(0, 40)}...`);
            console.log(`       is_hub: ${n.is_hub}, parent_hub_id: ${n.parent_hub_id ? 'set' : 'null'}`);
        });

        if (filtered.length > 10) {
            console.log(`     ... and ${filtered.length - 10} more nodes`);
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('DIAGNOSIS');
    console.log('='.repeat(60));

    if (filtered.length === 0) {
        console.log('\n  🚨 PROBLEM: No nodes would be displayed on the map!');
        console.log('\n  Root cause candidates:');
        console.log('    1. All nodes in viewport have parent_hub_id set');
        console.log('    2. RPC functions returning wrong data');
        console.log('    3. API fallback to SEED_NODES with issues');

        // Check candidates
        if (candidates.length > 0) {
            const withParent = candidates.filter((n: any) => n.parent_hub_id !== null).length;
            console.log(`\n  Among ${candidates.length} candidates:`);
            console.log(`    - ${candidates.length - withParent} have parent_hub_id=null`);
            console.log(`    - ${withParent} have parent_hub_id set`);
        }
    } else {
        console.log(`\n  ✓ ${filtered.length} nodes would be visible on the map`);
        console.log('\n  If map is still empty, check:');
        console.log('    1. Frontend console for errors');
        console.log('    2. Network tab for API response');
        console.log('    3. Map viewport coordinates');
    }

    console.log('\n' + '='.repeat(60));
}

simulateAPICall().catch(console.error);
