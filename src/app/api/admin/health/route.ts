import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/security/supabaseAuth';
import { rateLimit } from '@/lib/security/rateLimit';
import { isRoleAtLeast, Role } from '@/lib/security/rbac';
import { supabaseAdmin } from '@/lib/supabase';
import { writeAuditLog, writeSecurityEvent } from '@/lib/security/audit';

async function getMyRole(rls: any, userId: string): Promise<Role> {
    const { data } = await rls.from('member_profiles').select('role').eq('user_id', userId).maybeSingle();

    const role = data?.role;
    if (role === 'admin' || role === 'support' || role === 'member') return role;
    return 'member';
}

function clampInt(value: unknown, min: number, max: number, fallback: number) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, Math.trunc(n)));
}

function summarizeAuditEvents(rows: Array<{ created_at: string; after: any }>) {
    const total = rows.length;
    const failedRows = rows.filter(r => r?.after?.ok === false);
    const degradedRows = rows.filter(r => r?.after?.degraded === true);

    return {
        total,
        failedCount: failedRows.length,
        degradedCount: degradedRows.length,
        lastEventAt: rows[0]?.created_at || null,
        lastFailedAt: failedRows[0]?.created_at || null,
        lastDegradedAt: degradedRows[0]?.created_at || null,
        lastFailure: (() => {
            const after = failedRows[0]?.after;
            if (!after) return null;
            return {
                upstream: after.upstream || null,
                fallback: after.fallback || null,
                error: after.error || after.upstream_error || null
            };
        })()
    };
}

export async function GET(req: NextRequest) {
    const auth = await requireUser(req);
    if (!auth.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });

    const ip = req.headers.get('x-forwarded-for') || '';
    const rl = rateLimit({ key: `admin:health:${ip}`, capacity: 60, refillPerSecond: 1 });
    if (!rl.allowed) {
        await writeSecurityEvent(req, {
            type: 'rate_limit',
            severity: 'medium',
            actorUserId: auth.user.id,
            metadata: { endpoint: 'GET /api/admin/health' }
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
            severity: 'medium',
            actorUserId: auth.user.id,
            metadata: { endpoint: 'GET /api/admin/health' }
        });
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const windowHours = clampInt(searchParams.get('windowHours'), 1, 168, 24);
    const staleThresholdMinutes = clampInt(searchParams.get('staleThresholdMinutes'), 5, 1440, 30);
    const maxRows = clampInt(searchParams.get('maxRows'), 500, 20000, 5000);

    const now = new Date();
    const sinceIso = new Date(now.getTime() - windowHours * 60 * 60 * 1000).toISOString();
    const staleBeforeMs = now.getTime() - staleThresholdMinutes * 60 * 1000;

    const [weatherLiveRes, weatherAlertsRes, weatherSyncRes, l2Res] = await Promise.all([
        supabaseAdmin
            .from('audit_logs')
            .select('created_at, after')
            .eq('resource_type', 'weather_live')
            .gte('created_at', sinceIso)
            .order('created_at', { ascending: false })
            .limit(500),
        supabaseAdmin
            .from('audit_logs')
            .select('created_at, after')
            .eq('resource_type', 'weather_alerts')
            .gte('created_at', sinceIso)
            .order('created_at', { ascending: false })
            .limit(500),
        supabaseAdmin
            .from('audit_logs')
            .select('created_at, after')
            .eq('resource_type', 'weather_sync')
            .gte('created_at', sinceIso)
            .order('created_at', { ascending: false })
            .limit(500),
        supabaseAdmin
            .from('transit_dynamic_snapshot')
            .select('station_id, status_code, weather_info, updated_at')
            .order('updated_at', { ascending: false })
            .limit(maxRows)
    ]);

    const dbError = weatherLiveRes.error || weatherAlertsRes.error || weatherSyncRes.error || l2Res.error;
    if (dbError) {
        await writeSecurityEvent(req, {
            type: 'health_dashboard_db_error',
            severity: 'high',
            actorUserId: auth.user.id,
            metadata: { message: dbError.message }
        });
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }

    const weather = {
        live: summarizeAuditEvents((weatherLiveRes.data || []) as any),
        alerts: summarizeAuditEvents((weatherAlertsRes.data || []) as any),
        sync: (() => {
            const rows = (weatherSyncRes.data || []) as Array<{ created_at: string; after: any }>;
            const base = summarizeAuditEvents(rows as any);
            const after = rows[0]?.after;
            return {
                ...base,
                lastStationCount: typeof after?.station_count === 'number' ? after.station_count : null,
                lastUpdatedAt: after?.updated_at || null,
                source: after?.source || null
            };
        })()
    };

    const l2Rows = (l2Res.data || []) as Array<{
        station_id: string | null;
        status_code: string | null;
        weather_info: any;
        updated_at: string | null;
    }>;

    const latestByStation = new Map<string, { updatedAtMs: number; updatedAtIso: string; statusCode: string; hasWeather: boolean }>();
    for (const row of l2Rows) {
        const stationId = row.station_id;
        const updatedAtIso = row.updated_at;
        if (!stationId || !updatedAtIso) continue;
        if (latestByStation.has(stationId)) continue;

        const updatedAtMs = new Date(updatedAtIso).getTime();
        if (!Number.isFinite(updatedAtMs)) continue;

        latestByStation.set(stationId, {
            updatedAtMs,
            updatedAtIso,
            statusCode: row.status_code || 'UNKNOWN',
            hasWeather: row.weather_info != null
        });
    }

    const statusCounts: Record<string, number> = {};
    let staleCount = 0;
    let weatherCoverageCount = 0;
    let lastUpdatedAtMs = 0;

    const staleStations: Array<{ stationId: string; updatedAt: string; ageMinutes: number; statusCode: string }> = [];

    for (const [stationId, v] of latestByStation.entries()) {
        statusCounts[v.statusCode] = (statusCounts[v.statusCode] || 0) + 1;
        if (v.hasWeather) weatherCoverageCount += 1;
        if (v.updatedAtMs > lastUpdatedAtMs) lastUpdatedAtMs = v.updatedAtMs;

        const isStale = v.updatedAtMs < staleBeforeMs;
        if (isStale) {
            staleCount += 1;
            staleStations.push({
                stationId,
                updatedAt: v.updatedAtIso,
                ageMinutes: Math.max(0, Math.round((now.getTime() - v.updatedAtMs) / 60000)),
                statusCode: v.statusCode
            });
        }
    }

    staleStations.sort((a, b) => b.ageMinutes - a.ageMinutes);

    const l2 = {
        totalStations: latestByStation.size,
        staleStationsCount: staleCount,
        updatedStationsCount: Math.max(0, latestByStation.size - staleCount),
        weatherCoverageCount,
        statusCounts,
        lastUpdatedAt: lastUpdatedAtMs ? new Date(lastUpdatedAtMs).toISOString() : null,
        staleStations: staleStations.slice(0, 50)
    };

    await writeAuditLog(req, {
        actorUserId: auth.user.id,
        action: 'read',
        resourceType: 'health_dashboard',
        resourceId: 'global',
        before: null,
        after: { windowHours, staleThresholdMinutes }
    });

    return NextResponse.json({
        generatedAt: now.toISOString(),
        windowHours,
        staleThresholdMinutes,
        weather,
        l2
    });
}
