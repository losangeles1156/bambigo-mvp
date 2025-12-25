import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verify() {
    const stationId = 'odpt:Station:TokyoMetro.Tokyo';
    const url = `http://localhost:3000/api/station/${encodeURIComponent(stationId)}/facilities`;
    try {
        console.log(`Checking ${stationId}...`);
        const res = await fetch(url);
        const json = await res.json();
        console.log(`TOKYO SOURCE: ${json.source}`);
        console.log(`Facilities: ${json.facilities?.length}`);
    } catch (e) {
        console.error('Error', e);
    }
}
verify();
