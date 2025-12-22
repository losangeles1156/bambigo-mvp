'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Briefcase, Baby, UserMinus, Clock, Backpack, Users, CloudRain,
    MapPin, Search, ArrowDown, Zap, Lightbulb, ArrowRight, X, Sparkles
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { NodeProfile } from '@/lib/api/nodes';

interface L4_BambiProps {
    profile: NodeProfile | null;
}

const CONTEXT_OPTIONS = [
    { id: 'luggage', icon: <Briefcase size={20} />, label: '拖著行李', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 'stroller', icon: <Baby size={20} />, label: '推嬰兒車', color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
    { id: 'accessibility', icon: <UserMinus size={20} />, label: '行動不便', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'rush', icon: <Clock size={20} />, label: '趕時間', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
    { id: 'light', icon: <Backpack size={20} />, label: '輕裝上陣', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { id: 'family', icon: <Users size={20} />, label: '家庭出遊', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    { id: 'rain', icon: <CloudRain size={20} />, label: '避雨優先', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
];

export function L4_Bambi({ profile }: L4_BambiProps) {
    const { userContext, setUserContext } = useAppStore();
    const [origin, setOrigin] = useState('Current Location');
    const [destination, setDestination] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [strategyData, setStrategyData] = useState<any>(null);

    const toggleContext = (id: string) => {
        const current = userContext || [];
        setUserContext(current.includes(id)
            ? current.filter(c => c !== id)
            : [...current, id]
        );
    };

    const handleGenerate = async () => {
        if (!destination) return;

        setIsGenerating(true);
        setStrategyData(null); // Reset previous data

        try {
            const res = await fetch('/api/strategy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nodeId: profile?.node_id || 'unknown',
                    destination: destination,
                    context: userContext || []
                })
            });

            if (res.ok) {
                const json = await res.json();
                if (json.success) {
                    setStrategyData(json.data);
                    setShowResult(true);
                }
            }
        } catch (error) {
            console.error('Strategy generation failed', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">

            {/* 1. Status Selection (Horizontal Scroll) */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-black text-gray-900">Tell Bambi your status</h3>
                    <span className="text-[10px] text-gray-400 font-medium">Multi-select available</span>
                </div>

                <div className="relative -mx-4 px-4 overflow-hidden">
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x px-1">
                        {CONTEXT_OPTIONS.map((opt) => {
                            const isSelected = (userContext || []).includes(opt.id);
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => toggleContext(opt.id)}
                                    className={`relative flex-shrink-0 snap-start flex flex-col items-center gap-2 p-4 min-w-[90px] rounded-2xl border-2 transition-all duration-300 ${isSelected
                                        ? `${opt.bg} ${opt.border} shadow-lg scale-105`
                                        : 'bg-white border-gray-50 text-gray-300 hover:border-gray-100'
                                        }`}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-4 h-4 bg-black rounded-full text-white flex items-center justify-center text-[10px]">✓</div>
                                    )}
                                    <div className={`transition-colors ${isSelected ? opt.color : 'text-gray-300'}`}>
                                        {opt.icon}
                                    </div>
                                    <span className={`text-[11px] font-bold ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {opt.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 2. OD Input Area */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-4 relative overflow-hidden">
                <div className="space-y-3 relative z-10">
                    {/* Origin */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-100" />
                        <input
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm font-bold text-gray-800 w-full placeholder:text-gray-300"
                            placeholder="Start from..."
                        />
                        <button onClick={() => setOrigin('Current Location')} className="text-gray-400 hover:text-indigo-500">
                            <MapPin size={16} />
                        </button>
                    </div>

                    {/* Connector */}
                    <div className="absolute left-6 top-[3.25rem] w-0.5 h-6 bg-gray-200 border-l border-dashed border-gray-300" />

                    {/* Destination */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
                        <div className="w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-100" />
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm font-bold text-gray-800 w-full placeholder:text-gray-300"
                            placeholder="Where to go?"
                        />
                        <button className="text-gray-400 hover:text-indigo-500">
                            <Search size={16} />
                        </button>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !destination}
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-white text-sm shadow-lg shadow-indigo-200 transition-all ${isGenerating || !destination ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                        }`}
                >
                    {isGenerating ? (
                        <>
                            <Sparkles size={16} className="animate-spin" />
                            <span>Thinking...</span>
                        </>
                    ) : (
                        <>
                            <Zap size={16} fill="currentColor" />
                            <span>Get Strategy</span>
                        </>
                    )}
                </button>
            </div>

            {/* 3. Live Context Summary (New) */}
            {(showResult && strategyData?.alerts) && (
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {strategyData.alerts.map((alert: any, idx: number) => (
                        <div key={idx} className={`flex-shrink-0 px-3 py-2 border rounded-xl flex items-center gap-2 ${alert.type === 'delay' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-blue-50 border-blue-100 text-blue-700'
                            }`}>
                            <span className="text-xs">{alert.icon}</span>
                            <span className="text-[10px] font-bold">{alert.text}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* 4. Suggestion Card */}
            {showResult && strategyData && (
                <div className="animate-in fade-in slide-in-from-bottom duration-700 pb-20">
                    <div className="p-1 rounded-[32px] bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 shadow-xl shadow-indigo-200/50">
                        <div className="bg-white rounded-[28px] p-6 relative overflow-hidden">
                            {/* Watermark */}
                            <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] text-indigo-900 transform rotate-12 pointer-events-none">
                                <Zap size={180} fill="currentColor" />
                            </div>

                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 leading-tight">Optimal<br />Strategy</h2>
                                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">AI-POWERED • PERSONALIZED</p>
                                </div>
                                <div className="p-2 bg-black text-white rounded-full">
                                    <ArrowDown size={20} className="-rotate-45" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Route */}
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest pl-1">Route</span>
                                    <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="text-sm font-bold text-gray-900 truncate max-w-[80px]">{strategyData.route?.origin || 'Start'}</div>
                                            <div className="h-0.5 w-6 bg-gray-300" />
                                            <div className="text-sm font-bold text-gray-900 truncate max-w-[80px]">{strategyData.route?.destination || 'End'}</div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xs font-black text-indigo-600">{strategyData.route?.duration}</span>
                                            <span className="block text-[9px] text-gray-400 font-medium">{strategyData.route?.transfers} transfer(s)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Expert Knowledge */}
                                {strategyData.expertInsight && (
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest pl-1">Expert Insight</span>
                                        <div className="flex gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-100">
                                            <Lightbulb size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-amber-900 font-medium leading-relaxed">
                                                {strategyData.expertInsight}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Contextual Advice */}
                                {(strategyData.contextAdvice || []).length > 0 && (
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest pl-1">For Your Status</span>
                                        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 space-y-3">
                                            {strategyData.contextAdvice.map((advice: any, idx: number) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <span className="text-xs">{advice.icon}</span>
                                                    <p className="text-xs font-bold text-indigo-900 leading-tight pt-0.5">{advice.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    <button
                        onClick={() => { setShowResult(false); setDestination(''); setStrategyData(null); }}
                        className="mt-4 mx-auto block text-[10px] text-gray-400 hover:text-gray-600 underline"
                    >
                        Reset Search
                    </button>
                </div>
            )}
        </div>
    );
}
