import { NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';
import { supabase } from '@/lib/supabase';

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

// Cache TTL in hours
const NORMAL_TTL_HOURS = 1; // Reduced from 4 to 1 for better temperature responsiveness
const EMERGENCY_TTL_MINUTES = 30;

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
    const currentTemp = parseFloat(temp);

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
            .limit(5); // Get more to find a temperature match

        if (cached && cached.length > 0) {
            // Find a cache entry with similar temperature (+/- 2 degrees)
            const closeMatch = cached.find(c => {
                const cachedTemp = c.weather_data?.temp;
                return cachedTemp !== undefined && Math.abs(cachedTemp - currentTemp) <= 2;
            });

            if (closeMatch) {
                return NextResponse.json({
                    advice: closeMatch.advice,
                    jma_link: closeMatch.jma_link,
                    mode,
                    locale,
                    cached: true,
                    expires_at: closeMatch.expires_at
                });
            }
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
你是一位友善且專業的東京旅遊助手。
根據以下天氣數據，給出一句 ${maxWords} 字內的穿衣或出行建議。

穿衣指南規則（嚴格遵守）：
- 5°C 以下：極寒，建議穿著厚羽絨衣、發熱衣，並配戴圍巾手套。
- 5°C - 10°C：寒冷，建議穿著厚大衣或中等厚度羽絨衣。
- 10°C - 15°C：冷，建議穿著大衣或厚夾克。
- 15°C - 20°C：涼爽，建議穿著風衣或薄夾克。
- 20°C - 25°C：舒適，長袖襯衫或薄長袖即可。
- 25°C 以上：炎熱，短袖衣物。
- 絕對不要使用 ** 符號來加粗文字。

特別注意：
- 若有雨/雪：提醒攜帶雨具，並注意地面濕滑。
- 若風速大：提醒體感溫度會更低。

語氣溫暖、實用。語言：${lang}。

天氣：${condition}
溫度：${temp}°C
濕度：${humidity || 'N/A'}%
風速：${wind || 'N/A'} m/s
降雨機率：${precipProb || 'N/A'}%

範例輸出：
- (5°C, 晴) 「氣溫寒冷僅 ${temp}°C，請務必穿著厚大衣保暖」
- (18°C, 陰) 「天氣微涼，穿件薄夾克出門正合適」
- (28°C, 雨) 「天氣炎熱且有雨，建議穿短袖並攜帶雨傘」

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
