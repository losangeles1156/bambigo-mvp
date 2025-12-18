'use client';

import { MapPin, Star, ArrowRight } from 'lucide-react';

interface Facility {
    id: string;
    name: string;
    type: string;
    distance: string;
    rating?: number;
    image?: string;
}

interface FacilityCarouselProps {
    title: string;
    facilities: Facility[];
}

export function FacilityCarousel({ title, facilities }: FacilityCarouselProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end px-1">
                <h3 className="text-xl font-black text-gray-900">{title}</h3>
                <button className="text-sm font-bold text-indigo-600 flex items-center gap-1 active:scale-95 transition-transform">
                    查看全部 <ArrowRight size={14} />
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 px-1 no-scrollbar -mx-1 snap-x">
                {facilities.map((facility) => (
                    <div
                        key={facility.id}
                        className="flex-shrink-0 w-64 snap-start bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group active:scale-[0.98] transition-all"
                    >
                        {/* Image Placeholder */}
                        <div className="h-32 bg-indigo-50 relative">
                            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-wider">
                                {facility.type}
                            </div>
                            {facility.rating && (
                                <div className="absolute top-3 right-3 bg-indigo-600 px-2 py-0.5 rounded-lg text-[10px] font-black text-white flex items-center gap-1 shadow-lg shadow-indigo-200">
                                    <Star size={10} fill="white" />
                                    {facility.rating}
                                </div>
                            )}
                            <div className="w-full h-full flex items-center justify-center opacity-20 text-4xl">
                                {facility.type === 'cafe' ? '☕' : facility.type === 'shop' ? '🛍️' : '🍴'}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <h4 className="font-bold text-gray-900 truncate mb-1">{facility.name}</h4>
                            <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                                <MapPin size={10} />
                                <span>距離 {facility.distance}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
