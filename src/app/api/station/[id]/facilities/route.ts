
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { STATION_WISDOM } from '@/data/stationWisdom';
import { getStationIdVariants } from '@/lib/constants/stationLines';
import { buildStationIdSearchCandidates } from '@/lib/api/nodes';
import { logUserActivity } from '@/lib/activityLogger';

export const dynamic = 'force-dynamic';

async function fetchStationsStaticFacilities(stationId: string) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            console.warn('[facilities] Supabase credentials missing, skipping DB fetch');
            return [];
        }

        const expandedIds = buildStationIdSearchCandidates(stationId);
        let merged: any[] = [];
        for (const id of expandedIds) {
            const { data } = await supabaseAdmin
                .from('stations_static')
                .select('l3_services')
                .eq('station_id', id)
                .maybeSingle();

            if (data && Array.isArray((data as any).l3_services) && (data as any).l3_services.length > 0) {
                merged = merged.concat((data as any).l3_services);
            }
        }
        return merged;
    } catch (err) {
        console.error('[facilities] DB Fetch Error:', err);
        return [];
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const stationId = params.id;

        await logUserActivity({
            request,
            activityType: 'station_facilities_fetch',
            queryContent: { stationId },
            metadata: { feature: 'l3_facilities' }
        });

        let dbFacilities: any[] = [];
        try {
            dbFacilities = await fetchStationsStaticFacilities(stationId);
        } catch {
            dbFacilities = [];
        }

        const wisdom = (() => {
            for (const v of getStationIdVariants(stationId)) {
                const hit = (STATION_WISDOM as any)[v];
                if (hit) return hit;
            }
            return undefined;
        })();
        const mergedFacilities = [...(dbFacilities || []), ...((wisdom?.l3Facilities || []) as any[])];
        const seen = new Set<string>();
        const deduped = mergedFacilities.filter((f: any) => {
            const key = [
                f?.type,
                typeof f?.location === 'string' ? f.location : JSON.stringify(f?.location || {}),
                f?.floor,
                f?.operator
            ].join('|');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        const facilities = (deduped || []).map((f: any) => ({
            type: f.type,
            location: f.location || { en: 'Location', ja: '場所', zh: '位置' },
            attributes: {
                ...(f.attributes || {}),
                floor: f.floor,
                operator: f.operator,
                source: f.source
            }
        }));

        return NextResponse.json({
            stationId,
            facilities
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
