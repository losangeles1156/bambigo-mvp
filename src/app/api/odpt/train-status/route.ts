import { NextRequest, NextResponse } from 'next/server';

const ODPT_API_KEY = process.env.ODPT_API_KEY;

// Base URLs
// ... imports unchanged
const BASE_URL_STANDARD = 'https://api.odpt.org/api/v4';
const BASE_URL_CHALLENGE = 'https://api-challenge.odpt.org/api/v4'; // Fixed URL

const OPERATOR_MAP: Record<string, string> = {
    'TokyoMetro': 'odpt.Operator:TokyoMetro',
    'Toei': 'odpt.Operator:Toei',
    'JR-East': 'odpt.Operator:JR-East'
};

async function fetchForOperator(key: string, id: string) {
    const baseUrl = key === 'JR-East' ? BASE_URL_CHALLENGE : BASE_URL_STANDARD;
    const apiUrl = `${baseUrl}/odpt:TrainInformation?odpt:operator=${id}&acl:consumerKey=${ODPT_API_KEY}`;

    try {
        const res = await fetch(apiUrl, { next: { revalidate: 60 } }); // Cache 60s
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        console.error(`Fetch failed for ${key}`, e);
        return [];
    }
}

export async function GET(req: NextRequest) {
    if (!ODPT_API_KEY) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const operatorParam = searchParams.get('operator');

    let results = [];

    if (operatorParam && OPERATOR_MAP[operatorParam]) {
        // Single Operator
        results = await fetchForOperator(operatorParam, OPERATOR_MAP[operatorParam]);
    } else {
        // Fetch All
        const promises = Object.entries(OPERATOR_MAP).map(([key, id]) => fetchForOperator(key, id));
        const allData = await Promise.all(promises);
        results = allData.flat();
    }

    return NextResponse.json(results);
}
