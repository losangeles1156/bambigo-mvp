import { NextResponse } from 'next/server';
import { STATION_WISDOM } from '@/data/stationWisdom';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nodeId, destination, context } = body;

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Fetch Expert Wisdom from Data Source
        // ------------------------------------------------------------------
        const wisdom = STATION_WISDOM[nodeId as string];
        let expertInsight = "No specific expert warning for this station. Follow standard signage.";

        if (wisdom) {
            // Prioritize CRITICAL traps, then HIGH, then hacks
            const criticalTrap = wisdom.traps?.find(t => t.severity === 'critical');
            const highTrap = wisdom.traps?.find(t => t.severity === 'high');

            if (criticalTrap) {
                expertInsight = `🚨 **CRITICAL**: ${criticalTrap.content} ${criticalTrap.advice}`;
            } else if (highTrap) {
                expertInsight = `⚠️ **WARNING**: ${highTrap.content}`;
            } else if (wisdom.hacks && wisdom.hacks.length > 0) {
                expertInsight = `💡 **TIP**: ${wisdom.hacks[0]}`;
            }
        }

        // Logic to generate specific advice based on context and wisdom
        // ------------------------------------------------------------------
        const adviceList = [];

        if (context.includes('luggage')) {
            // Check for elevator/locker wisdom
            const elevator = wisdom?.l3Facilities?.find(f => f.type === 'elevator' && (f.location.includes('Exit') || f.location.includes('出口')));
            const locker = wisdom?.l3Facilities?.find(f => f.type === 'locker' && f.attributes?.count && f.attributes.count > 50);

            if (elevator) {
                adviceList.push({
                    id: 'luggage-elevator',
                    icon: '🛗',
                    text: `Heavy Luggage? Use elevator at ${elevator.location}.`
                });
            } else {
                adviceList.push({
                    id: 'luggage-1',
                    icon: '🧳',
                    text: 'Based on station maps, using the North Elevator (Exit 3) avoids 2 flights of stairs.' // Fallback
                });
            }

            if (locker) {
                adviceList.push({
                    id: 'luggage-locker',
                    icon: '🔐',
                    text: `Large lockers available at ${locker.location} (${locker.attributes?.count} units).`
                });
            }
        }

        if (context.includes('rain')) {
            // Check for underground hacks
            const dryHack = wisdom?.hacks?.find(h => h.includes('雨') || h.includes('Underground') || h.includes('地下'));
            if (dryHack) {
                adviceList.push({
                    id: 'rain-hack',
                    icon: '☔',
                    text: dryHack
                });
            } else {
                adviceList.push({
                    id: 'rain-1',
                    icon: '☔',
                    text: 'Heavy rain detected. We have routed you through the underground shopping street (80% dry path).'
                });
            }
        }

        if (context.includes('stroller')) {
            const babyFacility = wisdom?.l3Facilities?.find(f => f.attributes?.hasBabyRoom);
            const elevator = wisdom?.l3Facilities?.find(f => f.type === 'elevator');

            if (babyFacility) {
                adviceList.push({
                    id: 'stroller-baby',
                    icon: '🍼',
                    text: `Nursing room available at ${babyFacility.location}.`
                });
            }
            if (elevator) {
                adviceList.push({
                    id: 'stroller-elevator',
                    icon: '👶',
                    text: `Stroller friendly route via ${elevator.location}.`
                });
            } else {
                adviceList.push({
                    id: 'stroller-1',
                    icon: '👶',
                    text: 'Avoid the Central Gate due to narrow ticket barriers. South Gate is wider.'
                });
            }
        }

        if (context.includes('rush')) {
            const crowdTrap = wisdom?.traps?.find(t => t.type === 'crowd');
            if (crowdTrap) {
                adviceList.push({
                    id: 'rush-trap',
                    icon: '⚡',
                    text: `RUSH HOUR ALERT: ${crowdTrap.content}`
                });
            } else {
                adviceList.push({
                    id: 'rush-1',
                    icon: '⚡',
                    text: 'Front car (Car 1) is closest to the exit at your destination.'
                });
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                route: {
                    origin: 'Current Location',
                    destination: destination || 'Selected Station',
                    duration: '12 min',
                    transfers: 1,
                    summary: 'Fastest Path'
                },
                expertInsight,
                contextAdvice: adviceList,
                alerts: [
                    { type: 'delay', icon: '⚠️', text: 'Line Delay (+5m)' },
                    { type: 'weather', icon: '🌧️', text: 'Rain Alert' }
                ]
            }
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to generate strategy' },
            { status: 500 }
        );
    }
}
