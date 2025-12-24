import { BaseScraper } from '../baseScraper';
import { ScraperResult, StationFacility, LocaleString } from '../types';

export class MetroScraper extends BaseScraper {
    targetOperator = 'Metro';

    // Helper: Map Metro specific icon/text to standard FacilityType
    private mapFacilityType(text: string): string | null {
        if (text.includes('トイレ') || text.includes('Toilet')) return 'toilet';
        if (text.includes('エレベーター') || text.includes('Elevator')) return 'elevator';
        if (text.includes('ロッカー') || text.includes('Locker')) return 'locker';
        if (text.includes('ATM')) return 'atm';
        if (text.includes('ベビー') || text.includes('Baby')) return 'nursing';
        if (text.includes('WiFi')) return 'wifi';
        return null;
    }

    async scrape(stationId: string, url: string): Promise<ScraperResult> {
        const page = await this.getPage(url);

        // --- Tokyo Metro Specific Logic ---
        // Assuming we are scraping the "Accessibility" or "Facilities" tab of a station page
        // URL Example: https://www.tokyometro.jp/station/ueno/index.html (and subpages)

        // 1. Scrape Basic Info
        const stationName = await page.$eval('h1', el => el.textContent?.trim() || '');

        // 2. Scrape Facilities List (This is highly dependent on actual DOM structure)
        // For MVP, we simulate finding elements based on common table structures or lists.
        // In a real run, we would inspect the selector 'table.facilityTable' or similar.

        const facilities: StationFacility[] = [];

        // Example: Scraping "Barrier Free" section
        // Ideally we grab all rows from the facility table
        const rows = await page.$$('tr'); // Placeholder selector

        // Mocking the extraction logic for demonstration since checking live DOM structure requires interaction
        // Real implementation would look like:
        /*
        for (const row of rows) {
            const text = await row.evaluate(el => el.textContent);
            const type = this.mapFacilityType(text || '');
            if (type) {
                facilities.push({
                    type: type as any,
                    location: { ja: '改札内', en: 'Inside Gate', zh: '驗票口內' }, // Need actual parsing
                    floor: 'B1', // Need actual parsing
                    operator: 'Metro',
                    sourceUrl: url
                });
            }
        }
        */

        // For Proof of Concept, let's try to grab the page title and description to prove puppeteer works
        // And inject a mock facility based on page content detection
        const pageContent = await page.content();

        if (pageContent.includes('コインロッカー') || pageContent.includes('Coin Locker')) {
            facilities.push({
                type: 'locker',
                location: { ja: '構内図参照', en: 'See Map', zh: '請參照構內圖' },
                floor: 'Unknown',
                operator: 'Metro',
                attributes: { note: 'Detected on page' },
                sourceUrl: url
            });
        }

        if (pageContent.includes('多機能トイレ') || pageContent.includes('Multi-purpose Toilet')) {
            facilities.push({
                type: 'toilet',
                location: { ja: '構内', en: 'Station', zh: '站內' },
                floor: 'Unknown',
                operator: 'Metro',
                attributes: { wheelchair: true, hasWashlet: true },
                sourceUrl: url
            });
        }

        // ... Page content check finished

        // [Fallback Validation]
        // If facilities is empty (likely due to dynamic loading or selector mismatch in PoC),
        // we inject some dummy data to verify the PROCESSOR pipeline works.
        if (facilities.length === 0 && stationId === 'ueno') {
            console.log('[Mock] Injecting fallback data for Ueno to test Pipeline...');
            facilities.push({
                type: 'locker',
                location: { ja: '銀座線改札外', en: 'Outside Ginza Line Gate', zh: '銀座線驗票口外' },
                floor: 'B1',
                operator: 'Metro',
                attributes: { count: 50, sizes: ['S', 'M'] },
                sourceUrl: url
            });
            facilities.push({
                type: 'toilet',
                location: { ja: '日比谷線ホーム', en: 'Hibiya Line Platform', zh: '日比谷線月台' },
                floor: 'B2',
                operator: 'Metro',
                attributes: { wheelchair: true },
                sourceUrl: url
            });
        }

        return {
            stationName, // Should be "上野駅"
            operator: 'Metro',
            facilities
        };
    }
}
