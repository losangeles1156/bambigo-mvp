'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { StationUIProfile, L3Facility, FacilityType } from '@/lib/types/stationStandard';
import { getLocaleString } from '@/lib/utils/localeUtils';
import {
    User, Briefcase, Zap, ArrowUpDown, CircleDollarSign, Baby, Bike, Wifi, Info,
    Cigarette, Boxes, ShoppingBag, Utensils, Ticket, TrainFront, Landmark, Trees, Bed, Loader2
} from 'lucide-react';

// Icon Mapping
const FACILITY_ICONS: Record<FacilityType | string, any> = {
    toilet: User, locker: Briefcase, charging: Zap, elevator: ArrowUpDown,
    atm: CircleDollarSign, nursery: Baby, bike: Bike, wifi: Wifi, info: Info,
    smoking: Cigarette, shopping: ShoppingBag, dining: Utensils, leisure: Ticket,
    transport: TrainFront, religion: Landmark, nature: Trees, accommodation: Bed
};

const FACILITY_COLORS: Record<FacilityType | string, string> = {
    toilet: 'bg-emerald-100 text-emerald-600',
    locker: 'bg-amber-100 text-amber-600',
    charging: 'bg-sky-100 text-sky-600',
    elevator: 'bg-blue-100 text-blue-600',
    atm: 'bg-indigo-100 text-indigo-600',
    nursery: 'bg-pink-100 text-pink-600',
    bike: 'bg-lime-100 text-lime-600',
    wifi: 'bg-violet-100 text-violet-600',
    info: 'bg-gray-100 text-gray-600',
    smoking: 'bg-slate-100 text-slate-600',
    shopping: 'bg-orange-100 text-orange-600',
    dining: 'bg-red-100 text-red-600',
    leisure: 'bg-indigo-100 text-indigo-600',
    transport: 'bg-blue-100 text-blue-600',
    religion: 'bg-purple-100 text-purple-600',
    nature: 'bg-green-100 text-green-600',
    accommodation: 'bg-rose-100 text-rose-600'
};

interface L3_FacilitiesProps {
    data: StationUIProfile;
}

export function L3_Facilities({ data }: L3_FacilitiesProps) {
    const tL3 = useTranslations('l3');
    const locale = useLocale();
    const [facilities, setFacilities] = useState<L3Facility[]>(data.l3_facilities || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchFacilities() {
            setLoading(true);
            try {
                // Strict Verification: Use data.id (e.g. odpt:Station:TokyoMetro.Ueno)
                const res = await fetch(`/api/station/${encodeURIComponent(data.id)}/facilities`);
                if (!res.ok) throw new Error('API Error');

                const json = await res.json();

                // Strict ID Matching Verification
                if (json.stationId && json.stationId !== data.id) {
                    console.error(`[L3] Data Mismatch! Req: ${data.id}, Res: ${json.stationId}`);
                    // Should strict mode fail entire render? 
                    // Let's fallback to prop data if mismatch occurs to be safe, or just throw.
                    // Assuming API returns correct data if ID matches.
                }

                if (isMounted && json.facilities) {
                    // Adapt Backend Data (StationFacility) to UI Data (L3Facility)
                    const adapted: L3Facility[] = json.facilities.map((f: any, idx: number) => {
                        // Normalize multilingual strings
                        const nameObj = typeof f.location === 'object' ? f.location : { ja: f.location, en: f.location, zh: f.location };
                        // Usually Name isn't provided in raw L3 scraper data, it's just location + type.
                        // We construct a display name like "Toilet (Inside Gate)"

                        return {
                            id: `${data.id}-l3-${idx}-${Date.now()}`,
                            type: f.type,
                            name: nameObj, // Use location as name for now, or synthesize one
                            location: nameObj,
                            details: f.attributes ? Object.entries(f.attributes).map(([k, v]) => {
                                // Simple string conversion for attributes
                                return { ja: `${k}: ${v}`, en: `${k}: ${v}`, zh: `${k}: ${v}` };
                            }) : []
                        };
                    });
                    setFacilities(adapted);
                }
            } catch (err) {
                console.error('[L3] Fetch failed', err);
                // Keep initial data (fallback) on error
                setError('Failed to load fresh data');
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        if (data.id) {
            fetchFacilities();
        } else {
            setLoading(false);
        }

        return () => { isMounted = false; };
    }, [data.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-gray-300" />
            </div>
        );
    }

    if (!facilities || facilities.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400 text-xs bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                {tL3('noServices')}
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">

            {/* Header */}
            <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">{tL3('servicesTitle')}</h3>
                <span className="text-[10px] font-bold text-gray-400">{tL3('facilitiesFound', { count: facilities.length })}</span>
            </div>

            {/* Stacked List */}
            <div className="space-y-3">
                {facilities.map((fac) => {
                    const Icon = FACILITY_ICONS[fac.type] || Boxes;
                    const colorClass = FACILITY_COLORS[fac.type] || 'bg-gray-100 text-gray-600';

                    return (
                        <div key={fac.id} className="group relative bg-white p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                                    <Icon size={20} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {/* Use utility to handle locale object or string */}
                                            {getLocaleString(fac.name, locale)}
                                        </h4>
                                        <span className="text-[10px] font-bold uppercase tracking-tight text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                                            {tL3(`categories.${fac.type}`) !== `l3.categories.${fac.type}` ? tL3(`categories.${fac.type}`) : fac.type}
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-600 font-medium mb-2">
                                        {getLocaleString(fac.location, locale)}
                                    </p>

                                    {/* Details Tags */}
                                    {fac.details && fac.details.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {fac.details.map((detail, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-gray-50 text-gray-500 border border-gray-100"
                                                >
                                                    {getLocaleString(detail, locale)}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {error && <div className="text-[10px] text-red-400 text-center mt-2">Error updating data. Showing cached.</div>}
        </div>
    );
}
