
import { NextResponse } from 'next/server';
import { createAnonClient, createRlsClient, getBearerToken } from '@/lib/security/supabaseAuth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { score, reason, details, messageId, sessionId } = body;

        if (score !== 1 && score !== -1) {
            return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
        }

        const token = getBearerToken(request);
        const supabase = token ? createRlsClient(token) : createAnonClient();

        const { data, error } = await supabase
            .from('ai_chat_feedback')
            .insert({
                score,
                reason,
                details,
                message_id: messageId,
                session_id: sessionId
            })
            .select()
            .single();

        if (error) {
            console.error('Feedback Insert Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Feedback API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
