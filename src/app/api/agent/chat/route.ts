
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { orchestrator, AgentMessage } from '@/lib/agent/orchestrator';
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

/**
 * SSE Fallback for errors
 */
function createErrorStream(message: string) {
    const encoder = new TextEncoder();
    return new ReadableStream<Uint8Array>({
        start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'meta', mode: 'error' })}\n\n`));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'message', answer: `⚠️ ${message}` })}\n\n`));
            controller.close();
        }
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const clientMessages = Array.isArray(body?.messages) ? body.messages : [];
        const nodeId = typeof body?.nodeId === 'string' ? body.nodeId : '';
        const inputs = typeof body?.inputs === 'object' && body?.inputs ? body.inputs : {};

        const locale = normalizeLocale(inputs?.locale);
        const userProfile = typeof inputs?.user_profile === 'string' ? inputs.user_profile : 'general';
        const timestamp = Date.now();

        // 1. Resolve Node Identity
        let nodeName = 'Tokyo Station'; // Default
        let personaPrompt = '';

        if (nodeId) {
            const resolved = await resolveNodeInheritance({ nodeId, client: supabaseAdmin });
            const identityNode = resolved?.hub || resolved?.leaf || null;
            nodeName = pickLocaleText(identityNode?.name, locale) || nodeName;
            personaPrompt = typeof identityNode?.persona_prompt === 'string' ? identityNode.persona_prompt : '';
        }

        // 2. Build System Prompt (Dynamic & Concise)
        const systemPrompt = `You are "Lutagu", a professional DIGITAL STATION STAFF at ${nodeName}.
Tone: Helpful, warm, and natural.
Locale: ${locale}.
Current Station: ${nodeName} (${nodeId || 'Ambient Mode'}).
User Profile: ${userProfile}.

GOALS:
1. Answer questions about station facilities, train status, and local tips using TOOLS. 
2. CRITICAL: For specific needs (wheelchair, lockers, crowd), you MUST call the relevant tool before answering. Do not guess.
3. If tool data is found, synthesize it into a helpful answer. If empty, suggest Google Maps.

STRICT TOOL RULES:
- "Wheelchair", "Elevator", "Baby Car" -> Call 'retrieve_station_knowledge' (query='accessibility') AND 'get_station_facilities' (category='elevator').
- "Locker", "Luggage" -> Call 'get_station_facilities' (category='locker') AND 'retrieve_station_knowledge' (query='luggage').
- "Crowded", "Status", "Delay" -> Call 'get_train_status'.
- "Weather", "Rain" -> Call 'get_weather'.

CONSTRAINTS:
- Answer primarily in ${locale}.
- Do NOT say "Tokyo Subway Ticket" unless asked about fares.
- Do NOT give generic advice like "check the website" if you can check via tools.
- NEVER use ** symbols to bold text. Use natural language and emojis for emphasis.
- ${personaPrompt}`;

        // 3. Prepare Message History
        const messages: AgentMessage[] = [
            { role: 'system', content: systemPrompt },
            ...clientMessages.map((m: any) => ({
                role: m.role,
                content: m.content
            }))
        ];

        // 4. Run Orchestrator
        const stream = await orchestrator.run(messages, {
            nodeId,
            locale,
            userProfile,
            timestamp
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                Connection: 'keep-alive'
            }
        });

    } catch (error: any) {
        console.error('[Chat API] Fatal Error:', error);
        return new NextResponse(createErrorStream(error.message || 'Internal Server Error'), {
            headers: { 'Content-Type': 'text/event-stream' }
        });
    }
}
