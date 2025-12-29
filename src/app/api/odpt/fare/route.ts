import { NextRequest, NextResponse } from 'next/server';

const ODPT_API_KEY = process.env.ODPT_API_KEY;
const BASE_URL = 'https://api.odpt.org/api/v4/odpt:RailwayFare';

export async function GET(req: NextRequest) {
    if (!ODPT_API_KEY) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const fromStation = searchParams.get('from');
    const toStation = searchParams.get('to');

    if (!fromStation || !toStation) {
        return NextResponse.json({ error: 'Missing from/to station' }, { status: 400 });
    }

    // Attempt to guess operator from station ID (e.g. odpt:Station:TokyoMetro.Ginza.Ueno -> TokyoMetro)
    // But fares might be cross-operator. For MVP, we search strictly by `odpt:fromStation` and `odpt:toStation`.

    // We try to fetch fares where `fromStation` matches.
    // Note: ODPT API filtering by fromStation is efficient.
    const apiUrl = `${BASE_URL}?odpt:fromStation=${fromStation}&odpt:toStation=${toStation}&acl:consumerKey=${ODPT_API_KEY}`;

    try {
        const res = await fetch(apiUrl, { next: { revalidate: 3600 } }); // Cache 1 hour
        if (!res.ok) throw new Error('ODPT API Error');

        const data = await res.json();

        if (data.length === 0) {
            return NextResponse.json({ found: false, message: 'No direct fare found. Transfer might be required.' });
        }

        // Return simplified fare info
        const fares = data.map((entry: any) => ({
            ticket: entry['odpt:ticketFare'],
            ic: entry['odpt:icCardFare'],
            operator: entry['odpt:operator'],
            from: entry['odpt:fromStation'],
            to: entry['odpt:toStation']
        }));

        return NextResponse.json({ found: true, fares });

    } catch (error) {
        console.error('Fare API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch fare' }, { status: 500 });
    }
}
