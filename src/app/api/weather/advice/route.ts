import { NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const temp = searchParams.get('temp');
    const condition = searchParams.get('condition');
    const wind = searchParams.get('wind');
    const locale = searchParams.get('locale') || 'en';

    if (!temp || !condition) {
        return NextResponse.json({ error: 'Missing temp or condition' }, { status: 400 });
    }

    // Determine language
    const langMap: Record<string, string> = {
        'zh-TW': '繁體中文',
        'zh': '繁體中文',
        'ja': '日本語',
        'en': 'English'
    };
    const lang = langMap[locale] || 'English';

    const prompt = `
You are a friendly travel assistant for tourists in Tokyo.
Given the current weather, generate ONE short sentence (max 15 words) giving practical advice.
Be warm and helpful. Language: ${lang}.

Current Weather:
- Temperature: ${temp}°C
- Condition: ${condition}
- Wind: ${wind || 'N/A'} m/s

Example outputs:
- (English) "Perfect day for sightseeing—maybe grab a kakigori!"
- (日本語) 「今日は散策日和！水分補給も忘れずに」
- (繁體中文) 「天氣涼爽，適合逛街！記得帶件薄外套」

Output ONLY the advice sentence, no quotes, no explanation.
`;

    try {
        const result = await mistral.chat.complete({
            model: 'mistral-small-latest', // Fast and cost-effective
            messages: [{ role: 'user', content: prompt }],
        });

        const advice = (result.choices[0].message.content as string).trim();

        return NextResponse.json({
            advice,
            locale,
            generated_at: new Date().toISOString()
        }, {
            headers: {
                'Cache-Control': 'public, max-age=600' // Cache for 10 minutes
            }
        });

    } catch (error: any) {
        console.error('Weather Advice LLM Error:', error.message);
        // Fallback advice
        const fallback: Record<string, string> = {
            'zh-TW': '祝你今天出行順利！',
            'zh': '祝你今天出行順利！',
            'ja': '良い一日を！',
            'en': 'Have a great day exploring!'
        };
        return NextResponse.json({
            advice: fallback[locale] || fallback['en'],
            locale,
            fallback: true
        });
    }
}
