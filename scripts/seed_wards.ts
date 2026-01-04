/**
 * Seed Tokyo 23 wards data
 * Run: npx tsx scripts/seed_wards.ts
 *
 * This script inserts basic ward data for Tokyo's 23 special wards.
 * The boundary geometries are simplified approximations.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Tokyo 23 wards basic data (simplified center points for initial setup)
// These are approximate center points - for production, you should use official ward boundaries
const tokyo23Wards = [
    { id: 'ward:shinjuku', code: '13101', name_ja: '新宿区', name_zh: '新宿區', name_en: 'Shinjuku', lat: 35.6938, lng: 139.7034 },
    { id: 'ward:shibuya', code: '13113', name_ja: '渋谷区', name_zh: '澀谷區', name_en: 'Shibuya', lat: 35.6595, lng: 139.7004 },
    { id: 'ward:minato', code: '13103', name_ja: '港区', name_zh: '港區', name_en: 'Minato', lat: 35.6654, lng: 139.7607 },
    { id: 'ward:chiyoda', code: '13101', name_ja: '千代田区', name_zh: '千代田區', name_en: 'Chiyoda', lat: 35.6938, lng: 139.7536 },
    { id: 'ward:chuo', code: '13102', name_ja: '中央区', name_zh: '中央區', name_en: 'Chuo', lat: 35.6764, lng: 139.7703 },
    { id: 'ward:taito', code: '13104', name_ja: '台東区', name_zh: '台東區', name_en: 'Taito', lat: 35.7148, lng: 139.7967 },
    { id: 'ward:sumida', code: '13107', name_ja: '墨田区', name_zh: '墨田區', name_en: 'Sumida', lat: 35.7100, lng: 139.8057 },
    { id: 'ward:koto', code: '13108', name_ja: '江東区', name_zh: '江東區', name_en: 'Koto', lat: 35.6762, lng: 139.8173 },
    { id: 'ward:shinagawa', code: '13109', name_ja: '品川区', name_zh: '品川區', name_en: 'Shinagawa', lat: 35.6285, lng: 139.7187 },
    { id: 'ward:meguro', code: '13110', name_ja: '目黒区', name_zh: '目黑區', name_en: 'Meguro', lat: 35.6419, lng: 139.6993 },
    { id: 'ward:ota', code: '13111', name_ja: '大田区', name_zh: '大田區', name_en: 'Ota', lat: 35.5567, lng: 139.7158 },
    { id: 'ward:setagaya', code: '13112', name_ja: '世田谷区', name_zh: '世田谷區', name_en: 'Setagaya', lat: 35.6466, lng: 139.6532 },
    { id: 'ward:nakano', code: '13114', name_ja: '中野区', name_zh: '中野區', name_en: 'Nakano', lat: 35.7280, lng: 139.6635 },
    { id: 'ward:suginami', code: '13115', name_ja: '杉並区', name_zh: '杉並區', name_en: 'Suginami', lat: 35.7335, lng: 139.6374 },
    { id: 'ward:toshima', code: '13116', name_ja: '豊島区', name_zh: '豐島區', name_en: 'Toshima', lat: 35.7415, lng: 139.7067 },
    { id: 'ward:kita', code: '13117', name_ja: '北区', name_zh: '北區', name_en: 'Kita', lat: 35.7536, lng: 139.7346 },
    { id: 'ward:arakawa', code: '13118', name_ja: '荒川区', name_zh: '荒川區', name_en: 'Arakawa', lat: 35.7478, lng: 139.7840 },
    { id: 'ward:itabashi', code: '13119', name_ja: '板橋区', name_zh: '板橋區', name_en: 'Itabashi', lat: 35.7514, lng: 139.7569 },
    { id: 'ward:nerima', code: '13120', name_ja: '練馬区', name_zh: '練馬區', name_en: 'Nerima', lat: 35.7429, lng: 139.6528 },
    { id: 'ward:adachi', code: '13121', name_ja: '足立区', name_zh: '足立區', name_en: 'Adachi', lat: 35.7644, lng: 139.8035 },
    { id: 'ward:katsushika', code: '13122', name_ja: '葛飾区', name_zh: '葛飾區', name_en: 'Katsushika', lat: 35.7668, lng: 139.8463 },
    { id: 'ward:edogawa', code: '13123', name_ja: '江戸川区', name_zh: '江戸川區', name_en: 'Edogawa', lat: 35.7088, lng: 139.8719 },
];

async function seedWards() {
    if (!supabaseUrl || !supabaseKey) {
        console.log('❌ Missing Supabase credentials');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('='.repeat(60));
    console.log('Seeding Tokyo 23 Wards');
    console.log('='.repeat(60));

    let inserted = 0;
    let skipped = 0;

    for (const ward of tokyo23Wards) {
        // Create center_point geometry
        const centerPoint = {
            type: 'Point',
            coordinates: [ward.lng, ward.lat],
            crs: {
                type: 'name',
                properties: {
                    name: 'urn:ogc:def:crs:EPSG::4326'
                }
            }
        };

        const { error } = await supabase
            .from('wards')
            .upsert({
                id: ward.id,
                name_i18n: {
                    'ja': ward.name_ja,
                    'zh-TW': ward.name_zh,
                    'en': ward.name_en
                },
                prefecture: 'Tokyo',
                ward_code: ward.code,
                center_point: centerPoint,
                priority_order: inserted + 1,
                is_active: true,
                node_count: 0,
                hub_count: 0
            }, {
                onConflict: 'id',
                ignoreDuplicates: false
            });

        if (error) {
            console.log(`  ❌ Error inserting ${ward.id}:`, error.message);
        } else {
            console.log(`  ✓ ${ward.name_zh} (${ward.name_en})`);
            inserted++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`Seeding Complete: ${inserted} wards inserted/updated`);
    console.log('='.repeat(60));
    console.log('\nNext step: Run npx tsx scripts/assign_nodes_to_wards.ts');
}

seedWards().catch(console.error);
