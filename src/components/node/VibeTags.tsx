'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface VibeTagsProps {
    tags: string[];
}

export function VibeTags({ tags }: VibeTagsProps) {
    const tNode = useTranslations('node');

    if (!tags || tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 pb-2" aria-label={tNode('vibeTags')}>
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="text-[10px] font-black text-indigo-700 bg-indigo-50/80 px-2.5 py-0.5 rounded-full border border-indigo-100/50 backdrop-blur-sm shadow-sm transition-all hover:bg-white hover:shadow-md"
                >
                    #{tag}
                </span>
            ))}
        </div>
    );
}
