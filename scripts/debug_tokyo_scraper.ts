import { MetroScraper } from './l3-scraper/scrapers/metroScraper';
import { DataProcessor } from './l3-scraper/processor';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function debug() {
    console.log('--- Debugging Tokyo Scraper ---');
    const scraper = new MetroScraper();
    const processor = new DataProcessor();

    await scraper.init();
    try {
        console.log('Scraping...');
        const result = await scraper.scrape('tokyo', 'https://www.tokyometro.jp/station/tokyo/index.html');
        console.log('Scrape Result:', JSON.stringify(result, null, 2));

        console.log('Processing...');
        await processor.process([result]);
        console.log('Done.');
    } catch (e) {
        console.error(e);
    } finally {
        await scraper.close();
    }
}
debug();
