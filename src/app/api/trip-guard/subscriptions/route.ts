import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/security/supabaseAuth';

function normalizeTime(raw: unknown) {
    const text = typeof raw === 'string' ? raw : '';
    const m = text.match(/^(\d{2}):(\d{2})/);
    if (!m) return null;
    return `${m[1]}:${m[2]}`;
}

function formatDays(days: unknown) {
    const arr = Array.isArray(days) ? (days as unknown[]) : [];
    const nums = arr.map((d) => Number(d)).filter((n) => Number.isFinite(n) && n >= 1 && n <= 7);
    const uniq = Array.from(new Set(nums)).sort((a, b) => a - b);
    if (uniq.length === 0) return '平日';
    if (uniq.length === 7) return '每天';
    if (uniq.join(',') === '1,2,3,4,5') return '平日';
    if (uniq.join(',') === '6,7') return '周末';
    return `週${uniq.join(',')}`;
}

function pickNodeName(name: any, locale: string) {
    const loc = String(locale || 'zh-TW');
    const fallback = (k: string) => (typeof name?.[k] === 'string' ? name[k] : null);
    return fallback(loc) || fallback('zh-TW') || fallback('zh-CN') || fallback('ja') || fallback('en') || null;
}

function summarize(params: {
    originName: string | null;
    destinationName: string | null;
    originNodeId: string | null;
    destinationNodeId: string | null;
    routeIds: string[];
    activeDays: unknown;
    startTime: unknown;
    endTime: unknown;
}) {
    const originLabel = params.originName || (params.originNodeId ? params.originNodeId.split('.').pop() : null) || '起點';
    const destinationLabel =
        params.destinationName || (params.destinationNodeId ? params.destinationNodeId.split('.').pop() : null) || '終點';
    const dayLabel = formatDays(params.activeDays);
    const start = normalizeTime(params.startTime) || '07:00';
    const end = normalizeTime(params.endTime) || '23:30';
    const line = Array.isArray(params.routeIds) && params.routeIds.length > 0 ? params.routeIds[0].split('.').pop() : '路線';
    return `${originLabel} → ${destinationLabel} | ${dayLabel} ${start}-${end} | ${line}`;
}

const PatchSchema = z
    .object({
        id: z.string().uuid(),
        isActive: z.boolean()
    })
    .strict();

export async function GET(req: NextRequest) {
    const auth = await requireUser(req);
    if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('activeOnly');
    const locale = searchParams.get('locale') || 'zh-TW';

    let q = auth.rls
        .from('trip_subscriptions')
        .select(
            'id,user_id,route_ids,origin_node_id,destination_node_id,active_days,active_start_time,active_end_time,notification_method,is_active,created_at'
        )
        .order('created_at', { ascending: false });

    if (activeOnly === '1' || activeOnly === 'true') q = q.eq('is_active', true);

    const { data, error } = await q;
    if (error) {
        console.error('[trip-guard/subscriptions] select error', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }

    const rows = Array.isArray(data) ? data : [];
    const nodeIds = Array.from(
        new Set(
            rows
                .flatMap((r: any) => [r?.origin_node_id, r?.destination_node_id])
                .filter((v: any) => typeof v === 'string' && v.length > 0)
        )
    );

    const nodeNameById = new Map<string, string>();
    if (nodeIds.length > 0) {
        const { data: nodes } = await auth.rls.from('nodes').select('id,name').in('id', nodeIds);
        for (const n of Array.isArray(nodes) ? nodes : []) {
            const id = typeof (n as any)?.id === 'string' ? (n as any).id : null;
            if (!id) continue;
            const label = pickNodeName((n as any).name, locale);
            if (label) nodeNameById.set(id, label);
        }
    }

    const items = rows.map((r: any) => {
        const originNodeId = typeof r?.origin_node_id === 'string' ? r.origin_node_id : null;
        const destinationNodeId = typeof r?.destination_node_id === 'string' ? r.destination_node_id : null;
        const originName = originNodeId ? nodeNameById.get(originNodeId) || null : null;
        const destinationName = destinationNodeId ? nodeNameById.get(destinationNodeId) || null : null;
        const routeIds = Array.isArray(r?.route_ids) ? r.route_ids.map(String) : [];

        return {
            id: r?.id,
            userId: r?.user_id,
            routeIds,
            originNodeId,
            destinationNodeId,
            activeDays: r?.active_days,
            startTime: normalizeTime(r?.active_start_time),
            endTime: normalizeTime(r?.active_end_time),
            notificationMethod: r?.notification_method,
            isActive: Boolean(r?.is_active),
            createdAt: r?.created_at,
            summary: summarize({
                originName,
                destinationName,
                originNodeId,
                destinationNodeId,
                routeIds,
                activeDays: r?.active_days,
                startTime: r?.active_start_time,
                endTime: r?.active_end_time
            })
        };
    });

    const active = items.find((i) => i.isActive) || null;
    return NextResponse.json({ items, active });
}

export async function PATCH(req: NextRequest) {
    const auth = await requireUser(req);
    if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });

    const { data, error } = await auth.rls
        .from('trip_subscriptions')
        .update({ is_active: parsed.data.isActive })
        .eq('id', parsed.data.id)
        .eq('user_id', auth.user.id)
        .select(
            'id,user_id,route_ids,origin_node_id,destination_node_id,active_days,active_start_time,active_end_time,notification_method,is_active,created_at'
        )
        .single();

    if (error) {
        console.error('[trip-guard/subscriptions] update error', error);
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, subscription: data });
}
