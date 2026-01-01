import { CONFIG } from './config';
import { StationProfile } from './hub_profiles';

interface WikiAnalysisResult {
    summary: string;
    seasonalFlags: string[];
    keywords: string[];
    weightedKeywords: { word: string; weight: number }[];
}

export async function analyzeWiki(title: string, profile?: StationProfile): Promise<WikiAnalysisResult> {
    console.log(`📘 Analyzing Wiki for: ${title} ${profile ? `(Profile: ${profile.name})` : ''}...`);
    
    // 1. Fetch Wiki Content
    const endpoint = 'https://ja.wikipedia.org/w/api.php';
    const params = new URLSearchParams({
        action: 'query',
        prop: 'extracts',
        titles: title,
        explaintext: 'true', // Get plain text
        format: 'json',
        origin: '*'
    });

    try {
        const res = await fetch(`${endpoint}?${params.toString()}`);
        const data = await res.json();
        
        const pages = data.query?.pages;
        if (!pages) throw new Error('No pages found');
        
        const pageId = Object.keys(pages)[0];
        if (pageId === '-1') throw new Error('Page missing');
        
        const content = pages[pageId].extract as string;
        
        // 2. Analyze Seasonal Flags
        const seasonalFlags: string[] = [];
        
        if (matchesAny(content, CONFIG.SEASONAL_KEYWORDS.SAKURA)) seasonalFlags.push('Sakura');
        if (matchesAny(content, CONFIG.SEASONAL_KEYWORDS.AUTUMN)) seasonalFlags.push('Autumn Leaves');
        if (matchesAny(content, CONFIG.SEASONAL_KEYWORDS.HYDRANGEA)) seasonalFlags.push('Hydrangea');
        if (matchesAny(content, CONFIG.SEASONAL_KEYWORDS.PLUM)) seasonalFlags.push('Plum');

        // 3. Keyword Extraction with Weights
        // If a profile exists, we force include its core vibes
        const weightedKeywords: { word: string; weight: number }[] = [];
        const rawKeywords: string[] = [];

        // A. Profile Mandatory Vibes (Weight: 10)
        if (profile) {
            profile.core_vibes.forEach(vibe => {
                weightedKeywords.push({ word: vibe, weight: 10 });
                rawKeywords.push(vibe);
            });
            
            // Validate Landmarks in Text
            profile.mandatory_landmarks.forEach(lm => {
                if (content.includes(lm)) {
                    // Confirmed landmark presence
                    // weightedKeywords.push({ word: lm, weight: 5 }); // Optional: add specific landmark tag
                }
            });
        }

        // B. Wiki Content Analysis (Weight: 1-5)
        // General Dictionaries
        const DICT = {
            'Student Area': ['学生', '大学', '専門学校', 'キャンパス'],
            'Korea Town': ['韓国', 'コリアン', 'キムチ'],
            'Book Town': ['古書', '書店', '神保町'],
            'Ramen': ['ラーメン', '拉麺'],
            'Izakaya': ['飲み屋', '居酒屋', '横丁'],
            'Electronics': ['電気街', '家電'],
            'Otaku': ['アニメ', 'メイド', 'サブカル'],
            'High-end': ['高級', 'ブランド', '百貨店'],
            'Shitamachi': ['下町', '江戸', '情緒']
        };

        for (const [tag, keywords] of Object.entries(DICT)) {
            let hits = 0;
            keywords.forEach(k => {
                const regex = new RegExp(k, 'g');
                const count = (content.match(regex) || []).length;
                hits += count;
            });

            if (hits > 0) {
                // If profile already has this, skip or boost?
                // For now, simple add if not exists
                if (!rawKeywords.includes(tag)) {
                    // Logic: High hits = high weight?
                    // Cap weight at 5 for auto-detected
                    const weight = Math.min(hits, 5);
                    if (weight >= 2) { // Threshold
                        weightedKeywords.push({ word: tag, weight });
                        rawKeywords.push(tag);
                    }
                }
            }
        }

        // 4. Extract Summary (First 150 chars)
        // If profile exists, prefer expert description + wiki excerpt
        let summary = content.substring(0, 150).replace(/\n/g, ' ') + '...';
        if (profile) {
            summary = `【${profile.name}】${profile.description} (Wiki: ${summary})`;
        }

        return {
            summary,
            seasonalFlags,
            keywords: rawKeywords,
            weightedKeywords
        };

    } catch (error) {
        console.warn(`⚠️ Wiki fetch failed for ${title}:`, error);
        // Fallback to profile if available
        if (profile) {
            return {
                summary: profile.description,
                seasonalFlags: [],
                keywords: profile.core_vibes,
                weightedKeywords: profile.core_vibes.map(v => ({ word: v, weight: 10 }))
            };
        }
        return { summary: '', seasonalFlags: [], keywords: [], weightedKeywords: [] };
    }
}

function matchesAny(text: string, keywords: string[]): boolean {
    return keywords.some(k => text.includes(k));
}
