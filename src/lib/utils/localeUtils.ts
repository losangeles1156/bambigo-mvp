import { LocaleString } from '@/lib/types/stationStandard';

/**
 * Safely extracts the string for the current locale from a LocaleString object.
 * Fallbacks: requested locale -> en -> ja -> zh -> first available key -> empty string.
 * @param obj The LocaleString object { ja, en, zh }
 * @param locale The current locale code (e.g., 'ja', 'en', 'zh-TW', 'zh')
 */
export function getLocaleString(obj: LocaleString | string | undefined, locale: string): string {
    if (!obj) return '';
    if (typeof obj === 'string') return obj; // Legacy support or error case

    // Normalize locale (e.g., 'zh-TW' -> 'zh')
    const lang = locale.startsWith('zh') ? 'zh' : locale.split('-')[0]; // en-US -> en

    if (lang === 'ja' && obj.ja) return obj.ja;
    if (lang === 'en' && obj.en) return obj.en;
    if (lang === 'zh' && obj.zh) return obj.zh;

    // Fallbacks
    return obj.en || obj.ja || obj.zh || '';
}
