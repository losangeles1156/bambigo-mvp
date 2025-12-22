
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get('station_id');

    if (!stationId) {
        return NextResponse.json({ error: 'Missing station_id' }, { status: 400 });
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
            .gt('updated_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // 15 mins expiry
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error('Error fetching L2 status:', error);
            return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
        }

        return NextResponse.json(data?.value || null);
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
