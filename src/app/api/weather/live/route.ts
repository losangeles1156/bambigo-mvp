import { NextResponse } from 'next/server';

// WMO Weather Code Mapping
const WMO_CODES: Record<number, { condition: string; label: string; emoji: string }> = {
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

export async function GET() {
    try {
        // Tokyo Coordinates
        const lat = 35.6895;
        const lon = 139.6917;

        // Extended query with humidity and precipitation probability
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&hourly=precipitation_probability&timezone=Asia%2FTokyo&forecast_days=1`;

        const response = await fetch(url, {
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from Open Meteo');
        }

        const data = await response.json();
        const code = data.current.weather_code;
        const weatherInfo = WMO_CODES[code] || { condition: 'Unknown', label: '不明', emoji: '❓' };

        // Get current hour's precipitation probability
        const currentHour = new Date().getHours();
        const precipProb = data.hourly?.precipitation_probability?.[currentHour] ?? null;

        return NextResponse.json({
            temp: data.current.temperature_2m,
            code: code,
            condition: weatherInfo.condition,
            label: weatherInfo.label,
            emoji: weatherInfo.emoji,
            wind: data.current.wind_speed_10m,
            humidity: data.current.relative_humidity_2m,
            precipitationProbability: precipProb,
            source: 'Open-Meteo'
        });

    } catch (error: any) {
        console.error('Open Meteo API Error:', error.message);
        return NextResponse.json({ error: 'Failed to fetch live weather' }, { status: 500 });
    }
}
