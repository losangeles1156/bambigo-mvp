
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

async function seedToeiRoppongi() {
    const node = {
        id: 'odpt:Station:Toei.Oedo.Roppongi',
        city_id: 'tokyo_core',
        name: { 'zh-TW': '六本木(大江戶線)', 'ja': '六本木(大江戸線)', 'en': 'Roppongi (Toei)' },
        node_type: 'station',
        coordinates: 'POINT(139.7313 35.6628)', // Shared with Metro
        is_active: true,
        vibe_tags: { 'en': ['nightlife'], 'zh-TW': ['夜生活'], 'ja': ['ナイトライフ'] },
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('nodes').upsert(node);
    if (error) console.error(error);
    else console.log('✅ Seeded Toei Roppongi');
}
seedToeiRoppongi();
