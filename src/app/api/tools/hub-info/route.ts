
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    // 1. Find the Hub or Node
    const { data: nodes } = await supabase
        .from('nodes')
        .select('id, name, node_type, parent_hub_id')
        .or(`name->>en.ilike.%${query}%,name->>ja.ilike.%${query}%`)
        .limit(5);

    if (!nodes || nodes.length === 0) {
        return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }

    // Prefer Hub if available
    let targetNode = nodes.find(n => n.node_type === 'hub') || nodes[0];
    
    // Get all related IDs (Hub + Children)
    let relatedIds = [targetNode.id];
    if (targetNode.node_type === 'hub') {
        const { data: children } = await supabase
            .from('nodes')
            .select('id')
            .eq('parent_hub_id', targetNode.id);
        if (children) relatedIds.push(...children.map(c => c.id));
    }

    // Fetch L3 facilities
    const { data: staticData } = await supabase
        .from('stations_static')
        .select('facilities, id')
        .in('id', relatedIds);

    let facilities: Record<string, any> = {};

    if (staticData) {
        // Merge facilities
        staticData.forEach(row => {
             const facs = row.facilities || {};
             if (typeof facs === 'object') {
                 Object.keys(facs).forEach(key => {
                     // @ts-ignore
                     if (facs[key]) {
                        facilities[key] = true; // Simple boolean aggregation for now
                     }
                 });
             }
        });
    }

    // Also check L3 External Links (lockers, etc.) if available in l3_facilities table?
    // Let's check l3_facilities table too.
    const { data: externalLinks } = await supabase
        .from('l3_facilities')
        .select('*')
        .in('station_id', relatedIds);
    
    if (externalLinks) {
        externalLinks.forEach(link => {
            facilities[link.category] = {
                available: true,
                provider: link.provider,
                url: link.url
            };
        });
    }

    return NextResponse.json({
        name: targetNode.name,
        type: targetNode.node_type,
        facilities: facilities,
        node_id: targetNode.id
    });
}
