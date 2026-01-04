'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Accessibility, AlertTriangle, BookOpen, Briefcase, ChevronDown, ChevronRight, Clock, Loader2, Map, MapPin, Settings, Sparkles, Ticket, X } from 'lucide-react';
import { StationAutocomplete, type Station } from '@/components/ui/StationAutocomplete';
import type { OdptRailwayFare, OdptStationTimetable } from '@/lib/odpt/types';
import {
    buildL4DefaultQuestionTemplates,
    buildFareSuggestion,
    buildRouteSuggestion,
    buildTimetableSuggestion,
    buildAmenitySuggestion,
    buildStatusSuggestion,
    classifyQuestion,
    extractOdptStationIds,
    filterFaresForOrigin,
    filterTimetablesForStation,
    findDemoScenario,
    normalizeOdptStationId,
    type L4DemandState,
    type L4IntentKind,
    type L4QuestionTemplate,
    type L4TemplateCategory,
    type L4Suggestion,
    type EnrichedRouteOption,
    type SupportedLocale,
} from '@/lib/l4/assistantEngine';
import { DemoScenario } from '@/lib/l4/demoScenarios';
import { RouteResultCard } from '@/components/node/RouteResultCard';

// Types for Card response (Mirroring API response)
interface L4DashboardProps {
    currentNodeId: string;
    locale?: SupportedLocale;
}

