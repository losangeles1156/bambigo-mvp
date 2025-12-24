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
        { scraper: jrScraper, id: 'uguisudani', url: 'https://www.jreast.co.jp/estation/station/info.aspx?StationCd=149' }
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
