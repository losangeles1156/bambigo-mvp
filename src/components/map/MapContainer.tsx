'use client';

import { Component, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useZoneAwareness } from '@/hooks/useZoneAwareness';
import { useAppStore } from '@/stores/appStore';
import { fetchNearbyNodes, fetchNodeConfig, fetchNodesByViewport, NodeDatum } from '@/lib/api/nodes';
import { NodeMarker } from './NodeMarker';
import { TrainLayer } from './TrainLayer';
import { useLocale } from 'next-intl';

type ClusterItem =
    | { kind: 'node'; node: NodeDatum }
    | { kind: 'cluster'; id: string; count: number; lat: number; lon: number };

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function roundToStep(value: number, step: number) {
    return Math.round(value / step) * step;
}

function viewportStepForZoom(zoom: number) {
    if (zoom >= 17) return 0.002;
    if (zoom >= 15) return 0.005;
    if (zoom >= 13) return 0.02;
    if (zoom >= 11) return 0.05;
    return 0.2;
}

function buildViewportKey(input: { swLat: number; swLon: number; neLat: number; neLon: number; zoom: number; hubsOnly: boolean }) {
    const step = viewportStepForZoom(input.zoom);
    const swLat = roundToStep(input.swLat, step);
    const swLon = roundToStep(input.swLon, step);
    const neLat = roundToStep(input.neLat, step);
    const neLon = roundToStep(input.neLon, step);
    const zBucket = input.zoom < 11 ? 10 : input.zoom < 14 ? 13 : input.zoom;
    return `${zBucket}:${input.hubsOnly ? 1 : 0}:${swLat},${swLon},${neLat},${neLon}`;
}

function dedupeNodesById(nodes: NodeDatum[]) {
    const map = new Map<string, NodeDatum>();
    nodes.forEach(n => {
        if (!n?.id) return;
        map.set(n.id, n);
    });
    return Array.from(map.values());
}

