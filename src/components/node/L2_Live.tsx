'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Zap, AlertTriangle, AlertOctagon, Cloud, Sun, Users, Wind } from 'lucide-react';
import { StationUIProfile } from '@/lib/types/stationStandard';
import { getLocaleString } from '@/lib/utils/localeUtils';

// Weather Alert Component (Internal)
function WeatherAlertSection() {
    const tL2 = useTranslations('l2');
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

    // HIDE if no alerts (User Requirement)
    if (alerts.length === 0) {
        return null;
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
                    {tL2('weatherAlert')} | {mainAlert.title || 'Alert'}
                </h4>
                <p className={`text-[10px] font-medium leading-tight mt-0.5 line-clamp-2 ${isCritical ? 'text-rose-700' : 'text-amber-700'}`}>
                    {mainAlert.summary}
                </p>
            </div>
        </div>
    );
}

interface L2_LiveProps {
    data: StationUIProfile;
}

export function L2_Live({ data }: L2_LiveProps) {
    const tL2 = useTranslations('l2');
    const locale = useLocale();
    const { lines, weather, crowd } = data.l2;
    const [clickedCrowd, setClickedCrowd] = useState<number | null>(null);

    const maxVoteIdx = crowd.userVotes.distribution.indexOf(Math.max(...crowd.userVotes.distribution));

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
            {/* 1. Train Operation Status */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">{tL2('operationTitle')}</h3>
                    <span className="text-[10px] font-medium text-gray-400">{tL2('liveUpdates')}</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {lines.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-xs">
                            No Live Line Data Available
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {lines.map((line) => {
                                const isDelay = line.status !== 'normal';
                                return (
                                    <div key={line.id} className={`p-4 flex items-center gap-3 ${isDelay ? 'bg-rose-50/30' : ''}`}>
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white shadow-sm"
                                            style={{ backgroundColor: line.color }}
                                        >
                                            🚇
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                                    {getLocaleString(line.name, locale)}
                                                    <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                                                        {line.operator}
                                                    </span>
                                                </h4>

                                                {isDelay ? (
                                                    <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-full animate-pulse">DELAY</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-black rounded-full">OK</span>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-[10px] text-gray-500">
                                                    {line.message
                                                        ? getLocaleString(line.message, locale)
                                                        : (isDelay ? tL2('status.delay') : tL2('status.normal'))
                                                    }
                                                </p>
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
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">{tL2('weatherTitle')}</h3>
                <div className="grid grid-cols-2 gap-3">
                    {/* Weather Card */}
                    <div className="bg-gradient-to-br from-sky-400 to-indigo-500 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-20">
                            {weather.condition === 'Rain' ? <Cloud size={60} /> : <Sun size={60} />}
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-start justify-between">
                                <span className="text-[10px] font-medium opacity-80">TOKYO</span>
                                {weather.condition === 'Rain' ? <Cloud size={16} /> : <Sun size={16} />}
                            </div>
                            <div className="mt-2 mb-1">
                                <span className="text-3xl font-black">{weather.temp}°</span>
                                <span className="text-sm font-medium opacity-80 pl-1">{weather.condition}</span>
                            </div>
                            {/* Wind Speed Addition */}
                            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/20">
                                <Wind size={12} className="opacity-80" />
                                <span className="text-xs font-bold opacity-90">{weather.windSpeed} m/s</span>
                            </div>
                        </div>
                    </div>

                    {/* Alert & User Crowd Report */}
                    <div className="flex flex-col gap-2">
                        <WeatherAlertSection />

                        {/* User Crowd Report Section */}
                        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <Users size={14} className="text-gray-400" />
                                <span className="text-[10px] font-black text-gray-400 uppercase">{tL2('crowdReport')}</span>
                            </div>
                            <div className="grid grid-cols-5 gap-1">
                                {[
                                    { emoji: '😴', label: tL2('crowd.empty') },
                                    { emoji: '😊', label: tL2('crowd.comfortable') },
                                    { emoji: '😐', label: tL2('crowd.normal') },
                                    { emoji: '😓', label: tL2('crowd.crowded') },
                                    { emoji: '🥵', label: tL2('crowd.full') },
                                ].map((opt, idx) => {
                                    const isMostPopular = clickedCrowd !== null && idx === maxVoteIdx;
                                    const isSelected = clickedCrowd === idx;

                                    return (
                                        <button
                                            key={idx}
                                            className={`flex flex-col items-center p-1.5 rounded-xl border transition-all relative ${isSelected
                                                ? 'bg-indigo-600 border-indigo-600 text-white scale-110 shadow-md z-10'
                                                : isMostPopular
                                                    ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100'
                                                    : 'bg-white border-gray-100 hover:border-indigo-300 hover:bg-indigo-50'
                                                }`}
                                            onClick={() => setClickedCrowd(idx)}
                                        >
                                            <span className="text-base">{opt.emoji}</span>
                                            {/* Show Count if clicked (Simulated logic) */}
                                            {clickedCrowd !== null && (
                                                <span className={`text-[8px] font-bold mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-gray-400'}`}>
                                                    {crowd.userVotes.distribution[idx] + (isSelected ? 1 : 0)}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[9px] text-gray-300 mt-2 text-center">
                                {clickedCrowd !== null ? tL2('crowdThanks') : tL2('crowdClick')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
