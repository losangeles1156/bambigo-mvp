import { Navigation, MapPin, Utensils, ShoppingBag, Landmark, Coffee, TreePine } from 'lucide-react';
import { L1Place } from '@/hooks/useL1Places';

interface PlaceCardProps {
    place: L1Place;
    isFeatured?: boolean; // For B2B future
}

// Simple Icon Map (reuse or import if optimized)
const ICON_MAP: Record<string, any> = {
    dining: Utensils,
    shopping: ShoppingBag,
    culture: Landmark,
    leisure: Coffee,
    nature: TreePine,
    default: MapPin
};

export function PlaceCard({ place, isFeatured = false }: PlaceCardProps) {
    const Icon = ICON_MAP[place.category] || ICON_MAP.default;
    const name = place.name;

    // Google Maps Deep Link
    // Strategy: Search by Name first. Precision is better for UX.
    // If we wanted coordinate pin: query=${place.location.coordinates[1]},${place.location.coordinates[0]}
    const handleNavClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const lat = place.location.coordinates[1];
        const lon = place.location.coordinates[0];
        // Hybrid: Name + Coordinator hint? No, standard Maps API takes Query.
        // Let's use coordinates for 100% accuracy of the pin location
        // User can see the label on the map once opened.
        // Actually, searching by Name is better for "Place Info" (Review, Photos).
        // Let's try Name.
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={`p-3 rounded-xl border transition-all hover:bg-gray-50 flex items-start gap-3 group bg-white ${isFeatured ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100'}`}>
            {/* Icon Box */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'} transition-colors`}>
                <Icon size={18} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-900 truncate leading-tight">
                        {name}
                    </h4>
                    {isFeatured && (
                        <span className="text-[9px] font-black uppercase px-1 py-0.5 bg-amber-100 text-amber-600 rounded">
                            Ad
                        </span>
                    )}
                </div>

                <p className="text-xs text-gray-500 font-medium mt-0.5 truncate">
                    {place.category}
                    {place.tags?.cuisine && ` • ${place.tags.cuisine}`}
                </p>

                {/* Vibe Tags Pills (if relevant) */}
                {(place.tags?.ramen || place.tags?.amenity === 'cafe') && (
                    <div className="flex gap-1 mt-1.5">
                        {place.tags?.ramen && <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">#Ramen</span>}
                    </div>
                )}
            </div>

            {/* Nav Button */}
            <button
                onClick={handleNavClick}
                className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                title="Open in Google Maps"
            >
                <Navigation size={18} fill="currentColor" className="opacity-100" />
            </button>
        </div>
    );
}
