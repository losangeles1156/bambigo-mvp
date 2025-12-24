import puppeteer, { Browser, Page } from 'puppeteer';
import { IScraper, ScraperResult } from './types';

export abstract class BaseScraper implements IScraper {
    abstract targetOperator: string;
    protected browser: Browser | null = null;

    async init() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    protected async getPage(url: string): Promise<Page> {
        if (!this.browser) await this.init();
        const page = await this.browser!.newPage();

        // Anti-detection / Random user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        return page;
    }

    abstract scrape(stationId: string, url: string): Promise<ScraperResult>;
}
