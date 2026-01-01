import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { STATION_WISDOM, KNOWLEDGE_BASE } from '@/data/stationWisdom';
import { resolveNodeInheritance } from '@/lib/nodes/inheritance';

type SupportedLocale = 'zh-TW' | 'en' | 'ja';

function normalizeLocale(input?: string): SupportedLocale {
    const raw = String(input || '').trim().toLowerCase();
    if (raw.startsWith('ja')) return 'ja';
    if (raw.startsWith('en')) return 'en';
    return 'zh-TW';
}

function pickLocaleText(input: any, locale: SupportedLocale) {
    if (!input) return '';
    if (typeof input === 'string') return input;
    if (typeof input !== 'object') return '';
    return String(input?.[locale] || input?.['zh-TW'] || input?.en || input?.ja || '')
        .trim();
}

function chunkText(text: string, size: number) {
    const out: string[] = [];
    const s = String(text || '');
    for (let i = 0; i < s.length; i += size) {
        out.push(s.slice(i, i + size));
    }
    return out;
}

function createSseStream(params: { answer: string; meta: Record<string, any> }) {
    const encoder = new TextEncoder();
    const { answer, meta } = params;
    const chunks = chunkText(answer, 80);

    return new ReadableStream<Uint8Array>({
        start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'meta', ...meta })}\n\n`));
            for (const part of chunks) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'message', answer: part })}\n\n`));
            }
            controller.close();
        }
    });
}

async function generateMistralAnswer(params: { locale: SupportedLocale; stationName: string; personaPrompt?: string; wisdomSummary?: string; l2Delay?: number; userProfile?: string; userText: string }) {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) return null;

    const model = process.env.AI_SLM_MODEL || 'mistral-small-latest';
    const { locale, stationName, personaPrompt, wisdomSummary, l2Delay, userProfile, userText } = params;

    const system =
        locale === 'en'
            ? 'You are LUTAGU, a gentle station guide. Be accurate, concise, and actionable. If unsure, say you cannot confirm.'
            : locale === 'ja'
                ? 'あなたはLUTAGUという名の優しい駅案内人です。正確・簡潔・実用的に答えてください。不確かな場合は推測しないでください。'
                : '你是一個名為 LUTAGU 的溫柔站點嚮導。回答要正確、簡潔、可執行；不確定就直說無法確認，避免臆測。';

    const contextLines = [
        `station: ${stationName || 'Unknown'}`,
        `user_profile: ${userProfile || 'general'}`,
        `l2_delay: ${typeof l2Delay === 'number' ? l2Delay : 0}`,
        `persona_prompt: ${(personaPrompt || '').slice(0, 1500)}`,
        `wisdom: ${(wisdomSummary || '').slice(0, 2000)}`
    ].join('\n');

    const userPrompt =
        locale === 'en'
            ? `[Context]\n${contextLines}\n\n[User]\n${userText}`
            : locale === 'ja'
                ? `【コンテキスト】\n${contextLines}\n\n【ユーザー】\n${userText}`
                : `【背景】\n${contextLines}\n\n【使用者】\n${userText}`;

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

function buildOfflineAnswer(params: { locale: SupportedLocale; stationName: string; userProfile?: string; userText: string; wisdomSummary?: string; l2Delay?: number }) {
    const { locale, stationName, userProfile, userText, wisdomSummary, l2Delay } = params;

    const header =
        locale === 'en'
            ? `I'm in offline mode for ${stationName}.`
            : locale === 'ja'
                ? `${stationName}のオフライン案内です。`
                : `目前為 ${stationName} 的離線模式引導。`;

    const profileLine =
        locale === 'en'
            ? `Profile: ${userProfile || 'general'}`
            : locale === 'ja'
                ? `条件: ${userProfile || 'general'}`
                : `使用者狀態：${userProfile || 'general'}`;

    const delayLine =
        locale === 'en'
            ? `Delay signal: ${typeof l2Delay === 'number' ? l2Delay : 0} min`
            : locale === 'ja'
                ? `遅延の目安: ${typeof l2Delay === 'number' ? l2Delay : 0} 分`
                : `延遲指標：${typeof l2Delay === 'number' ? l2Delay : 0} 分`;

    const askLine =
        locale === 'en'
            ? `You asked: ${userText}`
            : locale === 'ja'
                ? `質問: ${userText}`
                : `你問的是：${userText}`;

    const tips =
        locale === 'en'
            ? `\n\nNext steps:\n1) Tell me your destination (place name).\n2) Tell me your constraints (luggage/stroller/accessibility/rush).\n3) If you can, share which exit/line you're near.`
            : locale === 'ja'
                ? `\n\n次の情報を教えてください：\n1) 行き先（地名）\n2) 条件（大きい荷物／ベビーカー／バリアフリー／急ぎ）\n3) 今いる改札・出口や路線`
                : `\n\n下一步建議：\n1）告訴我目的地（地名）\n2）告訴我限制（大行李／推嬰兒車／行動不便／趕時間）\n3）你現在靠近的出口／改札／路線（若知道）`;

    const wisdom = String(wisdomSummary || '').trim();
    const wisdomBlock = wisdom ? `\n\n${wisdom}` : '';

    return `${header}\n${profileLine}\n${delayLine}\n${askLine}${wisdomBlock}${tips}`;
}

