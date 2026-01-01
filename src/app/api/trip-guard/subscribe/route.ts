import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logUserActivity } from '@/lib/activityLogger';
import { requireUser } from '@/lib/security/supabaseAuth';
import { STATION_LINES, getStationIdVariants, StationLineDef } from '@/lib/constants/stationLines';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';

type ParsedSubscription = {
    originNodeId: string | null;
    destinationNodeId: string | null;
    routeIds: string[];
    activeDays: number[];
    startTime: string;
    endTime: string;
    notificationMethod: string;
    summary: string;
};

const RequestSchema = z
    .object({
        inputText: z.string().trim().min(1).optional(),
        routeIds: z.array(z.string().min(1)).optional(),
        originNodeId: z.string().min(1).optional(),
        destinationNodeId: z.string().min(1).optional(),
        activeDays: z.array(z.number().int().min(1).max(7)).optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        notificationMethod: z.string().optional()
    })
    .strict();

function normalizeTime(raw: string) {
    const m = raw.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (!Number.isFinite(h) || !Number.isFinite(min)) return null;
    if (h < 0 || h > 23) return null;
    if (min < 0 || min > 59) return null;
    return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

function extractTimeRange(text: string) {
    const m = text.match(/(\d{1,2}:\d{2})\s*(?:-|~|～|到|—|–)\s*(\d{1,2}:\d{2})/);
    if (!m) return null;
    const start = normalizeTime(m[1]);
    const end = normalizeTime(m[2]);
    if (!start || !end) return null;
    return { start, end };
}

function parseActiveDays(text: string): number[] {
    const t = text.toLowerCase();
    if (t.includes('平日') || t.includes('工作日') || t.includes('weekday')) return [1, 2, 3, 4, 5];
    if (t.includes('周末') || t.includes('週末') || t.includes('weekend')) return [6, 7];
    if (t.includes('每天') || t.includes('每日') || t.includes('everyday')) return [1, 2, 3, 4, 5, 6, 7];
    return [1, 2, 3, 4, 5];
}

const LINE_ALIASES: Array<{ routeId: string; keys: string[] }> = [
    { routeId: 'odpt.Railway:TokyoMetro.Ginza', keys: ['银座线', '銀座線', 'ginza'] },
    { routeId: 'odpt.Railway:TokyoMetro.Marunouchi', keys: ['丸之内线', '丸ノ内線', 'marunouchi'] },
    { routeId: 'odpt.Railway:TokyoMetro.Hibiya', keys: ['日比谷线', '日比谷線', 'hibiya'] },
    { routeId: 'odpt.Railway:TokyoMetro.Tozai', keys: ['东西线', '東西線', 'tozai'] },
    { routeId: 'odpt.Railway:TokyoMetro.Chiyoda', keys: ['千代田线', '千代田線', 'chiyoda'] },
    { routeId: 'odpt.Railway:TokyoMetro.Yurakucho', keys: ['有乐町线', '有楽町線', 'yurakucho'] },
    { routeId: 'odpt.Railway:TokyoMetro.Hanzomon', keys: ['半藏门线', '半蔵門線', 'hanzomon'] },
    { routeId: 'odpt.Railway:TokyoMetro.Namboku', keys: ['南北线', '南北線', 'namboku'] },
    { routeId: 'odpt.Railway:TokyoMetro.Fukutoshin', keys: ['副都心线', '副都心線', 'fukutoshin'] },
    { routeId: 'odpt.Railway:Toei.Asakusa', keys: ['浅草线', '淺草線', 'asakusa line', 'toei asakusa'] },
    { routeId: 'odpt.Railway:Toei.Mita', keys: ['三田线', '三田線', 'mita line', 'toei mita'] },
    { routeId: 'odpt.Railway:Toei.Shinjuku', keys: ['新宿线', '新宿線', 'shinjuku line', 'toei shinjuku'] },
    { routeId: 'odpt.Railway:Toei.Oedo', keys: ['大江户线', '大江戶線', 'oedo line', 'toei oedo'] },
    { routeId: 'odpt.Railway:JR-East.Yamanote', keys: ['山手线', '山手線', 'yamanote'] },
    { routeId: 'odpt.Railway:JR-East.KeihinTohoku', keys: ['京滨东北线', '京浜東北線', 'keihin-tohoku', 'keihin tohoku'] },
    { routeId: 'odpt.Railway:JR-East.Chuo', keys: ['中央线', '中央線', 'chuo'] },
    { routeId: 'odpt.Railway:JR-East.Sobu', keys: ['总武线', '総武線', 'sobu'] },
    { routeId: 'odpt.Railway:JR-East.SobuRapid', keys: ['总武快速', '総武快速線', 'sobu rapid'] },
    { routeId: 'odpt.Railway:JR-East.UenoTokyo', keys: ['上野东京线', '上野東京ライン', 'ueno-tokyo', 'ueno tokyo'] },
    { routeId: 'odpt.Railway:JR-East.Keiyo', keys: ['京叶线', '京葉線', 'keiyo'] },
    { routeId: 'odpt.Railway:JR-East.Joban', keys: ['常磐线', '常磐線', 'joban'] },
    { routeId: 'odpt.Railway:JR-East.Saikyo', keys: ['埼京线', '埼京線', 'saikyo'] },
    { routeId: 'odpt.Railway:JR-East.ShonanShinjuku', keys: ['湘南新宿线', '湘南新宿ライン', 'shonan-shinjuku', 'shonan shinjuku'] }
];

function parsePreferredRouteIds(text: string) {
    const t = text.toLowerCase();
    const match = LINE_ALIASES.find((item) => item.keys.some((k) => t.includes(k.toLowerCase())));
    return match ? [match.routeId] : null;
}

const STATION_ALIASES: Array<{ nodeId: string; keys: string[] }> = [
    { nodeId: 'odpt:Station:TokyoMetro.Ueno', keys: ['上野', 'ueno', 'うえの'] },
    { nodeId: 'odpt:Station:JR-East.Tokyo', keys: ['东京', '東京駅', '東京', 'tokyo station', 'tokyo'] },
    { nodeId: 'odpt:Station:JR-East.Shinjuku', keys: ['新宿', 'shinjuku', 'しんじゅく'] },
    { nodeId: 'odpt:Station:JR-East.Shibuya', keys: ['涩谷', '渋谷', 'shibuya', 'しぶや'] },
    { nodeId: 'odpt:Station:JR-East.Ikebukuro', keys: ['池袋', 'ikebukuro', 'いけぶくろ'] },
    { nodeId: 'odpt:Station:TokyoMetro.Asakusa', keys: ['浅草', '淺草', 'asakusa', 'あさくさ'] },
    { nodeId: 'odpt:Station:JR-East.Akihabara', keys: ['秋叶原', '秋葉原', 'akihabara', 'あきはばら'] },
    { nodeId: 'odpt:Station:JR-East.Shimbashi', keys: ['新桥', '新橋', 'shimbashi'] }
];

function extractOdptStationId(raw: string) {
    const m = raw.match(/(odpt[\.:]Station:[A-Za-z0-9_.:-]+)/);
    if (!m?.[1]) return null;
    return m[1].replace(/^odpt\.Station:/, 'odpt:Station:');
}

async function resolveStationNodeId(rls: SupabaseClient, stationText: string): Promise<string | null> {
    const explicit = extractOdptStationId(stationText);
    if (explicit) return explicit;

    const q = stationText.trim();
    if (!q) return null;

    const lower = q.toLowerCase();
    const alias = STATION_ALIASES.find((a) => a.keys.some((k) => lower.includes(k.toLowerCase())));
    if (alias) return alias.nodeId;

    const safe = q.replace(/[,%]/g, '');
    const { data } = await rls
        .from('nodes')
        .select('id,node_type')
        .or(`name->>en.ilike.%${safe}%,name->>ja.ilike.%${safe}%`)
        .limit(5);

    const nodes = Array.isArray(data) ? data : [];
    const hub = nodes.find((n: any) => n?.node_type === 'hub');
    const picked = hub || nodes[0];
    return picked?.id ? String(picked.id) : null;
}

function extractOriginDestination(text: string) {
    const cn = text.match(/从\s*([^，,\s]+?)\s*到\s*([^，,\s]+?)(?:[，,\s]|$)/);
    if (cn?.[1] && cn?.[2]) return { origin: cn[1], destination: cn[2] };
    const en = text.match(/\bfrom\s+([^,]+?)\s+to\s+([^,]+?)(?:,|\s|$)/i);
    if (en?.[1] && en?.[2]) return { origin: en[1].trim(), destination: en[2].trim() };
    const arrow = text.match(/([^，,\s]+?)\s*(?:->|→|到)\s*([^，,\s]+?)(?:[，,\s]|$)/);
    if (arrow?.[1] && arrow?.[2]) return { origin: arrow[1], destination: arrow[2] };
    return { origin: null, destination: null };
}

const LINE_SEGMENT_BY_NAME_EN: Record<string, string> = {
    'Ginza Line': 'Ginza',
    'Marunouchi Line': 'Marunouchi',
    'Hibiya Line': 'Hibiya',
    'Tozai Line': 'Tozai',
    'Chiyoda Line': 'Chiyoda',
    'Yurakucho Line': 'Yurakucho',
    'Hanzomon Line': 'Hanzomon',
    'Namboku Line': 'Namboku',
    'Fukutoshin Line': 'Fukutoshin',
    'Asakusa Line': 'Asakusa',
    'Mita Line': 'Mita',
    'Shinjuku Line': 'Shinjuku',
    'Oedo Line': 'Oedo',
    'Yamanote Line': 'Yamanote',
    'Keihin-Tohoku Line': 'KeihinTohoku',
    'Chuo Line': 'Chuo',
    'Sobu Line': 'Sobu',
    'Sobu Rapid Line': 'SobuRapid',
    'Chuo-Sobu Line': 'ChuoSobu',
    'Joban Line': 'Joban',
    'Keiyo Line': 'Keiyo',
    'Tokaido Line': 'Tokaido',
    'Yokosuka Line': 'Yokosuka',
    'Ueno-Tokyo Line': 'UenoTokyo',
    'Saikyo Line': 'Saikyo',
    'Shonan-Shinjuku Line': 'ShonanShinjuku'
};

function lineDefToRouteId(def: StationLineDef): string | null {
    const en = typeof def?.name?.en === 'string' ? def.name.en : null;
    const operator = typeof def?.operator === 'string' ? def.operator : null;
    if (!en || !operator) return null;
    const segment = LINE_SEGMENT_BY_NAME_EN[en];
    if (!segment) return null;
    if (operator === 'Metro') return `odpt.Railway:TokyoMetro.${segment}`;
    if (operator === 'Toei') return `odpt.Railway:Toei.${segment}`;
    if (operator === 'JR') return `odpt.Railway:JR-East.${segment}`;
    return null;
}

function inferRouteIdsFromStations(originNodeId: string | null, destinationNodeId: string | null) {
    const originRoutes = new Set<string>();
    const destRoutes = new Set<string>();

    const addFor = (nodeId: string, into: Set<string>) => {
        for (const v of getStationIdVariants(nodeId)) {
            const defs = (STATION_LINES as Record<string, StationLineDef[] | undefined>)[v];
            if (!Array.isArray(defs)) continue;
            for (const def of defs) {
                const routeId = lineDefToRouteId(def);
                if (routeId) into.add(routeId);
            }
        }
    };

    if (originNodeId) addFor(originNodeId, originRoutes);
    if (destinationNodeId) addFor(destinationNodeId, destRoutes);

    const intersection = new Set<string>();
    if (originRoutes.size > 0 && destRoutes.size > 0) {
        for (const r of originRoutes) {
            if (destRoutes.has(r)) intersection.add(r);
        }
    }

    if (intersection.size > 0) return Array.from(intersection);
    if (originRoutes.size > 0) return Array.from(originRoutes);
    return [];
}

async function parseSubscriptionFromText(rls: SupabaseClient, inputText: string, notificationMethod: string): Promise<ParsedSubscription> {
    const trimmed = inputText.trim();
    const { origin, destination } = extractOriginDestination(trimmed);
    const originNodeId = origin ? await resolveStationNodeId(rls, origin) : null;
    const destinationNodeId = destination ? await resolveStationNodeId(rls, destination) : null;
    const days = parseActiveDays(trimmed);
    const range = extractTimeRange(trimmed);
    const startTime = range?.start || '07:00';
    const endTime = range?.end || '23:30';

    const preferred = parsePreferredRouteIds(trimmed);
    const inferred = inferRouteIdsFromStations(originNodeId, destinationNodeId);
    const routeIds = preferred || inferred;

    const originLabel = origin || (originNodeId ? originNodeId.split('.').pop() : '') || '起点';
    const destinationLabel = destination || (destinationNodeId ? destinationNodeId.split('.').pop() : '') || '终点';
    const dayLabel = days.length === 5 && days.join(',') === '1,2,3,4,5' ? '平日' : days.length === 2 && days.join(',') === '6,7' ? '周末' : '每天';
    const lineLabel = preferred ? '已指定线路' : inferred.length > 0 ? '自动推断线路' : '未识别线路';
    const summary = `${originLabel} → ${destinationLabel} | ${dayLabel} ${startTime}-${endTime} | ${lineLabel}`;

    return {
        originNodeId,
        destinationNodeId,
        routeIds,
        activeDays: days,
        startTime,
        endTime,
        notificationMethod,
        summary
    };
}

async function ensureLegacyUsersRow(rls: SupabaseClient, userId: string, displayName: string | null) {
    try {
        const { data: exists, error: existsError } = await rls.from('users').select('id').eq('id', userId).maybeSingle();
        if (!existsError && exists?.id) return true;

        const { error } = await supabaseAdmin
            .from('users')
            .upsert(
                {
                    id: userId,
                    display_name: displayName,
                    last_seen_at: new Date().toISOString()
                },
                { onConflict: 'id' }
            );
        return !error;
    } catch {
        return false;
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await requireUser(req);
        if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });

        const ensured = await ensureLegacyUsersRow(
            auth.rls,
            auth.user.id,
            typeof auth.user.user_metadata?.full_name === 'string'
                ? auth.user.user_metadata.full_name
                : typeof auth.user.user_metadata?.name === 'string'
                    ? auth.user.user_metadata.name
                    : null
        );
        if (!ensured) {
            return NextResponse.json({ error: 'User profile not ready' }, { status: 500 });
        }

        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
        }

        const parsedBody = RequestSchema.safeParse(body);
        if (!parsedBody.success) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const notificationMethod = parsedBody.data.notificationMethod || 'line';
        const parsedFromText = parsedBody.data.inputText
            ? await parseSubscriptionFromText(auth.rls, parsedBody.data.inputText, notificationMethod)
            : null;

        const finalRouteIds = parsedBody.data.routeIds || parsedFromText?.routeIds || [];
        const originNodeId = parsedBody.data.originNodeId || parsedFromText?.originNodeId || null;
        const destinationNodeId = parsedBody.data.destinationNodeId || parsedFromText?.destinationNodeId || null;
        const activeDays = parsedBody.data.activeDays || parsedFromText?.activeDays || [1, 2, 3, 4, 5];
        const startTime = normalizeTime(parsedBody.data.startTime || parsedFromText?.startTime || '07:00');
        const endTime = normalizeTime(parsedBody.data.endTime || parsedFromText?.endTime || '23:30');

        const preview: ParsedSubscription = {
            originNodeId,
            destinationNodeId,
            routeIds: finalRouteIds,
            activeDays,
            startTime: startTime || '07:00',
            endTime: endTime || '23:30',
            notificationMethod,
            summary: parsedFromText?.summary || 'Trip Guard 订阅'
        };

        if (!startTime || !endTime) {
            return NextResponse.json({ error: 'Invalid time range', parsed: preview }, { status: 400 });
        }

        if (!Array.isArray(finalRouteIds) || finalRouteIds.length === 0) {
            return NextResponse.json({ error: '无法识别关注线路，请写明例如：关注银座线', parsed: preview }, { status: 400 });
        }

        await logUserActivity({
            request: req,
            userId: auth.user.id,
            activityType: 'trip_guard_subscribe_attempt',
            queryContent: { parsed: preview },
            metadata: { feature: 'trip_guard' }
        });

        const { data, error } = await auth.rls
            .from('trip_subscriptions')
            .insert({
                user_id: auth.user.id,
                route_ids: finalRouteIds,
                origin_node_id: originNodeId,
                destination_node_id: destinationNodeId,
                active_days: activeDays,
                active_start_time: startTime,
                active_end_time: endTime,
                notification_method: notificationMethod,
                is_active: true
            })
            .select()
            .single();

        if (error) {
            console.error('[trip-guard/subscribe] insert error', error);
            return NextResponse.json({ error: 'Database Error', parsed: preview }, { status: 500 });
        }

        await logUserActivity({
            request: req,
            userId: auth.user.id,
            activityType: 'trip_guard_subscribe_success',
            queryContent: { subscriptionId: data?.id || null },
            metadata: { feature: 'trip_guard' }
        });

        return NextResponse.json({
            success: true,
            parsed: preview,
            subscription: data || null,
            message: 'Trip Guard Activated'
        });

    } catch (error) {
        console.error('[trip-guard/subscribe] error', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
