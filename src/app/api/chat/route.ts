import { NextRequest, NextResponse } from 'next/server';
import { StrategyEngine } from '@/lib/ai/strategyEngine';
import { logUserActivity } from '@/lib/activityLogger';
import { getVisitorIdFromRequest } from '@/lib/visitorIdentity';
import { writeAuditLog, writeSecurityEvent } from '@/lib/security/audit';
import { STATION_WISDOM } from '@/data/stationWisdom';

export const runtime = 'edge';

type SupportedLocale = 'zh-TW' | 'en' | 'ja';

function normalizeLocale(input?: string): SupportedLocale {
    const raw = String(input || '').trim().toLowerCase();
    if (raw.startsWith('ja')) return 'ja';
    if (raw.startsWith('en')) return 'en';
    return 'zh-TW';
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, userLocation, zone, locale: inputLocale = 'zh-TW' } = body;
        const locale = normalizeLocale(inputLocale);

        // Use last message as query
        const lastMessage = messages[messages.length - 1]?.content || 'Hello';
        const visitorId = getVisitorIdFromRequest(req);
        const userId = visitorId || ('bambigo-user-' + Math.random().toString(36).substring(7));

        await logUserActivity({
            request: req,
            activityType: 'chat_query',
            queryContent: { message: lastMessage, zone: zone || 'core', locale },
            metadata: {
                hasLocation: Boolean(userLocation?.lat && userLocation?.lon)
            }
        });

        void writeAuditLog(req, {
            actorUserId: null,
            action: 'read',
            resourceType: 'chat',
            resourceId: String(userId || '*'),
            before: null,
            after: {
                zone: zone || 'core',
                locale,
                hasLocation: Boolean(userLocation?.lat && userLocation?.lon)
            }
        });

        // 1. Get Strategy Synthesis (L4)
        let strategyContext = null;
        if (userLocation?.lat && userLocation?.lon) {
            strategyContext = await StrategyEngine.getSynthesis(userLocation.lat, userLocation.lon, locale);
        }

        // Check for API Keys
        if (!process.env.DIFY_API_KEY) {
            console.warn('Missing DIFY_API_KEY');

            void writeSecurityEvent(req, {
                type: 'ai_config_missing',
                severity: 'high',
                actorUserId: null,
                metadata: { endpoint: 'POST /api/chat', missingKey: true }
            });

            const mistralText = await generateMistralAnswer({ query: lastMessage, locale, strategyContext, zone, userLocation });
            if (mistralText) {
                void writeSecurityEvent(req, {
                    type: 'ai_fallback_mistral',
                    severity: 'low',
                    actorUserId: null,
                    metadata: { endpoint: 'POST /api/chat', reason: 'dify_missing' }
                });
                return NextResponse.json({ answer: mistralText, actions: strategyContext?.commercialActions || [], mode: 'mistral' });
            }
            return NextResponse.json(mockResponse({ query: lastMessage, locale }));
        }

        const difyUrl = process.env.DIFY_API_URL || 'https://api.dify.ai/v1';

        // 2. Dify API Call
        let response: Response;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            try {
                response = await fetch(`${difyUrl}/chat-messages`, {
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
                        response_mode: 'streaming'
                    }),
                    signal: controller.signal
                });
            } finally {
                clearTimeout(timeoutId);
            }
        } catch {
            void writeSecurityEvent(req, {
                type: 'ai_network_error',
                severity: 'medium',
                actorUserId: null,
                metadata: { endpoint: 'POST /api/chat' }
            });

            const mistralText = await generateMistralAnswer({ query: lastMessage, locale, strategyContext, zone, userLocation });
            if (mistralText) {
                void writeSecurityEvent(req, {
                    type: 'ai_fallback_mistral',
                    severity: 'low',
                    actorUserId: null,
                    metadata: { endpoint: 'POST /api/chat', reason: 'network_error' }
                });
                return NextResponse.json({ answer: mistralText, actions: strategyContext?.commercialActions || [], mode: 'mistral' });
            }
            return NextResponse.json(mockResponse({ query: lastMessage, locale }));
        }

        if (!response.ok) {
            console.error('Dify API Error:', response.status, await response.text());

            void writeSecurityEvent(req, {
                type: 'ai_upstream_error',
                severity: 'medium',
                actorUserId: null,
                metadata: { endpoint: 'POST /api/chat', status: response.status }
            });

            const mistralText = await generateMistralAnswer({ query: lastMessage, locale, strategyContext, zone, userLocation });
            if (mistralText) {
                void writeSecurityEvent(req, {
                    type: 'ai_fallback_mistral',
                    severity: 'low',
                    actorUserId: null,
                    metadata: { endpoint: 'POST /api/chat', reason: 'upstream_error', status: response.status }
                });
                return NextResponse.json({ answer: mistralText, actions: strategyContext?.commercialActions || [], mode: 'mistral' });
            }
            return NextResponse.json(mockResponse({ query: lastMessage, locale }));
        }

        const difyAnswer = await readDifyStreamingAnswer(response);
        if (!difyAnswer) {
            void writeSecurityEvent(req, {
                type: 'ai_stream_error_event',
                severity: 'medium',
                actorUserId: null,
                metadata: { endpoint: 'POST /api/chat' }
            });

            const mistralText = await generateMistralAnswer({ query: lastMessage, locale, strategyContext, zone, userLocation });
            if (mistralText) {
                void writeSecurityEvent(req, {
                    type: 'ai_fallback_mistral',
                    severity: 'low',
                    actorUserId: null,
                    metadata: { endpoint: 'POST /api/chat', reason: 'dify_stream_error' }
                });
                return NextResponse.json({ answer: mistralText, actions: strategyContext?.commercialActions || [], mode: 'mistral' });
            }
            return NextResponse.json(mockResponse({ query: lastMessage, locale }));
        }

        // 2. Parse Dify Response
        // Dify returns text in `data.answer`.
        // We expect Dify to potentially return formatted JSON or text + actions.
        // For this MVP, we will try to parse JSON from the text if possible, or just return text.

        let clientAnswer = difyAnswer;
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
            },
            mode: 'dify'
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function readDifyStreamingAnswer(response: Response) {
    const stream = response.body;
    if (!stream) return null;

    const reader = stream.getReader();
    const decoder = new TextDecoder();

    let buffer = '';
    let answer = '';

    const parseDataLine = (line: string) => {
        const raw = line.slice('data:'.length).trim();
        if (!raw) return;
        if (raw === '[DONE]') return;

        let obj: any;
        try {
            obj = JSON.parse(raw);
        } catch {
            return;
        }

        const event = String(obj?.event || '');
        if (event === 'error') {
            throw new Error('Dify streaming error');
        }

        const chunk = typeof obj?.answer === 'string' ? obj.answer : '';
        if (chunk) answer += chunk;
    };

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const frames = buffer.split('\n\n');
            buffer = frames.pop() || '';

            for (const frame of frames) {
                const lines = frame.split('\n');
                for (const line of lines) {
                    if (!line.startsWith('data:')) continue;
                    parseDataLine(line);
                }
            }
        }
    } catch {
        return null;
    } finally {
        try {
            await reader.cancel();
        } catch {
        }
    }

    const trimmed = String(answer || '').trim();
    return trimmed || null;
}

