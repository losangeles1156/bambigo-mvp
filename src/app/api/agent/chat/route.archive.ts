
import { NextRequest, NextResponse } from 'next/server';
import { fetchNodeConfig, resolveRepresentativeOdptStationId } from '@/lib/api/nodes';
import { logUserActivity } from '@/lib/activityLogger';
import { writeAuditLog, writeSecurityEvent } from '@/lib/security/audit';
import { Mistral } from '@mistralai/mistralai';

// Force dynamic to prevent caching of L2 data
export const dynamic = 'force-dynamic';

const mistralClient = process.env.MISTRAL_API_KEY
    ? new Mistral({ apiKey: process.env.MISTRAL_API_KEY })
    : null;

const mistralModel = process.env.AI_SLM_MODEL || 'mistral-small-latest';

let llmWindowStartedAt = Date.now();
let llmWindowCount = 0;

type SupportedLocale = 'zh-TW' | 'en' | 'ja';

function normalizeLocale(input?: string): SupportedLocale | undefined {
    const raw = String(input || '').trim();
    if (!raw) return undefined;
    const lowered = raw.toLowerCase();
    if (lowered.startsWith('ja')) return 'ja';
    if (lowered.startsWith('en')) return 'en';
    if (lowered.startsWith('zh')) return 'zh-TW';
    return undefined;
}

function localeFromRequest(req: NextRequest, inputLocale?: string): SupportedLocale {
    const fromBody = normalizeLocale(inputLocale);
    if (fromBody) return fromBody;

    const header = req.headers.get('x-locale') || req.headers.get('accept-language') || '';
    const lowered = header.toLowerCase();
    if (lowered.includes('ja')) return 'ja';
    if (lowered.includes('en')) return 'en';
    if (lowered.includes('zh')) return 'zh-TW';
    return 'zh-TW';
}

function pickLocaleText(value: any, locale: SupportedLocale): string {
    if (!value) return '';
    if (typeof value === 'string') return value;

    if (locale === 'ja') return value.ja || value.en || value['zh-TW'] || value.zh || '';
    if (locale === 'en') return value.en || value.ja || value['zh-TW'] || value.zh || '';
    return value['zh-TW'] || value.zh || value.en || value.ja || '';
}

