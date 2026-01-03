
import { supabaseAdmin } from '@/lib/supabase';

// WMO Weather Code Mapping
export const WMO_CODES: Record<number, { condition: string; label: string; emoji: string }> = {
    0: { condition: 'Clear', label: '晴', emoji: '☀️' },
    1: { condition: 'Clear', label: '晴', emoji: '☀️' },
    2: { condition: 'PartlyCloudy', label: '多雲', emoji: '⛅' },
    3: { condition: 'Cloudy', label: '陰', emoji: '☁️' },
    45: { condition: 'Fog', label: '霧', emoji: '🌫️' },
    48: { condition: 'Fog', label: '霧', emoji: '🌫️' },
    51: { condition: 'Drizzle', label: '小雨', emoji: '🌧️' },
    53: { condition: 'Drizzle', label: '小雨', emoji: '🌧️' },
    55: { condition: 'Drizzle', label: '毛毛雨', emoji: '🌧️' },
    61: { condition: 'Rain', label: '雨', emoji: '🌧️' },
    63: { condition: 'Rain', label: '中雨', emoji: '🌧️' },
    65: { condition: 'HeavyRain', label: '大雨', emoji: '🌧️' },
    19: { condition: 'Snow', label: '小雪', emoji: '🌨️' }, // 71
    20: { condition: 'Snow', label: '雪', emoji: '🌨️' }, // 73
    21: { condition: 'HeavySnow', label: '大雪', emoji: '🌨️' }, // 75
    22: { condition: 'Snow', label: '雪粒', emoji: '🌨️' }, // 77
    71: { condition: 'Snow', label: '小雪', emoji: '🌨️' },
    73: { condition: 'Snow', label: '雪', emoji: '🌨️' },
    75: { condition: 'HeavySnow', label: '大雪', emoji: '🌨️' },
    77: { condition: 'Snow', label: '雪粒', emoji: '🌨️' },
    80: { condition: 'Showers', label: '陣雨', emoji: '🌦️' },
    81: { condition: 'Showers', label: '陣雨', emoji: '🌦️' },
    82: { condition: 'HeavyShowers', label: '暴雨', emoji: '⛈️' },
    85: { condition: 'SnowShowers', label: '陣雪', emoji: '🌨️' },
    86: { condition: 'HeavySnowShowers', label: '暴雪', emoji: '🌨️' },
    95: { condition: 'Thunderstorm', label: '雷雨', emoji: '⛈️' },
    96: { condition: 'Thunderstorm', label: '雷雨+冰雹', emoji: '⛈️' },
    99: { condition: 'Thunderstorm', label: '強雷雨', emoji: '⛈️' }
};

export async function getLiveWeather(lat: number = 35.6895, lon: number = 139.6917) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&hourly=precipitation_probability&timezone=Asia%2FTokyo&forecast_days=1`;

    let response: Response | null = null;
    let lastErr: any = null;
    
    // Retry logic
    for (let i = 0; i < 2; i++) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 4000);
            response = await fetch(url, {
                next: { revalidate: 300 },
                signal: controller.signal
            }).finally(() => clearTimeout(timeout));
            if (response.ok) break;
            lastErr = new Error('Failed to fetch from Open Meteo');
        } catch (e: any) {
            lastErr = e;
        }
    }

    if (!response || !response.ok) {
        // Fallback to DB if fetch fails
        try {
            const { data: row } = await supabaseAdmin
                .from('transit_dynamic_snapshot')
                .select('station_id, weather_info, updated_at')
                .not('weather_info', 'is', null)
                .order('updated_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (row && row.weather_info) {
                const w: any = row.weather_info;
                return {
                    temp: w.temp || 0,
                    code: w.code || 0,
                    condition: w.condition || 'Unknown',
                    label: w.label || '不明',
                    emoji: w.emoji || '❓',
                    wind: w.wind || 0,
                    humidity: w.humidity || 0,
                    precipitationProbability: w.precipitationProbability || 0,
                    source: 'Database Snapshot (Fallback)'
                };
            }
        } catch (dbErr) {
            console.error('DB Fallback failed:', dbErr);
        }
        throw lastErr || new Error('Failed to fetch weather');
    }

    const data = await response.json();
    const code = data.current.weather_code;
    const weatherInfo = WMO_CODES[code] || { condition: 'Unknown', label: '不明', emoji: '❓' };
    
    // Get current hour's precipitation probability
    const currentHour = new Date().getHours();
    const precipProb = data.hourly?.precipitation_probability?.[currentHour] ?? null;

    return {
        temp: data.current.temperature_2m,
        code: code,
        condition: weatherInfo.condition,
        label: weatherInfo.label,
        emoji: weatherInfo.emoji,
        wind: data.current.wind_speed_10m,
        humidity: data.current.relative_humidity_2m,
        precipitationProbability: precipProb,
        source: 'Open-Meteo'
    };
}
