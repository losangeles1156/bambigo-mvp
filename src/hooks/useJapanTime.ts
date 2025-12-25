import { useState, useEffect } from 'react';
import { getNow, formatJapanTime } from '@/lib/time';

export function useJapanTime(refreshIntervalMs: number = 1000) {
    const [now, setNow] = useState(getNow());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(getNow());
        }, refreshIntervalMs);

        return () => clearInterval(timer);
    }, [refreshIntervalMs]);

    return {
        now,
        formatted: formatJapanTime(now),
        format: (options?: Intl.DateTimeFormatOptions) => formatJapanTime(now, options)
    };
}
