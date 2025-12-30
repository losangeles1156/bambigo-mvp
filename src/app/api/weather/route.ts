import { NextResponse } from 'next/server';
import { writeAuditLog } from '@/lib/security/audit';

export async function GET(request: Request) {
    try {
        const response = await fetch('https://www.data.jma.go.jp/developer/xml/feed/extra.xml', {
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error('Failed to fetch JMA RSS');
        }

        const xml = await response.text();

        // Simple Regex Parser for Entry tags
        const entries: any[] = [];
        const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
        let match;

        while ((match = entryRegex.exec(xml)) !== null) {
            const content = match[1];
            const title = content.match(/<title>(.*?)<\/title>/)?.[1] || '';
            const summary = content.match(/<content type="text">([\s\S]*?)<\/content>/)?.[1] ||
                content.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || '';
            const updated = content.match(/<updated>(.*?)<\/updated>/)?.[1] || '';

            // [Phase 1] Pre-filter: Only alerts mentioning Tokyo Prefecture
            if (!title.includes('東京') && !summary.includes('東京')) {
                continue;
            }

            // [Phase 2] Strict Region Filter: 
            // Exclude alerts where 伊豆諸島 or 小笠原諸島 are the PRIMARY affected areas
            const text = title + summary;

            // Keywords indicating islands are the main subject
            const isIslandAlert = text.includes('伊豆諸島') || text.includes('小笠原諸島');

            // Keywords indicating core Tokyo metropolitan area
            const isTokyoMetroAlert = text.includes('23区') ||
                text.includes('多摩') ||
                (text.includes('東京地方') && !isIslandAlert);

            // If islands are mentioned but NOT 23区/多摩, this is likely an island-only alert
            // Exception: If 東京地方 has its OWN separate warning (not just secondary mention)
            if (isIslandAlert && !isTokyoMetroAlert) {
                // Check if Tokyo mainland has a SEPARATE warning phrase
                const tokyoHasOwnWarning = text.match(/東京地方[^、]*では[^。]*注意/);
                const islandPrimaryWarning = text.match(/(伊豆諸島|小笠原諸島)[^、]*では[^。]*(警報|注意)/);

                // If island has primary warning and Tokyo only has minor mention (fog etc), skip
                if (islandPrimaryWarning && !tokyoHasOwnWarning) {
                    continue;
                }

                // If Tokyo's warning is just "濃霧" (fog) while islands have major warnings, skip
                if (tokyoHasOwnWarning &&
                    text.match(/東京地方[^、]*濃霧/) &&
                    text.match(/(伊豆諸島|小笠原諸島)[^、]*(強風|高波|大雨|暴風)/)) {
                    continue;
                }
            }

            // [Phase 3] Special warnings always pass (earthquake, special警報)
            const isSpecialWarning = title.includes('特別警報') || title.includes('震度');

            // Determine severity
            let severity: 'info' | 'warning' | 'critical' = 'info';
            if (isSpecialWarning || title.includes('重大')) {
                severity = 'critical';
            } else if (title.includes('警報') || title.includes('注意報')) {
                severity = 'warning';
            }

            entries.push({
                title,
                summary: summary.replace(/&lt;br \/&gt;/g, '\n').trim(),
                updated,
                severity
            });
        }

        // Return the most relevant alert (or all)
        return NextResponse.json({
            alerts: entries,
            source: 'Japan Meteorological Agency (JMA)',
            fetchedAt: new Date().toISOString()
        });

    } catch (error: any) {
        void writeAuditLog(request, {
            actorUserId: null,
            action: 'create',
            resourceType: 'weather_alerts',
            resourceId: 'tokyo',
            before: null,
            after: {
                ok: false,
                upstream: 'jma_rss',
                error: String(error?.message || error || '')
            }
        });
        console.error('Weather API Error:', error.message);
        return NextResponse.json({ alerts: [], error: 'Failed to fetch weather data' }, { status: 500 });
    }
}
