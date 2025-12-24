import { BaseScraper } from '../baseScraper';
import { ScraperResult, StationFacility } from '../types';

export class ToeiScraper extends BaseScraper {
    targetOperator = 'Toei';

    async scrape(stationId: string, url: string): Promise<ScraperResult> {
        const page = await this.getPage(url);

        // --- Toei Subway Specific Logic ---
        // URL Example: https://www.kotsu.metro.tokyo.jp/subway/stations/shinjuku.html

        const stationName = await page.$eval('h1', el => el.textContent?.trim() || '');
        const facilities: StationFacility[] = [];

        // Toei usually lists facilities in a dl/dt/dd definitions or tables
        // Mocking extraction for PoC, similar to MetroScraper

        const pageContent = await page.content();

        if (pageContent.includes('だれでもトイレ') || pageContent.includes('Accessible Toilet')) {
            facilities.push({
                type: 'toilet',
                location: { ja: '改札内', en: 'Inside Gate', zh: '驗票口內' },
                floor: 'Unknown',
                operator: 'Toei',
                attributes: { wheelchair: true, hasOstomate: true },
                sourceUrl: url
            });
        }

        if (pageContent.includes('コインロッカー') || pageContent.includes('Coin Locker')) {
            facilities.push({
                type: 'locker',
                location: { ja: '改札外', en: 'Outside Gate', zh: '驗票口外' },
                floor: 'Unknown',
                operator: 'Toei',
                attributes: { note: 'See station map' },
                sourceUrl: url
            });
        }

        if (pageContent.includes('無線LAN') || pageContent.includes('Free Wi-Fi')) {
            facilities.push({
                type: 'wifi',
                location: { ja: '各所', en: 'Various locations', zh: '各處' },
                floor: 'Unknown',
                operator: 'Toei',
                attributes: { ssid: 'Toei_Subway_Free_Wi-Fi' },
                sourceUrl: url
            });
        }

        return {
            stationName,
            operator: 'Toei',
            facilities
        };
    }
}
