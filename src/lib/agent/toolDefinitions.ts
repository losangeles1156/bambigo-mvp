
import { STATION_WISDOM, KNOWLEDGE_BASE } from '@/data/stationWisdom';
import { supabaseAdmin } from '@/lib/supabase';
import { WeatherTool, TrainStatusTool } from './tools/standardTools';

// Mistral Tool Schema Types
export interface MistralToolSchema {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: {
            type: 'object';
            properties: Record<string, any>;
            required?: string[];
        };
    };
}

export const AGENT_TOOLS: MistralToolSchema[] = [
    {
        type: 'function',
        function: {
            name: 'get_train_status',
            description: 'Get real-time train operation status, delays, congestion, and crowd levels for lines.',
            parameters: {
                type: 'object',
                properties: {
                    stationId: { type: 'string', description: 'The ID of the station (e.g., odpt.Station:TokyoMetro.Ginza.Ueno)' }
                },
                required: ['stationId']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_weather',
            description: 'Get current weather and temperature at a specific station.',
            parameters: {
                type: 'object',
                properties: {
                    stationId: { type: 'string', description: 'The ID of the station' }
                },
                required: ['stationId']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'retrieve_station_knowledge',
            description: 'Search expert wisdom for specific topics: "wheelchair access", "best entrance/exit", "navigation tips", "local tricks".',
            parameters: {
                type: 'object',
                properties: {
                    stationId: { type: 'string', description: 'The ID of the station' },
                    query: { type: 'string', description: 'Specific keywords: "accessibility", "wheelchair", "luggage", "exit", "transfer"' }
                },
                required: ['stationId']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_station_facilities',
            description: 'List confirmed facilities. Use this for "lockers", "toilets", "elevators", "baby rooms".',
            parameters: {
                type: 'object',
                properties: {
                    stationId: { type: 'string', description: 'The ID of the station' },
                    category: { type: 'string', description: 'Optional filter: "locker", "elevator", "toilet"' }
                },
                required: ['stationId']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_station_crowd_context',
            description: 'Get historical busy-ness level and real-time service alerts for a station. Use for "crowded", "busy", "rush hour", or route planning.',
            parameters: {
                type: 'object',
                properties: {
                    stationId: { type: 'string', description: 'ODPT Station ID' }
                },
                required: ['stationId']
            }
        }
    }
];

/**
 * Execution Handlers for the tools
 */
export const TOOL_HANDLERS = {
    get_train_status: async (params: { stationId: string }, context: any) => {
        const tool = new TrainStatusTool();
        return await tool.execute({}, { ...context, nodeId: params.stationId });
    },
    get_weather: async (params: { stationId: string }, context: any) => {
        const tool = new WeatherTool();
        const result = await tool.execute({}, { ...context, nodeId: params.stationId });

        if (!result.success || !result.data) {
            return 'Weather data is currently unavailable.';
        }

        const { temp, condition, humidity, alert } = result.data;
        const locale = context.locale || 'zh-TW';

        // Get localized station name
        const stationNameMap: Record<string, Record<string, string>> = {
            'Ueno': { 'zh-TW': '上野', 'ja': '上野', 'en': 'Ueno' },
            'Shibuya': { 'zh-TW': '澀谷', 'ja': '渋谷', 'en': 'Shibuya' },
            'Shinjuku': { 'zh-TW': '新宿', 'ja': '新宿', 'en': 'Shinjuku' },
            'Ikebukuro': { 'zh-TW': '池袋', 'ja': '池袋', 'en': 'Ikebukuro' },
            'Tokyo': { 'zh-TW': '東京', 'ja': '東京', 'en': 'Tokyo' },
            'Asakusa': { 'zh-TW': '淺草', 'ja': '浅草', 'en': 'Asakusa' },
            'Ginza': { 'zh-TW': '銀座', 'ja': '銀座', 'en': 'Ginza' },
            'Akihabara': { 'zh-TW': '秋葉原', 'ja': '秋葉原', 'en': 'Akihabara' }
        };
        const rawName = params.stationId.split('.').pop() || '';
        const stationName = stationNameMap[rawName]?.[locale] || stationNameMap[rawName]?.['zh-TW'] || rawName;

        // Humanize weather condition
        const conditionMap: Record<string, Record<string, string>> = {
            'sunny': { 'zh-TW': '晴朗適合外出', 'ja': '晴れで外出日和', 'en': 'sunny and great for exploring' },
            'clear': { 'zh-TW': '天氣晴朗', 'ja': '晴れています', 'en': 'clear skies' },
            'cloudy': { 'zh-TW': '多雲但舒適', 'ja': '曇りですが快適', 'en': 'cloudy but comfortable' },
            'rainy': { 'zh-TW': '正在下雨，建議走地下通道', 'ja': '雨が降っています、地下通路がおすすめ', 'en': 'raining, recommend underground passages' },
            'unknown': { 'zh-TW': '天氣資訊更新中', 'ja': '天気情報更新中', 'en': 'weather data updating' }
        };

        // Temperature comfort level - corrected thresholds for Tokyo climate
        let tempAdvice = '';
        if (temp <= 5) {
            tempAdvice = locale === 'zh-TW' ? '天氣寒冷，請穿著保暖外套和圍巾'
                : locale === 'ja' ? '寒いです、暖かいコートとマフラーをお勧めします'
                    : "it's cold, wear a warm coat and scarf";
        } else if (temp <= 10) {
            tempAdvice = locale === 'zh-TW' ? '氣溫偏低，建議穿外套或毛衣'
                : locale === 'ja' ? '肌寒いです、ジャケットやセーターがおすすめ'
                    : 'chilly weather, a jacket or sweater recommended';
        } else if (temp <= 15) {
            tempAdvice = locale === 'zh-TW' ? '天氣涼爽，可帶件薄外套備用'
                : locale === 'ja' ? '涼しいです、薄手の上着があると安心'
                    : 'cool weather, bring a light jacket';
        } else if (temp <= 25) {
            tempAdvice = locale === 'zh-TW' ? '氣溫舒適宜人'
                : locale === 'ja' ? '快適な気温です'
                    : 'comfortable temperature';
        } else {
            tempAdvice = locale === 'zh-TW' ? '天氣炎熱，注意補充水分'
                : locale === 'ja' ? '暑いです、水分補給を忘れずに'
                    : "it's hot, stay hydrated";
        }

        const conditionText = conditionMap[condition]?.[locale] || conditionMap['unknown'][locale];
        const alertText = alert
            ? (locale === 'zh-TW' ? `⚠️ 氣象警報: ${alert}`
                : locale === 'ja' ? `⚠️ 気象警報: ${alert}`
                    : `⚠️ Weather alert: ${alert}`)
            : '';

        const summary = locale === 'zh-TW'
            ? `目前${stationName}一帶${conditionText}，約 ${temp}°C。${tempAdvice}。${alertText}`
            : locale === 'ja'
                ? `現在${stationName}付近は${conditionText}、約${temp}°C。${tempAdvice}。${alertText}`
                : `Around ${stationName}, it's currently ${conditionText}, about ${temp}°C. ${tempAdvice}. ${alertText}`;

        return summary.trim();
    },
    retrieve_station_knowledge: async (params: { stationId: string, query?: string }, context: any) => {
        let summary = '';
        const locale = context.locale || 'zh-TW';
        const wisdom = (STATION_WISDOM as any)[params.stationId];
        if (wisdom) {
            if (wisdom.traps) {
                wisdom.traps.forEach((t: any) => {
                    summary += `[WARNING] ${t.content} Advice: ${t.advice}\n`;
                });
            }
            if (wisdom.hacks) {
                wisdom.hacks.forEach((h: any) => {
                    const text = typeof h === 'string' ? h : `${h.title}: ${h.content}`;
                    summary += `[LOCAL TRICK] ${text}\n`;
                });
            }
        }

        // Filter Knowledge Base
        const relevantKnowledge = KNOWLEDGE_BASE.filter(rule => {
            const stationMatch = !rule.trigger.station_ids || rule.trigger.station_ids.includes(params.stationId);
            if (!stationMatch) return false;

            if (params.query && rule.trigger.keywords) {
                const q = params.query.toLowerCase();
                return rule.trigger.keywords.some(k => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q));
            }
            return true;
        });

        relevantKnowledge.forEach(k => {
            summary += `- ${k.title['en'] || k.title['zh-TW']}: ${k.content['en'] || k.content['zh-TW']}\n`;
        });

        // Add luggage-specific tips when query mentions locker/luggage
        const luggageKeywords = ['locker', 'luggage', 'bags', '寄物', 'コインロッカー', '荷物', '行李'];
        const isLuggageQuery = params.query && luggageKeywords.some(k => params.query!.toLowerCase().includes(k));

        if (isLuggageQuery) {
            const luggageTips: Record<string, string> = {
                'zh-TW': `\n[LUGGAGE TIP] 若站內寄物櫃滿，推薦使用 ecbo cloak 服務，可將行李寄放在附近商店或咖啡廳。預約連結: https://cloak.ecbo.io/\n[LUGGAGE TIP] 大型行李（超過24吋）通常需要 ¥600-800 的大型寄物櫃。`,
                'ja': `\n[LUGGAGE TIP] ロッカーが満杯の場合は、ecbo cloak サービスをおすすめします。近くのお店やカフェに荷物を預けられます。予約: https://cloak.ecbo.io/\n[LUGGAGE TIP] 大型荷物（24インチ以上）は通常 ¥600-800 の大型ロッカーが必要です。`,
                'en': `\n[LUGGAGE TIP] If station lockers are full, try ecbo cloak - you can store luggage at nearby shops/cafes. Book at: https://cloak.ecbo.io/\n[LUGGAGE TIP] Large luggage (over 24 inches) typically requires ¥600-800 large lockers.`
            };
            summary += luggageTips[locale] || luggageTips['en'];
        }

        return summary || 'No specific knowledge found for this query.';
    },
    get_station_facilities: async (params: { stationId: string }, context: any) => {
        const { data: facilities } = await supabaseAdmin
            .from('l3_facilities')
            .select('*')
            .eq('station_id', params.stationId);

        if (!facilities || facilities.length === 0) return 'No facility data available for this station.';

        return facilities.map((f: any) => `- ${f.type}: ${f.location_coords?.['en'] || f.location_coords?.['zh-TW'] || 'Unknown location'}`).join('\n');
    },
    get_station_crowd_context: async (params: { stationId: string }, context: any) => {
        // Humanized Advice Templates
        const CONGESTION_ADVICE: Record<string, Record<string, string>> = {
            'Quiet': {
                'zh-TW': '這是一個人流較少的車站，轉乘與等待時間都很輕鬆。',
                'ja': '比較的空いている駅です。乗り換えや待ち時間も余裕があります。',
                'en': 'This is a quiet station. Transfers and waiting times are relaxed.'
            },
            'Moderate': {
                'zh-TW': '人流適中。尖峰時段（08:00-09:30, 17:30-19:00）可能會有些擁擠。',
                'ja': '人の流れは普通です。ラッシュ時は混雑することがあります。',
                'en': 'Moderate traffic. Rush hours (08:00-09:30, 17:30-19:00) may be crowded.'
            },
            'Busy': {
                'zh-TW': '🚨 繁忙車站。建議錯開尖峰時段，或提前抵達以預留轉乘時間。',
                'ja': '🚨 混雑した駅です。ピーク時を避けるか、早めに到着することをお勧めします。',
                'en': '🚨 Busy station. Avoid peak hours or arrive early for transfers.'
            },
            'Very Busy': {
                'zh-TW': '⚠️ 超級繁忙！這是東京最擁擠的車站之一。強烈建議錯開早晚高峰，並使用較少人的出口。',
                'ja': '⚠️ 非常に混雑！東京で最も混雑する駅の一つです。ラッシュ時を避け、すいている出口を使うことを強くお勧めします。',
                'en': '⚠️ Extremely busy! One of Tokyo\'s busiest stations. Strongly recommend avoiding rush hours and using less crowded exits.'
            },
            'Unknown': {
                'zh-TW': '暫無此站的擁擠度資料。',
                'ja': 'この駅の混雑情報はありません。',
                'en': 'No congestion data available for this station.'
            }
        };

        try {
            const locale = context?.locale || 'zh-TW';

            // Query station_stats for latest year
            const { data: statsData } = await supabaseAdmin
                .from('station_stats')
                .select('station_id, survey_year, passenger_journeys')
                .eq('station_id', params.stationId)
                .order('survey_year', { ascending: false })
                .limit(1)
                .maybeSingle();

            // Extract railway ID
            const railwayMatch = params.stationId.match(/odpt\.Station:([^.]+\.[^.]+)/);
            const railwayId = railwayMatch ? `odpt.Railway:${railwayMatch[1]}` : null;

            // Query transit_alerts
            let alertText = '';
            if (railwayId) {
                const { data: alertsData } = await supabaseAdmin
                    .from('transit_alerts')
                    .select('status, text_ja')
                    .eq('railway', railwayId);

                if (alertsData && alertsData.length > 0) {
                    const nonNormalAlerts = alertsData.filter(a =>
                        a.text_ja && !a.text_ja.includes('平常') && !a.text_ja.includes('正常')
                    );
                    if (nonNormalAlerts.length > 0) {
                        alertText = `\n\n🚨 運行異常: ${nonNormalAlerts[0].text_ja}`;
                    }
                }
            }

            // Calculate busy level
            const journeys = statsData?.passenger_journeys || 0;
            let busyLevel: string;
            if (journeys === 0) busyLevel = 'Unknown';
            else if (journeys < 50000) busyLevel = 'Quiet';
            else if (journeys < 200000) busyLevel = 'Moderate';
            else if (journeys < 500000) busyLevel = 'Busy';
            else busyLevel = 'Very Busy';

            // Get localized advice
            const advice = CONGESTION_ADVICE[busyLevel]?.[locale] || CONGESTION_ADVICE[busyLevel]?.['en'] || '';

            return `${advice}${alertText}`;
        } catch (e: any) {
            return `擁擠度資料暫時無法取得。`;
        }
    }
};
