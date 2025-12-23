'use client';

import { useTranslations, useLocale } from 'next-intl';
import { StationUIProfile, L3Facility, FacilityType } from '@/lib/types/stationStandard';
import { getLocaleString } from '@/lib/utils/localeUtils';
import {
    User, // Toilet (Person)
    Briefcase, // Locker (Luggage storage)
    Zap, // Charging
    ArrowUpDown, // Elevator
    CircleDollarSign, // ATM
    Baby, // Nursery
    Bike, // Bike
    Wifi, // WiFi
    Info, // Info Center
    Cigarette, // Smoking
    Boxes, // Fallback
    ShoppingBag, // Shopping
    Utensils, // Dining
    Ticket, // Leisure
    TrainFront, // Transport
    Landmark, // Religion
    Trees, // Nature
    Bed, // Accommodation
} from 'lucide-react';

// Icon Mapping
const FACILITY_ICONS: Record<FacilityType | string, any> = {
    toilet: User,
    locker: Briefcase,
    charging: Zap,
    elevator: ArrowUpDown,
    atm: CircleDollarSign,
    nursery: Baby,
    bike: Bike,
    wifi: Wifi,
    info: Info,
    smoking: Cigarette,
    shopping: ShoppingBag,
    dining: Utensils,
    leisure: Ticket,
    transport: TrainFront,
    religion: Landmark,
    nature: Trees,
    accommodation: Bed
};

// Color Mapping (Soft Pastels for UI Consistency)
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
    const { l3_facilities } = data;
    const tL3 = useTranslations('l3');
    const locale = useLocale();

    if (!l3_facilities || l3_facilities.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400 text-xs bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                {tL3('noServices')}
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">

            {/* Header (Consistent L3 Style) */}
            <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">{tL3('servicesTitle')}</h3>
                <span className="text-[10px] font-bold text-gray-400">{tL3('facilitiesFound', { count: l3_facilities.length })}</span>
            </div>

            {/* Stacked List */}
            <div className="space-y-3">
                {l3_facilities.map((fac) => {
                    const Icon = FACILITY_ICONS[fac.type] || Boxes;
                    const colorClass = FACILITY_COLORS[fac.type] || 'bg-gray-100 text-gray-600';

                    return (
                        <div key={fac.id} className="group relative bg-white p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all duration-300">
                            <div className="flex items-start gap-4">
                                {/* Icon Badge */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                                    <Icon size={20} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
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

        </div>
    );
}
