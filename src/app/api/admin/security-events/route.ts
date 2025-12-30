import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/security/supabaseAuth';

export async function GET(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data, error, count } = await auth.rls
        .from('security_events')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        events: data,
        total: count,
        limit,
        offset
    });
}
