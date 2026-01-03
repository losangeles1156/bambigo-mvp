'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Accessibility, AlertTriangle, BookOpen, Briefcase, ChevronDown, ChevronRight, Clock, HelpCircle, Loader2, Map, MapPin, Send, Settings, Sparkles, Ticket, X } from 'lucide-react';
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

    const [question, setQuestion] = useState('');
    const [activeKind, setActiveKind] = useState<L4IntentKind | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeDemo, setActiveDemo] = useState<DemoScenario | null>(null);
    const [demoStepIndex, setDemoStepIndex] = useState(0);
    const [error, setError] = useState<string>('');

    const [focusedKind, setFocusedKind] = useState<Exclude<L4IntentKind, 'unknown'> | 'all'>('all');
    const [templateCategory, setTemplateCategory] = useState<L4TemplateCategory>('basic');
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
    const [overlay, setOverlay] = useState<'none' | 'quickstart' | 'faq'>('none');
    const [autoSendTemplate, setAutoSendTemplate] = useState(false);

    const [guideSessionId, setGuideSessionId] = useState<string>('');
    const [guideRated, setGuideRated] = useState(false);

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
        setTemplateCategory('basic');
        setOverlay('none');
        setDestinationInput('');
        setSelectedDestination(null);
    }, [stationId]);

    useEffect(() => {
        try {
            const existing = window.localStorage.getItem('l4_guide_session_id');
            const sid = existing || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
            if (!existing) window.localStorage.setItem('l4_guide_session_id', sid);
            setGuideSessionId(sid);
            setGuideRated(window.localStorage.getItem('l4_guide_rated') === '1');
        } catch {
            setGuideSessionId('');
        }
    }, []);

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

    const postGuideFeedback = async (score: 1 | -1) => {
        if (guideRated) return;
        try {
            await fetch('/api/agent/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    score,
                    reason: 'l4_quickstart',
                    details: {
                        locale: uiLocale,
                        stationId,
                        focusedKind,
                        templateCategory,
                        autoSendTemplate
                    },
                    messageId: 'l4_quickstart_v1',
                    sessionId: guideSessionId || null
                })
            });
            try {
                window.localStorage.setItem('l4_guide_rated', '1');
            } catch {
            }
            setGuideRated(true);
        } catch {
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
                setError(data.error || 'Route search failed');
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
                    setSuggestion(buildFareSuggestion({
                        originStationId: currentOriginId,
                        destinationStationId: toStationId,
                        demand,
                        verified: false,
                    }));
                    setError(detail || 'Fare request failed.');
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
                    setSuggestion(buildTimetableSuggestion({ stationId: currentOriginId, demand, verified: false }));
                    setError(detail || 'Timetable request failed.');
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
                    setSuggestion(buildRouteSuggestion({
                        originStationId: currentOriginId,
                        destinationStationId,
                        demand,
                        verified: false,
                        options: [],
                    }));
                    setError(detail || 'Route planning request failed.');
                    return;
                }

                const json = await res.json();
                const apiRoutes = json.routes || [];

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

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setOverlay('quickstart')}
                            className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-black flex items-center gap-2"
                        >
                            <BookOpen size={14} />
                            {uiLocale.startsWith('zh') ? '快速入門' : uiLocale === 'ja' ? 'クイック' : 'Quick start'}
                        </button>
                        <button
                            onClick={() => setOverlay('faq')}
                            className="px-3 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-100 text-xs font-black flex items-center gap-2"
                        >
                            <HelpCircle size={14} />
                            {uiLocale.startsWith('zh') ? '常見問題' : uiLocale === 'ja' ? 'FAQ' : 'FAQ'}
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2 text-[11px] font-bold text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="uppercase tracking-widest text-slate-400">
                        {uiLocale.startsWith('zh') ? '操作流程' : uiLocale === 'ja' ? '手順' : 'Flow'}
                    </span>
                    <span className={`${focusedKind !== 'all' ? 'text-slate-800' : 'text-slate-500'}`}>1) {uiLocale.startsWith('zh') ? '選模組' : uiLocale === 'ja' ? '機能選択' : 'Pick module'}</span>
                    <span className={`${isTemplatesOpen ? 'text-slate-800' : 'text-slate-500'}`}>2) {uiLocale.startsWith('zh') ? '選模板' : uiLocale === 'ja' ? 'テンプレ' : 'Template'}</span>
                    <span className={`${String(question || '').trim() ? 'text-slate-800' : 'text-slate-500'}`}>3) {uiLocale.startsWith('zh') ? '送出查詢' : uiLocale === 'ja' ? '送信' : 'Send'}</span>
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
                                    setOriginInput(s.name.ja || s.name.en || '');
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
                                    setDestinationInput(s.name.ja || s.name.en || '');
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
                            {selectedDestination.name.ja || selectedDestination.name.en} ({selectedDestination.operator})
                        </div>
                    )}

                    {/* Demand State Toggles */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                            <span>{uiLocale.startsWith('zh') ? '個人化需求' : uiLocale === 'ja' ? 'こだわり設定' : 'Personalization'}</span>
                            <span className="text-slate-300">Beta</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <DemandToggle 
                                icon="🦽" 
                                active={demand.wheelchair} 
                                onClick={() => setDemand(d => ({ ...d, wheelchair: !d.wheelchair }))} 
                                label={uiLocale.startsWith('zh') ? '輪椅' : uiLocale === 'ja' ? '車椅子' : 'Wheelchair'}
                            />
                            <DemandToggle 
                                icon="👶" 
                                active={demand.stroller} 
                                onClick={() => setDemand(d => ({ ...d, stroller: !d.stroller }))} 
                                label={uiLocale.startsWith('zh') ? '推車' : uiLocale === 'ja' ? 'ベビーカー' : 'Stroller'}
                            />
                            <DemandToggle 
                                icon="🧳" 
                                active={demand.largeLuggage} 
                                onClick={() => setDemand(d => ({ ...d, largeLuggage: !d.largeLuggage }))} 
                                label={uiLocale.startsWith('zh') ? '特大行李' : uiLocale === 'ja' ? '大型荷物' : 'Large Luggage'}
                            />
                            <DemandToggle 
                                icon="🏃" 
                                active={demand.rushing} 
                                onClick={() => setDemand(d => ({ ...d, rushing: !d.rushing }))} 
                                label={uiLocale.startsWith('zh') ? '趕時間' : uiLocale === 'ja' ? '急いでいる' : 'Rushing'}
                            />
                            <DemandToggle 
                                icon="💰" 
                                active={demand.budget} 
                                onClick={() => setDemand(d => ({ ...d, budget: !d.budget }))} 
                                label={uiLocale.startsWith('zh') ? '省錢優先' : uiLocale === 'ja' ? '安さ優先' : 'Budget'}
                            />
                        </div>
                    </div>
                </div>

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
                            placeholder={uiLocale.startsWith('zh') ? '輸入問題：票價／時刻表／怎麼去 odpt.Station:...' : uiLocale === 'ja' ? '質問：運賃／時刻表／odpt.Station:... まで' : 'Ask: fare / timetable / how to get to odpt.Station:...'}
                            className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-50 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none"
                            disabled={isLoading}
                        />
                        <button
                            onClick={ask}
                            disabled={isLoading || !String(question || '').trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center disabled:opacity-50"
                            aria-label="send"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                    </div>
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

                {!activeKind && !isLoading && !error && (
                    <EmptyState
                        locale={uiLocale}
                        stationId={stationId}
                        onOpenTemplates={() => setIsTemplatesOpen(true)}
                        onQuickStart={() => setOverlay('quickstart')}
                    />
                )}
            </div>

            {overlay !== 'none' && (
                <Overlay
                    title={overlay === 'quickstart'
                        ? (uiLocale.startsWith('zh') ? '快速入門' : uiLocale === 'ja' ? 'クイックスタート' : 'Quick start')
                        : (uiLocale.startsWith('zh') ? '常見問題' : uiLocale === 'ja' ? 'FAQ' : 'FAQ')}
                    onClose={() => setOverlay('none')}
                >
                    {overlay === 'quickstart' ? (
                        <QuickStart
                            locale={uiLocale}
                            stationId={stationId}
                            templates={templates}
                            onApply={(tpl) => void applyTemplate(tpl, { send: true })}
                            onFeedback={postGuideFeedback}
                            feedbackLocked={guideRated}
                        />
                    ) : (
                        <FaqPanel
                            locale={uiLocale}
                            stationId={stationId}
                            templates={templates}
                            onApply={(tpl) => void applyTemplate(tpl, { send: false })}
                        />
                    )}
                </Overlay>
            )}
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
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${
                active 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
            }`}
        >
            <span className="text-sm">{icon}</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
        </button>
    );
}

function Overlay({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 p-3">
            <div className="w-full sm:max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="text-sm font-black text-slate-900">{title}</div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50"
                        aria-label="close"
                    >
                        <X size={16} />
                    </button>
                </div>
                <div className="max-h-[75vh] overflow-y-auto p-5">
                    {children}
                </div>
            </div>
        </div>
    );
}

function EmptyState(params: { locale: SupportedLocale; stationId: string; onOpenTemplates: () => void; onQuickStart: () => void }) {
    const { locale, stationId, onOpenTemplates, onQuickStart } = params;
    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="text-sm font-black text-slate-900">
                        {locale.startsWith('zh')
                            ? '先選模板，再送出：新手 10 秒上手'
                            : locale === 'ja'
                                ? 'テンプレを選んで送信：10秒で使い始める'
                                : 'Pick a template, then send: start in 10 seconds'}
                    </div>
                    <div className="mt-2 text-sm font-bold text-slate-600 leading-relaxed">
                        {locale.startsWith('zh')
                            ? 'L4 只在你提出明確問題後，才顯示與當前問題直接相關的票價／時刻表／路線，並標註資料來源與驗證狀態。'
                            : locale === 'ja'
                                ? 'L4 は質問したときだけ、運賃/時刻表/経路を表示し、データソースと検証状態を明示します。'
                                : 'L4 shows fares/timetables/routes only after explicit questions, with sources and verification.'}
                    </div>
                </div>

                <div className="shrink-0 hidden sm:block">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center">
                        <BookOpen size={22} />
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StepCard
                    title={locale.startsWith('zh') ? '1) 選功能' : locale === 'ja' ? '1) 機能' : '1) Module'}
                    body={locale.startsWith('zh') ? '票價 / 時刻表 / 路線' : locale === 'ja' ? '運賃 / 時刻表 / 経路' : 'Fare / Timetable / Route'}
                />
                <StepCard
                    title={locale.startsWith('zh') ? '2) 選模板' : locale === 'ja' ? '2) テンプレ' : '2) Template'}
                    body={locale.startsWith('zh') ? '基礎 / 進階 / 特色' : locale === 'ja' ? '基本 / 応用 / 特徴' : 'Basic / Advanced / Features'}
                />
                <StepCard
                    title={locale.startsWith('zh') ? '3) 看結果' : locale === 'ja' ? '3) 結果' : '3) Output'}
                    body={locale.startsWith('zh') ? '數據模塊 + 決策建議' : locale === 'ja' ? 'データ + 提案' : 'Data + Suggestions'}
                />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    onClick={onOpenTemplates}
                    className="px-4 py-3 rounded-2xl bg-slate-900 text-white text-sm font-black"
                >
                    {locale.startsWith('zh') ? '打開模板' : locale === 'ja' ? 'テンプレを開く' : 'Open templates'}
                </button>
                <button
                    onClick={onQuickStart}
                    className="px-4 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-black"
                >
                    {locale.startsWith('zh') ? '查看快速入門' : locale === 'ja' ? 'クイックを見る' : 'View quick start'}
                </button>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {locale.startsWith('zh') ? '資料格式範例' : locale === 'ja' ? 'データ形式例' : 'Data format examples'}
                </div>
                <pre className="mt-2 text-[11px] font-bold text-slate-700 whitespace-pre-wrap break-words">
                    {locale.startsWith('zh')
                        ? `票價：{ fromStation, toStation, icCardFare, ticketFare }\n時刻表：{ station, calendar(平日/假日), railDirection, departures[] }\n路線：{ options: [{ label, steps[], sources[] }] }\n\nstation: ${stationId}`
                        : locale === 'ja'
                            ? `運賃：{ fromStation, toStation, icCardFare, ticketFare }\n時刻表：{ station, calendar(平日/休日), railDirection, departures[] }\n経路：{ options: [{ label, steps[], sources[] }] }\n\nstation: ${stationId}`
                            : `Fares: { fromStation, toStation, icCardFare, ticketFare }\nTimetable: { station, calendar(weekday/holiday), railDirection, departures[] }\nRoute: { options: [{ label, steps[], sources[] }] }\n\nstation: ${stationId}`}
                </pre>
            </div>
        </div>
    );
}

function StepCard({ title, body }: { title: string; body: string }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-xs font-black text-slate-900">{title}</div>
            <div className="mt-1 text-sm font-bold text-slate-600">{body}</div>
        </div>
    );
}

function QuickStart(params: {
    locale: SupportedLocale;
    stationId: string;
    templates: L4QuestionTemplate[];
    onApply: (tpl: L4QuestionTemplate) => void;
    onFeedback: (score: 1 | -1) => void;
    feedbackLocked: boolean;
}) {
    const { locale, stationId, templates, onApply, onFeedback, feedbackLocked } = params;
    const basic = templates.filter(t => t.category === 'basic');
    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-sm font-black text-slate-900">
                    {locale.startsWith('zh') ? '3 步驟完成第一次查詢' : locale === 'ja' ? '3ステップで初回検索' : 'First query in 3 steps'}
                </div>
                <ol className="mt-3 space-y-2 text-sm font-bold text-slate-700 list-decimal list-inside">
                    <li>{locale.startsWith('zh') ? '點上方「票價/時刻表/路線」任一圖示' : locale === 'ja' ? '上の「運賃/時刻表/経路」をタップ' : 'Tap one of Fare/Timetable/Route'}</li>
                    <li>{locale.startsWith('zh') ? '選一個基礎模板（已帶入本站 stationId）' : locale === 'ja' ? '基本テンプレを選ぶ（駅ID入り）' : 'Pick a basic template (with stationId)'}</li>
                    <li>{locale.startsWith('zh') ? '按送出，查看數據模塊與決策建議（含資料來源驗證）' : locale === 'ja' ? '送信して、データと提案（検証表示）を確認' : 'Send and review data + suggestions (with verification)'}</li>
                </ol>
            </div>

            <div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {locale.startsWith('zh') ? '一鍵示範（會直接送出）' : locale === 'ja' ? 'ワンタップ例（即送信）' : 'One-tap demo (auto-send)'}
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {basic.slice(0, 3).map(tpl => (
                        <button
                            key={tpl.id}
                            onClick={() => onApply(tpl)}
                            className="rounded-2xl bg-indigo-600 text-white p-4 text-left"
                        >
                            <div className="text-xs font-black">{tpl.title}</div>
                            <div className="mt-1 text-[11px] font-bold text-white/85 break-words line-clamp-2">{tpl.text}</div>
                        </button>
                    ))}
                </div>
                <div className="mt-2 text-[11px] font-bold text-slate-500 break-words">
                    {locale.startsWith('zh')
                        ? `本站 station: ${stationId}`
                        : locale === 'ja'
                            ? `現在の station: ${stationId}`
                            : `Current station: ${stationId}`}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-sm font-black text-slate-900">
                    {locale.startsWith('zh') ? '這個導引有幫助嗎？' : locale === 'ja' ? 'この案内は役に立ちましたか？' : 'Was this guide helpful?'}
                </div>
                <div className="mt-3 flex gap-2">
                    <button
                        disabled={feedbackLocked}
                        onClick={() => onFeedback(1)}
                        className={`flex-1 px-4 py-3 rounded-2xl text-sm font-black border ${feedbackLocked ? 'bg-slate-50 text-slate-300 border-slate-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}
                    >
                        {locale.startsWith('zh') ? '有幫助' : locale === 'ja' ? 'はい' : 'Yes'}
                    </button>
                    <button
                        disabled={feedbackLocked}
                        onClick={() => onFeedback(-1)}
                        className={`flex-1 px-4 py-3 rounded-2xl text-sm font-black border ${feedbackLocked ? 'bg-slate-50 text-slate-300 border-slate-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}
                    >
                        {locale.startsWith('zh') ? '不太有' : locale === 'ja' ? 'いいえ' : 'No'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function FaqPanel(params: {
    locale: SupportedLocale;
    stationId: string;
    templates: L4QuestionTemplate[];
    onApply: (tpl: L4QuestionTemplate) => void;
}) {
    const { locale, stationId, templates, onApply } = params;
    const basic = templates.filter(t => t.category === 'basic');
    const advanced = templates.filter(t => t.category === 'advanced');
    const feature = templates.filter(t => t.category === 'feature');

    return (
        <div className="space-y-6">
            <Section
                title={locale.startsWith('zh') ? '各功能模組會產出什麼？' : locale === 'ja' ? '各モジュールの出力' : 'What each module outputs'}
                items={[
                    {
                        q: locale.startsWith('zh') ? '票價（odpt:RailwayFare）' : locale === 'ja' ? '運賃（odpt:RailwayFare）' : 'Fares (odpt:RailwayFare)',
                        a: locale.startsWith('zh')
                            ? '顯示 IC/車票金額，來源標註 odpt:RailwayFare，並在可驗證時打 ✓。'
                            : locale === 'ja'
                                ? 'IC/切符の金額を表示し、ソース odpt:RailwayFare と検証 ✓ を表示します。'
                                : 'Shows IC/ticket amounts with odpt:RailwayFare source and ✓ when verified.'
                    },
                    {
                        q: locale.startsWith('zh') ? '時刻表（odpt:StationTimetable）' : locale === 'ja' ? '時刻表（odpt:StationTimetable）' : 'Timetable (odpt:StationTimetable)',
                        a: locale.startsWith('zh')
                            ? '顯示平日/假日兩套班次，並以「下一班」時間片段降低資訊負擔。'
                            : locale === 'ja'
                                ? '平日/休日の両方を表示し、「次の便」中心で見やすくします。'
                                : 'Shows weekday/holiday sets and focuses on next departures.'
                    },
                    {
                        q: locale.startsWith('zh') ? '路線拓撲（odpt:Railway）' : locale === 'ja' ? '路線トポロジー（odpt:Railway）' : 'Route topology (odpt:Railway)',
                        a: locale.startsWith('zh')
                            ? '以站點拓撲生成簡易路徑選項，輸出為結構化 steps + sources。'
                            : locale === 'ja'
                                ? '駅トポロジーから簡易経路を作り、steps + sources の構造化で出力します。'
                                : 'Generates simple route options with structured steps + sources.'
                    },
                ]}
            />

            <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-sm font-black text-slate-900">
                    {locale.startsWith('zh') ? '典型使用情境案例' : locale === 'ja' ? 'よくある利用シーン' : 'Typical scenarios'}
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {basic.slice(0, 2).map(tpl => (
                        <button
                            key={tpl.id}
                            onClick={() => onApply(tpl)}
                            className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left"
                        >
                            <div className="text-xs font-black text-slate-900">{tpl.title}</div>
                            <div className="mt-1 text-[11px] font-bold text-slate-600 break-words line-clamp-2">{tpl.text}</div>
                        </button>
                    ))}
                    {advanced.slice(0, 2).map(tpl => (
                        <button
                            key={tpl.id}
                            onClick={() => onApply(tpl)}
                            className="rounded-2xl border border-slate-100 bg-white p-3 text-left"
                        >
                            <div className="text-xs font-black text-slate-900">{tpl.title}</div>
                            <div className="mt-1 text-[11px] font-bold text-slate-600 break-words line-clamp-2">{tpl.text}</div>
                        </button>
                    ))}
                </div>
                <div className="mt-3 text-[11px] font-bold text-slate-500 break-words">
                    {locale.startsWith('zh')
                        ? `提示：把目的地替換成你要去的 ODPT 站點 ID。本站 station: ${stationId}`
                        : locale === 'ja'
                            ? `ヒント：目的地を ODPT 駅ID に置き換えてください。station: ${stationId}`
                            : `Tip: Replace the destination with your ODPT station ID. station: ${stationId}`}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="text-sm font-black text-slate-900">
                    {locale.startsWith('zh') ? '系統特色（不干擾進階使用者）' : locale === 'ja' ? '特徴（上級者の邪魔をしない）' : 'Features (doesn\'t block power users)'}
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {feature.slice(0, 3).map(tpl => (
                        <button
                            key={tpl.id}
                            onClick={() => onApply(tpl)}
                            className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left"
                        >
                            <div className="text-xs font-black text-slate-900">{tpl.title}</div>
                            <div className="mt-1 text-[11px] font-bold text-slate-600 break-words line-clamp-2">{tpl.text}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Section(params: { title: string; items: Array<{ q: string; a: string }> }) {
    const { title, items } = params;
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-sm font-black text-slate-900">{title}</div>
            <div className="mt-3 space-y-3">
                {items.map((it, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div className="text-xs font-black text-slate-900">{it.q}</div>
                        <div className="mt-1 text-sm font-bold text-slate-600 leading-relaxed">{it.a}</div>
                    </div>
                ))}
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
            <div className="text-sm font-black text-slate-900">{`from: ${stationId}`}</div>
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
    const now = new Date();
    const nowHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
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
            <div className="text-sm font-black text-slate-900">{`station: ${stationId}`}</div>
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

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Lutagu {locale.startsWith('zh') ? '建議方案' : locale === 'ja' ? '提案' : 'Suggestion'}
                </div>
                {hasDemand && (
                    <div className="flex gap-1">
                        {demand.wheelchair && <span title="Wheelchair">🦽</span>}
                        {demand.stroller && <span title="Stroller">👶</span>}
                        {demand.vision && <span title="Vision">🦯</span>}
                        {demand.senior && <span title="Senior">👴</span>}
                        {demand.largeLuggage && <span title="Large Luggage">🧳</span>}
                    </div>
                )}
            </div>
            
            <div className="text-base font-black text-slate-900 break-words">{suggestion.title}</div>
            
            <div className="mt-4 space-y-4">
                {suggestion.options.map((opt, idx) => (
                    <div key={`${opt.label}-${idx}`} className="relative pl-4 border-l-2 border-indigo-100">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-indigo-500" />
                        <div className="text-sm font-black text-slate-900 break-words mb-2 flex items-center gap-2">
                            {opt.label}
                            {idx === 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-black">
                                    {locale.startsWith('zh') ? '推薦' : locale === 'ja' ? 'おすすめ' : 'Best'}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            {opt.steps.map((s, i) => {
                                // Extract price, time or status for special styling
                                const isPrice = s.includes('💰') || s.includes('¥');
                                const isTime = s.includes('🚃') || s.includes('時刻') || s.includes('班') || s.includes('次發');
                                const isStatus = s.includes('✅') || s.includes('⚠️') || s.includes('❌');
                                
                                return (
                                    <div 
                                        key={i} 
                                        className={`text-sm font-bold break-words leading-relaxed ${
                                            isPrice ? 'text-emerald-600' : 
                                            isTime ? 'text-amber-600' : 
                                            isStatus ? (s.includes('✅') ? 'text-emerald-500' : s.includes('⚠️') ? 'text-amber-500' : 'text-rose-500') :
                                            'text-slate-700'
                                        }`}
                                    >
                                        {s}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {opt.sources.map((src, i) => (
                                <span
                                    key={`${src.type}-${i}`}
                                    className={`px-2 py-0.5 rounded-md text-[9px] font-black border flex items-center gap-1 ${
                                        src.verified 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                            : 'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}
                                >
                                    {src.verified ? '✓' : '!'} {src.type.split(':').pop()}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {hasDemand && (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        {locale.startsWith('zh') ? '個人化調整說明' : locale === 'ja' ? 'パーソナライズ' : 'Personalization'}
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 leading-normal">
                        {locale.startsWith('zh') 
                            ? '已根據您的狀態（無障礙/行李/偏好）優化建議方案，優先考慮電梯動線與少轉乘路徑。'
                            : locale === 'ja'
                                ? 'あなたの状態（バリアフリー/手荷物/こだわり）に合わせて、エレベーター優先や乗り換えの少ない経路を提案しています。'
                                : 'Optimized based on your state (accessibility/luggage/prefs), prioritizing elevators and fewer transfers.'}
                    </div>
                </div>
            )}
        </div>
    );
}