const UI_TEXT: Record<SupportedLocale, Record<string, string>> = {
    'zh-TW': {
        stationLabel: '站點',
        linkLabel: '連結',
        facilitiesTitle: '【設施】',
        facilitiesNone: '目前沒有查到相關設施資料。',
        timetableTitle: '【下一班車】',
        timetableNoTrips: '查到時刻表，但目前時段沒有可顯示的班次。',
        timetableNeedId: '時刻表需要 ODPT 的路線站點 ID（例如 odpt.Station:TokyoMetro.Ginza.Ueno）。\n目前站點未能解析成可用的 ODPT 時刻表 ID。',
        timetableFailed: '時刻表查詢失敗。',
        timetableFailedNetwork: '時刻表查詢失敗（網路或服務暫時不可用）。',
        fareTitle: '【票價】',
        fareTicketLabel: '車票',
        fareIcLabel: 'IC',
        fareNeedIds: '票價查詢需要出發與到達的 ODPT 站點 ID。\n你可以用這種格式問我：\n- 票價 from: odpt.Station:TokyoMetro.Ginza.Ueno to: odpt.Station:TokyoMetro.Marunouchi.Tokyo',
        fareNotFound: '查不到直達票價（可能需要轉乘或跨公司計價）。',
        fareFailed: '票價查詢失敗。',
        fareFailedNetwork: '票價查詢失敗（網路或服務暫時不可用）。',
        statusTitle: '【運行資訊】',
        statusNone: '目前沒有即時運行資料。',
        crowdLabel: '擁擠程度',
        weatherLabel: '天氣',
        updatedLabel: '更新',
        strategyTitle: '【前往 {destination}】',
        strategyUnavailable: '路線建議服務暫時不可用。',
        strategyEmpty: '目前沒有可用的路線建議。',
        fallbackHeader: '目前 AI 服務尚未完成設定，先用離線策略回覆。',
        fallbackNeedLabel: '使用者需求',
        fallbackQuestionLabel: '你問的是',
        fallbackAdviceTitle: '建議：',
        fallbackAdvice1: '先確認你要去的方向/出口，再決定走哪個月台或改札。',
        fallbackAdvice2: '若有行李/嬰兒車/輪椅，優先找電梯動線與少轉乘路徑。',
        fallbackAdvice3: '若遇到延遲，先找替代線或改走地面/計程車，避免在付費區內繞行。'
    },
    en: {
        stationLabel: 'Station',
        linkLabel: 'Link',
        facilitiesTitle: '[Facilities]',
        facilitiesNone: 'No relevant facility data found.',
        timetableTitle: '[Next trains]',
        timetableNoTrips: 'Timetable found, but no trips to show for the current window.',
        timetableNeedId: 'Timetable requires an ODPT station ID (e.g. odpt.Station:TokyoMetro.Ginza.Ueno).\nThis station could not be resolved to a usable ODPT timetable ID.',
        timetableFailed: 'Timetable request failed.',
        timetableFailedNetwork: 'Timetable request failed (network or service temporarily unavailable).',
        fareTitle: '[Fares]',
        fareTicketLabel: 'Ticket',
        fareIcLabel: 'IC',
        fareNeedIds: 'Fare lookup needs both origin and destination ODPT station IDs.\nAsk like:\n- Fare from: odpt.Station:TokyoMetro.Ginza.Ueno to: odpt.Station:TokyoMetro.Marunouchi.Tokyo',
        fareNotFound: 'No direct fare found (may require transfers or cross-operator pricing).',
        fareFailed: 'Fare request failed.',
        fareFailedNetwork: 'Fare request failed (network or service temporarily unavailable).',
        statusTitle: '[Service status]',
        statusNone: 'No live service status is available right now.',
        crowdLabel: 'Crowd',
        weatherLabel: 'Weather',
        updatedLabel: 'Updated',
        strategyTitle: '[To {destination}]',
        strategyUnavailable: 'Route suggestions are temporarily unavailable.',
        strategyEmpty: 'No route suggestions are available right now.',
        fallbackHeader: 'AI service is not fully configured yet. Responding with an offline strategy.',
        fallbackNeedLabel: 'Need',
        fallbackQuestionLabel: 'You asked',
        fallbackAdviceTitle: 'Suggestions:',
        fallbackAdvice1: 'Confirm direction/exit first, then pick the right platform or gates.',
        fallbackAdvice2: 'If you have luggage/stroller/wheelchair, prioritize elevator routes and fewer transfers.',
        fallbackAdvice3: 'If delays happen, switch to alternatives or surface routes/taxis; avoid wandering inside paid areas.'
    },
    ja: {
        stationLabel: '駅',
        linkLabel: 'リンク',
        facilitiesTitle: '【施設】',
        facilitiesNone: '該当する施設情報が見つかりませんでした。',
        timetableTitle: '【次の電車】',
        timetableNoTrips: '時刻表は取得できましたが、現在の時間帯に表示できる便がありません。',
        timetableNeedId: '時刻表には ODPT の駅ID（例：odpt.Station:TokyoMetro.Ginza.Ueno）が必要です。\nこの駅はODPT時刻表IDに解決できませんでした。',
        timetableFailed: '時刻表の取得に失敗しました。',
        timetableFailedNetwork: '時刻表の取得に失敗しました（ネットワークまたはサービスが一時的に利用できません）。',
        fareTitle: '【運賃】',
        fareTicketLabel: '切符',
        fareIcLabel: 'IC',
        fareNeedIds: '運賃検索には出発駅と到着駅の ODPT 駅ID が必要です。\n例：\n- 運賃 from: odpt.Station:TokyoMetro.Ginza.Ueno to: odpt.Station:TokyoMetro.Marunouchi.Tokyo',
        fareNotFound: '直通運賃が見つかりません（乗換や事業者跨ぎの可能性）。',
        fareFailed: '運賃の取得に失敗しました。',
        fareFailedNetwork: '運賃の取得に失敗しました（ネットワークまたはサービスが一時的に利用できません）。',
        statusTitle: '【運行情報】',
        statusNone: '現在、運行情報がありません。',
        crowdLabel: '混雑',
        weatherLabel: '天気',
        updatedLabel: '更新',
        strategyTitle: '【{destination} 方面】',
        strategyUnavailable: 'ルート提案は現在利用できません。',
        strategyEmpty: '利用できるルート提案がありません。',
        fallbackHeader: 'AI サービス設定が未完了のため、オフライン戦略で回答します。',
        fallbackNeedLabel: 'ニーズ',
        fallbackQuestionLabel: '質問',
        fallbackAdviceTitle: '提案：',
        fallbackAdvice1: 'まず方向／出口を確認し、適切なホームや改札を選びましょう。',
        fallbackAdvice2: '荷物／ベビーカー／車いすがある場合は、エレベーター動線と乗換回数の少なさを優先。',
        fallbackAdvice3: '遅延時は代替路線や地上ルート／タクシーも検討し、改札内で迷わないように。'
    }
};

function formatTemplate(locale: SupportedLocale, key: string, vars: Record<string, string>) {
    let template = UI_TEXT[locale][key] || '';
    for (const [k, v] of Object.entries(vars)) {
        template = template.replaceAll(`{${k}}`, v);
    }
    return template;
}

function facilityTypeLabel(type: string, locale: SupportedLocale) {
    const k = String(type || '').toLowerCase();
    const map: Record<string, Record<SupportedLocale, string>> = {
        toilet: { 'zh-TW': '廁所', en: 'Toilet', ja: 'トイレ' },
        locker: { 'zh-TW': '置物櫃', en: 'Locker', ja: 'ロッカー' },
        elevator: { 'zh-TW': '電梯', en: 'Elevator', ja: 'エレベーター' },
        wifi: { 'zh-TW': 'WiFi', en: 'WiFi', ja: 'WiFi' },
        charging: { 'zh-TW': '充電', en: 'Charging', ja: '充電' },
        atm: { 'zh-TW': 'ATM', en: 'ATM', ja: 'ATM' },
        nursery: { 'zh-TW': '育嬰', en: 'Nursery', ja: 'ベビー' },
        facility: { 'zh-TW': '設施', en: 'Facility', ja: '施設' }
    };
    return (map[k] || map.facility)[locale];
}

function checkLlmAllowance() {
    const windowMs = Number(process.env.AI_LLM_WINDOW_MS || 60 * 60 * 1000);
    const maxCalls = Number(process.env.AI_LLM_MAX_CALLS_PER_WINDOW || 0);

    if (!Number.isFinite(windowMs) || windowMs <= 0) return { allowed: true as const };
    if (!Number.isFinite(maxCalls) || maxCalls <= 0) return { allowed: true as const };

    const now = Date.now();
    if (now - llmWindowStartedAt >= windowMs) {
        llmWindowStartedAt = now;
        llmWindowCount = 0;
    }

    if (llmWindowCount >= maxCalls) {
        return { allowed: false as const, reason: 'budget_cap' as const };
    }

    llmWindowCount += 1;
    return { allowed: true as const };
}

