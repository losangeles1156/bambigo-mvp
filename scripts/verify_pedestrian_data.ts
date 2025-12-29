import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

async function runVerification() {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     歩行空間ネットワーク 數據驗證測試                         ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    let passed = 0;
    let failed = 0;

    // ═══════════════════════════════════════════════════════════════
    // TEST 1: 資料庫連線與基本查詢
    // ═══════════════════════════════════════════════════════════════
    console.log('📋 TEST 1: 資料庫連線與資料量');
    const { count: linkCount } = await supabase.from('pedestrian_links').select('*', { count: 'exact', head: true });
    const { count: nodeCount } = await supabase.from('pedestrian_nodes').select('*', { count: 'exact', head: true });

    if (linkCount && linkCount > 1000 && nodeCount && nodeCount > 1000) {
        console.log(`   ✅ PASS: Links=${linkCount}, Nodes=${nodeCount}`);
        passed++;
    } else {
        console.log(`   ❌ FAIL: 資料量不足 (Links=${linkCount}, Nodes=${nodeCount})`);
        failed++;
    }

    // ═══════════════════════════════════════════════════════════════
    // TEST 2: 無障礙屬性查詢 - 電梯可達路徑
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📋 TEST 2: 電梯可達路徑查詢');
    const { data: elevatorLinks, count: elevCount } = await supabase
        .from('pedestrian_links')
        .select('link_id, distance_meters, accessibility_rank', { count: 'exact' })
        .eq('has_elevator_access', true)
        .limit(5);

    if (elevCount && elevCount > 500) {
        console.log(`   ✅ PASS: ${elevCount} 條電梯可達路徑`);
        console.log(`   Sample: ${elevatorLinks?.slice(0, 3).map(l => l.accessibility_rank).join(', ')}`);
        passed++;
    } else {
        console.log(`   ❌ FAIL: 電梯可達路徑不足 (${elevCount})`);
        failed++;
    }

    // ═══════════════════════════════════════════════════════════════
    // TEST 3: 導盲磚路徑查詢
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📋 TEST 3: 導盲磚路徑查詢');
    const { count: brailleCount } = await supabase
        .from('pedestrian_links')
        .select('*', { count: 'exact', head: true })
        .eq('has_braille_tiles', true);

    if (brailleCount && brailleCount > 500) {
        console.log(`   ✅ PASS: ${brailleCount} 條導盲磚路徑`);
        passed++;
    } else {
        console.log(`   ❌ FAIL: 導盲磚路徑不足 (${brailleCount})`);
        failed++;
    }

    // ═══════════════════════════════════════════════════════════════
    // TEST 4: 按數據來源分組查詢 (修正版)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📋 TEST 4: 按數據來源分組查詢');

    // 分別查詢各來源的數量
    const sources = ['hokonavi_ueno', 'odpt_oedo_ueno', 'odpt_oedo_daimon'];
    const sourceCounts: Record<string, number> = {};

    for (const src of sources) {
        const { count } = await supabase
            .from('pedestrian_links')
            .select('*', { count: 'exact', head: true })
            .eq('source_dataset', src);
        if (count && count > 0) {
            sourceCounts[src] = count;
        }
    }

    const sourceList = Object.entries(sourceCounts);
    if (sourceList.length >= 2) {
        console.log(`   ✅ PASS: ${sourceList.length} 個數據來源`);
        sourceList.forEach(([src, count]) => console.log(`      - ${src}: ${count} links`));
        passed++;
    } else {
        console.log(`   ❌ FAIL: 數據來源不足 (${sourceList.length})`);
        failed++;
    }


    // ═══════════════════════════════════════════════════════════════
    // TEST 5: 排除樓梯的輪椅友善路徑
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📋 TEST 5: 輪椅友善路徑 (排除樓梯)');
    const { count: wheelchairFriendly } = await supabase
        .from('pedestrian_links')
        .select('*', { count: 'exact', head: true })
        .eq('has_elevator_access', true)
        .neq('route_structure', 4);  // Exclude stairs

    if (wheelchairFriendly && wheelchairFriendly > 500) {
        console.log(`   ✅ PASS: ${wheelchairFriendly} 條輪椅可用路徑`);
        passed++;
    } else {
        console.log(`   ❌ FAIL: 輪椅可用路徑不足 (${wheelchairFriendly})`);
        failed++;
    }

    // ═══════════════════════════════════════════════════════════════
    // TEST 6: 最高等級路徑 (S開頭)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📋 TEST 6: 最高無障礙等級路徑 (S等級)');
    const { data: sRankLinks, count: sCount } = await supabase
        .from('pedestrian_links')
        .select('accessibility_rank', { count: 'exact' })
        .like('accessibility_rank', 'S%');

    if (sCount && sCount > 100) {
        console.log(`   ✅ PASS: ${sCount} 條 S 等級路徑`);
        passed++;
    } else {
        console.log(`   ❌ FAIL: S 等級路徑不足 (${sCount})`);
        failed++;
    }

    // ═══════════════════════════════════════════════════════════════
    // TEST 7: 節點樓層資訊
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📋 TEST 7: 多樓層節點');
    const { data: floorNodes } = await supabase
        .from('pedestrian_nodes')
        .select('floor_level')
        .limit(1000);

    const floors = new Set(floorNodes?.map(n => n.floor_level));
    if (floors.size > 1) {
        console.log(`   ✅ PASS: 檢測到 ${floors.size} 個樓層: [${[...floors].sort().join(', ')}]`);
        passed++;
    } else {
        console.log(`   ❌ FAIL: 樓層資訊不足`);
        failed++;
    }

    // ═══════════════════════════════════════════════════════════════
    // TEST 8: 模擬 AI 查詢場景
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📋 TEST 8: 模擬 AI 查詢「上野站無障礙路線」');
    const { data: uenoLinks } = await supabase
        .from('pedestrian_links')
        .select('link_id, distance_meters, accessibility_rank, has_elevator_access')
        .eq('station_id', 'odpt:Station:TokyoMetro.Ueno')
        .eq('has_elevator_access', true)
        .order('distance_meters', { ascending: true })
        .limit(5);

    if (uenoLinks && uenoLinks.length > 0) {
        console.log(`   ✅ PASS: 找到 ${uenoLinks.length} 條上野站電梯可達路徑`);
        console.log(`   最短距離: ${uenoLinks[0].distance_meters}m, 等級: ${uenoLinks[0].accessibility_rank}`);
        passed++;
    } else {
        console.log(`   ❌ FAIL: 上野站查詢無結果`);
        failed++;
    }

    // ═══════════════════════════════════════════════════════════════
    // 結果總結
    // ═══════════════════════════════════════════════════════════════
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log(`║     測試結果: ${passed} PASSED / ${failed} FAILED                              ║`);
    console.log('╚══════════════════════════════════════════════════════════════╝');

    if (failed === 0) {
        console.log('\n🎉 所有測試通過！數據已可正常應用。');
    } else {
        console.log('\n⚠️  部分測試未通過，請檢查數據完整性。');
    }
}

runVerification().catch(console.error);
