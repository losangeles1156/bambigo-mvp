'use client';

import React from 'react';

interface VibeTagsProps {
    tags: string[];
}

export function VibeTags({ tags }: VibeTagsProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 pb-2" aria-label="氛圍標籤">
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100"
                >
                    #{tag}
                </span>
            ))}
        </div>
    );
}
