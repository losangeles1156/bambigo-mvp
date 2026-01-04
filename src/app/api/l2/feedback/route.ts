import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// POST /api/l2/feedback
// Body: { stationId: string; crowdLevel: number; userId?: string }
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { stationId, crowdLevel, userId } = body;

        if (!stationId || !crowdLevel) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (crowdLevel < 1 || crowdLevel > 5) {
            return NextResponse.json({ error: 'Invalid crowd level (1-5)' }, { status: 400 });
        }

        // Insert report
        const { error } = await supabaseAdmin
            .from('transit_crowd_reports')
            .insert({
                station_id: stationId,
                crowd_level: crowdLevel,
                user_id: userId || null
            });

        if (error) {
            console.error('[Feedback API] Insert error:', error);
            return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (e) {
        console.error('[Feedback API] Error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