function normText(input: string) {
    return (input || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function includesAny(text: string, keywords: string[]) {
    for (const k of keywords) {
        if (k && text.includes(k)) return true;
    }
    return false;
}

function guessDestination(raw: string) {
    const t = normText(raw);
    if (includesAny(t, ['narita', '成田'])) return 'Narita';
    if (includesAny(t, ['haneda', '羽田'])) return 'Haneda';
    if (includesAny(t, ['airport', '機場'])) return 'Narita';
    return '';
}

function extractOdptStationIds(raw: string) {
    const hits = new Set<string>();
    const text = raw || '';
    const pattern = /(odpt[\.:]Station:[A-Za-z0-9_.:-]+)/g;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
        const id = match[1];
        if (id) hits.add(id);
    }
    return Array.from(hits);
}

function extractOdptFromTo(raw: string) {
    const text = raw || '';
    const from = text.match(/\bfrom\s*[:=]\s*(odpt[\.:]Station:[A-Za-z0-9_.:-]+)/i)?.[1] || '';
    const to = text.match(/\bto\s*[:=]\s*(odpt[\.:]Station:[A-Za-z0-9_.:-]+)/i)?.[1] || '';
    return { from, to };
}

async function readErrorDetail(res: Response) {
    try {
        const json = await res.json();
        return json?.error || json?.message || JSON.stringify(json);
    } catch {
        try {
            const text = await res.text();
            return text;
        } catch {
            return '';
        }
    }
}

type ToolKind = 'facility' | 'timetable' | 'fare' | 'status' | 'strategy' | 'llm';

function detectKind(raw: string): ToolKind {
    const t = normText(raw);

    const isRoute = includesAny(t, ['怎麼去', '如何去', '怎麼走', '路線', '轉乘', '換乘', '怎麼搭', '搭乘', 'go to', 'route', 'transfer']);
    const isAirport = includesAny(t, ['airport', '機場', 'narita', '成田', 'haneda', '羽田']);
    if (isRoute && isAirport) return 'strategy';

    if (includesAny(t, ['時刻表', '班次', '下一班', '末班', '首班', 'departure', 'timetable', 'last train', 'first train'])) return 'timetable';
    if (includesAny(t, ['票價', '費用', '多少錢', '車資', '運賃', 'fare', 'price'])) return 'fare';
    if (includesAny(t, ['置物櫃', 'locker', '廁所', 'toilet', '電梯', 'elevator', '無障礙', 'access', 'wifi', '充電', 'charging', 'atm', '育嬰', 'nursery'])) return 'facility';
    if (includesAny(t, ['延遲', '誤點', '停駛', '運行', '運轉', 'delay', 'suspended', 'status', '擁擠', '人多', 'crowd', '天氣', 'weather'])) return 'status';
    if (isRoute) return 'strategy';

    return 'llm';
}

function sseResponse(answer: string, meta?: Record<string, any>) {
    return new NextResponse(createSseStream(answer, meta), {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive'
        }
    });
}

function toStatusLabel(status: string, locale: SupportedLocale) {
    const s = String(status || '').toLowerCase();
    if (locale === 'en') {
        if (s === 'delay') return 'Delayed';
        if (s === 'suspended') return 'Suspended';
        return 'Normal';
    }
    if (locale === 'ja') {
        if (s === 'delay') return '遅延';
        if (s === 'suspended') return '運休';
        return '平常';
    }
    if (s === 'delay') return '延遲';
    if (s === 'suspended') return '停駛';
    return '正常';
}

