'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Zap, AlertTriangle, AlertOctagon, Cloud, Sun, Clock, Users, ArrowRight } from 'lucide-react';
import { NodeProfile } from '@/lib/api/nodes';

// Weather Alert Component (Internal)
function WeatherAlertSection() {
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await fetch('/api/weather');
                if (res.ok) {
                    const data = await res.json();
                    if (data.alerts) setAlerts(data.alerts);
                }
            } catch (error) { }
        };
        fetchAlerts();
    }, []);

    if (alerts.length === 0) {
        return (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-lg text-emerald-500 shadow-sm">
                    <Sun size={14} />
                </div>
                <span className="text-[10px] font-bold text-emerald-700">目前無緊急天候警報</span>
            </div>
        );
    }

    const mainAlert = alerts[0];
    const isCritical = mainAlert.severity === 'critical';

    return (
        <div className={`p-3 rounded-2xl border flex items-start gap-3 animate-pulse ${isCritical ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
            <div className={`p-2 rounded-xl shadow-sm ${isCritical ? 'bg-white text-rose-500' : 'bg-white text-amber-500'}`}>
                {isCritical ? <AlertOctagon size={16} /> : <AlertTriangle size={16} />}
            </div>
            <div className="flex-1 overflow-hidden">
                <h4 className={`text-[10px] font-black uppercase tracking-tight truncate ${isCritical ? 'text-rose-900' : 'text-amber-900'}`}>
                    【天候警報】{mainAlert.title}
                </h4>
                <p className={`text-[10px] font-medium leading-tight mt-0.5 line-clamp-2 ${isCritical ? 'text-rose-700' : 'text-amber-700'}`}>
                    {mainAlert.summary}
                </p>
            </div>
        </div>
    );
}

interface L2_LiveProps {
    profile: NodeProfile | null;
}

export function L2_Live({ profile }: L2_LiveProps) {
    const tL2 = useTranslations('l2');
    const congestion = profile?.l2_status?.congestion || 1;

    // Helper for crowd level
    const getCrowdLevel = (level: number) => {
        if (level >= 5) return { label: tL2('experience.rushHour'), color: 'text-rose-600', bg: 'bg-rose-500', icon: '🔴' };
        if (level >= 4) return { label: tL2('experience.crowded'), color: 'text-orange-600', bg: 'bg-orange-500', icon: '🟠' };
        if (level >= 3) return { label: tL2('experience.moderate'), color: 'text-amber-600', bg: 'bg-amber-400', icon: '🟡' };
        return { label: tL2('experience.comfortable'), color: 'text-emerald-600', bg: 'bg-emerald-500', icon: '🟢' };
    };

    const crowdInfo = getCrowdLevel(congestion);

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
            {/* 1. Train Operation Status */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Train Operation</h3>
                    <span className="text-[10px] font-medium text-gray-400">Live Updates</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {!profile?.l2_status?.line_status || profile.l2_status.line_status.length === 0 ? (
                        <div className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                                <Zap size={20} fill="currentColor" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">{tL2('allLinesNormal')}</h4>
                                <p className="text-[10px] text-gray-500">{tL2('runningNormal')}</p>
                            </div>
                            <div className="ml-auto px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">
                                ON TIME
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {profile.l2_status.line_status.map((ls: any, i: number) => {
                                const isDelay = ls.status !== 'normal';
                                return (
                                    <div key={i} className={`p-4 flex items-center gap-3 ${isDelay ? 'bg-rose-50/30' : ''}`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isDelay ? 'bg-rose-100 text-rose-500' : 'bg-gray-100 text-gray-400'}`}>
                                            🚇
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="font-bold text-sm text-gray-900">{ls.line}</h4>
                                                {isDelay ? (
                                                    <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-full animate-pulse">DELAY</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-black rounded-full">OK</span>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-[10px] text-gray-500">{isDelay ? 'Significant delays reported' : 'Operating on schedule'}</p>
                                                <span className="text-[10px] font-mono font-bold text-gray-400">Next: 3m</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Weather & Alerts */}
            <div className="space-y-2">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Weather & Safety</h3>
                <div className="grid grid-cols-2 gap-3">
                    {/* Weather Card */}
                    <div className="bg-gradient-to-br from-sky-400 to-indigo-500 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-20">
                            <Cloud size={60} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-start justify-between">
                                <span className="text-[10px] font-medium opacity-80">TOKYO</span>
                                <Sun size={16} />
                            </div>
                            <div className="mt-2 mb-1">
                                <span className="text-3xl font-black">24°</span>
                                <span className="text-sm font-medium opacity-80 pl-1">Sunny</span>
                            </div>
                            <div className="flex gap-2 mt-2 pt-2 border-t border-white/20">
                                <div className="text-[8px] opacity-80 text-center">
                                    <div>15:00</div>
                                    <div>☁️</div>
                                </div>
                                <div className="text-[8px] opacity-80 text-center">
                                    <div>16:00</div>
                                    <div>🌧️</div>
                                </div>
                                <div className="text-[8px] opacity-80 text-center">
                                    <div>17:00</div>
                                    <div>🌤️</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alert & Crowd Cards */}
                    <div className="flex flex-col gap-2">
                        <WeatherAlertSection />

                        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${crowdInfo.bg}`} />
                                <span className="text-[10px] font-black text-gray-400 uppercase">CROWD</span>
                            </div>
                            <div className={`text-lg font-black ${crowdInfo.color}`}>
                                {crowdInfo.label}
                            </div>
                            <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
                                <div className={`h-full ${crowdInfo.bg}`} style={{ width: `${congestion * 20}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Expert Advice / Experience (Crowd) */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 border-dashed">
                <div className="flex gap-3">
                    <div className="mt-1">
                        <Users size={16} className="text-gray-400" />
                    </div>
                    <div>
                        <h5 className="text-xs font-black text-gray-700 mb-1">Bambi Tip</h5>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                            Weekends are usually crowded. Suggest avoiding 10:00-14:00 if you have luggage.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-2">
                <p className="text-[9px] text-gray-300 font-medium">Data updated: Just now • Source: Bambi Live Engine</p>
            </div>
        </div>
    );
}
