import { NextResponse } from 'next/server';
import { decisionEngine } from '@/lib/l4/decisionEngine';
import { UserPreferences } from '@/types/lutagu_l4';
import { logUserActivity } from '@/lib/activityLogger';

// Request Body definition
interface RecommendRequest {
    stationId: string;
    lineIds?: string[];
    userPreferences: UserPreferences;
    locale?: 'zh-TW' | 'ja' | 'en';
}

export async function POST(request: Request) {
    try {
        const body: RecommendRequest = await request.json();
        const {
            stationId,
            lineIds = [],
            userPreferences,
            locale = 'zh-TW'
        } = body;

        // Log the request for verification/analytics
        await logUserActivity({
            request,
            activityType: 'l4_recommendation_request',
            queryContent: { stationId, context: userPreferences },
            metadata: { feature: 'l4_decision_engine' }
        });

        // 1. Run Soft Advice Engine (Knowledge Base)
        const matches = decisionEngine.evaluate({
            stationId,
            lineIds,
            userPreferences,
            currentDate: new Date(),
            locale
        });

        // 2. (Future) Run Hard Calculation Engine (ODPT Routing)
        // const routeResult = await odptRouting.calculate(...)

        // 3. Transform to Frontend Response Cards
        const cards = matches.map(match => ({
            id: match.id,
            type: match.type === 'warning' ? 'warning' : match.type,
            icon: match.icon,
            title: match.title,
            description: match.description,
            priority: match.priority,
            _debug_reason: match._debug_reason
        }));

        // 4. Default Fallback
        if (cards.length === 0) {
            cards.push({
                id: 'no-match-explore',
                type: 'info',
                icon: '🔍',
                title: locale === 'zh-TW' ? '暫無特定建議' : 'No specific advice',
                description: locale === 'zh-TW'
                    ? '目前沒有針對此場景的特別建議，請探索周邊或輸入具體目的地。'
                    : 'No specific advice for this context. Please explore nearby.',
                priority: 0,
                _debug_reason: undefined
            });
        }

        return NextResponse.json({
            cards,
            meta: {
                total_matches: matches.length,
                engine_version: 'v3.0.0-alpha'
            }
        });

    } catch (error) {
        console.error('L4 Recommendation API Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate recommendations' },
            { status: 500 }
        );
    }
}
