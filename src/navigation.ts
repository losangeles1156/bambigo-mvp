import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['zh', 'en', 'ja', 'zh-TW'] as const;
export const localePrefix = 'as-needed'; // Default locale 'zh' will not have prefix

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales, localePrefix });
