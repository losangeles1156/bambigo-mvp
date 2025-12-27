'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
    MapPin, X, Star, Lightbulb, ChevronRight,
    Coffee, ShoppingBag, Landmark, Utensils, Bed, Building, TreePine,
    Stethoscope, Briefcase, ConciergeBell, GraduationCap
} from 'lucide-react';
import { getLocaleString } from '@/lib/utils/localeUtils';
import { useStationDNA, L1CategorySummary, VibeTag } from '@/hooks/useStationDNA';
import { PlaceCard } from './PlaceCard';
import { L1Place } from '@/hooks/useL1Places';

// Icon Mapping
const ICON_MAP: Record<string, any> = {
    nature: TreePine,
    shopping: ShoppingBag,
    dining: Utensils,
    leisure: Coffee,
    culture: Landmark,
    service: ConciergeBell,
    medical: Stethoscope,
    education: GraduationCap,
    finance: Briefcase,
    accommodation: Bed,
    building: Building
};

export function L1_DNA() {
    const tL1 = useTranslations('l1');
    const locale = useLocale();

    // Fetch Aggregated Data
    const { title, tagline, categories, vibe_tags, loading } = useStationDNA();

    // Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState('');
    const [drawerItems, setDrawerItems] = useState<L1Place[]>([]);

    // Simple Drawer Hander
    const openDrawer = (title: string, items: L1Place[]) => {
        setDrawerTitle(title);
        setDrawerItems(items);
        setDrawerOpen(true);
    };

    const categoryList = Object.values(categories).sort((a, b) => b.count - a.count);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500 relative">

            {/* 1. Vibe Dashboard (Hero) */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                        <Star size={16} fill="currentColor" />
                    </div>
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-500">{tL1('dnaTitle')}</h3>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-lg p-5">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Lightbulb size={120} />
                    </div>

                    <div className="relative z-10">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-black uppercase tracking-wider mb-2 border border-white/30">
                            {tL1('bambiInsight')}
                        </span>
                        <h2 className="text-xl font-black mb-1 leading-tight">
                            {getLocaleString(title, locale)}
                        </h2>
                        <p className="text-xs font-medium opacity-90 mb-4">
                            {getLocaleString(tagline, locale)}
                        </p>

                        {/* Vibe Chips */}
                        {vibe_tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {vibe_tags.map((tag: VibeTag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() => openDrawer(`#${getLocaleString(tag.label, locale)}`, tag.spots || [])}
                                        className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all active:scale-95"
                                    >
                                        <span className="text-[10px] font-bold">#{getLocaleString(tag.label, locale)}</span>
                                        <span className="text-[9px] bg-white text-indigo-600 px-1.5 rounded-full font-black">
                                            {tag.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Categories Grid (Drawer Trigger) */}
            <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">{tL1('nearbyHighlights')}</h4>

                {categoryList.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        {loading ? 'Loading...' : tL1('noHighlights')}
                    </div>
                ) : (
                    <div className="grid grid-cols-5 gap-y-4 gap-x-2">
                        {categoryList.map((cat: L1CategorySummary) => {
                            const Icon = ICON_MAP[cat.id] || MapPin;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => openDrawer(getLocaleString(cat.label, locale), cat.representative_spots || [])}
                                    className="flex flex-col items-center gap-1.5 p-1 group transition-transform active:scale-95"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 group-hover:border-indigo-200 group-hover:text-indigo-500 group-hover:shadow-indigo-100 transition-all relative">
                                        <Icon size={18} />
                                        {cat.count > 0 && (
                                            <div className="absolute -top-1 -right-1 bg-gray-900 text-white text-[8px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-bold shadow-sm">
                                                {cat.count > 99 ? '99+' : cat.count}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-500 group-hover:text-indigo-600 truncate max-w-full">
                                        {getLocaleString(cat.label, locale)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 3. The Drawer (Overlay) */}
            {drawerOpen && (
                <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col pointer-events-none">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300"
                        onClick={() => setDrawerOpen(false)}
                    />

                    {/* Sheet Content */}
                    <div className="bg-white w-full max-h-[70vh] rounded-t-3xl shadow-2xl flex flex-col pointer-events-auto animate-in slide-in-from-bottom duration-300 relative mx-auto max-w-md">
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-1" onClick={() => setDrawerOpen(false)}>
                            <div className="w-10 h-1 rounded-full bg-gray-200" />
                        </div>

                        {/* Header */}
                        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                {drawerTitle}
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                    {drawerItems.length}
                                </span>
                            </h3>
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 safe-bottom">
                            {drawerItems.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    No spots found.
                                </div>
                            ) : (
                                drawerItems.map((item, idx) => (
                                    <PlaceCard key={item.osm_id || idx} place={item} />
                                ))
                            )}
                            <div className="h-8" /> {/* Pad bottom */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
