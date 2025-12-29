
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

async function main() {
    const { data: stations, error } = await supabase
        .from('nodes')
        .select('id, name')
        .eq('is_active', true);

    if (error) { console.error(error); return; }

    const CHIYODA_KEYWORDS = [
        '大手町', '東京', '丸の内', '丸ノ内', '日比谷', '霞ケ関', '霞ヶ関', '永田町', '桜田門',
        '有楽町', '二重橋', '神田', '秋葉原', '御茶ノ水', '飯田橋', '九段下', '竹橋',
        '神保町', '岩本町', '小川町', '淡路町', '新御茶ノ水', '麹町', '半蔵門'
    ];

    // Improved Chuo keywords
    const CHUO_KEYWORDS = [
        '銀座', '日本橋', '京橋', '築地', '八丁堀', '茅場町', '三越前', '人形町',
        '東銀座', '水天宮前', '小伝馬町', '新富町', '月島', '勝どき', '馬喰町', '浜町'
    ];

    // Improved Taito keywords
    const TAITO_KEYWORDS = [
        '上野', '浅草', '御徒町', '入谷', '三ノ輪', '稲荷町', '田原町', '蔵前', '鶯谷'
    ];

    const filterByKeywords = (keywords: string[]) => stations.filter(s => {
        const jaName = s.name?.ja || '';
        return jaName && keywords.some(k => jaName.includes(k));
    });

    const chuoStations = filterByKeywords(CHUO_KEYWORDS);
    const taitoStations = filterByKeywords(TAITO_KEYWORDS);

    const formatForScraper = (list: any[]) => list
        .filter(s => s.id.includes('TokyoMetro'))
        .map(s => ({
            id: s.id,
            slug: s.name.en.toLowerCase().replace(/[-\s]+/g, '-').replace(/[()]/g, ''),
            operator: "TokyoMetro",
            name_ja: s.name.ja
        }));

    console.log(`\n=== CHUO METRO TARGETS ===`);
    console.log(JSON.stringify(formatForScraper(chuoStations), null, 2));

    console.log(`\n=== TAITO METRO TARGETS ===`);
    console.log(JSON.stringify(formatForScraper(taitoStations), null, 2));
}

main();
