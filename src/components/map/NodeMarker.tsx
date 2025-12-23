'use client';

import { Marker } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '@/stores/appStore';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapPin, Cloud, Sun, Wind, Crown, TreeDeciduous, Landmark, Zap, Tent } from 'lucide-react';

interface NodeMarkerProps {
    node: {
        id: string;
        name: any;
        location: { coordinates: [number, number] }; // GeoJSON Point [lon, lat]
        type: string;
        is_hub: boolean;
        tier?: 'major' | 'minor';
        mapDesign?: { color?: string; icon?: string };
        vibe?: string | null;
        facility_profile?: any;
    };
    zone: 'core' | 'buffer' | 'outer';
    locale?: string;
}

// Category to Icon mapping for dynamic styles
const CATEGORY_STYLE: Record<string, { icon: any; color: string; gradient: string }> = {
    shopping: { icon: '🛍️', color: 'bg-pink-500', gradient: 'from-pink-500 to-rose-600' },
    dining: { icon: '🍽️', color: 'bg-red-500', gradient: 'from-orange-500 to-red-600' },
    medical: { icon: '🏥', color: 'bg-emerald-500', gradient: 'from-emerald-400 to-teal-600' },
    transit: { icon: '🚉', color: 'bg-blue-600', gradient: 'from-blue-500 to-indigo-700' },
    // Defaults for others...
    default: { icon: '📍', color: 'bg-slate-600', gradient: 'from-gray-500 to-gray-700' }
};

export function NodeMarker({ node, zone, locale = 'zh-TW' }: NodeMarkerProps) {
    const { setCurrentNode, setBottomSheetOpen, currentNodeId } = useAppStore();

    // Coordinate Parsing
    let lon = 0, lat = 0;
    if (Array.isArray((node as any).coordinates?.coordinates)) {
        [lon, lat] = (node as any).coordinates.coordinates;
    } else if (Array.isArray(node.location?.coordinates)) {
        [lon, lat] = node.location.coordinates;
    }

    if (!lat || !lon) return null;

    const isSelected = currentNodeId === node.id;
    const isMajor = node.tier === 'major' || node.is_hub;

    // Style Determination
    const profile = node.facility_profile || {};
    const dominant = profile.dominant_category || 'default';
    const defaultStyle = CATEGORY_STYLE[dominant] || CATEGORY_STYLE.default;

    // Custom Design Override (The user request)
    const customIconId = node.mapDesign?.icon;
    const customColor = node.mapDesign?.color;

    // Icon Selection logic (Lucide Icons for professional look)
    let DisplayIcon = MapPin; // Default
    if (customIconId === 'park') DisplayIcon = TreeDeciduous; // Ueno (Park)
    if (customIconId === 'red_brick') DisplayIcon = Landmark; // Tokyo (Station)
    if (customIconId === 'electric') DisplayIcon = Zap; // Akihabara
    if (customIconId === 'lantern') DisplayIcon = Tent; // Asakusa (Proxy)

    const displayGradient = customColor
        ? `from-[${customColor}] to-[${customColor}]` // Custom solid
        : defaultStyle.gradient;

    const handleClick = () => {
        setCurrentNode(node.id);
        setBottomSheetOpen(true);
    };

    const iconMarkup = renderToStaticMarkup(
        <div className={`relative flex items-center justify-center transition-all duration-500 group ${isSelected ? 'z-50 scale-125' : 'z-10 hover:scale-110 hover:z-40'}`}>

            {/* 1. Pulse Layer */}
            {(isSelected || isMajor) && (
                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 bg-indigo-500`} style={{ animationDuration: '3s' }} />
            )}

            {/* 2. Primary Marker Shape */}
            <div className="relative drop-shadow-2xl filter group-active:scale-95 transition-transform">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-[3px] shadow-lg
                    ${isSelected
                        ? 'bg-gray-900 border-white text-white'
                        : `bg-gradient-to-br ${displayGradient} border-white text-white`
                    }
                `} style={{ backgroundColor: customColor }}>
                    <div className="filter drop-shadow-md transform transition-transform group-hover:scale-110">
                        {/* Render Lucide Icon */}
                        <DisplayIcon size={24} strokeWidth={2.5} />
                    </div>
                </div>

                {/* Crown for Hubs */}
                {isMajor && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-md">
                        <Crown size={16} fill="currentColor" />
                    </div>
                )}

                {/* Pointer */}
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-r-[3px] border-b-[3px] border-white rounded-br-sm -z-10 -mt-2 bg-indigo-700`}
                    style={{ backgroundColor: customColor || '#4338ca' }}>
                </div>
            </div>

            {/* 3. Label (Name) */}
            {
                (isSelected || isMajor) && (
                    <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl font-black whitespace-nowrap shadow-2xl border border-white/50 backdrop-blur-md transition-all duration-300
                    ${isSelected
                            ? 'bg-gray-900/90 text-white scale-105 opacity-100 translate-y-0'
                            : 'bg-white/90 text-gray-900 scale-100 opacity-100 translate-y-0'
                        }
                    z-50
                `}>
                        <div className="flex flex-col items-center gap-0">
                            <span className="text-xs tracking-tight">
                                {typeof node.name === 'string'
                                    ? node.name
                                    : (node.name?.[locale] || node.name?.['zh-TW'] || node.name?.['en'] || 'Station')}
                            </span>
                        </div>
                    </div>
                )
            }
        </div>
    );

    const leafletIcon = L.divIcon({
        html: iconMarkup,
        className: 'custom-node-icon',
        iconSize: [56, 56],
        iconAnchor: [28, 56],
    });

    return (
        <Marker
            position={[lat, lon]}
            icon={leafletIcon}
            eventHandlers={{
                click: handleClick,
            }}
        />
    );
}