function getDailyKey(prefix: string) {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${prefix}_${yyyy}-${mm}-${dd}`;
}

function getAndBumpDailyCounter(key: string, bump: number) {
    try {
        const raw = localStorage.getItem(key);
        const curr = raw ? Number(raw) : 0;
        const next = Number.isFinite(curr) ? curr + bump : bump;
        localStorage.setItem(key, String(next));
        return next;
    } catch {
        return null;
    }
}

// Component to handle map center updates
function MapController({ center, isTooFar, fallback, nodes }: {
    center: { lat: number, lon: number } | null,
    isTooFar: boolean,
    fallback: { lat: number, lon: number },
    nodes: NodeDatum[]
}) {
    const map = useMap();
    const mapCenter = useAppStore(state => state.mapCenter);
    const setMapCenter = useAppStore(state => state.setMapCenter);
    const lastTargetRef = useRef<{ lat: number, lon: number } | null>(null);

    const target = mapCenter || (isTooFar ? null : center);
    const { currentNodeId } = useAppStore();
    const [prevNodeId, setPrevNodeId] = useState<string | null>(null);

    useEffect(() => {
        // 1. Handle Selection Centering
        if (currentNodeId && currentNodeId !== prevNodeId) {
            const selectedNode = (nodes || []).find(n => n?.id === currentNodeId);
            if (selectedNode) {
                const [lon, lat] = selectedNode.location.coordinates;
                map.flyTo([lat, lon], 16, { animate: true, duration: 1.2 });
                setPrevNodeId(currentNodeId);
                return;
            }

            fetchNodeConfig(currentNodeId)
                .then(res => {
                    if (res?.node?.location?.coordinates) {
                        const [lon, lat] = res.node.location.coordinates;
                        map.flyTo([lat, lon], 16, { animate: true, duration: 1.2 });
                        setPrevNodeId(currentNodeId);
                    }
                })
                .catch(() => {
                });
            return;
        }

        // 2. Handle System Centering (Fallback or User Location)
        if (!target && isTooFar && !mapCenter) {
            const fallbackTarget = fallback;
            if (JSON.stringify(lastTargetRef.current) !== JSON.stringify(fallbackTarget)) {
                map.flyTo([fallbackTarget.lat, fallbackTarget.lon], 15, { animate: true, duration: 1.5 });
                lastTargetRef.current = fallbackTarget;
            }
            return;
        }

        if (target) {
            const targetChanged = JSON.stringify(lastTargetRef.current) !== JSON.stringify(target);
            if (targetChanged) {
                map.flyTo([target.lat, target.lon], 15, {
                    animate: true,
                    duration: 1.5
                });
                lastTargetRef.current = target;
            }
        }
    }, [target, map, isTooFar, fallback, mapCenter, currentNodeId, prevNodeId, nodes]);

    // Clear mapCenter if user starts dragging to allow manual exploration
    useEffect(() => {
        const onMove = () => {
            if (mapCenter) {
                // We keep mapCenter for now as it represents "Active Target"
                // But we could null it if we want "Free Pan" mode
            }
        };
        map.on('movestart', onMove);
        return () => { map.off('movestart', onMove); };
    }, [map, mapCenter]);

    return (
        <>
            {center && !isTooFar && (
                <div className="user-marker">
                    {/* Leaflet markers need to be inside MapContainer but outside MapController technically 
                        if using standard components, but we can use useMap and add a manual marker or 
                        just return it if this was a component. Actually, let's put it in AppMap. */}
                </div>
            )}
        </>
    );
}

function ViewportNodeLoader({ onData, onLoading, onError, refreshKey }: {
    onData: (nodes: NodeDatum[]) => void;
    onLoading: (loading: boolean) => void;
    onError: (message: string | null) => void;
    refreshKey: number;
}) {
    const map = useMap();
    const abortRef = useRef<AbortController | null>(null);
    const cacheRef = useRef(new Map<string, { ts: number; nodes: NodeDatum[] }>());
    const inFlightKeyRef = useRef<string | null>(null);
    const debounceTimerRef = useRef<number | null>(null);

    const maxDailyCalls = 2000;
    const callKey = useMemo(() => getDailyKey('map_api_calls'), []);

    const load = useCallback(async () => {
        const zoom = clamp(map.getZoom(), 1, 22);
        const padded = map.getBounds().pad(0.25);
        const sw = padded.getSouthWest();
        const ne = padded.getNorthEast();

        const hubsOnly = zoom < 11;
        const key = buildViewportKey({ swLat: sw.lat, swLon: sw.lng, neLat: ne.lat, neLon: ne.lng, zoom, hubsOnly });
        const now = Date.now();

        const cached = cacheRef.current.get(key);
        if (cached && now - cached.ts < 60_000) {
            onError(null);
            onData(cached.nodes);
            return;
        }

        if (inFlightKeyRef.current === key) return;
        inFlightKeyRef.current = key;

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        onLoading(true);
        onError(null);

        try {
            const bumped = getAndBumpDailyCounter(callKey, 1);
            if (typeof bumped === 'number' && bumped > maxDailyCalls) {
                throw new Error('API calls limit reached');
            }

            const basePageSize = zoom < 11 ? 180 : zoom < 14 ? 450 : 800;
            const maxPages = zoom < 11 ? 1 : 2;
            const targetNodes = zoom < 11 ? 180 : zoom < 14 ? 800 : 1200;

            let page = 0;
            let nextPage: number | null = 0;
            let combined: NodeDatum[] = [];

            while (nextPage !== null && page < maxPages && combined.length < targetNodes) {
                if (page > 0) {
                    const bumped2 = getAndBumpDailyCounter(callKey, 1);
                    if (typeof bumped2 === 'number' && bumped2 > maxDailyCalls) {
                        throw new Error('API calls limit reached');
                    }
                }

                const res = await fetchNodesByViewport(
                    {
                        swLat: sw.lat,
                        swLon: sw.lng,
                        neLat: ne.lat,
                        neLon: ne.lng,
                        zoom,
                        page,
                        pageSize: basePageSize,
                        hubsOnly
                    },
                    { signal: controller.signal }
                );

                combined = dedupeNodesById([...combined, ...res.nodes]);
                nextPage = res.next_page;
                page += 1;
                if (res.nodes.length < res.page_size) break;
            }

            cacheRef.current.set(key, { ts: now, nodes: combined });
            onData(combined);
        } catch (e: any) {
            if (e?.name === 'AbortError') return;
            onError(String(e?.message || 'Failed to load nodes'));
        } finally {
            onLoading(false);
            inFlightKeyRef.current = null;
        }
    }, [callKey, map, onData, onError, onLoading]);

    useEffect(() => {
        const onMove = () => {
            if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = window.setTimeout(() => {
                load();
            }, 350) as any;
        };

        map.on('moveend', onMove);
        map.on('zoomend', onMove);

        // Initial load
        onMove();

        return () => {
            map.off('moveend', onMove);
            map.off('zoomend', onMove);
            if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
        };
    }, [map, load, refreshKey]);

    return null;
}

function ClusteredNodeLayer({ nodes, zone, locale }: { nodes: NodeDatum[]; zone: any; locale: string }) {
    const map = useMap();
    const [zoom, setZoom] = useState(map.getZoom());

    useMapEvents({
        zoomend: () => setZoom(map.getZoom())
    });

    const clampedZoom = clamp(zoom, 1, 22);

    // Detect mobile for performance tuning
    const isMobile = useMemo(() => {
        if (typeof navigator === 'undefined') return false;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }, []);

    const items = useMemo<ClusterItem[]>(() => {
        if (!nodes || nodes.length === 0) return [];
        
        // At high zoom levels, show all individual nodes
        if (clampedZoom >= 15) {
            return nodes.map(n => ({ kind: 'node', node: n }));
        }

        // Adjust grid size based on zoom and device
        // Optimization: Increase grid size for mobile to reduce markers
        let gridPx = 70;
        if (clampedZoom < 11) gridPx = isMobile ? 120 : 90;
        else if (clampedZoom < 13) gridPx = isMobile ? 100 : 75;
        else if (clampedZoom < 15) gridPx = isMobile ? 80 : 60;

        const buckets = new Map<string, { count: number; sumLat: number; sumLon: number; nodes: NodeDatum[] }>();

        nodes.forEach(n => {
            const [lon, lat] = n.location.coordinates;
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
            const p = map.project([lat, lon], clampedZoom);
            const gx = Math.floor(p.x / gridPx);
            const gy = Math.floor(p.y / gridPx);
            const key = `${gx}:${gy}`;

            const bucket = buckets.get(key) || { count: 0, sumLat: 0, sumLon: 0, nodes: [] };
            bucket.count += 1;
            bucket.sumLat += lat;
            bucket.sumLon += lon;
            bucket.nodes.push(n);
            buckets.set(key, bucket);
        });

        const out: ClusterItem[] = [];
        let idx = 0;
        buckets.forEach(bucket => {
            // Optimization: Increase threshold for mobile to cluster more aggressively
            const threshold = clampedZoom < 12 ? 2 : (isMobile ? 5 : 3);
            if (bucket.count <= threshold) {
                bucket.nodes.forEach(n => out.push({ kind: 'node', node: n }));
                return;
            }
            out.push({
                kind: 'cluster',
                id: `c-${clampedZoom}-${idx++}`,
                count: bucket.count,
                lat: bucket.sumLat / bucket.count,
                lon: bucket.sumLon / bucket.count
            });
        });

        return out;
    }, [nodes, clampedZoom, map, isMobile]);

    return (
        <>
            {items.map(item => {
                if (item.kind === 'node') {
                    return <NodeMarker key={item.node.id} node={item.node} zone={zone} locale={locale} />;
                }

                const size = clamp(32 + Math.log2(item.count) * 8, 32, 64);
                const icon = L.divIcon({
                    className: 'node-cluster-icon',
                    html: `
                        <div class="relative flex items-center justify-center group" style="width:${size}px;height:${size}px;">
                            <div class="absolute inset-0 bg-indigo-600/20 rounded-full animate-ping opacity-20 group-hover:hidden"></div>
                            <div class="relative w-full h-full rounded-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 border-[3px] border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/25">
                                <span class="text-white font-black text-xs">${item.count}</span>
                            </div>
                        </div>
                    `,
                    iconSize: [size, size],
                    iconAnchor: [size / 2, size / 2]
                });

                return (
                    <Marker
                        key={item.id}
                        position={[item.lat, item.lon]}
                        icon={icon}
                        eventHandlers={{
                            click: () => {
                                map.flyTo([item.lat, item.lon], clamp(zoom + 2, 1, 18), { animate: true, duration: 0.6 });
                            }
                        }}
                    />
                );
            })}
        </>
    );
}

// Error Boundary for Map
class MapErrorBoundary extends Component<{ children: ReactNode; onReset: () => void }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error: any, errorInfo: any) {
        console.error('MapContainer Crash:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                    <p className="text-gray-600 mb-4">地圖加載出錯</p>
                    <button 
                        onClick={() => { this.setState({ hasError: false }); this.props.onReset(); }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        重試
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function AppMapWrapper() {
    console.log('[MapContainer] Rendering');
    const [key, setKey] = useState(0);
    return (
        <MapErrorBoundary onReset={() => setKey(k => k + 1)}>
            <AppMap key={key} />
        </MapErrorBoundary>
    );
}

function AppMap() {
    console.log('[MapContainerContent] Rendering');
    const { zone, userLocation, isTooFar, centerFallback } = useZoneAwareness();
    const [nodes, setNodes] = useState<NodeDatum[]>([]);
    const [loadingNodes, setLoadingNodes] = useState(false);
    const [nodesError, setNodesError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [gpsAlert, setGpsAlert] = useState<{ show: boolean, type: 'far' | 'denied' }>({ show: false, type: 'far' });
    const locale = useLocale();

    // Default center is Ueno if user is far
    const defaultCenter: [number, number] = [centerFallback.lat, centerFallback.lon];

    return (
        <div className="w-full h-screen relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={15}
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <MapController
                    center={userLocation}
                    isTooFar={isTooFar}
                    fallback={centerFallback}
                    nodes={nodes}
                />

                <ViewportNodeLoader
                    onData={setNodes}
                    onLoading={setLoadingNodes}
                    onError={setNodesError}
                    refreshKey={refreshKey}
                />

                {/* User Location Marker */}
                {userLocation && !isTooFar && (
                    <NodeMarker
                        node={{
                            id: 'user-location',
                            city_id: 'user',
                            name: { 'zh-TW': '您的位置', 'en': 'Your Location', 'ja': '現在地' },
                            type: 'user',
                            location: { coordinates: [userLocation.lon, userLocation.lat] },
                            vibe: 'me',
                            is_hub: false,
                            geohash: '',
                            parent_hub_id: null,
                            zone: 'user'
                        } as any}
                        zone="core"
                        locale={locale}
                    />
                )}

                {/* Render Nodes */}
                <ClusteredNodeLayer nodes={nodes} zone={zone} locale={locale} />

                {/* Real-time Train Layer */}
                <TrainLayer />
            </MapContainer>

            {loadingNodes && nodes.length === 0 && (
                <div className="absolute inset-0 z-[900] pointer-events-none flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px]" />
                    <div className="relative flex flex-col items-center">
                        <div className="w-16 h-16 mb-4 relative">
                            <div className="absolute inset-0 border-4 border-indigo-600/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <div className="px-6 py-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center gap-1">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 animate-pulse">
                                {locale.startsWith('ja') ? '地図を読み込み中' : locale.startsWith('en') ? 'Mapping DNA...' : '正在繪製地圖基因'}
                            </span>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Zone & Distance Indicator */}
            <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
                <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-lg text-sm font-medium">
                    <span className={
                        zone === 'core' ? 'text-green-600' :
                            zone === 'buffer' ? 'text-yellow-600' : 'text-gray-600'
                    }>
                        {zone === 'core' ? '🔴 Core Zone' :
                            zone === 'buffer' ? '🟡 Buffer Zone' : '⚪ Outer Zone'}
                    </span>
                </div>
                {(loadingNodes || nodesError) && (
                    <button
                        type="button"
                        onClick={() => {
                            if (nodesError) setRefreshKey(v => v + 1);
                        }}
                        className={`bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-lg text-[10px] font-black uppercase tracking-widest ${nodesError ? 'text-rose-600' : 'text-gray-700'} ${nodesError ? 'hover:bg-rose-50 active:scale-[0.98]' : ''} transition-all`}
                    >
                        {nodesError
                            ? (locale.startsWith('ja') ? 'ノード取得失敗（再試行）' : locale.startsWith('en') ? 'Nodes load failed (retry)' : '節點載入失敗（重試）')
                            : (locale.startsWith('ja') ? '読み込み中…' : locale.startsWith('en') ? 'Loading…' : '載入中…')}
                    </button>
                )}
                {isTooFar && (
                    <div className="bg-rose-500/90 text-white backdrop-blur px-3 py-1 rounded-full shadow-lg text-[10px] font-black uppercase tracking-widest animate-pulse">
                        📍 距離過遠已回正 (UENO)
                    </div>
                )}
            </div>

            {/* GPS & Navigation Controls */}
            <div className="absolute bottom-24 right-4 z-[1000] flex flex-col gap-3">
                <button
                    onClick={async () => {
                        if (!navigator.geolocation) return;
                        navigator.geolocation.getCurrentPosition(
                            async (pos) => {
                                const { latitude, longitude } = pos.coords;
                                // Simple distance check to Ueno (approx 0.5 degrees roughly 50km)
                                const dist = Math.sqrt(Math.pow(latitude - 35.7138, 2) + Math.pow(longitude - 139.7773, 2));

                                if (dist > 0.45) { // Roughly 50km
                                    const ueno = { lat: 35.7138, lon: 139.7773 };
                                    useAppStore.getState().setMapCenter(ueno);
                                    setGpsAlert({ show: true, type: 'far' });
                                } else {
                                    // Find nearest node
                                    try {
                                        const res = await fetchNearbyNodes(latitude, longitude, 4000);
                                        const nearest = (res || []).reduce((best: any, n: any) => {
                                            if (!best) return n;
                                            const d1 = (latitude - n.location.coordinates[1]) ** 2 + (longitude - n.location.coordinates[0]) ** 2;
                                            const d2 = (latitude - best.location.coordinates[1]) ** 2 + (longitude - best.location.coordinates[0]) ** 2;
                                            return d1 < d2 ? n : best;
                                        }, null);
                                        if (nearest) {
                                            const [lon, lat] = nearest.location.coordinates;
                                            useAppStore.getState().setMapCenter({ lat, lon });
                                            useAppStore.getState().setCurrentNode(nearest.id);
                                        }
                                    } catch (e) {
                                        useAppStore.getState().setMapCenter({ lat: latitude, lon: longitude });
                                    }
                                }
                            },
                            (err) => {
                                if (err.code === 1) setGpsAlert({ show: true, type: 'denied' });
                            }
                        );
                    }}
                    className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-all border border-black/[0.03] active:scale-95"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-400 blur-lg opacity-20" />
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3L10 14M21 3l-7 20-4-9-9-4 20-7z"></path></svg>
                    </div>
                </button>
            </div>

            {/* GPS Alert Overlay */}
            {gpsAlert.show && (
                <div className="absolute inset-0 z-[2000] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xs rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 text-center">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${gpsAlert.type === 'far' ? 'bg-amber-50 text-amber-500' : 'bg-rose-50 text-rose-500'}`}>
                                {gpsAlert.type === 'far' ?
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> :
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                                }
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">
                                {gpsAlert.type === 'far' ? '距離核心區域過遠' : '定位授權失敗'}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                                {gpsAlert.type === 'far' ?
                                    '偵測到您目前距離東京超過 50 公里。已為您預設至上野車站，您也可以手動選擇下方的門戶節點。' :
                                    '請開啟瀏覽器定位授權，以便 LUTAGU 為您精準導航。'}
                            </p>

                            {gpsAlert.type === 'far' && (
                                <div className="grid grid-cols-2 gap-2 mb-6 text-indigo-100">
                                    {['上野', '淺草', '秋葉原', '東京'].map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => {
                                                const nodesFallback = {
                                                    '上野': { lat: 35.7138, lon: 139.7773 },
                                                    '淺草': { lat: 35.7119, lon: 139.7976 },
                                                    '秋葉原': { lat: 35.6984, lon: 139.7753 },
                                                    '東京': { lat: 35.6812, lon: 139.7671 }
                                                };
                                                const target = (nodesFallback as any)[name];
                                                useAppStore.getState().setMapCenter(target);
                                                setGpsAlert({ show: false, type: 'far' });
                                            }}
                                            className="py-2.5 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white text-xs font-black text-indigo-700 rounded-xl transition-all active:scale-95"
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => setGpsAlert({ show: false, type: 'far' })}
                                className="w-full py-3.5 bg-gray-900 text-white rounded-2xl text-xs font-black hover:bg-gray-800 transition-colors shadow-lg active:scale-95"
                            >
                                好的，知道了
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
