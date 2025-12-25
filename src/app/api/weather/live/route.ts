import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Tokyo Coordinates
        const lat = 35.6895;
        const lon = 139.6917;

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FTokyo`;

        const response = await fetch(url, {
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from Open Meteo');
        }

        const data = await response.json();

        return NextResponse.json({
            temp: data.current.temperature_2m,
            code: data.current.weather_code,
            wind: data.current.wind_speed_10m,
            source: 'Open-Meteo'
        });

    } catch (error: any) {
        console.error('Open Meteo API Error:', error.message);
        return NextResponse.json({ error: 'Failed to fetch live weather' }, { status: 500 });
    }
}
