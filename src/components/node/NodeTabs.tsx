'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Map as MapIcon, ChevronDown, ChevronUp, Cloud, Zap, AlertOctagon } from 'lucide-react';
import { CollapsibleFacilitySection } from '../ui/CollapsibleFacilitySection';
import { FacilityDetailModal } from '../ui/FacilityDetailModal';
import { NodeProfile } from '@/lib/api/nodes';
import { L1_DNA } from './L1_DNA';
import { L2_Live } from './L2_Live';
import { L4_Bambi } from './L4_Bambi';

import dynamic from 'next/dynamic';

const StationMiniMap = dynamic(
    () => import('@/components/map/StationMiniMap'),
    { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" /> }
);

// Top Weather Alert Banner (Shared)
function TopWeatherAlert() {
    const [alert, setAlert] = useState<any>(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await fetch('/api/weather');
                if (res.ok) {
                    const data = await res.json();
                    if (data.alerts && data.alerts.length > 0) {
                        setAlert(data.alerts[0]);
                    }
                }
            } catch (error) { }
        };
        fetchAlerts();
    }, []);

    if (!alert) return null;

    return (
        <div className="mx-4 mt-2 mb-2 px-3 py-2 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-200 flex items-center gap-2 animate-in slide-in-from-top duration-500">
            <AlertOctagon size={16} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider flex-1 truncate">
                JMA WEATHER ALERT: {alert.title}
            </span>
            <span className="text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded">NOW</span>
        </div>
    );
}

interface NodeTabsProps {
    nodeData: any;
    profile: NodeProfile | null;
}

