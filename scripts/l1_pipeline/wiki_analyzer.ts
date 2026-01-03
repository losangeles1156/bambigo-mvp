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
            'Student Area': ['学生', '大学', '専門学校', 'キャンパス', '早稲田', '東洋大学', '法政大学'],
            'Korea Town': ['韓国', 'コリアン', 'キムチ'],
            'Book Town': ['古書', '書店', '神保町', '古本'],
            'Ramen': ['ラーメン', '拉麺', '激戦区', 'つけ麺'],
            'Izakaya': ['飲み屋', '居酒屋', '横丁', 'センベロ', '千ベロ', '立ち飲み', '焼き鳥', 'ホッピー'],
            'Electronics': ['電気街', '家電', 'パソコン', 'パーツ'],
            'Otaku': ['アニメ', 'メイド', 'サブカル', 'フィギュア'],
            'High-end': ['高級', 'ブランド', '百貨店', '洗練', 'タワーマンション'],
            'Hidden Gem': ['穴場', '隠れ家', '知る人ぞ知る', '秘境', '静か', '混雑回避', '地元民'],
            'Retro': ['レトロ', '昭和', 'ノスタルジック', '懐かしい', '老舗', '歴史的建造物', '銭湯', '純喫茶'],
            'Shitamachi': ['下町', '人情', '風情', '江戸', '路地', '深川', '職人'],
            'Subculture': ['サブカル', '古着', 'ライブハウス', '演劇', '若者文化', '劇場'],
            'Gourmet': ['グルメ', '食べ歩き', '名物', 'B級グルメ', 'もんじゃ', '海鮮', 'うなぎ', '団子'],
            'Power Spot': ['パワースポット', '縁結び', '御利益', '運気', '神社', '寺院', '亀戸天神', 'とげぬき地蔵'],
            'Market': ['市場', '商店街', '横丁', 'マルシェ', '問屋街', 'アメ横', '道具街'],
            'Nature': ['公園', '緑地', '自然', '庭園', '川沿い', '運河', '桜並木'],
            'Grandma Harajuku': ['おばあちゃんの原宿', '高齢者', '地蔵通り'],
            'Wholesale': ['問屋', '卸売', 'ビーズ', '手芸', '革製品', 'パーツ'],
            'Family Friendly': ['家族連れ', 'ファミリー', '公園', '動物園', '遊園地', '水族館']
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
