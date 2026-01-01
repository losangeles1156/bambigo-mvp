'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { UserPreferences } from '@/types/lutagu_l4';
import { Info, AlertTriangle, Lightbulb, MapPin, ChevronRight, HelpCircle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

// Types for Card response (Mirroring API response)
interface ActionCard {
    id: string;
    type: 'primary' | 'warning' | 'info' | 'secondary' | 'ai_suggestion' | 'seasonal' | 'ticket_advice' | 'timing';
    icon: string;
    title: string;
    description: string;
    priority: number;
    actionLabel?: string;
    actionUrl?: string;
    _debug_reason?: string;
}

interface L4DashboardProps {
    currentNodeId: string;
    locale?: 'zh-TW' | 'ja' | 'en';
}

export default function L4_Dashboard({ currentNodeId, locale = 'zh-TW' }: L4DashboardProps) {
    // 1. State Management
    const [preferences, setPreferences] = useState<UserPreferences>({
        accessibility: { wheelchair: false, stroller: false, visual_impairment: false, elderly: false },
        luggage: { large_luggage: false, multiple_bags: false },
        travel_style: { rushing: false, budget: false, comfort: false, avoid_crowd: false, avoid_rain: false },
        companions: { with_children: false, family_trip: false }
    });

    const [cards, setCards] = useState<ActionCard[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 2. Fetch Logic
    const fetchRecommendations = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/l4/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stationId: currentNodeId,
                    userPreferences: preferences,
                    locale
                })
            });
            const data = await res.json();
            if (data.cards) {
                setCards(data.cards);
            }
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentNodeId, preferences, locale]);

    // Initial fetch and fetch on preference change
    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);


    // 3. UI Helpers
    const togglePreference = <C extends keyof UserPreferences>(category: C, key: keyof UserPreferences[C]) => {
        setPreferences(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: !prev[category][key]
            }
        }));
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-24">

            {/* Block 1: User State Selector */}
            <div className="bg-white px-4 py-5 shadow-sm border-b border-gray-100 mb-2">
                <div className="flex items-center gap-2 mb-3">
                    <span className="w-1 h-4 bg-indigo-500 rounded-full" />
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                        {locale === 'zh-TW' ? '您的旅行情境' : 'Context'}
                    </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {/* Luggage Group */}
                    <Chip label="🧳 大葉行李" active={preferences.luggage.large_luggage} onClick={() => togglePreference('luggage', 'large_luggage')} />
                    <Chip label="👶 嬰兒車" active={preferences.accessibility.stroller} onClick={() => togglePreference('accessibility', 'stroller')} />
                    <Chip label="🦽 輪椅" active={preferences.accessibility.wheelchair} onClick={() => togglePreference('accessibility', 'wheelchair')} />
                    <Chip label="⏰ 趕時間" active={preferences.travel_style.rushing} onClick={() => togglePreference('travel_style', 'rushing')} />
                    <Chip label="💰 省錢" active={preferences.travel_style.budget} onClick={() => togglePreference('travel_style', 'budget')} />
                </div>
            </div>

            {/* Block 2: Result Cards */}
            <div className="flex-1 px-4 py-2 space-y-4">
                {isLoading ? (
                    <div className="space-y-4 pt-4">
                        <div className="h-32 bg-white rounded-2xl animate-pulse shadow-sm" />
                        <div className="h-32 bg-white rounded-2xl animate-pulse shadow-sm" />
                    </div>
                ) : cards.length > 0 ? (
                    cards.map(card => (
                        <InsightCard key={card.id} card={card} locale={locale} />
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-400 text-sm">
                        {locale === 'zh-TW' ? '無需特別注意的事項，祝旅途愉快！' : 'All good! Enjoy your trip.'}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Sub Components ---

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

function InsightCard({ card, locale }: { card: ActionCard, locale: string }) {
    // Style Mapping based on Card Type
    const getStyle = (type: string) => {
        switch (type) {
            case 'warning':
                return { bg: 'bg-rose-50', border: 'border-rose-100', iconBg: 'bg-rose-100', title: 'text-rose-700' };
            case 'seasonal':
                return { bg: 'bg-purple-50', border: 'border-purple-100', iconBg: 'bg-purple-100', title: 'text-purple-700' };
            case 'ticket_advice':
                return { bg: 'bg-emerald-50', border: 'border-emerald-100', iconBg: 'bg-emerald-100', title: 'text-emerald-700' };
            case 'ai_suggestion':
                return { bg: 'bg-gradient-to-br from-indigo-50 to-purple-50', border: 'border-indigo-100', iconBg: 'bg-white', title: 'text-indigo-700' };
            default:
                return { bg: 'bg-white', border: 'border-gray-100', iconBg: 'bg-gray-50', title: 'text-gray-800' };
        }
    };

    const s = getStyle(card.type);

    return (
        <div className={`relative rounded-2xl border ${s.border} ${s.bg} p-5 shadow-sm transition-all duration-300 hover:shadow-md`}>

            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center text-xl shrink-0 shadow-sm border border-white/50`}>
                    {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h4 className={`text-base font-black ${s.title} leading-tight`}>{card.title}</h4>
                        {/* Debug Info (Hidden by default, can be toggled if needed) */}
                        {/* <div className="group relative">
                            <HelpCircle size={14} className="text-gray-300 cursor-help" />
                             <div className="absolute right-0 top-6 w-48 p-2 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                                {card._debug_reason} ({card.priority})
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Content (Markdown) */}
            <div className="prose prose-sm max-w-none text-gray-600 text-sm leading-relaxed
                prose-headings:font-bold prose-headings:text-gray-800 prose-headings:mb-1 prose-headings:mt-2
                prose-p:m-0 prose-p:mb-2
                prose-strong:text-gray-900 prose-strong:font-black
                prose-ul:m-0 prose-ul:pl-4 prose-li:m-0
                prose-table:border prose-table:border-gray-200 prose-table:rounded-lg prose-table:overflow-hidden prose-table:w-full prose-table:text-xs prose-table:mb-2
                prose-th:bg-gray-100 prose-th:p-2 prose-th:text-left
                prose-td:p-2 prose-td:border-t prose-td:border-gray-100
                [&>*:last-child]:mb-0">

                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {card.description}
                </ReactMarkdown>
            </div>

            {/* Action Button */}
            {card.actionLabel && card.actionUrl && (
                <a
                    href={card.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center w-full py-2.5 bg-white border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-[0.98] group"
                >
                    {card.actionLabel}
                    <ChevronRight size={14} className="ml-1 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </a>
            )}
        </div>
    );
}
