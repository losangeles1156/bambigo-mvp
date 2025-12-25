import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verify() {
    const stationId = 'odpt:Station:TokyoMetro.Ueno';
    const url = `http://localhost:3000/api/station/${encodeURIComponent(stationId)}/facilities`;
    try {
        const res = await fetch(url);
        const json = await res.json();
        console.log(`UENO SOURCE: ${json.source}`);
    } catch (e) {
        console.error('Error', e);
    }
}
verify();
