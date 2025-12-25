import dotenv from 'dotenv';
// Load env before importing any modules that use process.env
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env

async function main() {
    console.log('--- Starting L3 Facility Scraper ---');

    // Dynamic imports to ensure env vars are loaded first
    const { MetroScraper } = await import('./scrapers/metroScraper');
    const { ToeiScraper } = await import('./scrapers/toeiScraper');
    const { JRScraper } = await import('./scrapers/jrScraper');
    const { DataProcessor } = await import('./processor');

    const metroScraper = new MetroScraper();
    const toeiScraper = new ToeiScraper();
    const jrScraper = new JRScraper();
    const processor = new DataProcessor();

    // Taito Ward Targets
    const targets = [
        // --- TAITO WARD ---
        // Ueno (Gateway)
        { scraper: metroScraper, id: 'ueno', url: 'https://www.tokyometro.jp/station/ueno/index.html' },
        { scraper: jrScraper, id: 'ueno', url: 'https://www.jreast.co.jp/estation/station/info.aspx?StationCd=171' },

        // Asakusa (Touristy)
        { scraper: metroScraper, id: 'asakusa', url: 'https://www.tokyometro.jp/station/asakusa/index.html' },
        { scraper: toeiScraper, id: 'asakusa', url: 'https://www.kotsu.metro.tokyo.jp/subway/stations/asakusa.html' },

        // Others in Taito
        { scraper: metroScraper, id: 'inaricho', url: 'https://www.tokyometro.jp/station/inaricho/index.html' },
        { scraper: metroScraper, id: 'tawaramachi', url: 'https://www.tokyometro.jp/station/tawaramachi/index.html' },
        { scraper: toeiScraper, id: 'kuramae', url: 'https://www.kotsu.metro.tokyo.jp/subway/stations/kuramae.html' },
        { scraper: toeiScraper, id: 'shin-okachimachi', url: 'https://www.kotsu.metro.tokyo.jp/subway/stations/shin-okachimachi.html' },
        { scraper: jrScraper, id: 'okachimachi', url: 'https://www.jreast.co.jp/estation/station/info.aspx?StationCd=355' },
        { scraper: jrScraper, id: 'uguisudani', url: 'https://www.jreast.co.jp/estation/station/info.aspx?StationCd=149' },

        // --- CHIYODA WARD ---
        // Tokyo (Hub)
        { scraper: metroScraper, id: 'tokyo', url: 'https://www.tokyometro.jp/station/tokyo/index.html' },
        { scraper: jrScraper, id: 'tokyo', url: 'https://www.jreast.co.jp/estation/station/info.aspx?StationCd=1039' }, // Tokyo JR code check needed, usually 1039 or similar... let's verify if possible or use generic search? JR East IDs are tricky. 1039 is Tokyo.

        // Otemachi (Hub)
        { scraper: metroScraper, id: 'otemachi', url: 'https://www.tokyometro.jp/station/otemachi/index.html' },
        { scraper: toeiScraper, id: 'otemachi', url: 'https://www.kotsu.metro.tokyo.jp/subway/stations/otemachi.html' },

        // Akihabara (Hub)
        { scraper: metroScraper, id: 'akihabara', url: 'https://www.tokyometro.jp/station/akihabara/index.html' },
        { scraper: jrScraper, id: 'akihabara', url: 'https://www.jreast.co.jp/estation/station/info.aspx?StationCd=41' }, // Akihabara JR code is 41

        // Hibiya / Yurakucho
        { scraper: metroScraper, id: 'hibiya', url: 'https://www.tokyometro.jp/station/hibiya/index.html' },
        { scraper: toeiScraper, id: 'hibiya', url: 'https://www.kotsu.metro.tokyo.jp/subway/stations/hibiya.html' },
        { scraper: metroScraper, id: 'yurakucho', url: 'https://www.tokyometro.jp/station/yurakucho/index.html' },
        // Kanda
        { scraper: metroScraper, id: 'kanda', url: 'https://www.tokyometro.jp/station/kanda/index.html' },
        { scraper: jrScraper, id: 'kanda', url: 'https://www.jreast.co.jp/estation/station/info.aspx?StationCd=492' },
        // Kasumigaseki
        { scraper: metroScraper, id: 'kasumigaseki', url: 'https://www.tokyometro.jp/station/kasumigaseki/index.html' },

        // --- CHUO WARD ---
        // Ginza (Hub)
        { scraper: metroScraper, id: 'ginza', url: 'https://www.tokyometro.jp/station/ginza/index.html' },
        // Nihombashi (Hub)
        { scraper: metroScraper, id: 'nihombashi', url: 'https://www.tokyometro.jp/station/nihombashi/index.html' },
        { scraper: toeiScraper, id: 'nihombashi', url: 'https://www.kotsu.metro.tokyo.jp/subway/stations/nihombashi.html' },
        // Kyobashi
        { scraper: metroScraper, id: 'kyobashi', url: 'https://www.tokyometro.jp/station/kyobashi/index.html' },
        // Mitsukoshimae
        { scraper: metroScraper, id: 'mitsukoshimae', url: 'https://www.tokyometro.jp/station/mitsukoshimae/index.html' },
        // Kayabacho
        { scraper: metroScraper, id: 'kayabacho', url: 'https://www.tokyometro.jp/station/kayabacho/index.html' },
        // Hatchobori
        { scraper: metroScraper, id: 'hatchobori', url: 'https://www.tokyometro.jp/station/hatchobori/index.html' },
        // { scraper: jrScraper, id: 'hatchobori', url: 'https://www.jreast.co.jp/estation/station/info.aspx?StationCd=1264' }, // 1264 is Bandaimachi, disabling.
        // Tsukiji
        { scraper: metroScraper, id: 'tsukiji', url: 'https://www.tokyometro.jp/station/tsukiji/index.html' },
        { scraper: toeiScraper, id: 'tsukijishijo', url: 'https://www.kotsu.metro.tokyo.jp/subway/stations/tsukijishijo.html' },
        // Higashi-Ginza
        { scraper: metroScraper, id: 'higashi-ginza', url: 'https://www.tokyometro.jp/station/higashi-ginza/index.html' },
        { scraper: toeiScraper, id: 'higashi-ginza', url: 'https://www.kotsu.metro.tokyo.jp/subway/stations/higashi-ginza.html' }
    ];

    try {
        await metroScraper.init();
        await toeiScraper.init();
        await jrScraper.init();

        const results = [];
        for (const target of targets) {
            console.log(`Scraping ${target.id} from ${target.url}...`);
            const result = await target.scraper.scrape(target.id, target.url);
            results.push(result);
        }

        // Process and Save
        await processor.process(results);

    } catch (error) {
        console.error('Scraping failed:', error);
    } finally {
        await metroScraper.close();
        await toeiScraper.close();
        await jrScraper.close();
        console.log('--- Finished ---');
    }
}

main();
