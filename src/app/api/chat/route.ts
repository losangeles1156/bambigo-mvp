import { NextRequest, NextResponse } from 'next/server';
import { StrategyEngine } from '@/lib/ai/strategyEngine';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, userLocation, zone, locale = 'zh-TW' } = body;

        // Use last message as query
        const lastMessage = messages[messages.length - 1]?.content || 'Hello';
        const userId = 'bambigo-user-' + Math.random().toString(36).substring(7);

        // 1. Get Strategy Synthesis (L4)
        let strategyContext = null;
        if (userLocation?.lat && userLocation?.lon) {
            strategyContext = await StrategyEngine.getSynthesis(userLocation.lat, userLocation.lon, locale);
        }

        // Check for API Keys
        if (!process.env.DIFY_API_KEY) {
            console.warn('Missing DIFY_API_KEY');
            return NextResponse.json(mockResponse(lastMessage));
        }

        const difyUrl = process.env.DIFY_API_URL || 'https://api.dify.ai/v1';

        // 2. Dify API Call
        const response = await fetch(`${difyUrl}/chat-messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DIFY_API_KEY}`
            },
            body: JSON.stringify({
                query: lastMessage,
                user: userId,
                inputs: {
                    current_zone: zone || 'core',
                    user_location: userLocation ? `${userLocation.lat},${userLocation.lon}` : 'unknown',
                    persona_prompt: `${strategyContext?.personaPrompt || ''}\n\n[STATION EXPERT KNOWLEDGE]\n${strategyContext?.wisdomSummary || 'No specific warnings.'}`,
                    nearest_hub: strategyContext?.nodeName || 'Unknown',
                    l2_delay: strategyContext?.l2Status?.delay || 0
                },
                response_mode: 'blocking'
            })
        });

        if (!response.ok) {
            console.error('Dify API Error:', response.status, await response.text());
            return NextResponse.json(mockResponse(lastMessage));
        }

        const data = await response.json();

        // 2. Parse Dify Response
        // Dify returns text in `data.answer`.
        // We expect Dify to potentially return formatted JSON or text + actions.
        // For this MVP, we will try to parse JSON from the text if possible, or just return text.

        let clientAnswer = data.answer;
        let clientActions: any[] = [];

        // Try to find actions in the response or structured part
        // IMPORTANT: In Dify Prompt, we should instruct it to output explicit actions if needed.
        // For now, we'll strip any "JSON" blocks if the AI puts them there primarily for app logic.

        // Simple heuristic: If the answer contains a special block like ```json ... ```, extract it.
        const jsonMatch = clientAnswer.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
            try {
                const extracted = JSON.parse(jsonMatch[1]);
                if (extracted.actions) {
                    clientActions = extracted.actions;
                }
                if (extracted.answer) {
                    clientAnswer = extracted.answer; // Update answer to clean text
                }
            } catch (e) {
                // Failed to parse, keep original
            }
        }

        // Append Commercial Nudges if any
        if (strategyContext?.commercialActions && strategyContext.commercialActions.length > 0) {
            clientActions = [...clientActions, ...strategyContext.commercialActions];
        }

        return NextResponse.json({
            answer: clientAnswer,
            actions: clientActions,
            context: {
                hub: strategyContext?.nodeName,
                delay: strategyContext?.l2Status?.delay
            }
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Fallback Mock Logic
function mockResponse(query: string) {
    const lowerMsg = query.toLowerCase();
    let actions: any[] = [];
    let answer = "I'm currently running in offline mode (Dify disconnected). But I can still help you navigate!";

    if (lowerMsg.includes('ueno') || lowerMsg.includes('上野')) {
        answer = "上野是個充滿文化氣息的好地方！要去上野公園還是阿美橫町逛逛呢？";
        actions.push({
            type: 'navigate',
            label: '前往上野 (Go to Ueno)',
            target: 'ueno',
            metadata: { coordinates: [35.7141, 139.7774] }
        });
        actions.push({
            type: 'details',
            label: '查看車站詳情',
            target: 'odpt:Station:TokyoMetro.Ueno'
        });
    }

    return {
        answer,
        actions
    };
}
