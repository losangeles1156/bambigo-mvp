'use client';

import { CategoryCounts } from '@/lib/nodes/facilityProfileCalculator';

/**
 * L1 Facility Main Categories as defined in L1_FACILITY_TAGS.md
 */
export const CATEGORY_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
    shopping: { icon: '🛒', label: '購物', color: '#EC4899' },
    dining: { icon: '🍜', label: '餐飲', color: '#F59E0B' },
    leisure: { icon: '🎭', label: '休閒', color: '#8B5CF6' },
    medical: { icon: '🏥', label: '醫療', color: '#EF4444' },
    finance: { icon: '🏦', label: '金融', color: '#3B82F6' },
    education: { icon: '🎓', label: '教育', color: '#10B981' },
    workspace: { icon: '💻', label: '辦公', color: '#6366F1' },
};

interface FacilityFingerprintProps {
    counts: CategoryCounts;
}

export function FacilityFingerprint({ counts }: FacilityFingerprintProps) {
    // Sort by count descending and only take top 5 non-zero categories
    const sortedCategories = Object.entries(counts)
        .filter(([_, count]) => count > 0)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    if (sortedCategories.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 py-2" aria-label="生活機能指紋">
            {sortedCategories.map(([category, count]) => {
                const config = CATEGORY_CONFIG[category];
                if (!config) return null;

                return (
                    <div
                        key={category}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-100 shadow-sm transition-transform hover:scale-105"
                        title={`${config.label}: ${count}`}
                    >
                        <span role="img" aria-label={config.label} className="text-sm">
                            {config.icon}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                            {count}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
