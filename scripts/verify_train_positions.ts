
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const ODPT_API_KEY = process.env.ODPT_API_KEY || process.env.ODPT_API_TOKEN;
const ODPT_BASE_URL = 'https://api.odpt.org/api/v4';

async function verifyTrainPositions() {
    if (!ODPT_API_KEY) {
        console.log('❌ ODPT_API_KEY is missing');
        return;
    }

    const url = `${ODPT_BASE_URL}/odpt:Train?acl:consumerKey=${ODPT_API_KEY}`;
    console.log(`📡 Fetching Train Positions: ${url}`);

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.log(`❌ API Error: ${res.status}`);
            return;
        }
        const data = await res.json();
        console.log(`✅ Total Trains Fetched: ${data.length}`);

        // Analyze distribution
        const operators: Record<string, number> = {};
        const lines: Record<string, number> = {};

        data.forEach((t: any) => {
            const op = t['odpt:operator'].replace('odpt.Operator:', '');
            const line = t['odpt:railway'].replace('odpt.Railway:', '');

            operators[op] = (operators[op] || 0) + 1;
            lines[line] = (lines[line] || 0) + 1;
        });

        console.log('\n--- Operators Distribution ---');
        console.table(operators);

        console.log('\n--- Top 10 Lines ---');
        const sortedLines = Object.entries(lines).sort((a, b) => b[1] - a[1]).slice(0, 10);
        // Test 2: Specific Fetch for Tokyo Metro
        const metroUrl = `${url}&odpt:operator=odpt.Operator:TokyoMetro`;
        console.log(`\n📡 Fetching Tokyo Metro: ${metroUrl}`);
        const resMetro = await fetch(metroUrl);
        const dataMetro = await resMetro.json();
        console.log(`✅ Metro Trains: ${dataMetro.length}`);

        // Test 3: Specific Fetch for JR East
        const jrUrl = `${url}&odpt:operator=odpt.Operator:JR-East`;
        console.log(`\n📡 Fetching JR East: ${jrUrl}`);
        const resJr = await fetch(jrUrl);
        const dataJr = await resJr.json();
        console.log(`✅ JR East Trains: ${dataJr.length}`);

        // Test 4: Specific Fetch for Yurikamome (just in case)
        const yuriUrl = `${url}&odpt:operator=odpt.Operator:Yurikamome`;
        const resYuri = await fetch(yuriUrl);
        const dataYuri = await resYuri.json();
        console.log(`✅ Yurikamome Trains: ${dataYuri.length}`);

    } catch (e) {
        console.error('Exception:', e);
    }
}

verifyTrainPositions();
