'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
    MapPin, X, Star, Lightbulb, ChevronRight,
    Coffee, ShoppingBag, Landmark, Utensils, Bed, TreePine,
    Hospital, Building2, Briefcase, Search
} from 'lucide-react';
import { getLocaleString, normalizeVibeTagsForDisplay } from '@/lib/utils/localeUtils';
import { useStationDNA, L1CategorySummary, VibeTag } from '@/hooks/useStationDNA';
import { PlaceCard } from './PlaceCard';
import { L1Place } from '@/hooks/useL1Places';
import { useCategoryTranslation } from '@/hooks/useCategoryTranslation';

// Enhanced Icon Map with Colors
const CATEGORY_STYLE: Record<string, { icon: any; color: string; bgColor: string; borderColor: string }> = {
    dining: { icon: Utensils, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-100' },
    shopping: { icon: ShoppingBag, color: 'text-pink-600', bgColor: 'bg-pink-50', borderColor: 'border-pink-100' },
    culture: { icon: Landmark, color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-100' },
    leisure: { icon: Coffee, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100' },
    nature: { icon: TreePine, color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-100' },
    medical: { icon: Hospital, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-100' },
    business: { icon: Building2, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-100' },
    service: { icon: Landmark, color: 'text-slate-600', bgColor: 'bg-slate-50', borderColor: 'border-slate-100' },
    finance: { icon: Briefcase, color: 'text-cyan-700', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-100' },
    accommodation: { icon: Bed, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-100' },
    default: { icon: MapPin, color: 'text-gray-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' }
};

export function L1_DNA({ data }: { data?: any }) {
    const tL1 = useTranslations('l1');
    const tTag = useTranslations('tag');
    const { getCategoryLabel, getSubcategoryLabel } = useCategoryTranslation();
    const locale = useLocale();

    const { title, tagline, categories, vibe_tags, loading } = useStationDNA();

    const displayVibeTags = useMemo(() => {
        if (vibe_tags && vibe_tags.length > 0) {
            return vibe_tags.map((t: VibeTag) => ({ id: t.id, label: t.label, count: t.count }));
        }

        return normalizeVibeTagsForDisplay(data?.l1_dna?.vibe_tags ?? data?.vibe_tags);
    }, [vibe_tags, data]);

    // Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [activeSubcategory, setActiveSubcategory] = useState<string | 'all'>('all');

    const toggleDrawer = (categoryId: string | null) => {
        setActiveCategoryId(categoryId);
        setActiveSubcategory('all');
        setDrawerOpen(!!categoryId);
    };

    const categoryList = Object.values(categories).sort((a, b) => b.count - a.count);

    // Active Data for Drawer
    const activeCategory = activeCategoryId ? categories[activeCategoryId] : null;
    const subcategories = useMemo(() => {
        if (!activeCategory) return [];
        const subs = new Set<string>();
        activeCategory.representative_spots.forEach(p => {
            if (p.subcategory) subs.add(p.subcategory);
        });
        return Array.from(subs).sort();
    }, [activeCategory]);

    const filteredItems = useMemo(() => {
        if (!activeCategory) return [];
        if (activeSubcategory === 'all') return activeCategory.representative_spots;
        return activeCategory.representative_spots.filter(p => p.subcategory === activeSubcategory);
    }, [activeCategory, activeSubcategory]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">

            {/* 1. Bambi Insight Hero (Premium Glassmorphism) */}
            <div className="group">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <Star size={14} fill="currentColor" />
                    </div>
                    <h3 className="font-extrabold text-[11px] uppercase tracking-[0.2em] text-gray-400">{tL1('dnaTitle')}</h3>
                </div>

                <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl transition-all hover:shadow-indigo-500/10">
                    {/* Animated Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-500/70" />

                    {/* Glass Overlay */}
                    <div className="absolute inset-0 backdrop-blur-[2px] bg-white/5" />

                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />

                    <div className="relative z-10 p-7 sm:p-8">
                        <div className="flex items-start justify-between mb-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white border border-white/30">
                                <Lightbulb size={12} className="text-yellow-300" />
                                {tL1('bambiInsight')}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                                L1
                            </span>
                        </div>

                        <h2 className="text-3xl font-black text-white mb-2 leading-[1.1] tracking-tight">
                            {getLocaleString(title, locale)}
                        </h2>
                        <p className="text-sm font-medium text-white/80 max-w-[85%] leading-relaxed mb-8">
                            {getLocaleString(tagline, locale)}
                        </p>

                        {/* Personality Vibe Chips */}
                        {displayVibeTags.length > 0 && (
                            <div className="flex flex-wrap gap-2.5">
                                {displayVibeTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        className="group/chip flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-xl transition-all active:scale-95"
                                    >
                                        <span className="text-xs font-bold text-white tracking-wide">#{getLocaleString(tag.label, locale)}</span>
                                        {typeof tag.count === 'number' && (
                                            <>
                                                <div className="h-4 w-[1px] bg-white/20" />
                                                <span className="text-[10px] font-black text-indigo-200">
                                                    {tag.count}
                                                </span>
                                            </>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Exploration Categories (Drawer Triggers) */}
            <div className="px-1">
                <div className="flex items-center justify-between mb-5">
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{tL1('nearbyHighlights')}</h4>
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{categoryList.reduce((acc, cat) => acc + cat.count, 0)} Total</span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-3xl" />)}
                    </div>
                ) : categoryList.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Search size={32} />
                        </div>
                        <p className="text-xs text-gray-400 font-bold">{tL1('noHighlights')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {categoryList.map((cat: L1CategorySummary) => {
                            const style = CATEGORY_STYLE[cat.id] || CATEGORY_STYLE.default;
                            const Icon = style.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleDrawer(cat.id)}
                                    className={`group relative flex flex-col items-start p-5 rounded-[2rem] bg-white border ${style.borderColor} hover:shadow-xl hover:shadow-indigo-500/5 transition-all active:scale-[0.98] overflow-hidden`}
                                >
                                    {/* Subtle Bg Icon */}
                                    <div className={`absolute -right-2 -bottom-2 opacity-[0.03] ${style.color}`}>
                                        <Icon size={80} />
                                    </div>

                                    <div className={`w-12 h-12 rounded-2xl ${style.bgColor} ${style.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                                        <Icon size={24} strokeWidth={2.5} />
                                    </div>

                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-black text-gray-900">
                                            {getCategoryLabel(cat.id)}
                                        </span>
                                        <span className={`text-[10px] font-black ${style.color}`}>
                                            {cat.count}
                                        </span>
                                    </div>
                                    <div className="mt-1 flex items-center text-[10px] font-bold text-gray-400 group-hover:text-indigo-500 transition-colors">
                                        Explore <ChevronRight size={12} strokeWidth={3} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 3. Immersive Category Drawer */}
            {drawerOpen && activeCategory && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => toggleDrawer(null)}
                    />

                    {/* Drawer Content */}
                    <div className="relative bg-white w-full max-h-[85vh] rounded-t-[3rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500 mx-auto max-w-lg overflow-hidden border-t border-white/20">
                        {/* Drag Handle */}
                        <div className="flex justify-center pt-4 pb-2" onClick={() => toggleDrawer(null)}>
                            <div className="w-12 h-1.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer" />
                        </div>

                        {/* Header Area */}
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl ${CATEGORY_STYLE[activeCategory.id]?.bgColor || 'bg-gray-100'} ${CATEGORY_STYLE[activeCategory.id]?.color || 'text-gray-900'} flex items-center justify-center shadow-lg shadow-black/5`}>
                                        {(() => {
                                            const Icon = CATEGORY_STYLE[activeCategory.id]?.icon || MapPin;
                                            return <Icon size={28} strokeWidth={2.5} />;
                                        })()}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 leading-tight">
                                            {getCategoryLabel(activeCategory.id)}
                                        </h3>
                                        <p className="text-xs font-bold text-gray-400 mt-0.5">
                                            {tL1('nearbyHighlights').replace('(300m)', '')} {activeCategory.count} {tTag('countSuffix')}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleDrawer(null)}
                                    className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 active:scale-90 transition-all border border-gray-100"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>

                            {/* Subcategory Tabs */}
                            {subcategories.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
                                    <button
                                        onClick={() => setActiveSubcategory('all')}
                                        className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black transition-all ${activeSubcategory === 'all' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        {tL1('menuTitle')}
                                    </button>
                                    {subcategories.map(sub => (
                                        <button
                                            key={sub}
                                            onClick={() => setActiveSubcategory(sub)}
                                            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black transition-all ${activeSubcategory === sub ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            {getSubcategoryLabel(sub)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Scrollable List */}
                        <div className="flex-1 overflow-y-auto px-6 pt-2 pb-12 bg-gray-50/50 space-y-4">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item, idx) => (
                                    <div
                                        key={item.osm_id || idx}
                                        className="animate-in fade-in slide-in-from-bottom duration-500"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <PlaceCard place={item} />
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center text-gray-400 font-bold text-sm">
                                    No spots match your filter.
                                </div>
                            )}
                            <div className="h-10" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
