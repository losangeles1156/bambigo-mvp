import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SEED_NODES } from '@/lib/nodes/seedNodes';

export const dynamic = 'force-dynamic';

function toNumber(value: string | null): number | null {
    if (value === null) return null;
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    return n;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function haversineMeters(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
    const R = 6371000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

function parseLocation(loc: any): { coordinates: [number, number] } {
    if (!loc) return { coordinates: [0, 0] };
    if (loc.coordinates && Array.isArray(loc.coordinates)) {
        return { coordinates: [loc.coordinates[0], loc.coordinates[1]] };
    }
    if (typeof loc === 'string' && loc.startsWith('POINT')) {
        const matches = loc.match(/\(([^)]+)\)/);
        if (matches) {
            const parts = matches[1].trim().split(/\s+/);
            return { coordinates: [parseFloat(parts[0]), parseFloat(parts[1])] };
        }
    }
    if (loc.type === 'Point' && loc.coordinates) {
        return { coordinates: loc.coordinates as [number, number] };
    }
    return { coordinates: [0, 0] };
}

function getFallbackNodes() {
    return SEED_NODES.map((n: any) => {
        const location = parseLocation(n.location);
        return {
            id: String(n.id ?? ''),
            city_id: String(n.city_id ?? ''),
            name: n.name ?? { 'zh-TW': '車站', ja: '駅', en: 'Station' },
            type: String(n.type ?? 'station'),
            location,
            geohash: String(n.geohash ?? ''),
            vibe: n.vibe ?? null,
            is_hub: typeof n.is_hub === 'boolean' ? n.is_hub : !(n.parent_hub_id ?? null),
            parent_hub_id: n.parent_hub_id ?? null,
            zone: String(n.zone ?? 'core')
        };
    }).filter(n => Boolean(n.id));
}

export async function GET(req: Request) {
    const url = new URL(req.url);

    const swLat = toNumber(url.searchParams.get('swLat'));
    const swLon = toNumber(url.searchParams.get('swLon'));
    const neLat = toNumber(url.searchParams.get('neLat'));
    const neLon = toNumber(url.searchParams.get('neLon'));
    const zoomRaw = toNumber(url.searchParams.get('zoom'));

    if (swLat === null || swLon === null || neLat === null || neLon === null || zoomRaw === null) {
        return NextResponse.json({ error: 'Missing or invalid viewport parameters' }, { status: 400 });
    }

    const zoom = clamp(Math.round(zoomRaw), 1, 22);
    const page = clamp(Math.floor(toNumber(url.searchParams.get('page')) ?? 0), 0, 1000);

    const maxDataSizeKb = clamp(Math.floor(toNumber(url.searchParams.get('max_kb')) ?? 350), 50, 2000);

    const defaultPageSize = zoom < 11 ? 200 : zoom < 14 ? 500 : 900;
    const requestedPageSize = Math.floor(toNumber(url.searchParams.get('page_size')) ?? defaultPageSize);
    const pageSize = clamp(requestedPageSize, 50, 1000);

    const hubsOnlyParam = url.searchParams.get('hubs_only');
    const hubsOnly = hubsOnlyParam === '1' || hubsOnlyParam === 'true' || zoom < 11;

    const minLat = Math.min(swLat, neLat);
    const maxLat = Math.max(swLat, neLat);
    const minLon = Math.min(swLon, neLon);
    const maxLon = Math.max(swLon, neLon);

    const center = { lat: (minLat + maxLat) / 2, lon: (minLon + maxLon) / 2 };
    const corner = { lat: maxLat, lon: maxLon };

    const radiusMetersRaw = haversineMeters(center, corner) * 1.12;
    const maxRadius = zoom < 11 ? 80000 : zoom < 14 ? 50000 : 25000;
    const radiusMeters = clamp(radiusMetersRaw, 800, maxRadius);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Check if we should use fallback due to missing config or explicit request
    const useFallback = !supabaseUrl || !supabaseKey || url.searchParams.get('fallback') === '1';
    
    let candidates: any[] = [];
    let degraded = false;
    let source: 'supabase' | 'fallback' = 'supabase';

    if (useFallback) {
        degraded = true;
        source = 'fallback';
        candidates = getFallbackNodes();
        if (!supabaseUrl || !supabaseKey) {
            console.log('[api/nodes/viewport] Supabase configuration missing, using fallback data');
        }
    } else {
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data, error } = await supabase.rpc('nearby_nodes', {
                center_lat: center.lat,
                center_lon: center.lon,
                radius_meters: Math.round(radiusMeters)
            });

            if (error) {
                degraded = true;
                source = 'fallback';
                candidates = getFallbackNodes();

                console.warn('[api/nodes/viewport] Supabase RPC failed, using fallback', {
                    code: (error as any).code,
                    message: (error as any).message
                });
            } else {
                candidates = (data as any[] | null | undefined) || [];
            }
        } catch (err: any) {
            degraded = true;
            source = 'fallback';
            candidates = getFallbackNodes();
            console.error('[api/nodes/viewport] Unexpected error fetching from Supabase:', err.message);
        }
    }
    const filtered = candidates
        .map(n => {
            const location = parseLocation((n as any).location ?? (n as any).coordinates);
            const isHub = typeof (n as any).is_hub === 'boolean' ? (n as any).is_hub : !(n as any).parent_hub_id;

            return {
                id: String((n as any).id ?? ''),
                city_id: String((n as any).city_id ?? ''),
                name: (n as any).name ?? { 'zh-TW': '車站', ja: '駅', en: 'Station' },
                type: String((n as any).type ?? 'station'),
                location,
                geohash: String((n as any).geohash ?? ''),
                vibe: (n as any).vibe ?? null,
                is_hub: isHub,
                parent_hub_id: (n as any).parent_hub_id ?? null,
                zone: String((n as any).zone ?? 'core')
            };
        })
        .filter(n => {
            const [lon, lat] = n.location.coordinates;
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
            if (lat < minLat || lat > maxLat || lon < minLon || lon > maxLon) return false;
            if (hubsOnly && !n.is_hub) return false;
            return true;
        })
        .sort((a, b) => {
            const da = (a.location.coordinates[1] - center.lat) ** 2 + (a.location.coordinates[0] - center.lon) ** 2;
            const db = (b.location.coordinates[1] - center.lat) ** 2 + (b.location.coordinates[0] - center.lon) ** 2;
            return da - db;
        });

    // Implement truncation to respect maxDataSizeKb
    // A rough estimation: each node is about 0.4KB to 0.6KB in JSON
    const estimatedNodeSizeKb = 0.5;
    const maxNodesAllowed = Math.floor(maxDataSizeKb / estimatedNodeSizeKb);
    
    const limitedNodes = filtered.slice(0, Math.min(filtered.length, pageSize, maxNodesAllowed));
    const hasMore = filtered.length > limitedNodes.length;

    return NextResponse.json({
        nodes: limitedNodes,
        page,
        page_size: pageSize,
        total_in_viewport: filtered.length,
        has_more: hasMore,
        degraded,
        source
    });
}
