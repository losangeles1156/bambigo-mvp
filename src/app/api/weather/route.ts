import { NextResponse } from 'next/server';

export async function GET() {
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

            // Filter for Tokyo and Warnings/Advisories
            if (title.includes('東京') || summary.includes('東京')) {
                // Determine severity
                let severity: 'info' | 'warning' | 'critical' = 'info';
                if (title.includes('特別警報') || title.includes('震度') || title.includes('重大')) {
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
        }

        // Return the most relevant alert (or all)
        return NextResponse.json({ alerts: entries });

    } catch (error: any) {
        console.error('Weather API Error:', error.message);
        return NextResponse.json({ alerts: [], error: 'Failed to fetch weather data' }, { status: 500 });
    }
}
