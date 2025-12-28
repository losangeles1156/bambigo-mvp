import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const ODPT_PROD = 'https://api.odpt.org/api/v4';
const TOKEN = process.env.ODPT_API_TOKEN;

async function inspectStation() {
    const ODPT_PUB = 'https://api-public.odpt.org/api/v4';
    const operator = 'odpt.Operator:Toei';
    const url = `${ODPT_PUB}/odpt:StationTimetable?odpt:operator=${operator}&limit=1`;

    console.log(`Fetching: ${url}`);

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error('Error:', res.status, res.statusText);
            const text = await res.text();
            console.error('Body:', text);
            return;
        }

        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));

        // Check for specific facility keywords
        if (data.length > 0) {
            const s = data[0];
            console.log('\n--- Analysis ---');
            console.log('Keys:', Object.keys(s));
            if (s['odpt:barrierfreeFacility']) console.log('Barrier Free:', s['odpt:barrierfreeFacility']);
            if (s['odpt:platformInformation']) console.log('Platform Info:', s['odpt:platformInformation']);
            if (s['odpt:stationFacility']) console.log('Station Facility:', s['odpt:stationFacility']);
        }

    } catch (e: any) {
        console.error('Exception:', e.message);
    }
}

inspectStation();
