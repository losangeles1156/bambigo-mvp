import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import puppeteer from 'puppeteer';

type StartedServer = {
    url: string;
    close: () => Promise<void>;
};

function pickAvailablePort(): number {
    return 3200 + Math.floor(Math.random() * 2000);
}

async function startNextDev(port: number): Promise<StartedServer> {
    const nextBin = path.join(process.cwd(), 'node_modules', '.bin', 'next');
    const proc = spawn(nextBin, ['dev', '-p', String(port)], {
        env: { ...process.env, PORT: String(port) },
        stdio: ['ignore', 'pipe', 'pipe']
    });

    const url = `http://localhost:${port}`;

    await new Promise<void>((resolve, reject) => {
        let combined = '';
        const readyRegex = /(ready\s*-\s*started\s*server\s*on|ready\s*in)/i;

        const cleanup = () => {
            clearTimeout(timer);
            proc.stdout?.off('data', onChunk);
            proc.stderr?.off('data', onChunk);
            proc.off('exit', onExit);
        };

        const onChunk = (chunk: any) => {
            combined += String(chunk);
            if (readyRegex.test(combined)) {
                cleanup();
                resolve();
            }
        };

        const onExit = (code: number | null) => {
            cleanup();
            reject(new Error(`Next dev server exited early with code ${code}. Output: ${combined.slice(-2000)}`));
        };

        const timer = setTimeout(() => {
            cleanup();
            reject(new Error(`Next dev server did not become ready. Output: ${combined.slice(-2000)}`));
        }, 90_000);

        proc.stdout?.on('data', onChunk);
        proc.stderr?.on('data', onChunk);
        proc.on('exit', onExit);
    });

    const close = async () => {
        if (proc.killed) return;
        proc.kill('SIGTERM');
        await new Promise<void>((resolve) => {
            const timer = setTimeout(() => {
                try {
                    proc.kill('SIGKILL');
                } catch {
                }
                resolve();
            }, 10_000);
            proc.once('exit', () => {
                clearTimeout(timer);
                resolve();
            });
        });
    };

    return { url, close };
}

async function clickOnboardingHubButton(page: any): Promise<void> {
    await page.waitForFunction(() => {
        const buttons = Array.from(document.querySelectorAll('button')) as HTMLButtonElement[];
        return buttons.some(b => (b.className || '').includes('bg-indigo-50'));
    }, { timeout: 60_000 });

    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button')) as HTMLButtonElement[];
        const target = buttons.find(b => (b.className || '').includes('bg-indigo-50'));
        if (target) target.click();
    });
}

async function clickNodeTabByIndex(page: any, index: number): Promise<void> {
    await page.waitForFunction(() => {
        const containers = Array.from(document.querySelectorAll('div')) as HTMLDivElement[];
        const nav = containers.find(d => (d.className || '').includes('sticky')
            && (d.className || '').includes('z-20')
            && d.querySelectorAll('button').length >= 4);
        return Boolean(nav);
    }, { timeout: 60_000 });

    await page.evaluate((i: number) => {
        const containers = Array.from(document.querySelectorAll('div')) as HTMLDivElement[];
        const nav = containers.find(d => (d.className || '').includes('sticky')
            && (d.className || '').includes('z-20')
            && d.querySelectorAll('button').length >= 4);
        if (!nav) return;
        const buttons = Array.from(nav.querySelectorAll('button')) as HTMLButtonElement[];
        const target = buttons[i];
        if (target) target.click();
    }, index);
}

async function waitForTabHeading(page: any, label: string): Promise<void> {
    await page.waitForFunction((expected: string) => {
        const headings = Array.from(document.querySelectorAll('h2'));
        return headings.some(h => (h.textContent || '').trim() === expected);
    }, { timeout: 60_000 }, label);
}

async function waitForSpotsCountAtLeast(page: any, min: number): Promise<void> {
    await page.waitForFunction((expectedMin: number) => {
        const spans = Array.from(document.querySelectorAll('span')) as HTMLSpanElement[];
        const spotSpan = spans.find(s => /\bSpots\b/.test((s.textContent || '').trim()));
        if (!spotSpan) return false;
        const m = (spotSpan.textContent || '').trim().match(/^(\d+)\s+Spots\b/);
        if (!m) return false;
        const n = Number(m[1]);
        return Number.isFinite(n) && n >= expectedMin;
    }, { timeout: 60_000 }, min);
}

test('UI renders level badges in node tabs', { timeout: 180_000 }, async (t) => {
    const port = pickAvailablePort();
    const server = await startNextDev(port);
    t.after(async () => {
        await server.close();
    });

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    t.after(async () => {
        await browser.close();
    });

    const page = await browser.newPage();
    await page.goto(`${server.url}/en`, { waitUntil: 'domcontentloaded' });

    await clickOnboardingHubButton(page);

    await clickNodeTabByIndex(page, 0);
    await waitForTabHeading(page, 'Nearby');
    await waitForSpotsCountAtLeast(page, 1);

    await clickNodeTabByIndex(page, 1);
    await waitForTabHeading(page, 'Status');

    await clickNodeTabByIndex(page, 2);
    await waitForTabHeading(page, 'Facilities');

    assert.ok(true);
});

test('UI renders route result card after destination search', { timeout: 180_000 }, async (t) => {
    const port = pickAvailablePort();
    const server = await startNextDev(port);
    t.after(async () => {
        await server.close();
    });

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    t.after(async () => {
        await browser.close();
    });

    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const url = req.url();

        if (url.includes('/api/stations/search')) {
            const payload = {
                stations: [
                    {
                        id: 'odpt.Station:TokyoMetro.Ginza.Ginza',
                        name: { ja: '銀座', en: 'Ginza' },
                        operator: 'TokyoMetro',
                        railway: 'TokyoMetro.Ginza'
                    }
                ]
            };
            void req.respond({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(payload)
            });
            return;
        }

        if (url.includes('/api/odpt/route')) {
            const payload = {
                routes: [
                    {
                        label: 'Ueno → Ginza',
                        steps: [
                            '🏠 Ueno',
                            '🚃 Take odpt.Railway:TokyoMetro.Ginza (Ginza Line)',
                            '📍 Ginza'
                        ],
                        sources: [{ type: 'odpt:Railway', verified: true }],
                        railways: ['odpt.Railway:TokyoMetro.Ginza'],
                        fare: { ic: 180, ticket: 200 },
                        duration: 18,
                        transfers: 0,
                        nextDeparture: '23:59'
                    }
                ]
            };
            void req.respond({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(payload)
            });
            return;
        }

        void req.continue();
    });

    await page.goto(`${server.url}/en`, { waitUntil: 'domcontentloaded' });
    await clickOnboardingHubButton(page);

    await clickNodeTabByIndex(page, 3);

    await page.waitForSelector('input[placeholder="Destination..."]', { timeout: 60_000 });
    await page.type('input[placeholder="Destination..."]', 'Ginza');
    await page.keyboard.press('Enter');

    await page.waitForFunction(() => {
        const text = (document.body?.innerText || '').replace(/\s+/g, ' ');
        return text.includes('Ueno → Ginza') && text.includes('Ticket ¥200') && text.includes('Next: 23:59');
    }, { timeout: 60_000 });

    assert.ok(true);
});
