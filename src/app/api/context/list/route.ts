import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Fallback data if DB is empty or RPC fails
const FALLBACK_STATIONS = [
    { id: 'tokyo.jr.ueno', name: { ja: '上野', en: 'Ueno', 'zh-TW': '上野' }, location: { lat: 35.7141, lng: 139.7774 } },
    { id: 'tokyo.jr.tokyo', name: { ja: '東京', en: 'Tokyo', 'zh-TW': '東京' }, location: { lat: 35.6812, lng: 139.7671 } },
    { id: 'tokyo.jr.akihabara', name: { ja: '秋葉原', en: 'Akihabara', 'zh-TW': '秋葉原' }, location: { lat: 35.6984, lng: 139.7731 } },
    { id: 'tokyo.metro.asakusa', name: { ja: '浅草', en: 'Asakusa', 'zh-TW': '淺草' }, location: { lat: 35.7119, lng: 139.7976 } },
];

export async function GET() {
    try {
        console.log('[API] Fetching all active nodes for L1 Workflow context...');

        // Try RPC first (same method used by frontend)
        const { data, error } = await supabase
            .rpc('nearby_nodes', {
                user_lat: 35.6895,
                user_lon: 139.6917,
                radius_meters: 50000
            });

        if (error || !data || data.length === 0) {
            console.warn('[API] RPC failed or empty, using fallback:', error?.message);
            return NextResponse.json({
                count: FALLBACK_STATIONS.length,
                nodes: FALLBACK_STATIONS
            });
        }

        // Transform RPC result to simpler format for n8n
        const nodes = data.map((n: any) => ({
            id: n.id,
            name: n.name,
            location: n.location ? {
                lat: n.location.coordinates?.[1] || 35.7141,
                lng: n.location.coordinates?.[0] || 139.7774
            } : { lat: 35.7141, lng: 139.7774 }
        }));

        return NextResponse.json({
            count: nodes.length,
            nodes
        });

    } catch (error) {
        console.error('List Context API Error:', error);
        // Return fallback even on error
        return NextResponse.json({
            count: FALLBACK_STATIONS.length,
            nodes: FALLBACK_STATIONS
        });
    }
}