function formatFacilitiesAnswer(params: { stationName: string; facilities: any[]; raw: string; locale: SupportedLocale }) {
    const { stationName, facilities, raw, locale } = params;
    const t = normText(raw);
    const typeKeywords: Array<[string, string[]]> = [
        ['toilet', ['toilet', '廁所']],
        ['locker', ['locker', '置物櫃']],
        ['elevator', ['elevator', '電梯']],
        ['wifi', ['wifi']],
        ['charging', ['charging', '充電']],
        ['atm', ['atm']],
        ['nursery', ['nursery', '育嬰']]
    ];

    let wanted: string | null = null;
    for (const [type, keys] of typeKeywords) {
        if (includesAny(t, keys)) {
            wanted = type;
            break;
        }
    }

    const list = Array.isArray(facilities) ? facilities : [];
    const filtered = wanted ? list.filter((f: any) => String(f?.type || '').toLowerCase() === wanted) : list;
    const top = filtered.slice(0, 8).map((f: any, idx: number) => {
        const type = f?.type || 'facility';
        const loc = f?.location;
        const locText = typeof loc === 'string'
            ? loc
            : pickLocaleText(loc, locale);
        const floor = f?.attributes?.floor ? `／${f.attributes.floor}` : '';
        const operator = f?.attributes?.operator ? `／${f.attributes.operator}` : '';
        const suffix = `${operator}${floor}`.replace(/^\//, '');
        const detail = suffix ? `（${suffix}）` : '';
        return `${idx + 1}. ${facilityTypeLabel(type, locale)}: ${locText}${detail}`;
    });

    if (top.length === 0) {
        return `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].facilitiesNone}`;
    }

    const title = wanted ? `【${facilityTypeLabel(wanted, locale)}】` : UI_TEXT[locale].facilitiesTitle;
    return `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${title}\n${top.join('\n')}`;
}

function formatTimetableAnswer(params: { stationName: string; stationId: string; data: any; locale: SupportedLocale }) {
    const { stationName, stationId, data, locale } = params;
    const directions = data?.directions || {};
    const lines: string[] = [];

    for (const [dir, trips] of Object.entries(directions)) {
        if (!Array.isArray(trips) || trips.length === 0) continue;
        const top = (trips as any[]).slice(0, 3).map((t: any) => {
            const time = t?.time || '';
            const dest = t?.dest ? `→${t.dest}` : '';
            const type = t?.trainType ? `(${t.trainType})` : '';
            return `${time}${dest}${type}`;
        });
        if (top.length > 0) lines.push(`${dir}: ${top.join('、')}`);
    }

    if (lines.length === 0) {
        return `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].timetableNoTrips}\nstation: ${stationId}`;
    }

    return `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].timetableTitle}\n${lines.join('\n')}`;
}

function formatFareAnswer(params: { stationName: string; fromStation: string; toStation: string; data: any; locale: SupportedLocale }) {
    const { stationName, fromStation, toStation, data, locale } = params;
    if (!data?.found) {
        return `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].fareNotFound}\nfrom: ${fromStation}\nto: ${toStation}`;
    }

    const fares = Array.isArray(data?.fares) ? data.fares : [];
    const top = fares.slice(0, 4).map((f: any, idx: number) => {
        const ticket = f?.ticket != null ? `${f.ticket}円` : 'N/A';
        const ic = f?.ic != null ? `${f.ic}円` : 'N/A';
        const sep = locale === 'en' ? ' / ' : '／';
        return `${idx + 1}. ${UI_TEXT[locale].fareTicketLabel} ${ticket}${sep}${UI_TEXT[locale].fareIcLabel} ${ic}`;
    });

    return `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].fareTitle}\n${top.join('\n')}`;
}

function formatStatusAnswer(params: { stationName: string; data: any; locale: SupportedLocale }) {
    const { stationName, data, locale } = params;
    if (!data) {
        return `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].statusNone}`;
    }

    const lines = Array.isArray(data?.line_status) ? data.line_status : [];
    const top = lines.slice(0, 8).map((l: any) => {
        const name = pickLocaleText(l?.name, locale) || l?.line || 'Line';
        const status = toStatusLabel(l?.status, locale);
        const raw = l?.message || l?.reason_ja || l?.message_ja;
        const msg = raw && typeof raw === 'object' ? pickLocaleText(raw, locale) : raw;
        return msg ? `${name}: ${status}（${msg}）` : `${name}: ${status}`;
    });

    const crowd = data?.congestion != null ? `\n\n${UI_TEXT[locale].crowdLabel}：${data.congestion}/5` : '';
    const weather = data?.weather?.temp != null ? `\n${UI_TEXT[locale].weatherLabel}：${data.weather.temp}°C ${data.weather.condition || ''}` : '';
    const updated = data?.updated_at ? `\n${UI_TEXT[locale].updatedLabel}：${data.updated_at}` : '';

    if (top.length === 0) return `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].statusNone}`;
    return `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].statusTitle}\n${top.join('\n')}${crowd}${weather}${updated}`;
}

function proxyDifyStream(params: { upstream: ReadableStream<Uint8Array>; getFallbackStream: () => Promise<ReadableStream<Uint8Array>> }) {
    const { upstream, getFallbackStream } = params;
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    const reader = upstream.getReader();

    const hasUpstreamError = (text: string) => {
        return (
            text.includes('"event":"error"') ||
            text.includes('event":"error"') ||
            text.includes('"event": "error"') ||
            text.includes('event": "error"')
        );
    };

    return new ReadableStream<Uint8Array>({
        async start(controller) {
            let decided = false;
            let buffer = '';
            let scanBuffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value);

                scanBuffer = (scanBuffer + text).slice(-2000);
                if (hasUpstreamError(scanBuffer)) {
                    try {
                        await reader.cancel();
                    } catch {
                    }

                    let fallback: ReadableStream<Uint8Array>;
                    try {
                        fallback = await getFallbackStream();
                    } catch {
                        fallback = createSseStream('', { mode: 'offline' });
                    }

                    const fallbackReader = fallback.getReader();
                    while (true) {
                        const r = await fallbackReader.read();
                        if (r.done) break;
                        controller.enqueue(r.value);
                    }
                    controller.close();
                    return;
                }

                if (!decided) {
                    buffer += text;
                    if (buffer.includes('data: ')) {
                        decided = true;
                        controller.enqueue(encoder.encode(buffer));
                        buffer = '';
                    }
                    continue;
                }

                controller.enqueue(value);
            }

            if (!decided && buffer) {
                controller.enqueue(encoder.encode(buffer));
            }
            controller.close();
        }
    });
}

function toDisplayStationName(profile: any, locale: SupportedLocale) {
    return (
        pickLocaleText(profile?.name, locale) ||
        profile?.node_id ||
        profile?.id ||
        (locale === 'ja' ? '駅' : locale === 'en' ? 'Station' : '站點')
    );
}

