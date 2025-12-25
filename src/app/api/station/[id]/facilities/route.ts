import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { STATION_WISDOM, StationFacility } from '@/data/stationWisdom';

// Ideally, import from the shared scraper types if possible, or duplicate the interface
// For Front End consumption, we use the StationStandard types.

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const stationId = decodeURIComponent(params.id);

    // 1. Try to get dynamic data from L3 Snapshots (Supabase)
    try {
        const { data: snapshot, error } = await supabase
            .from('l3_snapshots')
            .select('data')
            .eq('station_id', stationId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (snapshot && snapshot.data) {
            // Found dynamic data!
            return NextResponse.json({
                stationId,
                source: 'live_snapshot',
                facilities: snapshot.data as StationFacility[]
            });
        }
    } catch (err) {
        console.warn('Failed to fetch L3 snapshot, falling back to static wisdom.', err);
    }

    // 2. Fallback to Static Wisdom
    const wisdom = STATION_WISDOM[stationId];
    if (wisdom && wisdom.l3Facilities) {
        return NextResponse.json({
            stationId,
            source: 'static_wisdom',
            facilities: wisdom.l3Facilities
        });
    }

    // 3. No data found
    return NextResponse.json({
        stationId,
        source: 'none',
        facilities: []
    });
}
