import { NextRequest, NextResponse } from 'next/server';

const ODPT_API_KEY = process.env.ODPT_API_KEY;
const BASE_URL = 'https://api.odpt.org/api/v4';

export async function GET(req: NextRequest) {
    if (!ODPT_API_KEY) {
        return NextResponse.json({ error: 'ODPT_API_KEY not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode') || 'position'; // 'position' or 'status'
    const railway = searchParams.get('railway'); // e.g., 'odpt.Railway:TokyoMetro.Ginza'

    try {
        if (mode === 'position') {
            // Fetch Train Positions
            let url = `${BASE_URL}/odpt:Train?acl:consumerKey=${ODPT_API_KEY}`;
            if (railway) {
                url += `&odpt:railway=${railway}`;
            }

            const res = await fetch(url, { next: { revalidate: 30 } }); // Cache for 30s
            const data = await res.json();

            // Transform data for the frontend
            const trains = data.map((t: any) => ({
                id: t['owl:sameAs'],
                railway: t['odpt:railway'],
                trainNumber: t['odpt:trainNumber'],
                type: t['odpt:trainType'],
                fromStation: t['odpt:fromStation'],
                toStation: t['odpt:toStation'],
                direction: t['odpt:railDirection'],
                delay: t['odpt:delay'] || 0,
                updatedAt: t['dc:date']
            }));

            return NextResponse.json({ trains });
        } else if (mode === 'status') {
            // ... (existing status logic)
            let url = `${BASE_URL}/odpt:TrainInformation?acl:consumerKey=${ODPT_API_KEY}`;
            if (railway) {
                url += `&odpt:railway=${railway}`;
            }

            const res = await fetch(url, { next: { revalidate: 60 } }); // Cache for 1m
            const data = await res.json();

            const status = data.map((s: any) => ({
                railway: s['odpt:railway'],
                operator: s['odpt:operator'],
                status: s['odpt:trainInformationStatus']?.replace('odpt.TrainInformationStatus:', ''),
                text: s['odpt:trainInformationText']?.['zh-TW'] || s['odpt:trainInformationText']?.ja || s['odpt:trainInformationText'],
                cause: s['odpt:trainInformationCause']?.['zh-TW'] || s['odpt:trainInformationCause']?.ja || s['odpt:trainInformationCause'],
                updatedAt: s['dc:date']
            }));

            return NextResponse.json({ status });
        } else if (mode === 'facility') {
            const station = searchParams.get('station'); // e.g., 'odpt.Station:TokyoMetro.Ginza.Ueno'
            if (!station) return NextResponse.json({ error: 'Station ID required' }, { status: 400 });

            const url = `${BASE_URL}/odpt:StationFacility?odpt:station=${station}&acl:consumerKey=${ODPT_API_KEY}`;
            const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1h (static data)
            const data = await res.json();

            if (!data || data.length === 0) return NextResponse.json({ facilities: [] });

            const facilities = data[0]['odpt:barrierfreeFacility']?.map((f: any, i: number) => ({
                id: `bf-${i}`,
                category: f['odpt:barrierfreeFacilityType']?.replace('odpt.BarrierfreeFacilityType.', '').toLowerCase(),
                location: f['odpt:placeName'] || f['odpt:remark'] || '未知位置',
                attributes: {
                    floor_from: f['odpt:serviceStartStationFloor'],
                    floor_to: f['odpt:serviceEndStationFloor'],
                    wheelchair_accessible: f['odpt:hasWheelchairAccessibleRestroom'] || f['odpt:remark']?.includes('車いす') || f['odpt:barrierfreeFacilityType']?.includes('Elevator'),
                    note: f['odpt:remark']
                }
            })) || [];

            return NextResponse.json({ facilities });
        }

        return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });

    } catch (error: any) {
        console.error('ODPT API Error:', error.message);
        return NextResponse.json({ error: 'Failed to fetch ODPT data' }, { status: 500 });
    }
}
