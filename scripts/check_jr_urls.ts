
// Native fetch
// import fetch from 'node-fetch';

const IDS = [
    '204', // Known Ueno
    'JY03', 'AKB', '41', // Akihabara candidates
    '1039', 'TYO', 'JY01', // Tokyo candidates
    'JE02', // Hatchobori
    'KND', 'JY02', // Kanda
    'JY04', // Okachimachi
    'JY06', // Uguisudani
    'JY28', // Hamamatsucho
    '203', '205', '200', '210' // Numeric neighbors
];

async function main() {
    console.log('Checking URL candidates...');

    for (const id of IDS) {
        const url = `https://www.jreast.co.jp/estation/stations/${id}.html`;
        try {
            const res = await fetch(url);
            if (res.ok) {
                const html = await res.text();
                const titleMatch = html.match(/<title>(.*?)<\/title>/);
                console.log(`✅ [${id}] Status: ${res.status}, Title: ${titleMatch?.[1]}`);
            } else {
                console.log(`❌ [${id}] Status: ${res.status}`);
            }
        } catch (e) {
            console.log(`❌ [${id}] Error: ${e.message}`);
        }
    }
}

// Global fetch wrapper if needed
if (!globalThis.fetch) {
    console.error("Native fetch not found. Run with Node 18+");
} else {
    main();
}
