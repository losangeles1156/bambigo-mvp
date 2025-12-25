'use client';

import { useState } from 'react';
import { ChevronDown, MapPin, ExternalLink, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FacilityItem {
    id: string;
    category: string;
    subCategory: string;
    location: string;
    attributes?: Record<string, any>;
}
interface CollapsibleFacilitySectionProps {
    facilities: any[];
    onFacilityClick?: (facility: any) => void;
    locale?: string;
}

// Category configuration with icons and colors
const CATEGORY_STYLE: Record<string, { icon: string; color: string; bgColor: string; borderColor: string }> = {
    toilet: { icon: '🚻', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    locker: { icon: '🧳', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    elevator: { icon: '🛗', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    atm: { icon: '🏧', color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
    wifi: { icon: '📶', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    charging: { icon: '🔌', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    info: { icon: 'ℹ️', color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
    nursing: { icon: '🍼', color: 'text-pink-600', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' },
    smoking: { icon: '🚬', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
    accessibility: { icon: '♿', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
};

export function CollapsibleFacilitySection({ facilities, onFacilityClick, locale = 'zh-TW' }: CollapsibleFacilitySectionProps) {
    // Default to first category available if any
    const grouped = facilities.reduce((acc, fac) => {
        const cat = fac.facility_type || fac.category || 'other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(fac);
        return acc;
    }, {} as Record<string, any[]>);

    const sortedCategories = Object.keys(grouped).sort();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(sortedCategories[0] || null);

    const t = useTranslations('ui');
    const tL3 = useTranslations('l3');

    return (
        <div className="space-y-4">
            {/* 1. Category Grid (3 Columns) */}
            <div className="grid grid-cols-3 gap-2">
                {sortedCategories.map(cat => {
                    const style = CATEGORY_STYLE[cat] || { icon: '📍', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
                    const isSelected = selectedCategory === cat;
                    const items = grouped[cat];

                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(isSelected ? null : cat)}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden ${isSelected
                                    ? `${style.bgColor} ${style.borderColor} ring-2 ring-current ring-opacity-20 shadow-md scale-[1.02]`
                                    : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-2xl mb-1 filter drop-shadow-sm">{style.icon}</span>
                            <span className={`text-[10px] font-black uppercase tracking-tight ${isSelected ? style.color : 'text-gray-500'}`}>
                                {tL3(`categories.${cat}`) || cat}
                            </span>
                            <span className={`text-[9px] font-bold mt-0.5 px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/50 text-gray-700' : 'bg-gray-100 text-gray-400'}`}>
                                x{items.length}
                            </span>

                            {isSelected && (
                                <div className={`absolute bottom-0 w-8 h-1 rounded-t-full ${style.color.replace('text-', 'bg-')}`} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* 2. Detail List (Animated) */}
            {selectedCategory && grouped[selectedCategory] && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <h4 className="font-black text-sm text-gray-900 flex items-center gap-2">
                                <span>{CATEGORY_STYLE[selectedCategory]?.icon}</span>
                                <span>{tL3(`categories.${selectedCategory}`)}</span>
                                <span className="text-gray-400 font-medium text-xs">列表</span>
                            </h4>
                            <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-1 rounded-lg font-bold">
                                {grouped[selectedCategory].length} {t('items')}
                            </span>
                        </div>

                        {/* List */}
                        <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                            {grouped[selectedCategory].map((fac: any, idx: number) => (
                                <div
                                    key={fac.id || idx}
                                    onClick={() => onFacilityClick?.(fac)}
                                    className="p-4 hover:bg-indigo-50/10 active:bg-indigo-50/30 transition-colors cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="font-black text-xs text-gray-800">
                                            {fac.name?.[locale] || fac.name?.['zh-TW'] || fac.location || 'Facility'}
                                        </div>
                                        {/* Distance placeholder (if needed) */}
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                            <span>50m</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <MapPin size={12} className="text-gray-300 mt-0.5 flex-shrink-0" />
                                        <p className="text-[11px] text-gray-500 font-medium leading-tight">
                                            {fac.direction?.[locale] || fac.direction?.['zh-TW'] || fac.location || fac.direction}
                                        </p>
                                    </div>

                                    {/* Attributes */}
                                    {fac.attributes && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {Object.entries(fac.attributes).map(([key, value]) => {
                                                if (!value || ['note', 'count'].includes(key)) return null;
                                                // Only show concise tags
                                                return (
                                                    <span key={key} className="text-[9px] font-bold text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded-md">
                                                        {tL3(`attributes.${key}`) || key}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Expand/Collapse Hint (Optional) */}
                        <div className="p-2 bg-gray-50 text-center border-t border-gray-100">
                            <ChevronDown size={14} className="mx-auto text-gray-300" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
