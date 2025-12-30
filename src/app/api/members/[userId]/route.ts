import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/security/supabaseAuth';
import { rateLimit } from '@/lib/security/rateLimit';
import { writeAuditLog, writeSecurityEvent } from '@/lib/security/audit';
import { encryptJson } from '@/lib/security/crypto';
import { UpdateMemberSchema } from '@/lib/security/memberSchemas';
import { isRoleAtLeast, Role } from '@/lib/security/rbac';
import { supabaseAdmin } from '@/lib/supabase';

const ParamsSchema = z.object({ userId: z.string().uuid() }).strict();

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

async function fetchMemberForAudit(userId: string) {
    const { data, error } = await supabaseAdmin
        .from('member_profiles')
        .select('user_id, display_name, role, created_at, updated_at, deleted_at')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) return { ok: false as const, status: 500 as const };
    if (!data || data.deleted_at) return { ok: false as const, status: 404 as const };
    return { ok: true as const, member: data };
}

export async function PUT(req: NextRequest, ctx: { params: { userId: string } }) {
    const paramsParsed = ParamsSchema.safeParse(ctx.params);
    if (!paramsParsed.success) return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });

    const auth = await requireUser(req);
    if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });

    const ip = req.headers.get('x-forwarded-for') || '';
    const ctxKey = `members:update:${paramsParsed.data.userId}:${ip}`;
    const rl = rateLimit({ key: ctxKey, capacity: 20, refillPerSecond: 0.5 });
    if (!rl.allowed) {
        await writeSecurityEvent(req, {
            type: 'rate_limit',
            severity: 'medium',
            actorUserId: auth.user.id,
            metadata: { endpoint: 'PUT /api/members/[userId]', userId: paramsParsed.data.userId }
        });
        return NextResponse.json(
            { error: 'Too Many Requests' },
            { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } as any }
        );
    }

    const myRole = await getMyRole(auth.rls, auth.user.id);
    if (!isRoleAtLeast(myRole, 'admin')) {
        await writeSecurityEvent(req, {
            type: 'forbidden',
            severity: 'high',
            actorUserId: auth.user.id,
            metadata: { endpoint: 'PUT /api/members/[userId]', userId: paramsParsed.data.userId }
        });
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let body: any;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = UpdateMemberSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: 'Validation Error', details: parsed.error.flatten() }, { status: 400 });
    }

    const hasAnyField =
        parsed.data.displayName !== undefined || parsed.data.role !== undefined || parsed.data.pii !== undefined;
    if (!hasAnyField) return NextResponse.json({ error: 'No changes' }, { status: 400 });

    const beforeRes = await fetchMemberForAudit(paramsParsed.data.userId);
    if (!beforeRes.ok) return NextResponse.json({ error: 'Not Found' }, { status: beforeRes.status });

    const updateRow: any = {};
    if (parsed.data.displayName !== undefined) updateRow.display_name = parsed.data.displayName;
    if (parsed.data.role !== undefined) updateRow.role = parsed.data.role;
    if (parsed.data.pii !== undefined) {
        const piiPayload = await encryptJson(parsed.data.pii);
        updateRow.pii_ciphertext = piiPayload.ct_b64;
        updateRow.pii_iv = piiPayload.iv_b64;
        updateRow.pii_version = piiPayload.v;
    }

    const { data: updated, error } = await supabaseAdmin
        .from('member_profiles')
        .update(updateRow)
        .eq('user_id', paramsParsed.data.userId)
        .select('user_id, display_name, role, created_at, updated_at, deleted_at')
        .single();

    if (error) {
        console.error('Member update error:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }

    await writeAuditLog(req, {
        actorUserId: auth.user.id,
        action: 'update',
        resourceType: 'member_profiles',
        resourceId: paramsParsed.data.userId,
        before: beforeRes.member,
        after: updated
    });

    return NextResponse.json({ member: updated });
}

export async function DELETE(req: NextRequest, ctx: { params: { userId: string } }) {
    const paramsParsed = ParamsSchema.safeParse(ctx.params);
    if (!paramsParsed.success) return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });

    const auth = await requireUser(req);
    if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });

    const ip = req.headers.get('x-forwarded-for') || '';
    const ctxKey = `members:delete:${paramsParsed.data.userId}:${ip}`;
    const rl = rateLimit({ key: ctxKey, capacity: 10, refillPerSecond: 0.2 });
    if (!rl.allowed) {
        await writeSecurityEvent(req, {
            type: 'rate_limit',
            severity: 'high',
            actorUserId: auth.user.id,
            metadata: { endpoint: 'DELETE /api/members/[userId]', userId: paramsParsed.data.userId }
        });
        return NextResponse.json(
            { error: 'Too Many Requests' },
            { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } as any }
        );
    }

    const myRole = await getMyRole(auth.rls, auth.user.id);
    if (!isRoleAtLeast(myRole, 'admin')) {
        await writeSecurityEvent(req, {
            type: 'forbidden',
            severity: 'critical',
            actorUserId: auth.user.id,
            metadata: { endpoint: 'DELETE /api/members/[userId]', userId: paramsParsed.data.userId }
        });
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const beforeRes = await fetchMemberForAudit(paramsParsed.data.userId);
    if (!beforeRes.ok) return NextResponse.json({ error: 'Not Found' }, { status: beforeRes.status });

    const now = new Date().toISOString();
    const { data: deleted, error } = await supabaseAdmin
        .from('member_profiles')
        .update({
            deleted_at: now,
            display_name: null,
            pii_ciphertext: null,
            pii_iv: null,
            pii_version: null
        })
        .eq('user_id', paramsParsed.data.userId)
        .select('user_id, display_name, role, created_at, updated_at, deleted_at')
        .single();

    if (error) {
        console.error('Member delete error:', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }

    await writeAuditLog(req, {
        actorUserId: auth.user.id,
        action: 'delete',
        resourceType: 'member_profiles',
        resourceId: paramsParsed.data.userId,
        before: beforeRes.member,
        after: deleted
    });

    return NextResponse.json({ member: deleted });
}
