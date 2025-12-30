import { NextRequest, NextResponse } from 'next/server';

const TOKEN_STANDARD = process.env.ODPT_API_KEY || process.env.ODPT_API_TOKEN;
const TOKEN_CHALLENGE = process.env.ODPT_API_TOKEN_BACKUP || process.env.ODPT_API_KEY;

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
    const token = key === 'JR-East' ? TOKEN_CHALLENGE : TOKEN_STANDARD;
    if (!token) return [];
    const odptSearchParams = new URLSearchParams({
        'odpt:operator': id,
        'acl:consumerKey': token
    });
    const apiUrl = `${baseUrl}/odpt:TrainInformation?${odptSearchParams.toString()}`;

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
    if (!TOKEN_STANDARD && !TOKEN_CHALLENGE) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });

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

    return NextResponse.json(results, {
        headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
        }
    });
}