export default function L4_Dashboard({ currentNodeId, locale = 'zh-TW' }: L4DashboardProps) {
    const stationId = useMemo(() => normalizeOdptStationId(String(currentNodeId || '').trim()), [currentNodeId]);
    const isOdptStationId = useMemo(() => /^odpt[.:]Station:/.test(stationId), [stationId]);
    const uiLocale = locale;

    const [isDemandOpen, setIsDemandOpen] = useState(false);
    // Simplified 6-demand state (new design)
    const [demand, setDemand] = useState<L4DemandState>({
        wheelchair: false,
        stroller: false,
        vision: false,
        senior: false,
        largeLuggage: false,
        lightLuggage: false,
        rushing: false,
        budget: false,
        comfort: false,
        avoidCrowds: false,
        avoidRain: false,
    });

    // New simplified demand types for the 6-chip design
    type SimplifiedDemand = 'optimalRoute' | 'saveMoney' | 'accessibility' | 'expertTips' | 'avoidCrowds' | 'fastTrack';
    const [selectedDemands, setSelectedDemands] = useState<SimplifiedDemand[]>([]);

    const [question, setQuestion] = useState('');
    const [activeKind, setActiveKind] = useState<L4IntentKind | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeDemo, setActiveDemo] = useState<DemoScenario | null>(null);
    const [demoStepIndex, setDemoStepIndex] = useState(0);
    const [error, setError] = useState<string>('');

    const [focusedKind, setFocusedKind] = useState<Exclude<L4IntentKind, 'unknown'> | 'all'>('all');
    const [templateCategory, setTemplateCategory] = useState<L4TemplateCategory>('basic');
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
    const [autoSendTemplate, setAutoSendTemplate] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [fareData, setFareData] = useState<OdptRailwayFare[] | null>(null);
    const [timetableData, setTimetableData] = useState<OdptStationTimetable[] | null>(null);
    const [suggestion, setSuggestion] = useState<L4Suggestion | null>(null);

    // Origin/Destination autocomplete state
    const [originInput, setOriginInput] = useState('');
    const [selectedOrigin, setSelectedOrigin] = useState<Station | null>(null);
    const [destinationInput, setDestinationInput] = useState('');
    const [selectedDestination, setSelectedDestination] = useState<Station | null>(null);

    // Sync originInput with current station on start
    useEffect(() => {
        if (stationId) {
            setOriginInput(stationId);
            // We don't have the full Station object here yet, but we can set the input
        }
    }, [stationId]);

    useEffect(() => {
        setActiveKind(null);
        setError('');
        setFareData(null);
        setTimetableData(null);
        setSuggestion(null);
        setQuestion('');
        setIsTemplatesOpen(false);
        setFocusedKind('all');

        setDestinationInput('');
        setSelectedDestination(null);
    }, [stationId]);

    const templates = useMemo(() => {
        return buildL4DefaultQuestionTemplates({ originStationId: stationId, locale: uiLocale });
    }, [stationId, uiLocale]);

    const visibleTemplates = useMemo(() => {
        return templates.filter(t => {
            if (t.category !== templateCategory) return false;
            if (focusedKind === 'all') return true;
            return t.kind === focusedKind;
        });
    }, [templates, templateCategory, focusedKind]);

    const applyTemplate = async (tpl: L4QuestionTemplate, opts?: { send?: boolean }) => {
        setError('');
        setIsTemplatesOpen(true);
        setFocusedKind(tpl.kind);
        setQuestion(tpl.text);
        requestAnimationFrame(() => inputRef.current?.focus());
        if (opts?.send) {
            await new Promise(r => setTimeout(r, 0));
            await askWithText(tpl.text);
        }
    };

    // Quick route search using unified API when destination is selected via autocomplete
    const quickRouteSearch = async (destination: Station) => {
        if (!destination?.id || isLoading) return;

        const currentOriginId = selectedOrigin?.id || stationId;

        setError('');
        setActiveKind('route');
        setFareData(null);
        setTimetableData(null);
        setSuggestion(null);
        setIsLoading(true);
        setFocusedKind('route');

        try {
            const url = `/api/odpt/route?from=${encodeURIComponent(currentOriginId)}&to=${encodeURIComponent(destination.id)}&locale=${uiLocale}`;
            const res = await fetch(url, { cache: 'no-store' });
            const data = await res.json();

            if (!res.ok || data.error) {
                // Check for authentication errors
                const errorDetail = data.error || 'Route search failed';
                if (errorDetail.includes('403') || errorDetail.includes('Invalid acl:consumerKey')) {
                    setError(uiLocale.startsWith('zh')
                        ? '🔧 系統維護中：路線查詢服務暫時無法使用，請稍後再試。'
                        : uiLocale === 'ja'
                            ? '🔧 システムメンテナンス中：ルート検索サービスは一時的に利用できません。'
                            : '🔧 Route search service temporarily unavailable.');
                } else {
                    setError(errorDetail);
                }
                setSuggestion(buildRouteSuggestion({
                    originStationId: currentOriginId,
                    destinationStationId: destination.id,
                    demand,
                    verified: false,
                    options: [],
                }));
                return;
            }

            // Build suggestion from unified API response
            const apiRoutes = data.routes || [];

            setSuggestion({
                title: uiLocale.startsWith('zh')
                    ? '路線建議（含票價/時刻）'
                    : uiLocale === 'ja'
                        ? '経路案内（運賃/時刻付き）'
                        : 'Route suggestions (with fare/timetable)',
                options: apiRoutes.map((r: any): EnrichedRouteOption => ({
                    label: r.label,
                    steps: r.steps,
                    sources: r.sources || [{ type: 'odpt:Railway', verified: true }],
                    railways: r.railways,
                    transfers: Number(r.transfers ?? 0),
                    duration: typeof r.duration === 'number' ? r.duration : undefined,
                    fare: r.fare,
                    nextDeparture: r.nextDeparture
                })),
            });

            // Update question field for reference
            setQuestion(uiLocale.startsWith('zh')
                ? `怎麼去 ${destination.id} from: ${currentOriginId}`
                : uiLocale === 'ja'
                    ? `${destination.id} まで行きたい from: ${currentOriginId}`
                    : `How to get to ${destination.id} from: ${currentOriginId}`);
        } catch (e: any) {
            setError(e?.message || 'Route search failed');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDemand = (key: keyof L4DemandState) => {
        setDemand(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleSimplifiedDemand = (key: SimplifiedDemand) => {
        setSelectedDemands(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    const askWithText = async (rawText: string) => {
        const text = String(rawText || '').trim();
        if (!text || isLoading) return;

        setError('');
        setActiveKind(null);
        setFareData(null);
        setTimetableData(null);
        setSuggestion(null);

        // Check for Demo Scenario
        const demo = findDemoScenario(text);
        if (demo) {
            setActiveDemo(demo);
            setDemoStepIndex(0);
            return;
        }

        setIsLoading(true);
        const currentOriginId = selectedOrigin?.id || stationId;

        try {
            const intent = classifyQuestion(text, uiLocale);
            const kind = intent.kind;

            if (!isOdptStationId && !selectedOrigin) {
                setError(uiLocale.startsWith('zh')
                    ? '目前站點或出發地無法解析為 ODPT 站點 ID，無法查詢票價/時刻表/路線。'
                    : uiLocale === 'ja'
                        ? '現在の駅または出発地を ODPT 駅ID に解決できないため、運賃/時刻表/経路を取得できません。'
                        : 'Current station or origin cannot be resolved to an ODPT station ID, so fares/timetables/routes are unavailable.');
                setActiveKind('unknown');
                return;
            }

            if (kind === 'unknown') {
                setError(uiLocale.startsWith('zh')
                    ? '請用更明確的問題：例如「票價 to: odpt.Station:...」「時刻表」「怎麼去 odpt.Station:...」。'
                    : uiLocale === 'ja'
                        ? '質問をもう少し具体的にしてください（例：運賃 to: odpt.Station:... / 時刻表 / odpt.Station:... までの行き方）。'
                        : 'Ask more explicitly (e.g. “fare to: odpt.Station:...”, “timetable”, “how to get to odpt.Station:...”).');
                setActiveKind('unknown');
                return;
            }

            setActiveKind(kind);

            if (kind === 'status') {
                setSuggestion(buildStatusSuggestion({ stationId: currentOriginId, text, verified: true }));
                return;
            }

            if (kind === 'amenity') {
                setSuggestion(buildAmenitySuggestion({ stationId: currentOriginId, text, demand, verified: true }));
                return;
            }

            if (kind === 'fare') {
                const ids = extractOdptStationIds(text);
                const toStationId = intent.toStationId || (ids.find(id => normalizeOdptStationId(id) !== currentOriginId) ?? '');
                if (!toStationId) {
                    setSuggestion(buildFareSuggestion({
                        originStationId: currentOriginId,
                        destinationStationId: undefined,
                        demand,
                        verified: false,
                    }));
                    setError(uiLocale.startsWith('zh')
                        ? '票價需要指定目的地 ODPT 站點 ID（例如 to: odpt.Station:TokyoMetro.Marunouchi.Tokyo）。'
                        : uiLocale === 'ja'
                            ? '運賃には到着駅の ODPT 駅ID が必要です（例：to: odpt.Station:TokyoMetro.Marunouchi.Tokyo）。'
                            : 'Fare lookup needs a destination ODPT station ID (e.g. to: odpt.Station:TokyoMetro.Marunouchi.Tokyo).');
                    return;
                }

                const url = `/api/odpt/proxy?type=odpt:RailwayFare&odpt:fromStation=${encodeURIComponent(currentOriginId)}&odpt:toStation=${encodeURIComponent(normalizeOdptStationId(toStationId))}`;
                const res = await fetch(url, { cache: 'no-store' });
                if (!res.ok) {
                    const detail = await res.text().catch(() => '');
                    // Check for authentication errors
                    if (detail.includes('403') || detail.includes('Invalid acl:consumerKey')) {
                        setError(uiLocale.startsWith('zh')
                            ? '🔧 系統維護中：票價數據暫時無法使用，請稍後再試。'
                            : uiLocale === 'ja'
                                ? '🔧 システムメンテナンス中：運賃データは一時的に利用できません。'
                                : '🔧 Fare data temporarily unavailable.');
                    } else {
                        setError(detail || 'Fare request failed.');
                    }
                    setSuggestion(buildFareSuggestion({
                        originStationId: currentOriginId,
                        destinationStationId: toStationId,
                        demand,
                        verified: false,
                    }));
                    return;
                }
                const json = (await res.json()) as OdptRailwayFare[];
                const filtered = filterFaresForOrigin(json, currentOriginId);
                setFareData(filtered);
                setSuggestion(buildFareSuggestion({
                    originStationId: currentOriginId,
                    destinationStationId: toStationId,
                    demand,
                    verified: true,
                }));
                return;
            }

            if (kind === 'timetable') {
                const url = `/api/odpt/proxy?type=odpt:StationTimetable&odpt:station=${encodeURIComponent(currentOriginId)}`;
                const res = await fetch(url, { cache: 'no-store' });
                if (!res.ok) {
                    const detail = await res.text().catch(() => '');
                    // Check for authentication errors
                    if (detail.includes('403') || detail.includes('Invalid acl:consumerKey')) {
                        setError(uiLocale.startsWith('zh')
                            ? '🔧 系統維護中：時刻表數據暫時無法使用，請稍後再試。'
                            : uiLocale === 'ja'
                                ? '🔧 システムメンテナンス中：時刻表データは一時的に利用できません。'
                                : '🔧 Timetable data temporarily unavailable.');
                    } else {
                        setError(detail || 'Timetable request failed.');
                    }
                    setSuggestion(buildTimetableSuggestion({ stationId: currentOriginId, demand, verified: false }));
                    return;
                }
                const json = (await res.json()) as OdptStationTimetable[];
                const filtered = filterTimetablesForStation(json, currentOriginId);
                setTimetableData(filtered);
                setSuggestion(buildTimetableSuggestion({ stationId: currentOriginId, demand, verified: true }));
                return;
            }

            if (kind === 'route') {
                const ids = extractOdptStationIds(text).map(normalizeOdptStationId);
                const destinationStationId = (intent.toStationId ? normalizeOdptStationId(intent.toStationId) : '') || (ids.find(id => id !== currentOriginId) || '');
                if (!destinationStationId) {
                    setError(uiLocale.startsWith('zh')
                        ? '路線建議需要指定目的地 ODPT 站點 ID（例如「怎麼去 odpt.Station:TokyoMetro.Ginza.Ueno」）。'
                        : uiLocale === 'ja'
                            ? '経路には到着駅の ODPT 駅ID が必要です（例：「odpt.Station:TokyoMetro.Ginza.Ueno まで」）。'
                            : 'Route suggestions need a destination ODPT station ID (e.g. “to odpt.Station:TokyoMetro.Ginza.Ueno”).');
                    setSuggestion(buildRouteSuggestion({
                        originStationId: currentOriginId,
                        destinationStationId: currentOriginId,
                        demand,
                        verified: false,
                        options: [],
                    }));
                    return;
                }

                const url = `/api/odpt/route?from=${encodeURIComponent(currentOriginId)}&to=${encodeURIComponent(destinationStationId)}&locale=${uiLocale}`;
                const res = await fetch(url, { cache: 'no-store' });
                if (!res.ok) {
                    const detail = await res.text().catch(() => '');
                    // Check for authentication errors
                    if (detail.includes('403') || detail.includes('Invalid acl:consumerKey')) {
                        setError(uiLocale.startsWith('zh')
                            ? '🔧 系統維護中：部分路線數據暫時無法使用（認證過期），請聯絡管理員更新 API 金鑰。'
                            : uiLocale === 'ja'
                                ? '🔧 システムメンテナンス中：一時的にルートデータを利用できません（認証エラー）。'
                                : '🔧 System maintenance: Route data temporarily unavailable (API auth expired).');
                    } else {
                        setError(detail || 'Route planning request failed.');
                    }
                    setSuggestion(buildRouteSuggestion({
                        originStationId: currentOriginId,
                        destinationStationId,
                        demand,
                        verified: false,
                        options: [],
                    }));
                    return;
                }

                const json = await res.json();
                const apiRoutes = json.routes || [];

                // Check for API-level errors
                if (json.error && (json.error.includes('403') || json.error.includes('Invalid'))) {
                    setError(uiLocale.startsWith('zh')
                        ? '🔧 系統維護中：路線查詢服務暫時不可用，請稍後再試。'
                        : uiLocale === 'ja'
                            ? '🔧 システムメンテナンス中：ルート検索サービスは一時的に利用できません。'
                            : '🔧 Route search service temporarily unavailable.');
                    setSuggestion(buildRouteSuggestion({
                        originStationId: currentOriginId,
                        destinationStationId,
                        demand,
                        verified: false,
                        options: [],
                    }));
                    return;
                }

                setSuggestion({
                    title: uiLocale.startsWith('zh')
                        ? '路線建議（含票價/時刻）'
                        : uiLocale === 'ja'
                            ? '経路案内（運賃/時刻付き）'
                            : 'Route suggestions (with fare/timetable)',
                    options: apiRoutes.map((r: any): EnrichedRouteOption => ({
                        label: r.label,
                        steps: r.steps,
                        sources: r.sources || [{ type: 'odpt:Railway', verified: true }],
                        railways: r.railways,
                        transfers: Number(r.transfers ?? 0),
                        duration: typeof r.duration === 'number' ? r.duration : undefined,
                        fare: r.fare,
                        nextDeparture: r.nextDeparture
                    })),
                });

                if (apiRoutes.length === 0) {
                    setError(uiLocale.startsWith('zh')
                        ? '找不到簡單路徑（可能跨公司/跨 operator），請改用更精確的站點 ID 或稍後再試。'
                        : uiLocale === 'ja'
                            ? '簡易経路が見つかりません（事業者跨ぎの可能性）。より正確な駅IDで再試行してください。'
                            : 'No simple route found (may be cross-operator). Try a more specific station ID.');
                }
                return;
            }
        } catch (e: any) {
            setError(String(e?.message || e || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    const ask = async () => {
        await askWithText(question);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-24">
            <div className="bg-white px-4 py-4 shadow-sm border-b border-gray-100">
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                        <TopIconButton
                            icon={<Ticket size={16} />}
                            label={uiLocale.startsWith('zh') ? '票價' : uiLocale === 'ja' ? '運賃' : 'Fare'}
                            active={focusedKind === 'fare'}
                            onClick={() => {
                                setIsTemplatesOpen(true);
                                setFocusedKind('fare');
                                setTemplateCategory('basic');
                                const tpl = templates.find(t => t.category === 'basic' && t.kind === 'fare');
                                if (tpl) void applyTemplate(tpl, { send: autoSendTemplate });
                            }}
                        />
                        <TopIconButton
                            icon={<Clock size={16} />}
                            label={uiLocale.startsWith('zh') ? '時刻表' : uiLocale === 'ja' ? '時刻表' : 'Timetable'}
                            active={focusedKind === 'timetable'}
                            onClick={() => {
                                setIsTemplatesOpen(true);
                                setFocusedKind('timetable');
                                setTemplateCategory('basic');
                                const tpl = templates.find(t => t.category === 'basic' && t.kind === 'timetable');
                                if (tpl) void applyTemplate(tpl, { send: autoSendTemplate });
                            }}
                        />
                        <TopIconButton
                            icon={<Map size={16} />}
                            label={uiLocale.startsWith('zh') ? '路線' : uiLocale === 'ja' ? '経路' : 'Route'}
                            active={focusedKind === 'route'}
                            onClick={() => {
                                setIsTemplatesOpen(true);
                                setFocusedKind('route');
                                setTemplateCategory('basic');
                                const tpl = templates.find(t => t.category === 'basic' && t.kind === 'route');
                                if (tpl) void applyTemplate(tpl, { send: autoSendTemplate });
                            }}
                        />
                    </div>
                </div>

                {/* Travel Planning Assistant: Origin & Destination */}
                <div className="mt-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                        <MapPin size={12} className="inline mr-1" />
                        {uiLocale.startsWith('zh') ? '行程規劃助手' : uiLocale === 'ja' ? 'ルート案内' : 'Route Assistant'}
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50 z-10" />
                            <StationAutocomplete
                                value={originInput}
                                onChange={setOriginInput}
                                onSelect={(s) => {
                                    setSelectedOrigin(s);
                                    setOriginInput(s.name['zh-TW'] || s.name.ja || s.name.en || '');
                                }}
                                placeholder={uiLocale.startsWith('zh') ? '從哪裡出發？' : uiLocale === 'ja' ? 'どこから出発？' : 'Origin...'}
                                className="pl-8 bg-slate-50/50 border-slate-100 focus:bg-white transition-all"
                                locale={uiLocale}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-50 z-10" />
                            <StationAutocomplete
                                value={destinationInput}
                                onChange={setDestinationInput}
                                onSelect={(s) => {
                                    setSelectedDestination(s);
                                    setDestinationInput(s.name['zh-TW'] || s.name.ja || s.name.en || '');
                                    void quickRouteSearch(s);
                                }}
                                placeholder={uiLocale.startsWith('zh') ? '想去哪裡？' : uiLocale === 'ja' ? 'どこへ行く？' : 'Destination...'}
                                className="pl-8 bg-slate-50/50 border-slate-100 focus:bg-white transition-all"
                                locale={uiLocale}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {selectedDestination && (
                        <div className="mt-2 text-[11px] font-bold text-indigo-700 flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-indigo-400" />
                            {selectedDestination.name['zh-TW'] || selectedDestination.name.ja || selectedDestination.name.en} ({selectedDestination.operator})
                        </div>
                    )}

                    {/* NEW: Simplified 6-Demand Chips */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                            <span>{uiLocale.startsWith('zh') ? '我想...' : uiLocale === 'ja' ? 'わたしは...' : 'I want to...'}</span>
                            <span className="text-indigo-400">✨</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <SimplifiedDemandChip
                                icon="🛗"
                                label={uiLocale.startsWith('zh') ? '優化路線' : uiLocale === 'ja' ? '最適ルート' : 'Optimal Route'}
                                description={uiLocale.startsWith('zh') ? '少轉乘、有電梯' : uiLocale === 'ja' ? '乗り換えない、エレベーター' : 'Fewer transfers, elevator'}
                                active={selectedDemands.includes('optimalRoute')}
                                onClick={() => toggleSimplifiedDemand('optimalRoute')}
                            />
                            <SimplifiedDemandChip
                                icon="💰"
                                label={uiLocale.startsWith('zh') ? '省錢通行證' : uiLocale === 'ja' ? '賢く省钱' : 'Save Money'}
                                description={uiLocale.startsWith('zh') ? '找優惠票券' : uiLocale === 'ja' ? '得な切符' : 'Find passes'}
                                active={selectedDemands.includes('saveMoney')}
                                onClick={() => toggleSimplifiedDemand('saveMoney')}
                            />
                            <SimplifiedDemandChip
                                icon="🦽"
                                label={uiLocale.startsWith('zh') ? '無障礙' : uiLocale === 'ja' ? 'バリアフリー' : 'Accessible'}
                                description={uiLocale.startsWith('zh') ? '電梯/輪椅/推車' : uiLocale === 'ja' ? 'エレベーター/車椅子' : 'Elevator/wheelchair'}
                                active={selectedDemands.includes('accessibility')}
                                onClick={() => toggleSimplifiedDemand('accessibility')}
                            />
                            <SimplifiedDemandChip
                                icon="💡"
                                label={uiLocale.startsWith('zh') ? '專家建議' : uiLocale === 'ja' ? 'プロの技' : 'Pro Tips'}
                                description={uiLocale.startsWith('zh') ? '內行人才知道' : uiLocale === 'ja' ? '地元のコツ' : 'Local secrets'}
                                active={selectedDemands.includes('expertTips')}
                                onClick={() => toggleSimplifiedDemand('expertTips')}
                            />
                            <SimplifiedDemandChip
                                icon="🚶"
                                label={uiLocale.startsWith('zh') ? '避開人潮' : uiLocale === 'ja' ? '空いている' : 'Avoid Crowds'}
                                description={uiLocale.startsWith('zh') ? '避開尖峰時段' : uiLocale === 'ja' ? 'ラッシュ回避' : 'Skip rush hour'}
                                active={selectedDemands.includes('avoidCrowds')}
                                onClick={() => toggleSimplifiedDemand('avoidCrowds')}
                            />
                            <SimplifiedDemandChip
                                icon="⚡"
                                label={uiLocale.startsWith('zh') ? '快速通關' : uiLocale === 'ja' ? '最速' : 'Fast Track'}
                                description={uiLocale.startsWith('zh') ? '趕時間選這個' : uiLocale === 'ja' ? '急いでいる' : 'In a hurry'}
                                active={selectedDemands.includes('fastTrack')}
                                onClick={() => toggleSimplifiedDemand('fastTrack')}
                            />
                        </div>
                    </div>
                </div>

                {/* NEW: Improved Search Input with Guided Placeholder */}
                <div className="flex items-center gap-2 mt-3">
                    <div className="relative flex-1">
                        <input
                            ref={inputRef}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => {
                                if ((e.nativeEvent as any)?.isComposing) return;
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    ask();
                                }
                            }}
                            placeholder={uiLocale.startsWith('zh')
                                ? '例如：「我想從東京車站去淺草，偏好電車且攜帶大件行李」'
                                : uiLocale === 'ja'
                                    ? '例：「東京駅から浅草まで、電車が好きで大きな荷物を持っています」'
                                    : 'e.g., "I want to go from Tokyo Station to Asakusa with large luggage"'}
                            className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-50 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none placeholder:text-slate-400"
                            disabled={isLoading}
                        />
                        <button
                            onClick={ask}
                            disabled={isLoading || !String(question || '').trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center disabled:opacity-50"
                            aria-label="send"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        </button>
                    </div>
                </div>

                {/* Quick suggestion chips */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                    <QuickSuggestionChip
                        text={uiLocale.startsWith('zh') ? '怎麼去淺草' : uiLocale === 'ja' ? '浅草まで' : 'to Asakusa'}
                        onClick={() => setQuestion(uiLocale.startsWith('zh') ? '怎麼去淺草' : uiLocale === 'ja' ? '浅草まで' : 'How to get to Asakusa')}
                    />
                    <QuickSuggestionChip
                        text={uiLocale.startsWith('zh') ? '多少錢到新宿' : uiLocale === 'ja' ? '新宿まで多少钱' : 'fare to Shinjuku'}
                        onClick={() => setQuestion(uiLocale.startsWith('zh') ? '多少錢到新宿' : uiLocale === 'ja' ? '新宿までの運賃' : 'How much to Shinjuku')}
                    />
                    <QuickSuggestionChip
                        text={uiLocale.startsWith('zh') ? '下一班電車' : uiLocale === 'ja' ? '次の電車' : 'next train'}
                        onClick={() => setQuestion(uiLocale.startsWith('zh') ? '下一班電車' : uiLocale === 'ja' ? '次の電車' : 'When is the next train')}
                    />
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                        onClick={() => setIsTemplatesOpen(v => !v)}
                        className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1"
                    >
                        <span>{uiLocale.startsWith('zh') ? '預設問題模板' : uiLocale === 'ja' ? '質問テンプレート' : 'Templates'}</span>
                        {isTemplatesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    <button
                        onClick={() => setAutoSendTemplate(v => !v)}
                        className={`px-3 py-1.5 rounded-full text-xs font-black border ${autoSendTemplate ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}
                    >
                        {uiLocale.startsWith('zh') ? '點模板自動送出' : uiLocale === 'ja' ? 'テンプレ即送信' : 'Auto-send'}
                    </button>
                </div>

                {isTemplatesOpen && (
                    <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-3">
                        {!isOdptStationId && (
                            <div className="text-sm font-bold text-slate-500">
                                {uiLocale.startsWith('zh')
                                    ? '此站點不是 ODPT 站點 ID，模板僅供示意。'
                                    : uiLocale === 'ja'
                                        ? 'この駅は ODPT 駅ID ではないため、テンプレは例示のみです。'
                                        : 'This station is not an ODPT station ID; templates are for demonstration.'}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            <Pill active={focusedKind === 'all'} onClick={() => setFocusedKind('all')} label={uiLocale.startsWith('zh') ? '全部' : uiLocale === 'ja' ? '全部' : 'All'} />
                            <Pill active={focusedKind === 'fare'} onClick={() => setFocusedKind('fare')} label={uiLocale.startsWith('zh') ? '票價' : uiLocale === 'ja' ? '運賃' : 'Fare'} />
                            <Pill active={focusedKind === 'timetable'} onClick={() => setFocusedKind('timetable')} label={uiLocale.startsWith('zh') ? '時刻表' : uiLocale === 'ja' ? '時刻表' : 'Timetable'} />
                            <Pill active={focusedKind === 'route'} onClick={() => setFocusedKind('route')} label={uiLocale.startsWith('zh') ? '路線' : uiLocale === 'ja' ? '経路' : 'Route'} />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <Pill active={templateCategory === 'basic'} onClick={() => setTemplateCategory('basic')} label={uiLocale.startsWith('zh') ? '基礎操作' : uiLocale === 'ja' ? '基本' : 'Basic'} />
                            <Pill active={templateCategory === 'advanced'} onClick={() => setTemplateCategory('advanced')} label={uiLocale.startsWith('zh') ? '進階功能' : uiLocale === 'ja' ? '応用' : 'Advanced'} />
                            <Pill active={templateCategory === 'feature'} onClick={() => setTemplateCategory('feature')} label={uiLocale.startsWith('zh') ? '系統特色' : uiLocale === 'ja' ? '特徴' : 'Features'} />
                        </div>

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {visibleTemplates.map((tpl) => (
                                <button
                                    key={tpl.id}
                                    onClick={() => void applyTemplate(tpl, { send: autoSendTemplate })}
                                    className="text-left rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors p-3"
                                >
                                    <div className="text-xs font-black text-slate-900 break-words">{tpl.title}</div>
                                    <div className="mt-1 text-[11px] font-bold text-slate-600 break-words line-clamp-2">{tpl.text}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setIsDemandOpen(v => !v)}
                    className="mt-3 w-full flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-50 p-3 rounded-2xl border border-slate-100"
                >
                    <div className="flex items-center gap-2">
                        <Settings size={14} />
                        <span>{uiLocale.startsWith('zh') ? '告訴 ルタグ 你的狀態' : uiLocale === 'ja' ? 'ルタグに状態を教える' : 'Tell Lutagu your state'}</span>
                    </div>
                    <span className="flex items-center gap-1 text-slate-400">
                        {isDemandOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                </button>

                {isDemandOpen && (
                    <div className="mt-3 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Accessibility */}
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Accessibility size={12} />
                                {uiLocale.startsWith('zh') ? '無障礙需求' : uiLocale === 'ja' ? 'バリアフリー' : 'Accessibility'}
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                <StateButton label="🦽" sub={uiLocale.startsWith('zh') ? '輪椅' : 'Wheel'} active={demand.wheelchair} onClick={() => toggleDemand('wheelchair')} />
                                <StateButton label="👶" sub={uiLocale.startsWith('zh') ? '嬰兒車' : 'Strol'} active={demand.stroller} onClick={() => toggleDemand('stroller')} />
                                <StateButton label="🦯" sub={uiLocale.startsWith('zh') ? '視障' : 'Vision'} active={demand.vision} onClick={() => toggleDemand('vision')} />
                                <StateButton label="👴" sub={uiLocale.startsWith('zh') ? '長者' : 'Senior'} active={demand.senior} onClick={() => toggleDemand('senior')} />
                            </div>
                        </div>

                        {/* Luggage */}
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Briefcase size={12} />
                                {uiLocale.startsWith('zh') ? '行李狀態' : uiLocale === 'ja' ? '手荷物' : 'Luggage'}
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                <StateButton label="🧳" sub={uiLocale.startsWith('zh') ? '大行李' : 'Large'} active={demand.largeLuggage} onClick={() => toggleDemand('largeLuggage')} />
                                <StateButton label="🎒" sub={uiLocale.startsWith('zh') ? '輕裝' : 'Light'} active={demand.lightLuggage} onClick={() => toggleDemand('lightLuggage')} />
                            </div>
                        </div>

                        {/* Preferences */}
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Sparkles size={12} />
                                {uiLocale.startsWith('zh') ? '行程偏好' : uiLocale === 'ja' ? 'こだわり' : 'Preferences'}
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                <StateButton label="⏰" sub={uiLocale.startsWith('zh') ? '趕時間' : 'Rush'} active={demand.rushing} onClick={() => toggleDemand('rushing')} />
                                <StateButton label="💰" sub={uiLocale.startsWith('zh') ? '省錢' : 'Save'} active={demand.budget} onClick={() => toggleDemand('budget')} />
                                <StateButton label="😌" sub={uiLocale.startsWith('zh') ? '舒適' : 'Comfy'} active={demand.comfort} onClick={() => toggleDemand('comfort')} />
                                <StateButton label="🚶" sub={uiLocale.startsWith('zh') ? '避人潮' : 'Crowd'} active={demand.avoidCrowds} onClick={() => toggleDemand('avoidCrowds')} />
                                <StateButton label="🌧️" sub={uiLocale.startsWith('zh') ? '避雨' : 'Rain'} active={demand.avoidRain} onClick={() => toggleDemand('avoidRain')} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 px-4 py-4 space-y-4">
                {error && (
                    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-rose-700 text-sm font-bold flex items-start gap-2">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                        <div className="min-w-0 break-words">{error}</div>
                    </div>
                )}

                {activeKind && activeKind !== 'unknown' && activeKind !== 'route' && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {uiLocale.startsWith('zh') ? '數據來源詳情' : uiLocale === 'ja' ? 'データソース詳細' : 'Data Source Details'}
                        </div>

                        {activeKind === 'fare' && (
                            <FareModule
                                stationId={stationId}
                                fares={fareData}
                                destinationId={extractOdptStationIds(question).map(normalizeOdptStationId).find(id => id !== stationId)}
                            />
                        )}

                        {activeKind === 'timetable' && (
                            <TimetableModule stationId={stationId} timetables={timetableData} />
                        )}
                    </div>
                )}

                {activeDemo && (
                    <div className="mt-4 p-4 rounded-3xl bg-indigo-50 border border-indigo-100 shadow-sm animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-indigo-600" size={18} />
                                <span className="text-sm font-black text-indigo-900">{activeDemo.title}</span>
                            </div>
                            <button
                                onClick={() => {
                                    setActiveDemo(null);
                                    setDemoStepIndex(0);
                                }}
                                className="p-1 hover:bg-indigo-100 rounded-full text-indigo-400"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {activeDemo.steps.slice(0, demoStepIndex + 1).map((step, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-end">
                                        <div className="max-w-[85%] px-4 py-2 rounded-2xl bg-indigo-600 text-white text-sm font-bold shadow-sm">
                                            {step.user}
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="max-w-[90%] px-4 py-3 rounded-2xl bg-white text-slate-700 text-sm font-bold shadow-sm border border-indigo-100">
                                            <div className="whitespace-pre-wrap">{step.agent}</div>

                                            {step.tools && (
                                                <div className="mt-3 flex flex-wrap gap-1">
                                                    {step.tools.map(t => (
                                                        <span key={t} className="px-2 py-0.5 rounded-full bg-indigo-50 text-[10px] font-black text-indigo-600 border border-indigo-100">
                                                            🛠️ {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {step.links && (
                                                <div className="mt-3 space-y-2">
                                                    {step.links.map(link => (
                                                        <a
                                                            key={link.url}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black transition-colors"
                                                        >
                                                            <BookOpen size={14} />
                                                            {link.label}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}

                                            {step.action && (
                                                <div className="mt-3 text-[11px] font-black text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                                                    <Sparkles size={12} />
                                                    系統執行：{step.action}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {demoStepIndex < activeDemo.steps.length - 1 && (
                            <button
                                onClick={() => setDemoStepIndex(idx => idx + 1)}
                                className="mt-4 w-full py-3 rounded-2xl bg-white border-2 border-indigo-600 text-indigo-600 text-sm font-black hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                點擊模擬使用者後續提問 <ChevronRight size={16} />
                            </button>
                        )}

                        {demoStepIndex === activeDemo.steps.length - 1 && (
                            <div className="mt-4 text-center text-[11px] font-black text-slate-400">
                                —— 演示流程結束 ——
                            </div>
                        )}
                    </div>
                )}

                {suggestion && activeKind === 'route' ? (
                    <div className="space-y-3">
                        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Lutagu {uiLocale.startsWith('zh') ? '路線' : uiLocale === 'ja' ? '経路' : 'Routes'}
                            </div>
                            <div className="mt-1 text-base font-black text-slate-900 break-words">{suggestion.title}</div>
                        </div>

                        <div className="space-y-3">
                            {suggestion.options.map((opt, idx) => (
                                <RouteResultCard
                                    key={`${opt.label}-${idx}`}
                                    option={{
                                        ...(opt as any),
                                        transfers: Number((opt as any).transfers ?? 0)
                                    }}
                                    rank={idx}
                                    locale={uiLocale}
                                />
                            ))}
                        </div>
                    </div>
                ) : suggestion ? (
                    <SuggestionModule suggestion={suggestion} demand={demand} locale={uiLocale} />
                ) : null}

                {/* EmptyState removed - template button already exists above */}
            </div>
        </div>
    );
}

// --- Sub Components ---

function StateButton({ label, sub, active, onClick }: { label: string; sub: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${active
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30'
                }`}
        >
            <span className="text-xl mb-0.5">{label}</span>
            <span className={`text-[9px] font-black uppercase tracking-tighter ${active ? 'text-indigo-100' : 'text-slate-400'}`}>{sub}</span>
        </button>
    );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${active
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
        >
            {label}
        </button>
    );
}

function TopIconButton(params: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
    const { icon, label, active, onClick } = params;
    return (
        <button
            onClick={onClick}
            className={`px-3 py-2 rounded-2xl border text-xs font-black flex items-center gap-2 transition-colors ${active
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50'
                }`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}

function Pill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-xs font-black border transition-colors ${active
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
        >
            {label}
        </button>
    );
}

function DemandToggle({ icon, active, onClick, label }: { icon: string; active: boolean; onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            title={label}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${active
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
        >
            <span className="text-sm">{icon}</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
        </button>
    );
}

// NEW: Simplified 6-Demand Chip Component
function SimplifiedDemandChip({ icon, label, description, active, onClick }: {
    icon: string;
    label: string;
    description: string;
    active: boolean;
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={`relative p-3 rounded-xl border text-left transition-all duration-200 ${active
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]'
                : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                }`}
        >
            <div className="flex items-start gap-2">
                <span className="text-xl">{icon}</span>
                <div className="flex-1 min-w-0">
                    <div className={`text-xs font-black tracking-tight ${active ? 'text-white' : 'text-slate-800'
                        }`}>
                        {label}
                    </div>
                    <div className={`text-[10px] font-bold mt-0.5 ${active ? 'text-indigo-100' : 'text-slate-400'
                        }`}>
                        {description}
                    </div>
                </div>
                {active && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
        </button>
    );
}

// NEW: Quick Suggestion Chip Component
function QuickSuggestionChip({ text, onClick }: { text: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 text-[10px] font-bold text-slate-600 hover:text-indigo-600 transition-colors border border-slate-200 hover:border-indigo-200"
        >
            + {text}
        </button>
    );
}

function EmptyState(params: { locale: SupportedLocale; stationId: string; onOpenTemplates: () => void }) {
    const { locale, onOpenTemplates } = params;
    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-5">
            <div className="text-sm font-bold text-slate-600 leading-relaxed">
                {locale.startsWith('zh')
                    ? '輸入問題或選擇模板來查詢票價、時刻表或路線規劃。'
                    : locale === 'ja'
                        ? 'を入力するか、テンプレートを選択してください。'
                        : 'Enter a question or select a template to query fares, timetables, or routes.'}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    onClick={onOpenTemplates}
                    className="px-4 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-black"
                >
                    {locale.startsWith('zh') ? '開啟模板' : locale === 'ja' ? 'テンプレートを開く' : 'Open templates'}
                </button>
            </div>
        </div>
    );
}

function FareModule({ stationId, fares, destinationId }: { stationId: string; fares: OdptRailwayFare[] | null; destinationId?: string }) {
    const rows = (fares || []).filter(f => {
        if (!destinationId) return true;
        return normalizeOdptStationId(String(f['odpt:toStation'] || '')) === normalizeOdptStationId(destinationId);
    });

    return (
        <div className="mt-3">
            <div className="text-sm font-black text-slate-900">{`from: ${stationId.split('.').pop() || stationId}`}</div>
            <div className="mt-2 overflow-x-auto rounded-xl border border-slate-100">
                <table className="min-w-[520px] w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="text-left p-3 text-xs font-black text-slate-500">to</th>
                            <th className="text-left p-3 text-xs font-black text-slate-500">IC</th>
                            <th className="text-left p-3 text-xs font-black text-slate-500">Ticket</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.slice(0, 40).map((f) => (
                            <tr key={f['@id']} className="border-t border-slate-100">
                                <td className="p-3 font-bold text-slate-700 break-words">{String(f['odpt:toStation'] || '').split('.').pop()}</td>
                                <td className="p-3 font-bold text-slate-700">¥{f['odpt:icCardFare']}</td>
                                <td className="p-3 font-bold text-slate-700">¥{f['odpt:ticketFare']}</td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-4 text-center text-slate-400 text-sm font-bold">No fares.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function TimetableModule({ stationId, timetables }: { stationId: string; timetables: OdptStationTimetable[] | null }) {
    // FIX: Use JST (Tokyo Time) for current time comparison, not user's local browser time.
    const now = new Date();
    const jstNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
    const nowHHMM = `${String(jstNow.getHours()).padStart(2, '0')}:${String(jstNow.getMinutes()).padStart(2, '0')}`;
    const items = (timetables || []);
    const directions = Array.from(new Set(items.map(t => t['odpt:railDirection']).filter(Boolean)));

    const pickNext = (table: OdptStationTimetable) => {
        const objs = (table['odpt:stationTimetableObject'] || []).map(o => String(o['odpt:departureTime'] || '')).filter(Boolean);
        const later = objs.filter(t => t >= nowHHMM);
        const base = later.length > 0 ? later : objs;
        return base.slice(0, 6);
    };

    return (
        <div className="mt-3 space-y-4">
            <div className="text-sm font-black text-slate-900">{`station: ${stationId.split('.').pop() || stationId}`}</div>
            {directions.length === 0 && (
                <div className="text-slate-400 text-sm font-bold">No timetable data.</div>
            )}
            {directions.map((dir) => {
                const tables = items.filter(t => t['odpt:railDirection'] === dir);
                const sorted = tables.slice().sort((a, b) => String(a['odpt:calendar'] || '').localeCompare(String(b['odpt:calendar'] || '')));
                return (
                    <div key={dir} className="rounded-xl border border-slate-100 overflow-hidden">
                        <div className="px-4 py-3 bg-slate-50 text-xs font-black text-slate-600 break-words">
                            {`To ${String(dir).split('.').pop()}`}
                        </div>
                        <div className="p-4 space-y-3">
                            {sorted.map((table) => {
                                const calendar = String(table['odpt:calendar'] || '').split(':').pop();
                                const next = pickNext(table);
                                return (
                                    <div key={table['@id']} className="rounded-xl border border-slate-100 p-3">
                                        <div className="text-xs font-black text-indigo-700">{calendar || 'Calendar'}</div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {next.map((t) => (
                                                <span key={t} className="px-2 py-1 rounded-lg bg-slate-50 text-slate-700 text-xs font-black">{t}</span>
                                            ))}
                                            {next.length === 0 && (
                                                <span className="text-slate-400 text-xs font-bold">No trips.</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function SuggestionModule({ suggestion, demand, locale }: { suggestion: L4Suggestion; demand: L4DemandState; locale: SupportedLocale }) {
    const hasDemand = Object.values(demand).some(v => v);

    // Separate content into categories
    const allSteps = suggestion.options.flatMap(opt => opt.steps);
    const expertTips = allSteps.filter(s =>
        s.includes('💡') || s.includes('⚠️') || s.includes('🎍') || s.includes('🛗')
    );
    const passKnowledge = allSteps.filter(s =>
        s.includes('Tokyo Subway Ticket') || s.includes('JR 都區內') ||
        s.includes('Greater Tokyo Pass') || s.includes('🎫')
    );

    // Get origin and destination from first option
    const firstOption = suggestion.options[0];
    const originStep = allSteps.find(s => s.includes('from:') || s.includes('出發') || s.includes('出発'));
    const destStep = allSteps.find(s => s.includes('to:') || s.includes('終點') || s.includes('到着'));

    return (
        <div className="space-y-4">
            {/* Expert Tips Card - Amber */}
            {expertTips.length > 0 && (
                <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-200">
                            <span className="text-xl">💡</span>
                        </div>
                        <div>
                            <div className="text-sm font-black text-amber-800">
                                {locale.startsWith('zh') ? '專家建議' : locale === 'ja' ? 'プロのアドバイス' : 'Pro Tips'}
                            </div>
                            <div className="text-[11px] font-bold text-amber-600">
                                {locale.startsWith('zh') ? '內行人才知道的重要資訊' : locale === 'ja' ? '地元民だけが知る重要情報' : 'Insider knowledge'}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {expertTips.map((tip, idx) => (
                            <div key={idx} className="flex items-start gap-2 bg-white/60 rounded-xl p-3 hover:bg-white transition-colors">
                                <span className="text-amber-500 mt-0.5">●</span>
                                <span className="text-sm font-bold text-slate-700 leading-relaxed">{tip.replace(/^[\s\S]*?[：:]/, '')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pass Knowledge Card - Emerald */}
            {passKnowledge.length > 0 && (
                <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                            <span className="text-xl">🎫</span>
                        </div>
                        <div>
                            <div className="text-sm font-black text-emerald-800">
                                {locale.startsWith('zh') ? '省錢通行證' : locale === 'ja' ? 'お得な切符' : 'Save Money'}
                            </div>
                            <div className="text-[11px] font-bold text-emerald-600">
                                {locale.startsWith('zh') ? '聰明搭車省更多' : locale === 'ja' ? '賢く利用して節約' : 'Smart savings'}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {passKnowledge.map((pass, idx) => {
                            const nameMatch = pass.match(/🎫\s*([^\(]+)/);
                            const priceMatch = pass.match(/\((¥[\d,]+)/);
                            const adviceMatch = pass.match(/-\s*(.+)/);

                            return (
                                <div key={idx} className="bg-white/80 rounded-xl p-3 border border-emerald-100 hover:border-emerald-300 transition-colors">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-black text-slate-800 flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
                                                {idx + 1}
                                            </span>
                                            {nameMatch ? nameMatch[1].trim() : pass}
                                        </span>
                                        {priceMatch && (
                                            <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                                                {priceMatch[1]}
                                            </span>
                                        )}
                                    </div>
                                    {adviceMatch && (
                                        <div className="mt-1.5 ml-8 text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                            <span className="text-emerald-400">✓</span>
                                            {adviceMatch[1].trim()}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Main Route Card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                {/* Route Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                <MapPin size={16} className="text-white" />
                            </div>
                            <span className="text-sm font-black text-white">
                                {locale.startsWith('zh') ? '路線規劃' : locale === 'ja' ? 'ルート案内' : 'Route Plan'}
                            </span>
                        </div>
                        {hasDemand && (
                            <div className="flex gap-1">
                                {demand.wheelchair && <span title="Wheelchair" className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">🦽</span>}
                                {demand.stroller && <span title="Stroller" className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">👶</span>}
                                {demand.vision && <span title="Vision" className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">🦯</span>}
                                {demand.senior && <span title="Senior" className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">👴</span>}
                                {demand.largeLuggage && <span title="Large Luggage" className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">🧳</span>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Route Options */}
                <div className="p-4 space-y-4">
                    {suggestion.options.map((opt, idx) => (
                        <div
                            key={`${opt.label}-${idx}`}
                            className={`rounded-xl border-2 transition-all duration-200 ${idx === 0
                                ? 'border-indigo-200 bg-indigo-50/50'
                                : 'border-slate-100 hover:border-indigo-100 hover:bg-slate-50'
                                }`}
                        >
                            {/* Option Header */}
                            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 ${
                                idx === 0 ? 'bg-indigo-100/50' : 'bg-slate-50'
                            }">
                                <div className="flex items-center gap-2">
                                    {idx === 0 && (
                                        <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-black">
                                            {locale.startsWith('zh') ? '推薦' : locale === 'ja' ? 'おすすめ' : 'Best'}
                                        </span>
                                    )}
                                    <span className="text-sm font-black text-slate-700">{opt.label}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    {opt.duration && (
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {Math.floor(opt.duration / 60)}min
                                        </span>
                                    )}
                                    {(opt.transfers ?? 0) > 0 && (
                                        <span className="flex items-center gap-1">
                                            <Map size={12} />
                                            {opt.transfers} {locale.startsWith('zh') ? '次換乘' : locale === 'ja' ? '回乗り換え' : 'transfers'}
                                        </span>
                                    )}
                                    {typeof opt.fare === 'number' && (
                                        <span className="text-emerald-600">
                                            ¥{opt.fare}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Route Steps */}
                            <div className="p-3 space-y-2">
                                {opt.steps.filter(s => !s.includes('💡') && !s.includes('🎫') && !s.includes('Tokyo Subway Ticket') && !s.includes('JR 都區內')).map((s, i) => {
                                    const isOrigin = s.includes('🏠') || s.includes('出發') || s.includes('出発') || s.includes('from:');
                                    const isDest = s.includes('終點') || s.includes('到着') || s.includes('to:');
                                    const isTransfer = s.includes('換乘') || s.includes('乗り換え') || s.includes('→');
                                    const isPrice = s.includes('💰') || s.includes('¥');
                                    const isTime = s.includes('🚃') || s.includes('時刻') || s.includes('班');

                                    let stepClass = "text-sm font-bold text-slate-700 leading-relaxed";
                                    let icon = null;

                                    if (isOrigin) {
                                        stepClass = "text-sm font-black text-blue-600";
                                        icon = <MapPin size={14} className="text-blue-500 shrink-0 mt-0.5" />;
                                    } else if (isDest) {
                                        stepClass = "text-sm font-black text-emerald-600";
                                        icon = <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />;
                                    } else if (isTransfer) {
                                        stepClass = "text-sm font-bold text-amber-600";
                                        icon = <Map size={14} className="text-amber-500 shrink-0 mt-0.5" />;
                                    } else if (isPrice) {
                                        stepClass = "text-sm font-bold text-emerald-600";
                                    } else if (isTime) {
                                        stepClass = "text-sm font-bold text-amber-600";
                                    }

                                    const stepText = s.replace(/^[\s\S]*?[：:]/, '').trim();

                                    return (
                                        <div key={i} className={`flex items-start gap-2 rounded-lg p-2 hover:bg-slate-100 transition-colors ${isOrigin ? 'bg-blue-50' : isDest ? 'bg-emerald-50' : isTransfer ? 'bg-amber-50' : ''
                                            }`}>
                                            {icon && <div className="shrink-0">{icon}</div>}
                                            <span className={stepClass}>{stepText}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Sources */}
                            <div className="px-3 pb-3 flex flex-wrap gap-1.5">
                                {opt.sources.map((src, i) => (
                                    <span
                                        key={`${src.type}-${i}`}
                                        className={`px-2 py-0.5 rounded-md text-[9px] font-black border flex items-center gap-1 ${src.verified
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}
                                    >
                                        {src.verified ? '✓' : '!'} {src.type.split(':').pop()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Personalization Note */}
                {hasDemand && (
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                            <Sparkles size={12} />
                            {locale.startsWith('zh') ? '個人化調整' : locale === 'ja' ? 'パーソナライズ' : 'Personalization'}
                        </div>
                        <div className="text-[11px] font-bold text-slate-500 leading-normal">
                            {locale.startsWith('zh')
                                ? '已根據您的無障礙需求、行李狀態和行程偏好，優化路線建議。'
                                : locale === 'ja'
                                    ? 'バリアフリー、手荷物、こだわり条件に基づいて経路を提案しています。'
                                    : 'Route optimized based on your accessibility needs, luggage, and preferences.'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
