import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getPedestrianGraph } from '../src/lib/navigation/service';
import { supabaseAdmin } from '../src/lib/supabase';

async function verifyMapData() {
    console.log('--- Verifying Map Data Flow ---');

    // 1. Define a test location (Tokyo Station area)
    const lat = 35.681236;
    const lon = 139.767125;
    const radius = 500;

    console.log(`Fetching graph for Lat: ${lat}, Lon: ${lon}, Radius: ${radius}m`);

    try {
        const result = await getPedestrianGraph(lat, lon, radius);

        console.log(`\nNodes found: ${result.nodes.length}`);
        console.log(`Edges found: ${result.edges.length}`);

        if (result.edges.length > 0) {
            const firstEdge = result.edges[0];
            console.log('\nSample Edge:', JSON.stringify(firstEdge, null, 2));

            // Verify Geometry Format for PedestrianLayer
            // Expectation: geometry is an object with type 'LineString' and coordinates array
            if (firstEdge.geometry && typeof firstEdge.geometry === 'object') {
                if (firstEdge.geometry.type === 'LineString' && Array.isArray(firstEdge.geometry.coordinates)) {
                    console.log('\n[PASS] Edge geometry is valid GeoJSON LineString.');
                    console.log('Coordinates sample:', firstEdge.geometry.coordinates[0]);
                } else {
                    console.error('\n[FAIL] Edge geometry is NOT a valid LineString.');
                }
            } else {
                console.warn('\n[WARN] Edge has no geometry object (might be using fallback WKB or missing).');
                // Check if fallback WKB string exists if we were using raw query
                // But we expect GeoJSON from RPC
            }
        } else {
            console.warn('\n[WARN] No edges found. This might be due to empty DB or location.');
        }

    } catch (error) {
        console.error('\n[ERROR] Failed to fetch graph:', error);
    }
}

verifyMapData();