export async function POST(req: NextRequest) {
    let locale: SupportedLocale = 'zh-TW';

    try {
        const body = await req.json();
        const messages = Array.isArray(body?.messages) ? body.messages : [];
        const nodeId = typeof body?.nodeId === 'string' ? body.nodeId : '';
        const inputs = typeof body?.inputs === 'object' && body?.inputs ? body.inputs : {};
        locale = normalizeLocale(inputs?.locale);
        const userProfile = typeof inputs?.user_profile === 'string' ? inputs.user_profile : 'general';

        const userText = String(messages[messages.length - 1]?.content || '').trim();
        const fallbackStationName = locale === 'en' ? 'Station' : locale === 'ja' ? '駅' : '車站';

        let effectiveNode: any = null;
        let identityNode: any = null;
        let l2Delay = 0;
        let wisdomSummary = '';

        if (nodeId) {
            const resolved = await resolveNodeInheritance({ nodeId, client: supabaseAdmin });
            identityNode = resolved?.hub || resolved?.leaf || null;
            const mergedNode: any = resolved?.effective || identityNode;
            effectiveNode = mergedNode;

            const cacheKey = `l2:${identityNode?.id || effectiveNode?.id || nodeId}`;
            const { data: l2Cache } = await supabaseAdmin
                .from('l2_cache')
                .select('value')
                .eq('key', cacheKey)
                .maybeSingle();
            const val = l2Cache?.value;
            if (val && typeof val === 'object') {
                const d = Number((val as any).delay);
                if (!Number.isNaN(d)) l2Delay = d;
            }

            const wisdom = (STATION_WISDOM as any)[identityNode?.id || effectiveNode?.id || nodeId];
            if (wisdom) {
                const criticalTrap = wisdom.traps?.find((t: any) => t.severity === 'critical');
                const highTrap = wisdom.traps?.find((t: any) => t.severity === 'high');
                const hack = wisdom.hacks?.[0];
                if (criticalTrap) wisdomSummary += `[CRITICAL WARNING] ${criticalTrap.content} Advice: ${criticalTrap.advice}\n`;
                if (highTrap) wisdomSummary += `[WARNING] ${highTrap.content}\n`;
                if (hack) wisdomSummary += `[LOCAL TRICK] ${hack}\n`;
            }

            // [UPDATED] Inject KNOWLEDGE_BASE (V3)
            const relevantKnowledge = KNOWLEDGE_BASE.filter(rule => {
                // Global rules (no station_ids) OR Specific station match
                if (!rule.trigger.station_ids || rule.trigger.station_ids.length === 0) return true;
                return rule.trigger.station_ids.includes(identityNode?.id || effectiveNode?.id || nodeId);
            });

            if (relevantKnowledge.length > 0) {
                wisdomSummary += '\n[EXPERT KNOWLEDGE BASE]\n';
                relevantKnowledge.forEach(k => {
                    const title = pickLocaleText(k.title, locale);
                    const content = pickLocaleText(k.content, locale);
                    wisdomSummary += `- 【${title}】: ${content}\n`;
                });
            }
            wisdomSummary = wisdomSummary.trim();
        }

        const stationName = pickLocaleText((identityNode?.name || effectiveNode?.name) as any, locale) || fallbackStationName;
        const personaPrompt = typeof effectiveNode?.persona_prompt === 'string' ? effectiveNode.persona_prompt : '';

        const mistralText = await generateMistralAnswer({
            locale,
            stationName,
            personaPrompt,
            wisdomSummary,
            l2Delay,
            userProfile,
            userText: userText || (locale === 'en' ? 'Hello' : locale === 'ja' ? 'こんにちは' : '你好')
        });

        if (mistralText) {
            return new NextResponse(
                createSseStream({
                    answer: mistralText,
                    meta: {
                        mode: 'mistral',
                        nodeId: nodeId || null,
                        stationName
                    }
                }),
                {
                    headers: {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache, no-transform',
                        Connection: 'keep-alive'
                    }
                }
            );
        }

        const offlineAnswer = buildOfflineAnswer({ locale, stationName, userProfile, userText, wisdomSummary, l2Delay });
        return new NextResponse(
            createSseStream({
                answer: offlineAnswer,
                meta: {
                    mode: 'offline',
                    nodeId: nodeId || null,
                    stationName
                }
            }),
            {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache, no-transform',
                    Connection: 'keep-alive'
                }
            }
        );
    } catch {
        const fallbackStationName = locale === 'en' ? 'Station' : locale === 'ja' ? '駅' : '車站';
        const offlineAnswer = buildOfflineAnswer({
            locale,
            stationName: fallbackStationName,
            userProfile: 'general',
            userText: locale === 'en' ? 'I need help' : locale === 'ja' ? '助けて' : '需要幫忙'
        });

        return new NextResponse(
            createSseStream({
                answer: offlineAnswer,
                meta: { mode: 'offline', nodeId: null, stationName: fallbackStationName }
            }),
            {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache, no-transform',
                    Connection: 'keep-alive'
                }
            }
        );
    }
}
