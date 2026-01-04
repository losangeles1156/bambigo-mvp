/**
 * Assign nodes to wards based on coordinates
 * Run: npx tsx scripts/assign_nodes_to_wards.ts
 *
 * This script:
 * 1. Fetches all wards with their boundaries
 * 2. Fetches all nodes with coordinates
 * 3. For each node, determines which ward it belongs to
 * 4. Updates the node's ward_id column
 * 5. Updates ward statistics (node_count, hub_count)
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as turf from '@turf/turf';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface Ward {
    id: string;
    name_i18n: { 'zh-TW': string; 'ja': string; 'en': string };
    boundary: any;
    center_point: any;
}

interface Node {
    id: string;
    coordinates: any;
    is_hub: boolean;
    parent_hub_id: string | null;
}

async function assignNodesToWards() {
    if (!supabaseUrl || !supabaseKey) {
        console.log('❌ Missing Supabase credentials');
        console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY are set in .env.local');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('='.repeat(60));
    console.log('Ward Assignment Script');
    console.log('='.repeat(60));

    // Step 1: Fetch all wards with boundaries
    console.log('\n[1/4] Fetching wards...');
    const { data: wards, error: wardError } = await supabase
        .from('wards')
        .select('id, name_i18n, boundary, center_point')
        .eq('is_active', true);

    if (wardError) {
        console.log('❌ Error fetching wards:', wardError.message);
        return;
    }

    if (!wards || wards.length === 0) {
        console.log('❌ No wards found. Please run the migration first.');
        console.log('   Run: supabase db push');
        return;
    }

    console.log(`✓ Found ${wards.length} wards`);

    // Convert PostGIS geometry to Turf.js features
    const wardFeatures: Ward[] = wards.map((w: any) => ({
        ...w,
        boundary: w.boundary ? turf.feature(w.boundary) : null
    }));

    // Step 2: Fetch all nodes
    console.log('\n[2/4] Fetching nodes...');
    const { data: nodes, error: nodeError } = await supabase
        .from('nodes')
        .select('id, coordinates, is_hub, parent_hub_id')
        .eq('is_active', true);

    if (nodeError) {
        console.log('❌ Error fetching nodes:', nodeError.message);
        return;
    }

    if (!nodes || nodes.length === 0) {
        console.log('❌ No nodes found.');
        return;
    }

    console.log(`✓ Found ${nodes.length} nodes`);

    // Step 3: Assign each node to a ward
    console.log('\n[3/4] Assigning nodes to wards...');
    let assigned = 0;
    let notFound = 0;
    let errors = 0;
    const wardCounts: Record<string, { total: number; hubs: number }> = {};

    // Initialize ward counts
    for (const ward of wardFeatures) {
        wardCounts[ward.id] = { total: 0, hubs: 0 };
    }

    for (const node of nodes) {
        try {
            // Parse coordinates from PostGIS format
            const coords = parseCoordinates(node.coordinates);
            if (!coords) {
                console.log(`  ⚠️ Skipping ${node.id}: invalid coordinates`);
                continue;
            }

            const [lng, lat] = coords;
            const point = turf.point([lng, lat]);

            // Find the ward this node belongs to
            let foundWardId: string | null = null;

            // First, try polygon containment check
            for (const ward of wardFeatures) {
                if (!ward.boundary) continue;

                try {
                    if (turf.booleanPointInPolygon(point, ward.boundary)) {
                        foundWardId = ward.id;
                        break;
                    }
                } catch (e) {
                    // Skip invalid geometry
                    continue;
                }
            }

            // If no polygon match, use nearest center point
            if (!foundWardId) {
                let nearestDistance = Infinity;
                for (const ward of wardFeatures) {
                    if (!ward.center_point) continue;

                    try {
                        const wardPoint = turf.point([
                            ward.center_point.coordinates[0],
                            ward.center_point.coordinates[1]
                        ]);
                        const distance = turf.distance(point, wardPoint, { units: 'kilometers' });
                        if (distance < nearestDistance && distance < 10) { // Within 10km
                            nearestDistance = distance;
                            foundWardId = ward.id;
                        }
                    } catch (e) {
                        continue;
                    }
                }
            }

            if (foundWardId) {
                // Update node's ward_id
                const { error: updateError } = await supabase
                    .from('nodes')
                    .update({ ward_id: foundWardId })
                    .eq('id', node.id);

                if (updateError) {
                    console.log(`  ❌ Error updating ${node.id}:`, updateError.message);
                    errors++;
                } else {
                    assigned++;
                    wardCounts[foundWardId].total++;
                    if (node.is_hub && !node.parent_hub_id) {
                        wardCounts[foundWardId].hubs++;
                    }
                }
            } else {
                notFound++;
                // console.log(`  ⚠️ No ward found for: ${node.id}`);
            }
        } catch (e: any) {
            console.log(`  ❌ Error processing ${node.id}:`, e.message);
            errors++;
        }

        // Progress indicator
        if (assigned % 50 === 0) {
            process.stdout.write(`\r  Progress: ${assigned}/${nodes.length} nodes processed...`);
        }
    }

    console.log(`\r  Progress: ${nodes.length}/${nodes.length} nodes processed...`);

    console.log('\n  Results:');
    console.log(`    ✓ Assigned: ${assigned}`);
    console.log(`    ⚠️ Not in any ward: ${notFound}`);
    console.log(`    ❌ Errors: ${errors}`);

    // Step 4: Update ward statistics
    console.log('\n[4/4] Updating ward statistics...');

    for (const ward of wardFeatures) {
        const stats = wardCounts[ward.id];

        const { error: updateError } = await supabase
            .from('wards')
            .update({
                node_count: stats.total,
                hub_count: stats.hubs,
                updated_at: new Date().toISOString()
            })
            .eq('id', ward.id);

        if (updateError) {
            console.log(`  ❌ Error updating ${ward.id}:`, updateError.message);
        } else {
            const name = ward.name_i18n['zh-TW'] || ward.name_i18n['ja'] || ward.id;
            console.log(`  ✓ ${name}: ${stats.total} nodes, ${stats.hubs} hubs`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('Ward Assignment Complete!');
    console.log('='.repeat(60));
}

/**
 * Parse coordinates from various PostGIS formats to [lng, lat]
 */
function parseCoordinates(coords: any): [number, number] | null {
    if (!coords) return null;

    // Handle PostGIS geography format: {"type": "Point", "coordinates": [lng, lat], "crs": {...}}
    if (coords.coordinates && Array.isArray(coords.coordinates)) {
        return [coords.coordinates[0], coords.coordinates[1]];
    }

    // Handle raw array [lng, lat]
    if (Array.isArray(coords) && coords.length >= 2) {
        return [coords[0], coords[1]];
    }

    // Handle WKT format "POINT(lng lat)"
    if (typeof coords === 'string' && coords.startsWith('POINT')) {
        const match = coords.match(/POINT\(([^)]+)\)/);
        if (match) {
            const parts = match[1].trim().split(/\s+/);
            if (parts.length >= 2) {
                return [parseFloat(parts[0]), parseFloat(parts[1])];
            }
        }
    }

    return null;
}

// Run the script
assignNodesToWards().catch(console.error);
