'use client';

import { useL1Places } from '@/hooks/useL1Places';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { ShoppingBag, Utensils, Coffee, MapPin, Stethoscope } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCategoryTranslation } from '@/hooks/useCategoryTranslation';

const CATEGORY_COLOR = {
    shopping: '#F472B6', // Pink
    dining: '#F59E0B',   // Amber
    convenience: '#EF4444', // Red
    medical: '#10B981',   // Emerald
    default: '#6B7280'    // Gray
};

export function L1Layer() {
    const { places } = useL1Places();
    const map = useMap();
    const [visible, setVisible] = useState(false);
    const { getCategoryLabel } = useCategoryTranslation();

    // Only show when zoomed in
    useEffect(() => {
        const checkZoom = () => setVisible(map.getZoom() >= 16);
        map.on('zoomend', checkZoom);
        checkZoom();
        return () => { map.off('zoomend', checkZoom); };
    }, [map]);

    if (!visible) return null;

    return (
        <>
            {places.map(place => {
                const color = (CATEGORY_COLOR as any)[place.category] || CATEGORY_COLOR.default;

                // Simple dot icon
                const icon = L.divIcon({
                    className: 'l1-marker',
                    html: `<div style="
                        width: 10px; 
                        height: 10px; 
                        background-color: ${color}; 
                        border: 2px solid white; 
                        border-radius: 50%; 
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    "></div>`,
                    iconSize: [12, 12],
                    iconAnchor: [6, 6]
                });

                return (
                    <Marker
                        key={place.osm_id}
                        position={[place.location.coordinates[1], place.location.coordinates[0]]}
                        icon={icon}
                    >
                        <Popup className="l1-popup">
                            <div className="text-xs font-bold">{place.name}</div>
                            <div className="text-[10px] text-gray-500 capitalize">
                                {getCategoryLabel(place.category)}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}
