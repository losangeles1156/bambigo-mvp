/**
 * GET /api/wards/[wardId] - Get ward details with Hubs and nodes
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ wardId: string }> }
) {
    const { wardId } = await params;
    const url = new URL(req.url);
    const includeNodes = url.searchParams.get('include_nodes') !== '0';
    const includeHubs = url.searchParams.get('include_hubs') !== '1';
    const nodeLimit = parseInt(url.searchParams.get('limit') || '100');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Fetch ward details
        const { data: ward, error: wardError } = await supabase
            .from('wards')
            .select(`
                id,
                name_i18n,
                prefecture,
                ward_code,
                boundary,
                center_point,
                priority_order,
                is_active,
                node_count,
                hub_count
            `)
            .eq('id', wardId)
            .single();

        if (wardError || !ward) {
            return NextResponse.json({ error: 'Ward not found' }, { status: 404 });
        }

        const response: any = {
            ward: {
                ...ward,
                center_point: ward.center_point ? {
                    lat: ward.center_point.coordinates?.[1] || 0,
                    lng: ward.center_point.coordinates?.[0] || 0
                } : null
            }
        };

        // Fetch Hubs in this ward (via hub_members -> hub_metadata)
        if (!includeHubs) {
            // First get node IDs in this ward
            const { data: wardNodeIds } = await supabase
                .from('nodes')
                .select('id')
                .eq('ward_id', wardId);

            const nodeIds = wardNodeIds?.map(n => n.id) || [];

            if (nodeIds.length > 0) {
                const { data: hubs } = await supabase
                    .from('hub_members')
                    .select(`
                        hub_id,
                        hub_metadata:hubs!inner (
                            id,
                            name_i18n,
                            primary_operator,
                            hub_category,
                            child_count
                        )
                    `)
                    .in('node_id', nodeIds);

                if (hubs) {
                    // Deduplicate hubs
                    const hubMap = new Map();
                    for (const h of hubs) {
                        if (h.hub_metadata && !hubMap.has(h.hub_id)) {
                            hubMap.set(h.hub_id, h.hub_metadata);
                        }
                    }
                    response.hubs = Array.from(hubMap.values());
                }
            }
        }

        // Fetch nodes in this ward
        if (includeNodes) {
            const { data: nodes, error: nodesError } = await supabase
                .from('nodes')
                .select(`
                    id,
                    name_i18n,
                    operator,
                    coordinates,
                    is_hub,
                    parent_hub_id,
                    ward_id,
                    odpt_platform_codes,
                    accessibility_status,
                    tags
                `)
                .eq('ward_id', wardId)
                .order('is_hub', { ascending: false })
                .order('name_i18n')
                .limit(nodeLimit);

            if (nodesError) {
                console.error('[api/wards/[wardId]] Error fetching nodes:', nodesError);
                return NextResponse.json({ error: nodesError.message }, { status: 500 });
            }

            response.nodes = nodes?.map((n: any) => ({
                ...n,
                coordinates: n.coordinates ? {
                    lat: n.coordinates.coordinates?.[1] || 0,
                    lng: n.coordinates.coordinates?.[0] || 0
                } : null
            }));

            response.node_count = nodes?.length || 0;
        }

        // Calculate bounds from nodes if available
        if (response.nodes?.length > 0) {
            const lats = response.nodes.map((n: any) => n.coordinates?.lat || 0);
            const lngs = response.nodes.map((n: any) => n.coordinates?.lng || 0);
            response.bounds = {
                minLat: Math.min(...lats),
                maxLat: Math.max(...lats),
                minLng: Math.min(...lngs),
                maxLng: Math.max(...lngs)
            };
        }

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, max-age=3600, s-maxage=86400'
            }
        });
    } catch (err: any) {
        console.error('[api/wards/[wardId]] Unexpected error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
