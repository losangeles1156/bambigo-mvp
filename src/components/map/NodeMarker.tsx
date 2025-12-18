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
}

const VIBE_STYLE: Record<string, { color: string; icon: string }> = {
    culture: { color: 'bg-amber-500', icon: '🎨' },
    geek: { color: 'bg-indigo-500', icon: '🎮' },
    transit: { color: 'bg-blue-600', icon: '🚉' },
    luxury: { color: 'bg-rose-500', icon: '💎' },
    tourism: { color: 'bg-orange-500', icon: '⛩️' },
};

export function NodeMarker({ node, zone }: NodeMarkerProps) {
    const { setCurrentNode, setBottomSheetOpen, currentNodeId } = useAppStore();
    const [lon, lat] = node.location.coordinates;
    const isSelected = currentNodeId === node.id;

    const handleClick = () => {
        setCurrentNode(node.id);
        setBottomSheetOpen(true);
    };

    // Use node's own zone for styling, fallback to 'core' if undefined
    const nodeZone = node.is_hub ? 'core' : 'buffer';
    const isCoreNode = nodeZone === 'core';
    const vibe = node.vibe || (node.is_hub ? 'transit' : null);
    const vibeConfig = vibe ? VIBE_STYLE[vibe] : null;

    // Create a dynamic premium icon using SVG + Lucide
    const iconMarkup = renderToStaticMarkup(
        <div className={`relative flex items-center justify-center transition-all duration-300 ${isSelected ? 'scale-125 -translate-y-2' : 'scale-100'}`}>
            {/* Outer Pulse for selected or hub nodes */}
            {(isSelected || (isCoreNode && node.is_hub)) && (
                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isSelected ? 'bg-indigo-500' : (vibeConfig?.color || 'bg-rose-400')}`} />
            )}

            {/* Icon Container */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transform rotate-45 transition-all border-2 ${isSelected
                ? 'bg-indigo-600 border-white text-white ring-4 ring-indigo-500/20'
                : vibeConfig
                    ? `${vibeConfig.color} border-white text-white`
                    : 'bg-white border-indigo-100 text-indigo-600 hover:border-indigo-300'
                }`}>
                <div className="-rotate-45 flex items-center justify-center">
                    {isSelected ? (
                        <MapPin size={22} fill="white" className="animate-bounce-short" />
                    ) : vibeConfig ? (
                        <span className="text-sm">{vibeConfig.icon}</span>
                    ) : node.is_hub ? (
                        <span className="text-sm font-bold">★</span>
                    ) : (
                        <MapPin size={18} />
                    )}
                </div>
            </div>

            {/* Label Tooltip for selected node */}
            {isSelected && (
                <div className="absolute -top-12 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-xl font-black whitespace-nowrap shadow-2xl animate-in fade-in slide-in-from-bottom-1 duration-300">
                    <div className="flex items-center gap-1.5">
                        {vibeConfig && <span>{vibeConfig.icon}</span>}
                        {node.name?.['zh-TW'] || node.name?.['en']}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
            )}
        </div>
    );

    const customIcon = L.divIcon({
        html: iconMarkup,
        className: 'custom-node-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });

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
