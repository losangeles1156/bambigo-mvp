
// Native fetch used
// import fetch from 'node-fetch';

const START_URL = 'https://www.jreast.co.jp/estation/stations/204.html'; // Ueno
const BASE_URL = 'https://www.jreast.co.jp';

const TARGET_NAMES = [
    'Akihabara', 'Tokyo', 'Hatchobori', 'Kanda', 'Okachimachi', 'Uguisudani', 'Hamamatsucho',
    '秋葉原', '東京', '八丁堀', '神田', '御徒町', '鶯谷', '浜松町'
];

async function main() {
    console.log('Crawling IDs starting from Ueno (204)...');

    // Simple BFS
    const visited = new Set<string>();
    const queue = [START_URL];
    const found = new Map<string, string>(); // Name -> ID

    let count = 0;
    while (queue.length > 0 && count < 20) {
        const url = queue.shift()!;
        if (visited.has(url)) continue;
        visited.add(url);

        console.log(`Visiting ${url}...`);
        try {
            const res = await fetch(url);
            const html = await res.text();

            // console.log(html.slice(0, 500)); // Debug HTML head

            // Extract ALL links for debug
            const allLinksRegex = /href=["']([^"']+)["']/g;
            let m;
            let linkCount = 0;
            while ((m = allLinksRegex.exec(html)) !== null && linkCount < 200) {
                if (m[1].includes('station') || m[1].includes('.html')) {
                    console.log('Debug Link:', m[1]);
                }
                linkCount++;
            }

            // Regex to find IDs in hrefs
            const regex = /stations\/(\d+)\.html/g;
            let match;
            const candidates = new Set<string>();

            while ((match = regex.exec(html)) !== null) {
                candidates.add(match[1]);
            }

            console.log(`Found ${candidates.size} candidate IDs on ${url}`);

            for (const id of candidates) {
                const fullUrl = `https://www.jreast.co.jp/estation/stations/${id}.html`;

                if (visited.has(fullUrl)) continue;

                // We could verify by title, but first just Log
                // Queue for BFS
                queue.push(fullUrl); // Add to queue to crawl deeper if needed

                // Optimization: Fetch HEAD/GET to check title if we are searching for names
                // Only fetch if we haven't identified this ID yet
                if (!Array.from(found.values()).includes(id)) {
                    try {
                        const pageRes = await fetch(fullUrl);
                        const pageHtml = await pageRes.text();
                        const titleMatch = pageHtml.match(/<title>(.*?)<\/title>/);
                        const title = titleMatch ? titleMatch[1] : '';

                        console.log(`Checked ${id}: ${title}`);

                        for (const target of TARGET_NAMES) {
                            if (title.includes(target)) {
                                console.log(`🎯 MATCH: ${target} -> ${id}`);
                                found.set(target, id);
                            }
                        }
                    } catch (err) {
                        console.error(`Failed to check candidate ${id}`);
                    }
                }
            }
        } catch (e) {
            console.error(`Error fetching ${url}:`, e);
        }
        count++;
    }

    console.log('--- Results ---');
    found.forEach((id, name) => console.log(`${name}: ${id}`));
}

main();
