import { MatchedStrategyCard, EvaluationContext } from '@/types/lutagu_l4';
import { odptClient } from '@/lib/odpt/client';

export class L4HardCalculationEngine {

    /**
     * Evaluates the current context against hard data (Real-time API, Timetable).
     * Unlike the DecisionEngine (which uses static rules), this engine fetches live data.
     */
    async evaluate(context: EvaluationContext): Promise<MatchedStrategyCard[]> {
        const cards: MatchedStrategyCard[] = [];
        const { lineIds, currentDate, locale } = context;

        // 1. Real-time Train Status Check (Delay/Suspension)
        // We only check if we have lineIds.
        if (lineIds && lineIds.length > 0) {
            try {
                // Extract operators from line IDs (approximate)
                // ODPT IDs are like "odpt:Railway:TokyoMetro.Ginza" -> operator "odpt:Operator:TokyoMetro"
                const railways = lineIds.filter(id => id.startsWith('odpt:Railway:'));

                if (railways.length > 0) {
                    // Fetch info for these railways. 
                    // Note: API rate limits might be an issue if we call individually.
                    // For MVP, we fetch by operator if possible, or just fetch all for the main operators involved.
                    // Here we just loop through generic operators for Tokyo if we can't parse specific ones easily,
                    // or better, just pass the specific railway ID to getTrainInformation.

                    // Optimization: Just fetch TokyoMetro and Toei info once if any line matches their pattern.
                    // For simplicity in MVP, let's just try to fetch info for the *first* detected railway to demonstrate.
                    const targetRailway = railways[0];
                    const operator = this.guessOperator(targetRailway);

                    if (operator) {
                        const infoList = await odptClient.getTrainInformation(operator, targetRailway);

                        for (const info of infoList) {
                            if (info['odpt:trainInformationStatus'] && info['odpt:trainInformationStatus'] !== '平常運転' && info['odpt:trainInformationStatus'] !== '平時運行') {
                                // Found a non-normal status!
                                const text = info['odpt:trainInformationText']?.[locale === 'zh-TW' ? 'ja' : (locale === 'en' ? 'en' : 'ja')] || 'Delay detected'; // Fallback to JA for ZH for now as API might not have ZH

                                cards.push({
                                    id: `odpt-delay-${info['@id']}`,
                                    type: 'warning',
                                    priority: 99, // Very High Priority
                                    icon: '⚠️',
                                    title: locale === 'en' ? 'Train Status Alert' : '運行情報 (Live)',
                                    description: text,
                                    _debug_reason: `HardCalc: Detected abnormal status on ${targetRailway}`
                                });
                            }
                        }
                    }
                }

            } catch (e) {
                console.error('[HardCalc] Failed to fetch train info', e);
                // Fail silently, don't block the UI
            }
        }

        // 2. Last Train Check (Time-based Mock)
        const hour = currentDate.getHours();
        if (hour >= 23 || hour < 1) {
            cards.push({
                id: 'hard-calc-last-train',
                type: 'warning',
                priority: 90,
                icon: '🌙',
                title: locale === 'en' ? 'Last Train Approach' : '終電注意',
                description: locale === 'en'
                    ? 'It is late. Please check the timetable for the last train.'
                    : '夜深了，請務必確認這條路線的末班車時間，以免滯留。',
                _debug_reason: `HardCalc: Time is ${hour}:00`
            });
        }

        // 3. Weather check (Placeholder)
        // if (isRaining()) { ... }

        return cards;
    }

    private guessOperator(lineId: string): string | undefined {
        if (lineId.includes('TokyoMetro')) return 'odpt:Operator:TokyoMetro';
        if (lineId.includes('Toei')) return 'odpt:Operator:Toei';
        if (lineId.includes('JR-East')) return 'odpt:Operator:JR-East';
        return undefined;
    }
}

export const hardCalculationEngine = new L4HardCalculationEngine();
