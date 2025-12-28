import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { STATION_LINES } from '@/lib/constants/stationLines';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get('station_id') || searchParams.get('stationId');

    if (!stationId) {
        return NextResponse.json({ error: 'Missing station_id or stationId' }, { status: 400 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('transit_dynamic_snapshot')
            .select(`
                *,
                stations_static (
                    l1_ai_personality_summary
                )
            `)
            .eq('station_id', stationId)
            .gt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Relaxed to 24 hours to handle irregular n8n updates
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('Error fetching L2 status:', error);
            return NextResponse.json({ error: 'Database Error', details: error.message }, { status: 500 });
        }

        if (!data) {
            console.log('[L2 API] No data found in DB for station:', stationId);
            return NextResponse.json(null);
        }

        console.log('[L2 API] Raw DB Data:', data);


        // Transform Flat DB columns (from n8n) to Frontend Interface

        // 1. Get lines for this station (Now returns Rich Objects from upgraded stationLines.ts)
        const lines = STATION_LINES[stationId] || [];

        // 2. Map single DB status to all lines
        const lineStatusArray = lines.map(lineDef => {
            return {
                line: lineDef.name.en, // Keep English name as ID/Key for now
                name: lineDef.name, // Rich Object
                operator: lineDef.operator,
                color: lineDef.color,
                status: data.status_code?.toLowerCase() || 'normal',
                message: (data.status_code === 'DELAY' || data.status_code === 'SUSPENDED')
                    ? (data.reason_ja || data.message || 'Delay')
                    : undefined
            };
        });

        const l2Status = {
            congestion: data.status_code === 'DELAY' ? 4 : (data.status_code === 'SUSPENDED' ? 5 : 2),
            line_status: lineStatusArray,
            weather: {
                temp: data.weather_info?.temp || 0,
                condition: data.weather_info?.condition || 'Unknown',
                wind: data.weather_info?.wind || 0
            },
            updated_at: data.updated_at
        };

        return NextResponse.json(l2Status);
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
