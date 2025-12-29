import { NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';
import { supabase } from '@/lib/supabase';

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

// Cache TTL in hours
const NORMAL_TTL_HOURS = 4;
const EMERGENCY_TTL_MINUTES = 30;

// Calculate current 4-hour window (06, 10, 14, 18, 22)
function getCurrentWindow(): Date {
    const now = new Date();
    const hour = now.getHours();
    const windowHour = Math.floor(hour / 4) * 4;
    const windowStart = new Date(now);
    windowStart.setHours(windowHour < 6 ? 6 : windowHour, 0, 0, 0);
    return windowStart;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const temp = searchParams.get('temp');
    const condition = searchParams.get('condition');
    const wind = searchParams.get('wind');
    const humidity = searchParams.get('humidity');
    const precipProb = searchParams.get('precipProb');
    const locale = searchParams.get('locale') || 'en';

    // Check for emergency mode (passed from frontend if JMA alert exists)
    const isEmergency = searchParams.get('emergency') === 'true';
    const jmaSummary = searchParams.get('jmaSummary') || '';
    const jmaLink = 'https://www.jma.go.jp/bosai/warning/';

    if (!temp || !condition) {
        return NextResponse.json({ error: 'Missing temp or condition' }, { status: 400 });
    }

    const mode = isEmergency ? 'emergency' : 'normal';

    // --- Check Cache ---
    try {
        const now = new Date();
        const { data: cached } = await supabase
            .from('weather_advice_cache')
            .select('*')
            .eq('mode', mode)
            .eq('locale', locale)
            .gt('expires_at', now.toISOString())
            .order('created_at', { ascending: false })
            .limit(1);

        if (cached && cached.length > 0) {
            return NextResponse.json({
                advice: cached[0].advice,
                jma_link: cached[0].jma_link,
                mode,
                locale,
                cached: true,
                expires_at: cached[0].expires_at
            });
        }
    } catch (e) {
        console.warn('[Advice Cache] Read failed, proceeding without cache.');
    }

    // --- Generate New Advice ---
    const langMap: Record<string, string> = {
        'zh-TW': '繁體中文', 'zh': '繁體中文', 'ja': '日本語', 'en': 'English'
    };
    const lang = langMap[locale] || 'English';

    let prompt = '';
    let maxWords = 15;

    if (isEmergency && jmaSummary) {
        maxWords = 50;
        prompt = `
你是一位專業的東京旅遊緊急顧問。
日本氣象廳 (JMA) 發布了以下警報：
---
${jmaSummary}
---
請用 ${lang} 給出一句 ${maxWords} 字內的緊急行動建議，告訴使用者：
1. 是否應避免外出
2. 需要注意什麼
語氣應嚴肅但不恐慌。不要包含問候語。
`;
    } else {
        prompt = `
你是一位友善的東京旅遊助手。
根據以下天氣數據，給出一句 ${maxWords} 字內的穿衣或出行建議。
語氣溫暖、實用。語言：${lang}。

天氣：${condition}
溫度：${temp}°C
濕度：${humidity || 'N/A'}%
風速：${wind || 'N/A'} m/s
降雨機率：${precipProb || 'N/A'}%

範例輸出：
- (繁中) 「天氣涼爽，適合薄外套出門」
- (日文) 「今日は暖かいので軽装でOK」
- (英文) \"Perfect weather for a walk!\"

輸出時只寫建議本身，不要引號或說明。
`;
    }

    try {
        const result = await mistral.chat.complete({
            model: 'mistral-small-latest',
            messages: [{ role: 'user', content: prompt }],
        });

        const advice = (result.choices[0].message.content as string).trim();

        // --- Save to Cache ---
        const expiresAt = new Date();
        if (isEmergency) {
            expiresAt.setMinutes(expiresAt.getMinutes() + EMERGENCY_TTL_MINUTES);
        } else {
            expiresAt.setHours(expiresAt.getHours() + NORMAL_TTL_HOURS);
        }

        try {
            await supabase.from('weather_advice_cache').insert({
                mode,
                locale,
                advice,
                jma_link: isEmergency ? jmaLink : null,
                weather_data: { temp, condition, wind, humidity, precipProb },
                expires_at: expiresAt.toISOString()
            });
        } catch (e) {
            console.warn('[Advice Cache] Write failed.');
        }

        return NextResponse.json({
            advice,
            jma_link: isEmergency ? jmaLink : null,
            mode,
            locale,
            generated_at: new Date().toISOString()
        }, {
            headers: { 'Cache-Control': 'public, max-age=600' }
        });

    } catch (error: any) {
        console.error('Weather Advice LLM Error:', error.message);
        const fallback: Record<string, string> = {
            'zh-TW': isEmergency ? '請留意官方警報，注意安全！' : '祝你今天出行順利！',
            'zh': isEmergency ? '請留意官方警報，注意安全！' : '祝你今天出行順利！',
            'ja': isEmergency ? '公式警報に注意してください!' : '良い一日を！',
            'en': isEmergency ? 'Please follow official advisories!' : 'Have a great day exploring!'
        };
        return NextResponse.json({
            advice: fallback[locale] || fallback['en'],
            jma_link: isEmergency ? jmaLink : null,
            mode,
            locale,
            fallback: true
        });
    }
}
