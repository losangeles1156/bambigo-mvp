import { NextResponse } from 'next/server';
import { getLiveWeather } from '@/lib/weather/service';

export async function GET(request: Request) {
    try {
        const weatherData = await getLiveWeather();
        return NextResponse.json(weatherData);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
