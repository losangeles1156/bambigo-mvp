import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';

import { odptClient } from '@/lib/odpt/client';
import { GET } from './route';

test('route API response includes fare, duration, transfers, nextDeparture, steps', async () => {
    const originalGetRailways = odptClient.getRailways;
    const originalGetFares = odptClient.getFares;
    const originalGetStationTimetable = odptClient.getStationTimetable;
    const originalFetch = globalThis.fetch;

    try {
        odptClient.getRailways = async () => {
            return [
                {
                    'owl:sameAs': 'odpt.Railway:TokyoMetro.Ginza',
                    'odpt:operator': 'odpt.Operator:TokyoMetro',
                    'odpt:railwayTitle': { en: 'Ginza Line', ja: '銀座線' },
                    'odpt:stationOrder': [
                        {
                            'odpt:index': 0,
                            'odpt:station': 'odpt.Station:TokyoMetro.Ginza.Ueno',
                            'odpt:stationTitle': { en: 'Ueno', ja: '上野' },
                        },
                        {
                            'odpt:index': 1,
                            'odpt:station': 'odpt.Station:TokyoMetro.Ginza.Ginza',
                            'odpt:stationTitle': { en: 'Ginza', ja: '銀座' },
                        }
                    ]
                }
            ] as any;
        };

        odptClient.getFares = async () => {
            return [
                {
                    'odpt:icCardFare': 180,
                    'odpt:ticketFare': 200,
                }
            ] as any;
        };

        odptClient.getStationTimetable = async () => {
            return [
                {
                    'odpt:stationTimetableObject': [
                        { 'odpt:departureTime': '23:59' },
                    ]
                }
            ] as any;
        };

        globalThis.fetch = (async (input: any) => {
            const url = String(input?.url || input || '');
            if (url.includes('/api/l2/status')) {
                return new Response(JSON.stringify({ status: 'normal', crowding_text: 'ok' }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return new Response(JSON.stringify({}), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }) as any;

        const req = new NextRequest(
            'http://localhost/api/odpt/route?from=odpt.Station:TokyoMetro.Ginza.Ueno&to=odpt.Station:TokyoMetro.Ginza.Ginza&locale=en'
        );
        const res = await GET(req as any);
        assert.equal(res.status, 200);
        const body = (await res.json()) as any;

        assert.ok(Array.isArray(body.routes));
        assert.ok(body.routes.length > 0);

        const route = body.routes[0];
        assert.equal(typeof route.label, 'string');
        assert.ok(Array.isArray(route.steps));
        assert.equal(typeof route.transfers, 'number');
        assert.equal(typeof route.duration, 'number');
        assert.equal(typeof route.nextDeparture, 'string');
        assert.ok(route.fare && typeof route.fare.ic === 'number' && typeof route.fare.ticket === 'number');
        assert.ok(Array.isArray(route.sources));
    } finally {
        odptClient.getRailways = originalGetRailways;
        odptClient.getFares = originalGetFares;
        odptClient.getStationTimetable = originalGetStationTimetable;
        globalThis.fetch = originalFetch;
    }
});

