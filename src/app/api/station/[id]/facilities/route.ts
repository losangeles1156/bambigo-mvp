
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const stationId = params.id;

        // Fetch L3 facilities
        const { data, error } = await supabase
            .from('l3_facilities')
            .select('*')
            .eq('station_id', stationId);

        if (error) {
            console.error('[API] L3 Fetch Error:', error);
            return NextResponse.json({ error: 'Database Error' }, { status: 500 });
        }

        // Transform to frontend format if necessary
        // The frontend expects { facilities: [ { type, location: string|obj, attributes } ] }

        const facilities = (data || []).map((row: any) => ({
            type: row.type, // toilet, locker, etc.
            location: row.name_i18n || { en: 'Location', ja: '場所' }, // Backend stores localized name
            attributes: row.attributes || {}
        }));

        return NextResponse.json({
            stationId,
            facilities
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
