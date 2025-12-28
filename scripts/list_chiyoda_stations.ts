
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

async function main() {
    // 1. Fetch all active stations
    const { data: stations, error } = await supabase
        .from('nodes')
        .select('id, name')
        .eq('is_active', true);

    if (error) {
        console.error('DB Error:', error);
        return;
    }

    // 2. Define Ward Keywords
    const CHIYODA_KEYWORDS = [
        '大手町', '東京', '丸の内', '丸ノ内', '日比谷', '霞ケ関', '霞ヶ関', '永田町', '桜田門',
        '有楽町', '二重橋', '神田', '秋葉原', '御茶ノ水', '水道橋', '飯田橋', '九段下', '竹橋',
        '神保町', '岩本町', '小川町', '淡路町', '新御茶ノ水', '麹町', '半蔵門'
    ];

    // 3. Filter
    const targetStations = stations.filter(s => {
        const jaName = s.name?.ja || '';
        if (!jaName) return false;

        // Exact matches or includes (be careful with includes like 'Tokyo' in 'Tokyoga')
        // But for these keywords, includes is mostly safe.
        // We'll trust the keywords list for now.
        return CHIYODA_KEYWORDS.some(k => jaName.includes(k));
    });

    console.log(`Found ${targetStations.length} Chiyoda stations.`);

    // 4. Generate Output for Scraper
    // We also need to know the OPERATOR to guess the URL.
    // Tokyo Metro IDs look like: odpt.Station:TokyoMetro...
    // Toei: odpt.Station:Toei...
    // JR: odpt.Station:JR-East...

    // We'll prioritize METRO for now as the scraper is built for Metro.
    const metroTargets = targetStations.filter(s => s.id.includes('TokyoMetro'));

    console.log(`\n--- Tokyo Metro Targets (${metroTargets.length}) ---`);
    console.log(JSON.stringify(metroTargets.map(s => ({
        id: s.id,
        name_en: s.name.en.toLowerCase().replace(/[-\s]+/g, '-').replace(/[()]/g, ''), // slug guess
        name_ja: s.name.ja
    })), null, 2));

}

main();
