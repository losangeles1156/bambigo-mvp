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

async function waitForBadge(page: any, badge: 'L1' | 'L2' | 'L3'): Promise<void> {
    await page.waitForFunction((b: string) => {
        const spans = Array.from(document.querySelectorAll('span'));
        return spans.some(s => (s.textContent || '').trim() === b);
    }, { timeout: 60_000 }, badge);
}

test('UI renders L1/L2/L3 level badges in node tabs', { timeout: 180_000 }, async (t) => {
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
    await waitForBadge(page, 'L1');

    await clickNodeTabByIndex(page, 1);
    await waitForBadge(page, 'L2');

    await clickNodeTabByIndex(page, 2);
    await waitForBadge(page, 'L3');

    assert.ok(true);
});