async function generateMistralAnswer(params: { query: string; locale: SupportedLocale; strategyContext: any; zone?: string; userLocation?: any }) {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) return null;

    const model = process.env.AI_SLM_MODEL || 'mistral-small-latest';
    const { query, locale, strategyContext, zone, userLocation } = params;

    const system =
        locale === 'en'
            ? 'You are a Tokyo transit & station guide. Be accurate, concise, and actionable. If unsure, say you cannot confirm.'
            : locale === 'ja'
                ? 'あなたは東京の駅・乗換案内の専門ガイドです。正確・簡潔・実用的に答えてください。不確かな場合は推測しないでください。'
                : '你是東京車站/轉乘/旅遊的專業嚮導。回答要正確、簡潔、可執行；不確定就直說無法確認，避免臆測。';

    const context =
        `zone: ${zone || 'core'}\n` +
        `user_location: ${userLocation?.lat && userLocation?.lon ? `${userLocation.lat},${userLocation.lon}` : 'unknown'}\n` +
        `nearest_hub: ${strategyContext?.nodeName || 'Unknown'}\n` +
        `l2_delay: ${strategyContext?.l2Status?.delay || 0}\n` +
        `persona_prompt: ${(strategyContext?.personaPrompt || '').slice(0, 1500)}\n` +
        `wisdom: ${(strategyContext?.wisdomSummary || '').slice(0, 2000)}`;

    const userPrompt =
        locale === 'en'
            ? `[Context]\n${context}\n\n[User]\n${query}`
            : locale === 'ja'
                ? `【コンテキスト】\n${context}\n\n【ユーザー】\n${query}`
                : `【背景】\n${context}\n\n【使用者】\n${query}`;

    try {
        const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: system },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.2
            })
        });

        if (!res.ok) return null;
        const data: any = await res.json();
        const content = data?.choices?.[0]?.message?.content;

        const text =
            typeof content === 'string'
                ? content
                : Array.isArray(content)
                    ? content.map((c: any) => c?.text || '').join('')
                    : '';

        const trimmed = String(text || '').trim();
        return trimmed || null;
    } catch {
        return null;
    }
}