export function NodeTabs({ nodeData, profile }: NodeTabsProps) {
    const [activeTab, setActiveTab] = useState<'l1' | 'l2' | 'l3' | 'l4'>('l1');
    const [selectedFacility, setSelectedFacility] = useState<any>(null);
    const [isMapExpanded, setIsMapExpanded] = useState(false);

    const locale = useLocale();
    const tTabs = useTranslations('tabs');
    const tNode = useTranslations('node');

    return (
        <div className="pb-24"> {/* Bottom padding for fixed footer if needed */}

            {/* 0. Shared Page Header */}
            <div className="px-1 pt-2 pb-4 space-y-3">
                {/* Weather Alert */}
                <TopWeatherAlert />

                {/* Node Title & Weather */}
                <div className="flex items-start justify-between px-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                                {nodeData?.name?.[locale] || nodeData?.name?.['zh-TW'] || profile?.node_id || 'Unknown Station'}
                            </h1>
                            <span className="px-2 py-0.5 bg-gray-900 text-white text-[9px] font-black uppercase tracking-wider rounded-md">
                                STATION
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 font-bold tracking-wide">
                            {nodeData?.vibe ? nodeData.vibe.split(':')[0] : 'Cultural Node'}
                        </p>
                    </div>

                    {/* Weather Mini-Widget */}
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xl font-black text-gray-800">
                                {profile?.l2_status?.weather?.temp || 24}°,
                            </span>
                            <div className="text-orange-400">
                                {profile?.l2_status?.weather?.condition === 'Rain' ? (
                                    <Cloud size={20} className="text-blue-400" />
                                ) : (
                                    <Cloud size={20} fill="currentColor" className="text-yellow-400" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Preview (Collapsible) */}
                <div className="bg-gray-100 rounded-2xl overflow-hidden border border-white shadow-inner relative transition-all duration-300"
                    style={{ height: isMapExpanded ? '240px' : '80px' }}>

                    {nodeData?.location?.coordinates ? (
                        <div className="absolute inset-0">
                            <StationMiniMap
                                lat={nodeData.location.coordinates[1]}
                                lon={nodeData.location.coordinates[0]}
                            />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                            <MapIcon className="text-gray-300 opacity-50" size={32} />
                            <span className="ml-2 text-xs font-black text-gray-400 uppercase tracking-widest">Preview Unavailable</span>
                        </div>
                    )}

                    {/* Overlay Gradient (only when collapsed to indicate there's more) */}
                    {!isMapExpanded && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                    )}

                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsMapExpanded(!isMapExpanded)}
                        className="absolute bottom-2 right-2 p-1.5 bg-white rounded-lg shadow-sm text-gray-500 hover:text-indigo-600 transition-colors z-[1000]"
                    >
                        {isMapExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6 px-1">
                {/* Tab Headers - Premium Glassmorphism */}
                <div className="flex p-1 bg-gray-100/80 backdrop-blur-md rounded-xl border border-gray-200/50 relative overflow-hidden shadow-inner">
                    <button
                        onClick={() => setActiveTab('l1')}
                        className={`flex-1 py-3 text-[10px] font-black tracking-widest transition-all rounded-lg relative z-10 ${activeTab === 'l1'
                            ? 'bg-white text-indigo-600 shadow-sm scale-100'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-white/50 scale-[0.98]'
                            }`}
                    >
                        {tTabs('dna')}
                    </button>
                    <button
                        onClick={() => setActiveTab('l2')}
                        className={`flex-1 py-3 text-[10px] font-black tracking-widest transition-all rounded-lg relative z-10 ${activeTab === 'l2'
                            ? 'bg-white text-indigo-600 shadow-sm scale-100'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-white/50 scale-[0.98]'
                            }`}
                    >
                        {tTabs('live')}
                    </button>
                    <button
                        onClick={() => setActiveTab('l3')}
                        className={`flex-1 py-3 text-[10px] font-black tracking-widest transition-all rounded-lg relative z-10 ${activeTab === 'l3'
                            ? 'bg-white text-indigo-600 shadow-sm scale-100'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-white/50 scale-[0.98]'
                            }`}
                    >
                        {tTabs('facility')}
                    </button>
                    <button
                        onClick={() => setActiveTab('l4')}
                        className={`flex-1 py-3 text-[10px] font-black tracking-widest transition-all rounded-lg relative z-10 ${activeTab === 'l4'
                            ? 'bg-white text-indigo-600 shadow-sm scale-100'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-white/50 scale-[0.98]'
                            }`}
                    >
                        {tTabs('bambi')}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                    {activeTab === 'l1' && (
                        <L1_DNA nodeData={nodeData} profile={profile} />
                    )}

                    {activeTab === 'l2' && (
                        <L2_Live profile={profile} />
                    )}

                    {activeTab === 'l3' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                            {/* Shared Bike Section (New) */}
                            <div className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-black text-teal-800 uppercase tracking-wide mb-0.5">Hello Cycling</h4>
                                    <p className="text-[10px] text-teal-600 font-medium">Station North Port • 5 bikes available</p>
                                </div>
                                <button className="px-3 py-1.5 bg-white text-teal-600 text-[10px] font-black rounded-lg shadow-sm border border-teal-100">
                                    RENT
                                </button>
                            </div>

                            {/* Facilities List */}
                            {(() => {
                                const validL3Categories = ['toilet', 'locker', 'elevator', 'atm', 'wifi', 'charging', 'info', 'nursing', 'smoking', 'accessibility'];
                                const filteredFacilities = profile?.l3_facilities?.filter(f => validL3Categories.includes(f.category || '')) || [];

                                return filteredFacilities.length > 0 ? (
                                    <CollapsibleFacilitySection
                                        facilities={filteredFacilities}
                                        onFacilityClick={(fac) => setSelectedFacility(fac)}
                                        locale={locale}
                                    />
                                ) : (
                                    <div className="p-8 text-center text-gray-400 italic text-xs">{tNode('noL3Facilities')}</div>
                                );
                            })()}
                        </div>
                    )}

                    {activeTab === 'l4' && (
                        <L4_Bambi profile={profile} />
                    )}
                </div>
            </div >

            {/* Facility Detail Modal */}
            < FacilityDetailModal
                facility={selectedFacility}
                onClose={() => setSelectedFacility(null)
                }
            />
        </div>
    );
}
