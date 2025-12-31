import { NextResponse } from 'next/server';
import { STATION_WISDOM } from '@/data/stationWisdom';
import { ActionCard } from '@/lib/types/stationStandard';
import { logUserActivity } from '@/lib/activityLogger';

// Define the request body structure
interface StrategyRequest {
    stationId: string;
    demand: string | null;      // 'speed' | 'luggage' | 'budget' | ...
    destination: string;        // 'Narita', 'Shinjuku', etc.
    locale?: string;
}

export async function POST(request: Request) {
    try {
        const body: StrategyRequest = await request.json();
        const { stationId, demand, destination, locale = 'en' } = body;

        await logUserActivity({
            request,
            activityType: 'strategy_request',
            queryContent: { stationId, demand, destination, locale },
            metadata: { feature: 'l4_strategy' }
        });

        // 1. Get Wisdom for the station
        const wisdom = STATION_WISDOM[stationId];
        const cards: ActionCard[] = [];

        if (!wisdom) {
            // Fallback for unknown stations
            return NextResponse.json({
                cards: [{
                    id: 'fallback',
                    type: 'primary',
                    title: { ja: '検索中...', en: 'Analyzing...', zh: '分析中...' },
                    description: { ja: 'この駅のデータはまだありません。', en: 'No specific data for this station yet.', zh: '尚無此車站的詳細數據。' },
                    actionLabel: { ja: '地図を見る', en: 'View Map', zh: '查看地圖' },
                    actionUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination || stationId)}`
                }]
            });
        }

        // 2. Rule Engine Logic

        // --- DESTINATION RULES (Priority: High) ---
        if (destination) {
            const destLower = destination.toLowerCase();

            // Rule: Narita Airport (General)
            if (destLower.includes('narita') || destLower.includes('成田')) {
                if (stationId.includes('Ueno')) {
                    if (demand === 'budget') {
                        cards.push({
                            id: 'ueno-narita-budget',
                            type: 'primary',
                            title: { ja: '京成線特急 (Access Express)', en: 'Keisei Access Express', zh: '京成成田Sky Access特急' },
                            description: {
                                ja: 'スカイライナーより安く、乗り換えなしで空港へ行けます。',
                                en: 'Cheaper than Skyliner, direct access to the airport.',
                                zh: '比Skyliner便宜，且不需要對號座，直接抵達機場。'
                            },
                            actionLabel: { ja: '時刻表', en: 'Timetable', zh: '時刻表' },
                            actionUrl: 'https://www.keisei.co.jp/keisei/tetudou/skyliner/tc/timetable/index.php'
                        });
                    } else {
                        // Default to Skyliner for Speed/Comfort
                        cards.push({
                            id: 'ueno-narita-skyliner',
                            type: 'primary',
                            title: { ja: '京成スカイライナー', en: 'Keisei Skyliner', zh: '京成 Skyliner' },
                            description: {
                                ja: '最速で成田空港へ。全席指定で快適です。',
                                en: 'Fastest way to Narita. Reserved seating and comfortable.',
                                zh: '前往成田機場最快的方式 (約41分)。全車對號座，舒適且有行李架。'
                            },
                            actionLabel: { ja: '予約する', en: 'Reserve', zh: '預約車票' },
                            actionUrl: 'https://www.keisei.co.jp/keisei/tetudou/skyliner/e-ticket/zht/'
                        });
                    }
                } else if (stationId.includes('Asakusa') || stationId.includes('Oshiage')) {
                    cards.push({
                        id: 'asakusa-narita-direct',
                        type: 'primary',
                        title: { ja: '都営淺草線直通 (エアポート快特)', en: 'Asakusa Line Direct (Airport Kaitoku)', zh: '都營淺草線直通 (機場快特)' },
                        description: {
                            ja: '乗り換えなしで成田空港へ直行できます。',
                            en: 'Direct train to Narita Airport without transfers.',
                            zh: '免轉乘！搭乘「Access特急」或「機場快特」可直接抵達航廈。'
                        },
                        actionLabel: { ja: '時刻表', en: 'Timetable', zh: '時刻表' },
                        actionUrl: 'https://www.kotsu.metro.tokyo.jp/subway/stations/asakusa.html'
                    });
                }
            }
        }

        // --- DEMAND RULES (Priority: Medium) ---
        // If no primary card derived from destination, try to derive from wisdom tags/facilities
        if (cards.length === 0 && demand) {
            // Rule: Luggage -> Look for Elevators or Lockers advice
            if (demand === 'luggage') {
                const lockerStart = wisdom.l3Facilities?.find(f => f.type === 'locker' && (f.attributes?.count || 0) > 50);
                if (lockerStart) {
                    const loc = lockerStart.location as { ja: string; en: string; zh: string };
                    cards.push({
                        id: 'luggage-advice',
                        type: 'primary',
                        title: { ja: '手荷物預かり・ロッカー', en: 'Luggage Storage / Lockers', zh: '大行李寄放建議' },
                        description: {
                            ja: `大型ロッカーは「${loc.ja}」にあります。`,
                            en: `Large lockers are available at "${loc.en}".`,
                            zh: `推薦前往「${loc.zh}」，那裡有較多的大型置物櫃與行李寄放服務。`
                        },
                        actionLabel: { ja: '構内図', en: 'Station Map', zh: '構內圖' },
                        actionUrl: 'https://www.google.com/maps'
                    });
                } else {
                    // Fallback Luggage Advice
                    cards.push({
                        id: 'luggage-general',
                        type: 'primary',
                        title: { ja: 'エレベーター利用推奨', en: 'Use Elevators', zh: '建議使用電梯' },
                        description: {
                            ja: '大きな荷物がある場合は、エレベータールートを確認してください。',
                            en: 'With large luggage, please check the elevator routes to avoid stairs.',
                            zh: '攜帶大行李時，請務必尋找電梯標示。此站部分出口僅有樓梯。'
                        },
                        actionLabel: { ja: '構内図', en: 'Station Map', zh: '構內圖' },
                        actionUrl: ''
                    });
                }
            }

            // Rule: Family -> Look for Nursing/Wide gates
            if (demand === 'family') {
                const babyRoom = wisdom.l3Facilities?.find(f => f.attributes?.hasBabyRoom);
                if (babyRoom) {
                    const loc = babyRoom.location as { ja: string; en: string; zh: string };
                    cards.push({
                        id: 'family-babyroom',
                        type: 'primary',
                        title: { ja: '授乳室与設備', en: 'Nursing Room & Facilities', zh: '育嬰室與親子設施' },
                        description: {
                            ja: `授乳室は「${loc.ja}」にあります。`,
                            en: `Nursing room is located at "${loc.en}".`,
                            zh: `育嬰室位於「${loc.zh}」，提供熱水與尿布台。`
                        },
                        actionLabel: { ja: '詳細', en: 'Details', zh: '詳細資訊' }
                    });
                }
            }
            // Rule: Speed -> Check Hacks
            if (demand === 'speed' && wisdom.hacks && wisdom.hacks.length > 0) {
                const hack = wisdom.hacks[0];
                cards.push({
                    id: 'speed-hack',
                    type: 'primary',
                    title: { ja: hack.title, en: hack.title, zh: hack.title },
                    description: {
                        ja: hack.content,
                        en: hack.content,
                        zh: hack.content
                    },
                    actionLabel: { ja: '確認', en: 'Check', zh: '確認' }
                });
            }
        }

        // --- TRAP WARNINGS (Always add as Secondary if High Severity) ---
        const criticalTraps = wisdom.traps.filter(t => t.severity === 'critical' || t.severity === 'high');
        criticalTraps.forEach((trap, idx) => {
            cards.push({
                id: `trap-${idx}`,
                type: cards.length === 0 ? 'primary' : 'secondary',
                title: { ja: trap.title, en: trap.title, zh: trap.title },
                description: {
                    ja: (trap.content || '') + '\n' + trap.advice,
                    en: (trap.content || '') + '\n' + trap.advice,
                    zh: (trap.content || '') + '\n' + trap.advice
                },
                actionLabel: { ja: '注意', en: 'Warning', zh: '注意' }
            });
        });

        // --- DEFAULT FALLBACK (If still empty) ---
        if (cards.length === 0) {
            cards.push({
                id: 'default-explore',
                type: 'primary',
                title: { ja: '周辺を探索', en: 'Explore Around', zh: '探索周邊' },
                description: {
                    ja: '特定の条件に合う提案が見つかりませんでした。地図で周辺を確認してみましょう。',
                    en: 'No specific advice found for your criteria. Let\'s check the map.',
                    zh: '暫無針對此條件的特定建議。不妨打開地圖探索周邊景點。'
                },
                actionLabel: { ja: 'Google Maps', en: 'Google Maps', zh: 'Google Maps' },
                actionUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stationId)}`
            });
        }

        // Add hacks as secondary if not used
        if (wisdom.hacks && wisdom.hacks.length > 0) {
            const hack = wisdom.hacks[0];
            // Check if already added
            if (!cards.find(c => c.id === 'speed-hack')) {
                cards.push({
                    id: 'secondary-hack',
                    type: 'secondary',
                    title: { ja: hack.title, en: hack.title, zh: hack.title },
                    description: {
                        ja: hack.content,
                        en: hack.content,
                        zh: hack.content
                    },
                    actionLabel: { ja: '詳細', en: 'Detail', zh: '詳細' }
                });
            }
        }

        return NextResponse.json({ cards });
    } catch (error) {
        console.error('Strategy API Error:', error);
        return NextResponse.json({ error: 'Failed to generate strategy' }, { status: 500 });
    }
}

