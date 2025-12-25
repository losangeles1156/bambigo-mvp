import { BaseScraper } from '../baseScraper';
import { ScraperResult, StationFacility } from '../types';

export class JRScraper extends BaseScraper {
    targetOperator = 'JR';

    async scrape(stationId: string, url: string): Promise<ScraperResult> {
        const page = await this.getPage(url);

        // --- JR East Specific Logic ---
        // URL Example: https://www.jreast.co.jp/estation/station/info.aspx?StationCd=171 (Ueno)

        const stationName = await page.$eval('title', el => el.textContent?.split('|')[0].trim() || '');
        const facilities: StationFacility[] = [];

        // Mocking extraction for PoC
        const pageContent = await page.content();

        if (pageContent.includes('トイレ') || pageContent.includes('Restroom')) {
            facilities.push({
                type: 'toilet',
                location: { ja: '中央改札内', en: 'Central Gate Inside', zh: '中央驗票口內' },
                floor: '1F',
                operator: 'JR',
                attributes: { wheelchair: true, hasBabyRoom: true },
                sourceUrl: url
            });
        }

        if (pageContent.includes('ロッカー') || pageContent.includes('Locker')) {
            facilities.push({
                type: 'locker',
                location: { ja: '公園口改札外', en: 'Park Exit Outside', zh: '公園口驗票口外' },
                floor: '2F',
                operator: 'JR',
                attributes: { count: 100, sizes: ['S', 'M', 'L', 'XL'] },
                sourceUrl: url
            });
        }

        if (pageContent.includes('みどりの窓口') || pageContent.includes('Ticket Office')) {
            facilities.push({
                type: 'info',
                location: { ja: '中央改札横', en: 'Beside Central Gate', zh: '中央驗票口旁' },
                floor: '1F',
                operator: 'JR',
                attributes: { note: 'JR Ticket Office' },
                sourceUrl: url
            });
        }

        return {
            stationName,
            operator: 'JR',
            facilities
        };
    }
}