function summarizeL2(profile: any, locale: SupportedLocale) {
    const lines = profile?.l2_status?.line_status;
    if (!Array.isArray(lines) || lines.length === 0) return '';

    const top = lines.slice(0, 6).map((l: any) => {
        const name = pickLocaleText(l?.name, locale) || l?.line || 'Line';
        const status = toStatusLabel(l?.status, locale);
        const raw = l?.message || l?.reason_ja || l?.message_ja;
        const msg = raw && typeof raw === 'object' ? pickLocaleText(raw, locale) : raw;
        return msg ? `${name}: ${status}（${msg}）` : `${name}: ${status}`;
    });

    const title = locale === 'en' ? '[L2 Live]' : locale === 'ja' ? '【L2 リアルタイム】' : '【L2 即時】';
    return `\n\n${title}\n${top.join('\n')}`;
}

function summarizeL3(profile: any, locale: SupportedLocale) {
    const facilities = profile?.l3_facilities;
    if (!Array.isArray(facilities) || facilities.length === 0) return '';

    const counts: Record<string, number> = {};
    for (const f of facilities) {
        const type = (f as any)?.type || 'unknown';
        counts[type] = (counts[type] || 0) + 1;
    }

    const topTypes = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([type, count]) => `${type}×${count}`);

    const title = locale === 'en' ? '[L3 Facilities]' : locale === 'ja' ? '【L3 施設】' : '【L3 設施】';
    const sep = locale === 'en' ? ', ' : '、';
    return `\n\n${title}\n${topTypes.join(sep)}`;
}

function summarizeP1Counts(profile: any, locale: SupportedLocale) {
    const counts = profile?.category_counts || profile?.facility_profile?.category_counts;
    if (!counts || typeof counts !== 'object') return '';

    const keys = [
        'convenience_count',
        'drugstore_count',
        'restaurant_count',
        'cafe_count',
        'shrine_count',
        'temple_count',
        'museum_count'
    ];

    const rows = keys
        .map((k) => [k, (counts as any)?.[k]] as const)
        .filter(([, v]) => typeof v === 'number' && v > 0)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 6)
        .map(([k, v]) => {
            const label =
                k === 'convenience_count' ? (locale === 'en' ? 'Convenience' : locale === 'ja' ? 'コンビニ' : '便利店') :
                    k === 'drugstore_count' ? (locale === 'en' ? 'Drugstore' : locale === 'ja' ? 'ドラッグストア' : '藥妝') :
                        k === 'restaurant_count' ? (locale === 'en' ? 'Restaurants' : locale === 'ja' ? 'レストラン' : '餐廳') :
                            k === 'cafe_count' ? (locale === 'en' ? 'Cafe' : locale === 'ja' ? 'カフェ' : '咖啡') :
                                k === 'shrine_count' ? (locale === 'en' ? 'Shrine' : locale === 'ja' ? '神社' : '神社') :
                                    k === 'temple_count' ? (locale === 'en' ? 'Temple' : locale === 'ja' ? '寺院' : '寺廟') :
                                        (locale === 'en' ? 'Museum' : locale === 'ja' ? '博物館' : '博物館');

            return `${label}×${v}`;
        });

    if (rows.length === 0) return '';

    const title = locale === 'en' ? '[P1 Counts]' : locale === 'ja' ? '【P1 カウント】' : '【P1 計數】';
    const sep = locale === 'en' ? ', ' : '、';
    return `\n\n${title}\n${rows.join(sep)}`;
}

function buildFallbackAnswer(params: { profile: any; userProfile: string; userText: string; locale: SupportedLocale }) {
    const { profile, userProfile, userText, locale } = params;
    const stationName = toDisplayStationName(profile, locale);
    const l2 = summarizeL2(profile, locale);
    const l3 = summarizeL3(profile, locale);
    const p1 = summarizeP1Counts(profile, locale);

    const header = `${UI_TEXT[locale].fallbackHeader}\n\n${UI_TEXT[locale].stationLabel}：${stationName}\n${UI_TEXT[locale].fallbackNeedLabel}：${userProfile}`;
    const prompt = userText ? `\n\n${UI_TEXT[locale].fallbackQuestionLabel}：${userText}` : '';
    const baseAdvice = `\n\n${UI_TEXT[locale].fallbackAdviceTitle}\n1) ${UI_TEXT[locale].fallbackAdvice1}\n2) ${UI_TEXT[locale].fallbackAdvice2}\n3) ${UI_TEXT[locale].fallbackAdvice3}`;

    return `${header}${prompt}${l2}${l3}${p1}${baseAdvice}`;
}

async function generateMistralAnswer(params: { profile: any; userProfile: string; userText: string; locale: SupportedLocale }) {
    const { profile, userProfile, userText, locale } = params;
    if (!mistralClient) return null;

    const stationName = toDisplayStationName(profile, locale);
    const l2 = summarizeL2(profile, locale);
    const l3 = summarizeL3(profile, locale);
    const p1 = summarizeP1Counts(profile, locale);

    const lang = locale === 'ja' ? '日本語' : locale === 'en' ? 'English' : '繁體中文';

    const system =
        locale === 'en'
            ? 'You are LUTAGU, a gentle guide. Like a guardian deer, you provide the most thoughtful travel advice based on real-time data (L2).'
            : locale === 'ja'
                ? 'あなたはLUTAGUという名の優しい案内人です。守護霊鹿のように、リアルタイムデータ（L2）に基づいてユーザーに最も思いやりのある行動提案を行います。'
                : '你是一個名為 LUTAGU 的溫柔指引者，像守護靈鹿一樣，根據即時數據 (L2) 為用戶提供最貼心的行動建議。';

    const context =
        `${UI_TEXT[locale].stationLabel}：${stationName}\n` +
        `${UI_TEXT[locale].fallbackNeedLabel}：${userProfile}` +
        (l2 ? `\n${l2}` : '') +
        (l3 ? `\n${l3}` : '') +
        (p1 ? `\n${p1}` : '');

    const userPrompt =
        (locale === 'en'
            ? `Answer in ${lang}.\n\n[Context]\n${context}\n\n[User]\n${userText}`
            : locale === 'ja'
                ? `${lang}で回答してください。\n\n【コンテキスト】\n${context}\n\n【ユーザー】\n${userText}`
                : `請用${lang}回答。\n\n【背景】\n${context}\n\n【使用者】\n${userText}`);

    try {
        const result = await mistralClient.chat.complete({
            model: mistralModel,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: userPrompt }
            ]
        });

        const content = (result as any)?.choices?.[0]?.message?.content;
        if (!content) return null;

        const text = typeof content === 'string' ? content : Array.isArray(content) ? content.map((c: any) => c?.text || '').join('') : '';
        const trimmed = String(text || '').trim();
        return trimmed || null;
    } catch {
        return null;
    }
}

