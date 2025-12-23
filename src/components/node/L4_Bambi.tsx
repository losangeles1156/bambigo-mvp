'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { StationUIProfile, ActionCard } from '@/lib/types/stationStandard';
import { getLocaleString } from '@/lib/utils/localeUtils';
import { Sparkles, ArrowRight, Clock, Briefcase, Wallet, Armchair, Baby, Accessibility, Compass, MapPin } from 'lucide-react';

interface L4_BambiProps {
    data: StationUIProfile;
}

export function L4_Bambi({ data }: L4_BambiProps) {
    const tL4 = useTranslations('l4');
    const locale = useLocale();
    const { l4_cards } = data;

    // User Demand State
    const [selectedDemand, setSelectedDemand] = useState<string | null>(null);
    const [destination, setDestination] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // Sort logic (Primary First)
    const sortedCards = [...(l4_cards || [])].sort((a, b) =>
        (a.type === 'primary' ? -1 : 1)
    );

    const primaryCard = sortedCards.find(c => c.type === 'primary');
    const secondaryCards = sortedCards.filter(c => c.type === 'secondary');

    // Demand Options Configuration (7 Contexts)
    const demandOptions = [
        { id: 'speed', icon: Clock, label: tL4('demands.speed') },
        { id: 'luggage', icon: Briefcase, label: tL4('demands.luggage') },
        { id: 'budget', icon: Wallet, label: tL4('demands.budget') },
        { id: 'comfort', icon: Armchair, label: tL4('demands.comfort') },
        { id: 'family', icon: Baby, label: tL4('demands.family') },
        { id: 'accessibility', icon: Accessibility, label: tL4('demands.accessibility') },
        { id: 'vibe', icon: Compass, label: tL4('demands.vibe') },
    ];

    const handleGenerate = () => {
        if (!selectedDemand && !destination) return; // Basic validation
        setIsAnalyzing(true);
        setShowResult(false);

        // Simulate Analysis
        setTimeout(() => {
            setIsAnalyzing(false);
            setShowResult(true);
        }, 1500);
    };

    // Reset when inputs change
    const onDemandSelect = (id: string) => {
        if (selectedDemand === id) {
            setSelectedDemand(null);
        } else {
            setSelectedDemand(id);
        }
        setShowResult(false);
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500 pb-20">

            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Sparkles size={16} />
                </div>
                <div>
                    <h3 className="text-sm font-black text-gray-900">{tL4('strategyTitle')}</h3>
                    <p className="text-[10px] text-gray-500 font-medium">{tL4('subtitle')}</p>
                </div>
            </div>

            {/* 1. Demand Menu (User Needs) - 7 Types */}
            <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">{tL4('demandCard')}</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                    {demandOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = selectedDemand === opt.id;
                        return (
                            <button
                                key={opt.id}
                                onClick={() => onDemandSelect(opt.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isSelected
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                                    : 'bg-white border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
                                    }`}
                            >
                                <Icon size={12} />
                                {opt.label}
                            </button>
                        );
                    })}
                </div>

                {/* Destination Input & Generate Action */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            目的地 / Destination
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                value={destination}
                                onChange={(e) => {
                                    setDestination(e.target.value);
                                    setShowResult(false);
                                }}
                                placeholder="例如: 成田機場, 新宿..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isAnalyzing || (!selectedDemand && !destination)}
                        className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${isAnalyzing || (!selectedDemand && !destination)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95'
                            }`}
                    >
                        {isAnalyzing ? (
                            <>
                                <Sparkles className="animate-spin" size={16} />
                                分析中...
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                生成最佳行動建議
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* 2. Results Section (Conditional) */}
            {showResult && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Primary Recommendation */}
                    {primaryCard ? (
                        <div className="relative group overflow-hidden rounded-3xl bg-gray-900 text-white shadow-xl shadow-indigo-200 transaction-all hover:scale-[1.01] duration-300">
                            {/* Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900 opacity-90" />

                            {/* Content */}
                            <div className="relative p-6 z-10">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-indigo-100 mb-4 shadow-sm">
                                    <Sparkles size={10} />
                                    {tL4('topPick')}
                                </div>

                                <h2 className="text-xl font-black leading-tight mb-2 text-white">
                                    {getLocaleString(primaryCard.title, locale)}
                                </h2>
                                <p className="text-sm font-medium text-indigo-100 leading-relaxed mb-6 opacity-90">
                                    {getLocaleString(primaryCard.description, locale)}
                                </p>

                                <a
                                    href={primaryCard.actionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-white text-indigo-900 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 active:scale-95 transition-all shadow-lg"
                                >
                                    {getLocaleString(primaryCard.actionLabel, locale)}
                                    <ArrowRight size={18} />
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 bg-gray-50 rounded-2xl border border-dashed text-center text-gray-400 text-xs">
                            {tL4('thinking')}
                        </div>
                    )}

                    {/* 3. Secondary Options */}
                    {secondaryCards.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1 pt-2">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{tL4('alternatives')}</h4>
                            </div>

                            {secondaryCards.map((card) => (
                                <div key={card.id} className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all">
                                    <h5 className="font-bold text-gray-900 mb-1">{getLocaleString(card.title, locale)}</h5>
                                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">{getLocaleString(card.description, locale)}</p>

                                    {card.actionUrl && (
                                        <a
                                            href={card.actionUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                                        >
                                            {getLocaleString(card.actionLabel, locale)}
                                            <ArrowRight size={14} />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Disclaimer */}
            <p className="text-[9px] text-gray-300 text-center px-6 leading-normal">
                {tL4('disclaimer')}
            </p>
        </div >
    );
}
