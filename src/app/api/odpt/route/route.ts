import { NextRequest, NextResponse } from 'next/server';
import { odptClient } from '@/lib/odpt/client';
import {
    findSimpleRoutes,
    normalizeOdptStationId,
    inferOdptOperatorFromStationId,
    type RailwayTopology,
} from '@/lib/l4/assistantEngine';

const FARE_API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface RouteResponse {
    routes: Array<{
        label: string;
        steps: string[];
        duration?: number;
        transfers: number;
        fare?: { ic: number; ticket: number };
        nextDeparture?: string;
        railways?: string[]; // Added to pass to AssistantEngine
        sources: Array<{ type: string; verified: boolean }>;
    }>;
    error?: string;
}

// Helper to fetch fare between two stations
async function fetchFare(from: string, to: string): Promise<{ ic: number; ticket: number } | null> {
    try {
        const fares = await odptClient.getFares(from, to);
        if (fares && fares.length > 0) {
            const fare = fares[0];
            return {
                ic: fare['odpt:icCardFare'],
                ticket: fare['odpt:ticketFare']
            };
        }
    } catch (e) {
        console.warn('Failed to fetch fare:', e);
    }
    return null;
}

// Helper to fetch next departure from a station
async function fetchNextDeparture(station: string): Promise<string | null> {
    try {
        const timetables = await odptClient.getStationTimetable(station);
        if (timetables && timetables.length > 0) {
            const now = new Date();
            const nowHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            for (const table of timetables) {
                const objs = table['odpt:stationTimetableObject'] || [];
                for (const obj of objs) {
                    const depTime = obj['odpt:departureTime'];
                    if (depTime && depTime >= nowHHMM) {
                        return depTime;
                    }
                }
            }
        }
    } catch (e) {
        console.warn('Failed to fetch timetable:', e);
    }
    return null;
}

// Helper to count transfers in a route path
function countTransfers(steps: string[]): number {
    const trainSegments = (steps || []).filter(s => String(s || '').trim().startsWith('🚃')).length;
    return Math.max(0, trainSegments - 1);
}

function estimateDurationMinutes(steps: string[], transfers: number): number {
    const trainSegments = (steps || []).filter(s => String(s || '').trim().startsWith('🚃')).length;
    const base = 2;
    const ride = trainSegments * 12;
    const transfer = Math.max(0, transfers) * 6;
    return base + ride + transfer;
}

// Helper to fetch L2 status for a station
async function fetchL2Status(stationId: string): Promise<{ status: string; text?: string } | null> {
    try {
        // We call our internal L2 status API
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/l2/status?station_id=${encodeURIComponent(stationId)}`, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            if (data && data.status) {
                return {
                    status: data.status, // normal, delay, suspended
                    text: data.crowding_text || data.train_status_text
                };
            }
        }
    } catch (e) {
        console.warn('Failed to fetch L2 status:', e);
    }
    return null;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const fromStation = searchParams.get('from');
    const toStation = searchParams.get('to');
    const locale = (searchParams.get('locale') || 'zh-TW') as any;

    if (!fromStation || !toStation) {
        return NextResponse.json({ error: 'Missing from/to station parameters', routes: [] }, { status: 400 });
    }

    const normalizedFrom = normalizeOdptStationId(fromStation);
    const normalizedTo = normalizeOdptStationId(toStation);

    try {
        // 1. Infer operator for railway topology
        const operator = inferOdptOperatorFromStationId(normalizedFrom);
        if (!operator) {
            return NextResponse.json({
                error: 'Cannot infer operator from station ID',
                routes: []
            }, { status: 400 });
        }

        // 2. Fetch railway topology
        const railwaysRaw = await odptClient.getRailways(operator);
        const railways: RailwayTopology[] = (railwaysRaw || []).map(r => ({
            railwayId: r['owl:sameAs'],
            operator: r['odpt:operator'],
            title: r['odpt:railwayTitle'],
            stationOrder: (r['odpt:stationOrder'] || []).map(s => ({
                index: s['odpt:index'],
                station: s['odpt:station'],
                title: s['odpt:stationTitle'],
            })),
        }));

        // 3. Find routes using BFS
        const routeOptions = findSimpleRoutes({
            originStationId: normalizedFrom,
            destinationStationId: normalizedTo,
            railways,
            maxHops: 25,
            locale,
        });

        if (routeOptions.length === 0) {
            return NextResponse.json({
                error: 'No direct route found. Cross-operator transfer may be required.',
                routes: []
            });
        }

        // 4. Enrich routes with fare, timetable and L2 status data (fetch in parallel)
        const [fare, nextDep, l2Status] = await Promise.all([
            fetchFare(normalizedFrom, normalizedTo),
            fetchNextDeparture(normalizedFrom),
            fetchL2Status(normalizedFrom)
        ]);

        // 5. Build response
        const routes: RouteResponse['routes'] = routeOptions.map((opt) => {
            const transfers = countTransfers(opt.steps);
            const duration = estimateDurationMinutes(opt.steps, transfers);

            return {
                label: opt.label,
                steps: opt.steps,
                duration,
                transfers,
                fare: fare || undefined,
                nextDeparture: nextDep || undefined,
                railways: opt.railways,
                sources: [
                    { type: 'odpt:Railway', verified: true },
                    ...(fare ? [{ type: 'odpt:RailwayFare', verified: true }] : []),
                    ...(nextDep ? [{ type: 'odpt:StationTimetable', verified: true }] : []),
                    ...(l2Status ? [{ type: 'l2:Status', verified: true }] : []),
                ]
            };
        });

        return NextResponse.json({ routes }, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
            }
        });

    } catch (error) {
        console.error('Route API Error:', error);
        return NextResponse.json({
            error: 'Failed to plan route',
            routes: []
        }, { status: 500 });
    }
}
