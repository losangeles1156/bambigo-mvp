import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/security/supabaseAuth';
import { rateLimit } from '@/lib/security/rateLimit';
import { writeSecurityEvent, writeAuditLog } from '@/lib/security/audit';
import { encryptJson } from '@/lib/security/crypto';
import { CreateMemberSchema } from '@/lib/security/memberSchemas';
import { isRoleAtLeast, Role } from '@/lib/security/rbac';
import { supabaseAdmin } from '@/lib/supabase';

async function getMyRole(rls: any, userId: string): Promise<Role> {
    const { data } = await rls
        .from('member_profiles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

    const role = data?.role;
    if (role === 'admin' || role === 'support' || role === 'member') return role;
    return 'member';
}

export async function GET(req: NextRequest) {
    const auth = await requireUser(req);
    if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });

    const ctxKey = `members:list:${req.headers.get('x-forwarded-for') || ''}`;
    const rl = rateLimit({ key: ctxKey, capacity: 30, refillPerSecond: 0.5 });
    if (!rl.allowed) {
        await writeSecurityEvent(req, { type: 'rate_limit', severity: 'medium', actorUserId: auth.user.id, metadata: { endpoint: 'GET /api/members' } });
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } as any });
    }

    const myRole = await getMyRole(auth.rls, auth.user.id);
    if (!isRoleAtLeast(myRole, 'admin')) {
        await writeSecurityEvent(req, { type: 'forbidden', severity: 'medium', actorUserId: auth.user.id, metadata: { endpoint: 'GET /api/members' } });
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || '20')));
    const offset = Math.max(0, Number(searchParams.get('offset') || '0'));

    const { data, error } = await supabaseAdmin
        .from('member_profiles')
        .select('user_id, display_name, role, created_at, updated_at, deleted_at')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) return NextResponse.json({ error: 'Database Error' }, { status: 500 });

    await writeAuditLog(req, {
        actorUserId: auth.user.id,
        action: 'read',
        resourceType: 'member_profiles',
        resourceId: '*',
        before: null,
        after: { count: data?.length || 0 }
    });

    return NextResponse.json({ items: data || [], limit, offset });
}

export async function POST(req: NextRequest) {
    const auth = await requireUser(req);
    if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });

    const ctxKey = `members:create:${req.headers.get('x-forwarded-for') || ''}`;
    const rl = rateLimit({ key: ctxKey, capacity: 10, refillPerSecond: 0.2 });
    if (!rl.allowed) {
        await writeSecurityEvent(req, { type: 'rate_limit', severity: 'high', actorUserId: auth.user.id, metadata: { endpoint: 'POST /api/members' } });
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } as any });
    }

    const myRole = await getMyRole(auth.rls, auth.user.id);
    if (!isRoleAtLeast(myRole, 'admin')) {
        await writeSecurityEvent(req, { type: 'forbidden', severity: 'high', actorUserId: auth.user.id, metadata: { endpoint: 'POST /api/members' } });
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let body: any;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = CreateMemberSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: 'Validation Error', details: parsed.error.flatten() }, { status: 400 });
    }

    const piiPayload = parsed.data.pii ? await encryptJson(parsed.data.pii) : null;

    const insertRow: any = {
        user_id: parsed.data.userId,
        display_name: parsed.data.displayName || null,
        role: parsed.data.role || 'member',
        pii_ciphertext: piiPayload?.ct_b64 || null,
        pii_iv: piiPayload?.iv_b64 || null,
        pii_version: piiPayload?.v || null
    };

    const { data: created, error } = await supabaseAdmin
        .from('member_profiles')
        .insert(insertRow)
        .select('user_id, display_name, role, created_at, updated_at')
        .single();

    if (error) {
        console.error('Member creation error:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }

    await writeAuditLog(req, {
        actorUserId: auth.user.id,
        action: 'create',
        resourceType: 'member_profiles',
        resourceId: created.user_id,
        before: null,
        after: created
    });

    return NextResponse.json({ member: created }, { status: 201 });
}