// Fallback Mock Logic
function mockResponse(params: { query: string; locale: SupportedLocale }) {
    const { query, locale } = params;
    const lowerMsg = query.toLowerCase();
    let actions: any[] = [];
    let answer =
        locale === 'en'
            ? "I'm currently running in offline mode. I can still help with basic navigation and station info."
            : locale === 'ja'
                ? '現在オフラインモードです。簡単な案内や駅情報ならお手伝いできます。'
                : '目前為離線模式（AI 服務未連線）。我仍可以先提供基礎導航與站點資訊。';

    const extractStationId = () => {
        const idMatch = query.match(/odpt:Station:[A-Za-z0-9_.-]+/);
        if (idMatch) return idMatch[0];

        const pairs: Array<{ id: string; keywords: string[] }> = [
            { id: 'odpt:Station:TokyoMetro.Ueno', keywords: ['ueno', '上野', 'うえの'] },
            { id: 'odpt:Station:TokyoMetro.Asakusa', keywords: ['asakusa', '浅草', 'あさくさ'] },
            { id: 'odpt:Station:JR-East.Akihabara', keywords: ['akihabara', '秋葉原', 'あきはばら'] },
            { id: 'odpt:Station:JR-East.Tokyo', keywords: ['tokyo station', 'tokyo', '東京駅', '東京'] }
        ];
        for (const p of pairs) {
            if (p.keywords.some(k => lowerMsg.includes(k))) return p.id;
        }
        return null;
    };

    const stationId = extractStationId();
    if (stationId) {
        const wisdom = (STATION_WISDOM as any)[stationId];
        const facilities = Array.isArray(wisdom?.l3Facilities) ? wisdom.l3Facilities : [];

        if (facilities.length > 0) {
            const typeCounts: Record<string, number> = {};
            for (const f of facilities) {
                const t = String(f?.type || 'other');
                typeCounts[t] = (typeCounts[t] || 0) + 1;
            }
            const top = Object.entries(typeCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([t, c]) => `${t}×${c}`)
                .join(locale === 'en' ? ', ' : '、');

            const header = locale === 'en' ? 'Station facilities (offline): ' : locale === 'ja' ? '駅施設（オフライン）：' : '車站設施（離線）：';
            answer = `${answer}\n\n${header}${top}`;
        }

        actions.push({
            type: 'details',
            label: locale === 'en' ? 'View station details' : locale === 'ja' ? '駅の詳細を見る' : '查看車站詳情',
            target: stationId
        });
    }

    if (lowerMsg.includes('ueno') || lowerMsg.includes('上野')) {
        answer =
            locale === 'en'
                ? 'Ueno is a great area. Do you want to head to Ueno Park or Ameyoko?'
                : locale === 'ja'
                    ? '上野は文化もグルメも楽しめます。上野公園かアメ横、どちらに行きますか？'
                    : '上野是個充滿文化氣息的好地方！要去上野公園還是阿美橫町逛逛呢？';
        actions.push({
            type: 'navigate',
            label: locale === 'en' ? 'Go to Ueno' : locale === 'ja' ? '上野へ移動' : '前往上野',
            target: 'ueno',
            metadata: { coordinates: [35.7141, 139.7774] }
        });
        actions.push({
            type: 'details',
            label: locale === 'en' ? 'View station details' : locale === 'ja' ? '駅の詳細を見る' : '查看車站詳情',
            target: 'odpt:Station:TokyoMetro.Ueno'
        });
    }

    return {
        answer,
        actions,
        mode: 'offline'
    };
}
