'use client';

import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/stores/appStore';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin } from 'lucide-react';

interface NodeMarkerProps {
    node: {
        id: string;
        name: any;
        location: { coordinates: [number, number] }; // GeoJSON Point [lon, lat]
        type: string;
        is_hub: boolean;
        vibe?: string | null;
    };
    zone: 'core' | 'buffer' | 'outer';
    locale?: string; // Added for i18n
}

// Category to Icon mapping for dynamic styles with premium gradients
const CATEGORY_STYLE: Record<string, { icon: string; color: string; gradient: string }> = {
    shopping: { icon: '🛍️', color: 'bg-pink-500', gradient: 'from-pink-500 to-rose-600' },
    dining: { icon: '🍽️', color: 'bg-red-500', gradient: 'from-orange-500 to-red-600' },
    medical: { icon: '🏥', color: 'bg-emerald-500', gradient: 'from-emerald-400 to-teal-600' },
    education: { icon: '🎓', color: 'bg-violet-600', gradient: 'from-violet-500 to-indigo-700' },
    leisure: { icon: '🎭', color: 'bg-cyan-600', gradient: 'from-cyan-400 to-blue-600' },
    finance: { icon: '🏦', color: 'bg-indigo-500', gradient: 'from-slate-600 to-slate-800' },
    accommodation: { icon: '🏨', color: 'bg-orange-500', gradient: 'from-orange-400 to-amber-600' },
    nature: { icon: '🌳', color: 'bg-green-600', gradient: 'from-lime-500 to-green-700' },
    religious: { icon: '⛩️', color: 'bg-amber-600', gradient: 'from-amber-400 to-orange-700' },
    business: { icon: '🏢', color: 'bg-slate-600', gradient: 'from-gray-500 to-gray-700' },
    transit: { icon: '🚉', color: 'bg-blue-600', gradient: 'from-blue-500 to-indigo-700' }
};

export function NodeMarker({ node, zone, locale = 'zh-TW' }: NodeMarkerProps) {
    const { setCurrentNode, setBottomSheetOpen, currentNodeId } = useAppStore();

    // Support both old and new coordinate formats
    let lon = 0, lat = 0;
    if (Array.isArray((node as any).coordinates?.coordinates)) {
        [lon, lat] = (node as any).coordinates.coordinates;
    } else if (Array.isArray(node.location?.coordinates)) {
        [lon, lat] = node.location.coordinates;
    }

    const isSelected = currentNodeId === node.id;

    const handleClick = () => {
        setCurrentNode(node.id);
        setBottomSheetOpen(true);
    };

    // Determine primary icon and color based on dominant category or vibe
    const profile = (node as any).facility_profile || {};
    const dominant = profile.dominant_category || 'transit';
    const config = CATEGORY_STYLE[dominant] || CATEGORY_STYLE.transit;

    // --- SMART TAG LOGIC (AI Tag Visualization) ---
    let badgeLabel = null;
    let badgeIcon = null;
    const cats = profile.category_counts || {};

    // Select the most prominent stat
    if (dominant && cats[dominant] > 0) {
        badgeLabel = cats[dominant];
        badgeIcon = config.icon;
    }

    const iconMarkup = renderToStaticMarkup(
        <div className={`relative flex items-center justify-center transition-all duration-500 group ${isSelected ? 'z-50 scale-125' : 'z-10 hover:scale-110 hover:z-40'}`}>

            {/* 1. Pulse Layer */}
            {(isSelected || node.is_hub) && (
                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isSelected ? 'bg-indigo-500' : config.color}`} style={{ animationDuration: '3s' }} />
            )}

            {/* 2. Primary Marker Shape */}
            <div className="relative drop-shadow-2xl filter group-active:scale-95 transition-transform">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-[3px] shadow-lg
                    ${isSelected
                        ? 'bg-gray-900 border-white text-white'
                        : `bg-gradient-to-br ${config.gradient} border-white text-white`
                    }
                `}>
                    <div className="text-xl filter drop-shadow-md transform transition-transform group-hover:scale-110">
                        {config.icon}
                    </div>
                </div>

                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-r-[3px] border-b-[3px] border-white rounded-br-sm -z-10 -mt-2
                     ${isSelected ? 'bg-gray-900' : `bg-indigo-700`}
                 `} style={{ backgroundColor: !isSelected ? undefined : 'rgb(17, 24, 39)' }}></div>
            </div>

            {/* 3. Data Pill (Smart Tag) */}
            {badgeLabel && (
                <div className={`absolute -top-3 -right-3 px-2 py-0.5 rounded-full shadow-lg border border-white/40 backdrop-blur-xl flex items-center gap-1 min-w-[36px] justify-center transition-all duration-300
                    ${isSelected || node.is_hub ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'}
                    ${isSelected ? 'bg-indigo-600/90' : 'bg-black/60'} text-white text-[10px] font-black z-50
                `}>
                    <span className="opacity-90 text-[8px]">{badgeIcon}</span>
                    <span>{badgeLabel}</span>
                </div>
            )}

            {/* 4. Label (Name + Vibe Tag) */}
            {(isSelected || node.is_hub || zone === 'core') && (
                <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl font-black whitespace-nowrap shadow-2xl border border-white/50 backdrop-blur-md transition-all duration-300
                    ${isSelected
                        ? 'bg-gray-900/90 text-white scale-105 opacity-100 translate-y-0'
                        : node.is_hub
                            ? 'bg-white/90 text-gray-900 scale-100 opacity-100 translate-y-0'
                            : 'bg-white/60 text-gray-800 scale-90 opacity-80 hover:opacity-100 hover:scale-100 -translate-y-1'
                    }
                    ${(node.is_hub || isSelected) ? 'z-50' : 'z-30'}
                `}>
                    <div className="flex flex-col items-center gap-0">
                        <span className="text-xs tracking-tight">
                            {typeof node.name === 'string'
                                ? node.name
                                : (node.name?.[locale] || node.name?.['zh-TW'] || node.name?.['en'] || node.name?.['ja'] || 'Station')}
                        </span>
                        {/* Show Vibe Tags */}
                        {(node as any).vibe_tags?.[locale] && (
                            <div className="flex gap-1 mt-0.5">
                                {(node as any).vibe_tags[locale].slice(0, 2).map((v: string) => (
                                    <span key={v} className={`text-[8px] px-1 rounded-md font-bold ${isSelected ? 'text-indigo-300 bg-white/5' : 'text-indigo-600 bg-indigo-50'}`}>
                                        #{v}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const customIcon = L.divIcon({
        html: iconMarkup,
        className: 'custom-node-icon',
        iconSize: [48, 48],
        iconAnchor: [24, 48],
    });

    if (!lat || !lon) return null;

    return (
        <Marker
            position={[lat, lon]}
            icon={customIcon}
            eventHandlers={{
                click: handleClick,
            }}
        />
    );
}
