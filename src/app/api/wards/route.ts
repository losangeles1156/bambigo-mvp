/**
 * GET /api/wards - List all wards with optional statistics
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const includeStats = url.searchParams.get('include_stats') === '1';
    const onlyActive = url.searchParams.get('only_active') !== '0';
    const prefecture = url.searchParams.get('prefecture');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        let query = supabase
            .from('wards')
            .select(`
                id,
                name_i18n,
                prefecture,
                ward_code,
                center_point,
                priority_order,
                is_active,
                node_count,
                hub_count
            `);

        if (onlyActive) {
            query = query.eq('is_active', true);
        }

        if (prefecture) {
            query = query.eq('prefecture', prefecture);
        }

        const { data: wards, error } = await query.order('priority_order');

        if (error) {
            console.error('[api/wards] Error fetching wards:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // If stats requested but not pre-computed, calculate on the fly
        let responseData: any = { wards, total: wards?.length || 0 };

        if (includeStats && (!wards?.[0]?.node_count)) {
            // Fetch node counts from nodes table
            const { data: nodeStats } = await supabase
                .from('nodes')
                .select('ward_id, is_hub')
                .not('ward_id', 'is', null);

            if (nodeStats) {
                const wardStats = new Map<string, { total: number; hubs: number }>();

                for (const stat of nodeStats) {
                    if (!stat.ward_id) continue;
                    const current = wardStats.get(stat.ward_id) || { total: 0, hubs: 0 };
                    current.total++;
                    if (stat.is_hub) current.hubs++;
                    wardStats.set(stat.ward_id, current);
                }

                // Merge stats into response
                responseData.wards = wards?.map((w: any) => ({
                    ...w,
                    node_count: wardStats.get(w.id)?.total || 0,
                    hub_count: wardStats.get(w.id)?.hubs || 0,
                    center_point: w.center_point ? {
                        lat: w.center_point.coordinates?.[1] || 0,
                        lng: w.center_point.coordinates?.[0] || 0
                    } : null
                }));
            }
        } else if (wards) {
            // Format center_point for response
            responseData.wards = wards.map((w: any) => ({
                ...w,
                center_point: w.center_point ? {
                    lat: w.center_point.coordinates?.[1] || 0,
                    lng: w.center_point.coordinates?.[0] || 0
                } : null
            }));
        }

        return NextResponse.json(responseData, {
            headers: {
                'Cache-Control': 'public, max-age=86400, s-maxage=86400'
            }
        });
    } catch (err: any) {
        console.error('[api/wards] Unexpected error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