function createSseStream(answer: string, meta?: Record<string, any>) {
    const encoder = new TextEncoder();
    const chunks: string[] = [];

    const chunkSize = 80;
    for (let i = 0; i < answer.length; i += chunkSize) {
        chunks.push(answer.slice(i, i + chunkSize));
    }

    return new ReadableStream({
        async start(controller) {
            if (meta && typeof meta === 'object') {
                const payload = `data: ${JSON.stringify({ event: 'meta', ...meta })}\n\n`;
                controller.enqueue(encoder.encode(payload));
            }
            for (const part of chunks) {
                const payload = `data: ${JSON.stringify({ event: 'message', answer: part })}\n\n`;
                controller.enqueue(encoder.encode(payload));
                await new Promise(resolve => setTimeout(resolve, 40));
            }
            controller.close();
        }
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, inputs, nodeId, conversation_id } = body;

        console.log('[API] Chat Request Received:', { nodeId, inputs });

        const clientInputs = inputs || {};
        const locale = localeFromRequest(req, clientInputs.locale);

        // 1. Fetch Node Context (L2 + L3)
        // If nodeId is missing, we must handle it gracefully or default.
        if (!nodeId) {
            console.warn('[API] Warning: nodeId is missing in request.');
        }

        const { node, profile } = await fetchNodeConfig(nodeId || 'default');

        if (!profile) {
            console.error('[API] Error: Profile not found for nodeId:', nodeId);
            return NextResponse.json({ error: `Profile not found for nodeId: ${nodeId}` }, { status: 404 });
        }

        console.log('[API] Node Profile Fetched:', { name: node?.name?.en || node?.name?.ja || profile.node_id, id: profile.node_id });

        // 2. Format Context for Dify Variables (V2 Architecture: Tool Calling)
        // We only pass the station ID and user profile. The Agent fetches the rest.

        const lastUserText = messages?.[messages.length - 1]?.content || '';

        let currentStationId = profile?.node_id || node?.id || nodeId;
        // Ensure ID is fully qualified if possible, or trust profile.id
        // profile.id from nodes table is usually 'odpt:Station:...'

        const contextInputs = {
            current_station: currentStationId,
            user_profile: clientInputs.user_profile || 'general'
        };

        const routerEnabled = process.env.AI_ROUTER_ENABLED !== 'false';
        const toolsOnly = process.env.AI_TOOL_MODE_ONLY === 'true';
        const kind = routerEnabled ? detectKind(lastUserText) : 'llm';
        const stationName = pickLocaleText(node?.name, locale) || currentStationId || (locale === 'ja' ? '駅' : locale === 'en' ? 'Station' : '站點');

        await logUserActivity({
            request: req,
            activityType: 'agent_chat_query',
            queryContent: {
                text: lastUserText,
                kind,
                nodeId: nodeId || null,
                currentStationId: currentStationId || null,
                conversation_id: conversation_id || null
            },
            metadata: {
                feature: 'agent_chat',
                locale,
                toolsOnly
            }
        });

        void writeAuditLog(req, {
            actorUserId: null,
            action: 'read',
            resourceType: 'agent_chat',
            resourceId: String(conversation_id || currentStationId || '*'),
            before: null,
            after: {
                kind,
                locale,
                nodeId: nodeId || null,
                currentStationId: currentStationId || null,
                toolsOnly
            }
        });

        const origin = new URL(req.url).origin;

        if (toolsOnly || kind !== 'llm') {
            if (kind === 'facility') {
                let facilities: any[] = [];
                try {
                    const res = await fetch(`${origin}/api/station/${encodeURIComponent(String(currentStationId || ''))}/facilities`, { cache: 'no-store' });
                    if (res.ok) {
                        const json = await res.json();
                        facilities = json?.facilities || [];
                    }
                } catch {
                    facilities = [];
                }
                const answer = formatFacilitiesAnswer({ stationName, facilities, raw: lastUserText, locale });
                return sseResponse(answer);
            }

            if (kind === 'status') {
                let l2: any = null;
                try {
                    const res = await fetch(`${origin}/api/l2/status?station_id=${encodeURIComponent(String(currentStationId || ''))}`, { cache: 'no-store' });
                    if (res.ok) l2 = await res.json();
                } catch {
                    l2 = null;
                }

                const answer = formatStatusAnswer({ stationName, data: l2 || profile?.l2_status || null, locale });
                return sseResponse(answer);
            }

            if (kind === 'timetable') {
                const timetableStation = resolveRepresentativeOdptStationId(String(currentStationId || ''));
                if (!timetableStation) {
                    const answer = `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].timetableNeedId}`;
                    return sseResponse(answer);
                }

                try {
                    const res = await fetch(`${origin}/api/odpt/timetable?station=${encodeURIComponent(timetableStation)}`, { cache: 'no-store' });
                    if (!res.ok) {
                        const detail = await readErrorDetail(res);
                        const reason = detail ? `\n${detail}` : '';
                        const answer = `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].timetableFailed}\nstation: ${timetableStation}`;
                        return sseResponse(`${answer}${reason}`);
                    }
                    const data = await res.json();
                    const answer = formatTimetableAnswer({ stationName, stationId: timetableStation, data, locale });
                    return sseResponse(answer);
                } catch {
                    const answer = `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].timetableFailedNetwork}\nstation: ${timetableStation}`;
                    return sseResponse(answer);
                }
            }

            if (kind === 'fare') {
                const explicit = extractOdptFromTo(lastUserText);
                const explicitFrom = explicit.from ? explicit.from.replace(/^odpt:Station:/, 'odpt.Station:') : '';
                const explicitTo = explicit.to ? explicit.to.replace(/^odpt:Station:/, 'odpt.Station:') : '';

                const fromStation = explicitFrom || resolveRepresentativeOdptStationId(String(currentStationId || ''));
                const ids = extractOdptStationIds(lastUserText).map((id) => id.replace(/^odpt:Station:/, 'odpt.Station:'));
                const candidates = ids.filter((id) => id.startsWith('odpt.Station:'));
                const unique = Array.from(new Set(candidates));

                const toStation = explicitTo || unique.find((id) => id !== fromStation) || unique[0] || '';

                if (!fromStation || !toStation) {
                    const answer = `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].fareNeedIds}`;
                    return sseResponse(answer);
                }

                try {
                    const res = await fetch(`${origin}/api/odpt/fare?from=${encodeURIComponent(fromStation)}&to=${encodeURIComponent(toStation)}`, { cache: 'no-store' });
                    if (!res.ok) {
                        const detail = await readErrorDetail(res);
                        const reason = detail ? `\n${detail}` : '';
                        const answer = `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].fareFailed}\nfrom: ${fromStation}\nto: ${toStation}`;
                        return sseResponse(`${answer}${reason}`);
                    }
                    const data = await res.json();
                    const answer = formatFareAnswer({ stationName, fromStation, toStation, data, locale });
                    return sseResponse(answer);
                } catch {
                    const answer = `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].fareFailedNetwork}\nfrom: ${fromStation}\nto: ${toStation}`;
                    return sseResponse(answer);
                }
            }

            if (kind === 'strategy') {
                const destination = guessDestination(lastUserText) || 'Narita';
                try {
                    const res = await fetch(`${origin}/api/strategy`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            stationId: String(currentStationId || ''),
                            demand: contextInputs.user_profile || null,
                            destination,
                            locale
                        })
                    });

                    if (!res.ok) {
                        const answer = `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].strategyUnavailable}`;
                        return sseResponse(answer);
                    }

                    const data = await res.json();
                    const cards = Array.isArray(data?.cards) ? data.cards : [];
                    const top = cards.slice(0, 3).map((c: any, idx: number) => {
                        const title = pickLocaleText(c?.title, locale);
                        const desc = pickLocaleText(c?.description, locale);
                        const url = c?.actionUrl ? `\n${UI_TEXT[locale].linkLabel}：${c.actionUrl}` : '';
                        return `${idx + 1}. ${title}\n${desc}${url}`.trim();
                    });

                    const answer = top.length > 0
                        ? `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${formatTemplate(locale, 'strategyTitle', { destination })}\n${top.join('\n\n')}`
                        : `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].strategyEmpty}`;
                    return sseResponse(answer);
                } catch {
                    const answer = `${UI_TEXT[locale].stationLabel}：${stationName}\n\n${UI_TEXT[locale].strategyUnavailable}`;
                    return sseResponse(answer);
                }
            }

            const answer = buildFallbackAnswer({
                profile,
                userProfile: contextInputs.user_profile || 'general',
                userText: lastUserText,
                locale
            });
            return sseResponse(answer, { mode: 'offline' });
        }

        const allowance = checkLlmAllowance();
        if (!allowance.allowed) {
            void writeSecurityEvent(req, {
                type: 'llm_budget_cap',
                severity: 'medium',
                actorUserId: null,
                metadata: { endpoint: 'POST /api/agent/chat', reason: allowance.reason }
            });

            const mistralText = await generateMistralAnswer({
                profile,
                userProfile: contextInputs.user_profile || 'general',
                userText: lastUserText,
                locale
            });

            if (mistralText) {
                void writeSecurityEvent(req, {
                    type: 'ai_fallback_mistral',
                    severity: 'low',
                    actorUserId: null,
                    metadata: { endpoint: 'POST /api/agent/chat', reason: 'budget_cap' }
                });
                return sseResponse(mistralText, { mode: 'mistral' });
            }

            const answer = buildFallbackAnswer({
                profile,
                userProfile: contextInputs.user_profile || 'general',
                userText: lastUserText,
                locale
            });
            return sseResponse(answer, { mode: 'offline' });
        }

        // 3. Call Dify API
        const difyApiKey = process.env.DIFY_API_KEY;
        const difyApiUrl = process.env.DIFY_API_URL;

        if (!difyApiKey || !difyApiUrl) {
            void writeSecurityEvent(req, {
                type: 'ai_config_missing',
                severity: 'high',
                actorUserId: null,
                metadata: { endpoint: 'POST /api/agent/chat', missingKey: !difyApiKey, missingUrl: !difyApiUrl }
            });
            const userText = messages?.[messages.length - 1]?.content || '';
            const mistralText = await generateMistralAnswer({
                profile,
                userProfile: contextInputs.user_profile || 'general',
                userText,
                locale
            });

            if (mistralText) {
                void writeSecurityEvent(req, {
                    type: 'ai_provider_mistral',
                    severity: 'low',
                    actorUserId: null,
                    metadata: { endpoint: 'POST /api/agent/chat', reason: 'dify_missing' }
                });
                return sseResponse(mistralText, { mode: 'mistral' });
            }

            const answer = buildFallbackAnswer({
                profile,
                userProfile: contextInputs.user_profile || 'general',
                userText,
                locale
            });

            return sseResponse(answer, { mode: 'offline' });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        let difyResponse: Response;
        try {
            difyResponse = await fetch(`${difyApiUrl}/chat-messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${difyApiKey}`
                },
                body: JSON.stringify({
                    inputs: contextInputs,
                    query: lastUserText,
                    response_mode: 'streaming',
                    conversation_id: conversation_id || '',
                    user: 'lutagu-user-v1',
                    files: []
                }),
                signal: controller.signal
            });
        } catch (e) {
            void writeSecurityEvent(req, {
                type: 'ai_network_error',
                severity: 'medium',
                actorUserId: null,
                metadata: { endpoint: 'POST /api/agent/chat' }
            });

            const mistralText = await generateMistralAnswer({
                profile,
                userProfile: contextInputs.user_profile || 'general',
                userText: lastUserText,
                locale
            });

            if (mistralText) {
                void writeSecurityEvent(req, {
                    type: 'ai_fallback_mistral',
                    severity: 'low',
                    actorUserId: null,
                    metadata: { endpoint: 'POST /api/agent/chat', reason: 'network_error' }
                });
                return sseResponse(mistralText, { mode: 'mistral' });
            }

            const answer = buildFallbackAnswer({
                profile,
                userProfile: contextInputs.user_profile || 'general',
                userText: lastUserText,
                locale
            });

            return sseResponse(answer, { mode: 'offline' });
        } finally {
            clearTimeout(timeoutId);
        }

        if (!difyResponse.ok) {
            void writeSecurityEvent(req, {
                type: 'ai_upstream_error',
                severity: 'medium',
                actorUserId: null,
                metadata: { endpoint: 'POST /api/agent/chat', status: difyResponse.status }
            });
            const errorText = await difyResponse.text();
            console.error('Dify API Error:', errorText);

            const mistralText = await generateMistralAnswer({
                profile,
                userProfile: contextInputs.user_profile || 'general',
                userText: lastUserText,
                locale
            });

            if (mistralText) {
                void writeSecurityEvent(req, {
                    type: 'ai_fallback_mistral',
                    severity: 'low',
                    actorUserId: null,
                    metadata: { endpoint: 'POST /api/agent/chat', reason: 'upstream_error', status: difyResponse.status }
                });
                return sseResponse(mistralText, { mode: 'mistral' });
            }

            const answer = buildFallbackAnswer({
                profile,
                userProfile: contextInputs.user_profile || 'general',
                userText: lastUserText,
                locale
            });

            return sseResponse(answer, { mode: 'offline' });
        }

        const stream = difyResponse.body;
        if (!stream) {
            void writeSecurityEvent(req, {
                type: 'ai_stream_missing',
                severity: 'medium',
                actorUserId: null,
                metadata: { endpoint: 'POST /api/agent/chat' }
            });

            const mistralText = await generateMistralAnswer({
                profile,
                userProfile: contextInputs.user_profile || 'general',
                userText: lastUserText,
                locale
            });

            if (mistralText) {
                void writeSecurityEvent(req, {
                    type: 'ai_fallback_mistral',
                    severity: 'low',
                    actorUserId: null,
                    metadata: { endpoint: 'POST /api/agent/chat', reason: 'no_stream' }
                });
                return sseResponse(mistralText, { mode: 'mistral' });
            }

            const answer = buildFallbackAnswer({
                profile,
                userProfile: contextInputs.user_profile || 'general',
                userText: lastUserText,
                locale
            });

            return sseResponse(answer, { mode: 'offline' });
        }

        const fallbackAnswer = buildFallbackAnswer({
            profile,
            userProfile: contextInputs.user_profile || 'general',
            userText: lastUserText,
            locale
        });

        const getFallbackStream = async () => {
            void writeSecurityEvent(req, {
                type: 'ai_stream_error_event',
                severity: 'medium',
                actorUserId: null,
                metadata: { endpoint: 'POST /api/agent/chat' }
            });

            const mistralText = await generateMistralAnswer({
                profile,
                userProfile: contextInputs.user_profile || 'general',
                userText: lastUserText,
                locale
            });

            if (mistralText) {
                void writeSecurityEvent(req, {
                    type: 'ai_fallback_mistral',
                    severity: 'low',
                    actorUserId: null,
                    metadata: { endpoint: 'POST /api/agent/chat', reason: 'dify_stream_error' }
                });
                return createSseStream(mistralText, { mode: 'mistral' });
            }

            return createSseStream(fallbackAnswer, { mode: 'offline' });
        };

        return new NextResponse(proxyDifyStream({ upstream: stream, getFallbackStream }), {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                Connection: 'keep-alive'
            }
        });

    } catch (error) {
        console.error('Agent API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
