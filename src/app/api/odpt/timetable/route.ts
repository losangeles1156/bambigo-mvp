import { NextRequest, NextResponse } from 'next/server';

const ODPT_API_KEY = process.env.ODPT_API_KEY;
const BASE_URL = 'https://api.odpt.org/api/v4/odpt:StationTimetable';

// Helper to get JST Time and Day
function getJSTContext() {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const day = now.getDay(); // 0 = Sun
    const isWeekend = day === 0 || day === 6;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // ODPT Calendar mapping logic (Simplified)
    // In reality, should check for holidays. For MVP:
    const calendarSelector = isWeekend ? ['SaturdayHoliday', 'Holiday', 'Saturday'] : ['Weekday'];

    return { currentMinutes, calendarSelector };
}

export async function GET(req: NextRequest) {
    if (!ODPT_API_KEY) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });

    const { searchParams } = new URL(req.url);
    const station = searchParams.get('station');

    if (!station) return NextResponse.json({ error: 'Missing station ID' }, { status: 400 });

    const { currentMinutes, calendarSelector } = getJSTContext();

    // Fetch Timetables for this station
    const apiUrl = `${BASE_URL}?odpt:station=${station}&acl:consumerKey=${ODPT_API_KEY}`;

    try {
        const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error('ODPT API Error');
        const data = await res.json();

        // Filter by Calendar
        const relevantTables = data.filter((t: any) => {
            const cal = t['odpt:calendar'].replace('odpt.Calendar:', '');
            return calendarSelector.some(c => cal.includes(c));
        });

        // Process Departures
        const directions: Record<string, any[]> = {};

        relevantTables.forEach((table: any) => {
            const dir = table['odpt:railDirection']?.replace('odpt.RailDirection:', '') || 'Unknown';
            const trips = table['odpt:stationTimetableObject'] || [];

            // Find next 3 trains
            const upcoming = trips.map((trip: any) => {
                const [h, m] = trip['odpt:departureTime'].split(':').map(Number);
                const tripMinutes = h * 60 + m;
                return { ...trip, minutes: tripMinutes };
            })
                .filter((trip: any) => trip.minutes >= currentMinutes)
                .sort((a: any, b: any) => a.minutes - b.minutes)
                .slice(0, 3)
                .map((trip: any) => ({
                    time: trip['odpt:departureTime'],
                    dest: trip['odpt:destinationStation']?.[0]?.split('.').pop() || 'Unknown',
                    trainType: trip['odpt:trainType']?.split(':').pop()
                }));

            if (upcoming.length > 0) {
                if (!directions[dir]) directions[dir] = [];
                directions[dir].push(...upcoming);
            }
        });

        return NextResponse.json({ station, directions });

    } catch (error) {
        console.error('Timetable API Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
