/**
 * Weather Alert Region Policy
 * Strictly locked to Tokyo Core, Kanagawa, and Chiba.
 * Explicitly excludes remote islands.
 */

export const WEATHER_REGION_POLICY = {
    // Core Prefectures (Level 1 Filter)
    targetPrefectures: ['東京', '神奈川', '千葉'],

    // Specific Regions (Level 2 Filter)
    // Matches JMA's regional terminology
    targetRegions: [
        '東京地方',
        '23区',
        '多摩',
        '神奈川県東部',
        '神奈川県西部',
        '千葉県北西部',
        '千葉県北東部',
        '千葉県南部'
    ],

    // Explicit Exclusions (Level 3 Filter)
    // Even if islands are mentioned, they must be excluded unless a target region is also mentioned with a warning.
    excludedRegions: ['伊豆諸島', '小笠原諸島'],

    /**
     * Normalizes JMA text for consistent matching (Full-width to Half-width)
     */
    normalize: (s: string) => s.replace(/[！-～]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0xfee0)),

    /**
     * Checks if the given alert text (title + summary) satisfies the region policy.
     */
    isTargetRegion: (title: string, summary: string): boolean => {
        const normalize = WEATHER_REGION_POLICY.normalize;
        const normTitle = normalize(title);
        const normSummary = normalize(summary);

        // 0. Strict Title Exclusion
        // If the title explicitly mentions an excluded region (e.g., "Warning for Izu Islands")
        // AND does NOT mention any target region, reject it immediately.
        const titleMentionsExcluded = WEATHER_REGION_POLICY.excludedRegions.some(ex => normTitle.includes(ex));
        const titleMentionsTarget = WEATHER_REGION_POLICY.targetRegions.some(tg => normTitle.includes(tg));
        const titleMentionsPrefecture = WEATHER_REGION_POLICY.targetPrefectures.some(pf => normTitle.includes(pf));

        if (titleMentionsExcluded && !titleMentionsTarget && !titleMentionsPrefecture) {
            return false;
        }

        // 1. Emergency Bypass
        // Earthquakes (Shindo) and Tsunamis often don't use the standard "Region dewa Warning" format.
        const isEmergency = normTitle.includes('震度') || normTitle.includes('地震') || normTitle.includes('超音波') || normTitle.includes('津浪');
        if (isEmergency) {
            const combinedText = normTitle + normSummary;
            return WEATHER_REGION_POLICY.targetRegions.some(r => combinedText.includes(r)) ||
                WEATHER_REGION_POLICY.targetPrefectures.some(p => combinedText.includes(p));
        }

        // 2. Sentence-Scoped Analysis with Clear Statement Detection
        // Split summary into sentences to prevent cross-contamination (e.g. "Tokyo is clear. Izu has rain.")
        const sentences = normSummary.split(/[。\n]/).map(s => s.trim()).filter(s => s.length > 0);

        // Add the Title as a "sentence" because sometimes short info is only in title
        sentences.push(normTitle);

        const targetRegionsPattern = WEATHER_REGION_POLICY.targetRegions.join('|');
        // Warning keywords: Warning (警報), Advisory (注意報), Short "Attention" (注意), Special Warning (特別警報), Alert/Vigilance (警戒)
        const warningPattern = /警報|注意報|注意|特別警報|警戒/;

        // Clear/Good weather statements that should NOT trigger alerts
        // These indicate the region is NOT under warning
        const clearStatementPattern = /は晴れています|は崩れ|は回復|解除|ielder|注意報解除|警報解除|解除しました/;

        for (const sentence of sentences) {
            // Skip clear/good weather statements
            // E.g., "東京地方は晴れています" should not trigger an alert
            if (clearStatementPattern.test(sentence)) {
                continue;
            }

            // Does this sentence mention a target region?
            const mentionsTarget = new RegExp(targetRegionsPattern).test(sentence);

            // Does this sentence contain a warning keyword?
            const hasWarning = warningPattern.test(sentence);

            // If both are true in the same sentence, it's a valid alert for us.
            if (mentionsTarget && hasWarning) {
                return true;
            }
        }

        return false;
    },

    /**
     * Regex patterns for severity classification
     * Updated: Added intermediate 'warning' level for granular alerts
     */
    patterns: {
        // 紅色警報（Critical）- 極其嚴重，生命威脅
        critical: /特別警報|大地震|巨大地震|津波警告|震度[6-7]|大火災警報|土砂災害特別警戒情報/,

        // 橙色警報（Warning）- 重大影響，謹慎行動
        warning: /警報|強風警報|波浪警報|高潮警報|大雨警報|洪水警報|大雪警報|土砂災害警戒情報|強風注意報/,

        // 黃色警報（Advisory）- 注意防範
        advisory: /注意報/,

        // 藍色資訊（Info）- 一般資訊
        info: /気象情報|全般台風情報|天候情報/
    },

    /**
     * Map severity level to UI color code
     */
    severityToColor: {
        critical: 'red',
        warning: 'orange',
        advisory: 'yellow',
        info: 'blue'
    },

    /**
     * Map severity level to urgency level (1-4)
     */
    severityToUrgency: {
        critical: 4,  // 最高優先級
        warning: 3,   // 高優先級
        advisory: 2,  // 中優先級
        info: 1       // 低優先級
    },

    /**
     * Determine severity level from alert title and content
     */
    getSeverity: (title: string, summary: string): 'info' | 'advisory' | 'warning' | 'critical' => {
        const normalizedTitle = WEATHER_REGION_POLICY.normalize(title);
        const normalizedSummary = WEATHER_REGION_POLICY.normalize(summary);
        const combined = normalizedTitle + ' ' + normalizedSummary;

        // Check in order of priority (critical > warning > advisory > info)
        if (WEATHER_REGION_POLICY.patterns.critical.test(combined)) {
            return 'critical';
        }
        if (WEATHER_REGION_POLICY.patterns.warning.test(combined)) {
            return 'warning';
        }
        if (WEATHER_REGION_POLICY.patterns.advisory.test(combined)) {
            return 'advisory';
        }
        if (WEATHER_REGION_POLICY.patterns.info.test(combined)) {
            return 'info';
        }

        // Default to info if no pattern matches
        return 'info';
    },

    /**
     * Get user-friendly severity label
     */
    getSeverityLabel: (severity: 'info' | 'advisory' | 'warning' | 'critical'): { ja: string; zh: string; en: string } => {
        const labels = {
            critical: { ja: '特別警報', zh: '特別警報', en: 'Special Warning' },
            warning: { ja: '警報', zh: '警報', en: 'Warning' },
            advisory: { ja: '注意報', zh: '注意報', en: 'Advisory' },
            info: { ja: '気象情報', zh: '天氣資訊', en: 'Weather Info' }
        };
        return labels[severity] || labels.info;
    },

    /**
     * Adjust severity based on user profile
     * Some profiles require higher caution levels
     */
    adjustSeverityForUser: (
        severity: 'info' | 'advisory' | 'warning' | 'critical',
        userProfile: 'general' | 'wheelchair' | 'stroller' | 'large_luggage'
    ): 'info' | 'advisory' | 'warning' | 'critical' => {
        // Wheelchair users should receive more cautious alerts
        if (userProfile === 'wheelchair') {
            if (severity === 'advisory') return 'warning';
            if (severity === 'info') return 'advisory';
        }

        // Stroller users also benefit from higher caution
        if (userProfile === 'stroller') {
            if (severity === 'info') return 'advisory';
        }

        // Large luggage users - mainly affected by weather conditions
        if (userProfile === 'large_luggage' && severity === 'advisory') {
            // Heavy rain or snow advisory becomes warning for large luggage
            if (WEATHER_REGION_POLICY.patterns.warning.test(severity)) {
                return 'warning';
            }
        }

        return severity;
    }
};
