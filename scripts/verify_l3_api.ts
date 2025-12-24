import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verify(stationId: string) {
    const url = `http://localhost:3000/api/station/${encodeURIComponent(stationId)}/facilities`;
    console.log(`Fetching from ${url}...`);
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();

        console.log(`[${stationId}] Source: ${json.source}`);
        console.log(`[${stationId}] ID Match: ${json.stationId === stationId ? 'PASS' : 'FAIL'}`);
        console.log(`[${stationId}] Facilities: ${json.facilities?.length || 0}`);

        if (json.stationId !== stationId) {
            console.error('CRITICAL: Station ID mismatch!');
        }
    } catch (e) {
        console.error(`Failed to fetch ${stationId}`, e);
    }
}

async function main() {
    // Test Taito Stations
    await verify('odpt:Station:TokyoMetro.Ueno');
    await verify('odpt:Station:Toei.Asakusa');
    await verify('odpt:Station:TokyoMetro.Inaricho');
}

main();
