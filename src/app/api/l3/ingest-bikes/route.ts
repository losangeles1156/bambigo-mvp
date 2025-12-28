import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow longer processing for spatial queries

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { provider, stations } = body; // stations: GBFS station objects

        if (!stations || !Array.isArray(stations) || stations.length === 0) {
            return NextResponse.json({ message: 'No stations provided' }, { status: 200 });
        }

        console.log(`[L3 Bike Ingest] Processing ${stations.length} stations from ${provider}`);

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        let matchCount = 0;
        let insertCount = 0;

        // Process in smaller chunks to avoid generic timeouts if loop is heavy
        // But for <500 items, a simple loop with parallel promises might be okay or efficient enough.

        // We need to match each bike station to a Node (Metro Station)
        // Strategy: Efficiently find nearest node within 200m using PostGIS RPC (if native query)
        // But Supabase JS client doesn't support complex PostGIS joins easily without RPC.
        // Option 1: RPC 'match_bike_stations' (Best performance)
        // Option 2: JS Loop - Fetch all active nodes (125) and do Haversine in memory (Fastest for small N)

        // Given 125 nodes and 500 bikes per batch: 125 * 500 = 62,500 comparisons.
        // In-memory Haversine is extremely fast (< 10ms for this size).
        // Let's use In-Memory Matching to avoid complex RPC deployment for now.

        // 1. Fetch All Active Nodes
        const { data: nodes, error: nodeError } = await supabase
            .from('nodes')
            .select('id, coordinates')
            .eq('is_active', true);

        if (nodeError) throw nodeError;

        // Helper: Haversine Distance (meters)
        function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
            const R = 6371000; // Radius of the earth in m
            const dLat = deg2rad(lat2 - lat1);
            const dLon = deg2rad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat1)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        }

        function deg2rad(deg: number) {
            return deg * (Math.PI / 180);
        }

        // 2. Process Matches
        const facilitiesToUpsert: any[] = [];
        const RADIUS_METERS = 300; // Increased to 300m for better coverage

        for (const bike of stations) {
            // Safety check for lat/lon
            if (!bike.lat || !bike.lon) continue;

            let nearestNodeId = null;
            let minDist = Infinity;

            for (const node of nodes) {
                // Parse Node GeoJSON POINT(lng lat)
                let nLat = 0, nLng = 0;
                if (typeof node.coordinates === 'string' && node.coordinates.startsWith('POINT')) {
                    const match = node.coordinates.match(/POINT\(([-0-9.]+) ([-0-9.]+)\)/);
                    if (match) {
                        nLng = parseFloat(match[1]);
                        nLat = parseFloat(match[2]);
                    }
                } else {
                    continue; // Skip invalid node coords
                }

                const dist = getDistanceFromLatLonInM(bike.lat, bike.lon, nLat, nLng);
                if (dist < RADIUS_METERS && dist < minDist) {
                    minDist = dist;
                    nearestNodeId = node.id;
                }
            }

            // If matched
            if (nearestNodeId) {
                matchCount++;

                // Construct attributes from GBFS
                const attributes = {
                    provider: provider,
                    external_id: bike.station_id,
                    capacity: bike.capacity || bike.vehicle_capacity || 0,
                    address: bike.address,
                    distance_to_station: Math.round(minDist),
                    rental_uris: bike.rental_uris
                };

                facilitiesToUpsert.push({
                    station_id: nearestNodeId,
                    type: 'bikeshare',
                    name_i18n: {
                        en: bike.name,
                        ja: bike.name // GBFS usually comes in one lang, often has JP chars
                    },
                    location_coords: `POINT(${bike.lon} ${bike.lat})`,
                    attributes: attributes,
                    updated_at: new Date().toISOString()
                });
            }
        }

        // 3. Upsert Implementation
        // To avoid duplicates logic complexity:
        // We want to update if (station_id + type + attributes->external_id) matches?
        // Since we don't have a unique constraint on JSONB, we can't simple upsert safely without ID.
        // MVP Strategy:
        // Query existing bikeshare facilities for these stations and dedupe in JS? Or just Insert.
        // Actually, let's look up match by `external_id` inside `attributes`.
        // Fetch all existing 'bikeshare' facilities (not too many total).
        if (facilitiesToUpsert.length > 0) {
            // 3a. Get existing bikeshare facilities to map external_id -> uuid
            const { data: existing, error: existError } = await supabase
                .from('l3_facilities')
                .select('id, attributes')
                .eq('type', 'bikeshare');

            if (!existError && existing) {
                const existingMap = new Map(); // external_id -> uuid
                existing.forEach((f: any) => {
                    const extId = f.attributes?.external_id;
                    if (extId) existingMap.set(extId, f.id);
                });

                // Attach ID if exists
                facilitiesToUpsert.forEach(f => {
                    const extId = f.attributes.external_id;
                    if (existingMap.has(extId)) {
                        f.id = existingMap.get(extId);
                    }
                });
            }

            // 3b. Upsert
            const { error: upsertError } = await supabase
                .from('l3_facilities')
                .upsert(facilitiesToUpsert);

            if (upsertError) throw upsertError;
            insertCount = facilitiesToUpsert.length;
        }

        return NextResponse.json({
            success: true,
            total_received: stations.length,
            matched: matchCount,
            upserted: insertCount,
            message: `Processed ${stations.length} bikes, matched ${matchCount} to stations.`
        });

    } catch (error: any) {
        console.error('[L3 Bike Ingest] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
