-- Seed Nodes Sync Migration
-- 將 src/lib/nodes/seedNodes.ts 中的 60 個車站同步到數據庫
-- 執行時間: 2026-01-03

-- 首先檢查現有數據
SELECT COUNT(*) as current_nodes FROM nodes;

-- Upsert Seed Nodes (60 stations)
-- 注意: 這是一個基礎同步，確保所有 Seed Nodes 都存在於數據庫中

INSERT INTO nodes (
    id,
    city_id,
    name,
    node_type,
    coordinates,
    is_active,
    is_hub,
    parent_hub_id,
    transit_lines,
    vibe_tags,
    facility_tags,
    updated_at
) VALUES
-- Ueno Area (上野區域)
('odpt:Station:TokyoMetro.Ueno', 'tokyo_core', '{"zh-TW":"上野","ja":"上野","en":"Ueno"}', 'station', 'POINT(139.7774 35.7141)', true, false, 'odpt:Station:JR-East.Ueno', '[]', '{"zh-TW":["文化"],"ja":["文化"],"en":["culture"]}', '[{"mainCategory":"leisure","subCategory":"nature","detailCategory":"park","name":"Ueno Park","distanceMeters":50,"direction":"Park Exit"},{"mainCategory":"leisure","subCategory":"culture","detailCategory":"museum","name":"Tokyo National Museum","distanceMeters":400,"direction":"Park Exit"},{"mainCategory":"shopping","subCategory":"market","name":"Ameya-Yokocho","distanceMeters":100,"direction":"Shinobazu Exit"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    coordinates = EXCLUDED.coordinates,
    is_hub = EXCLUDED.is_hub,
    parent_hub_id = EXCLUDED.parent_hub_id,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:JR-East.Ueno', 'tokyo_core', '{"zh-TW":"上野","ja":"上野","en":"Ueno"}', 'station', 'POINT(139.7774 35.7141)', true, true, NULL, '[]', '{"zh-TW":["文化"],"ja":["文化"],"en":["culture"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    updated_at = NOW();

-- Akihabara Area (秋葉原區域)
('odpt:Station:JR-East.Akihabara', 'tokyo_core', '{"zh-TW":"秋葉原","ja":"秋葉原","en":"Akihabara"}', 'station', 'POINT(139.7742 35.6986)', true, true, NULL, '[]', '{"zh-TW":["御宅族"],"ja":["オタク"],"en":["geek"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:TsukubaExpress.Akihabara', 'tokyo_core', '{"zh-TW":"秋葉原","ja":"秋葉原","en":"Akihabara"}', 'station', 'POINT(139.7742 35.6986)', true, false, 'odpt:Station:JR-East.Akihabara', '[]', '{"zh-TW":["科技之門"],"ja":["テクノロジー"],"en":["tech_gateway"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    parent_hub_id = EXCLUDED.parent_hub_id,
    updated_at = NOW();

-- Tokyo Station Area (東京站區域)
('odpt:Station:JR-East.Tokyo', 'tokyo_core', '{"zh-TW":"東京","ja":"東京","en":"Tokyo"}', 'station', 'POINT(139.7671 35.6812)', true, true, NULL, '[]', '{"zh-TW":["歷史"],"ja":["歴史"],"en":["historic"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

-- Ginza Area (銀座區域)
('odpt:Station:TokyoMetro.Ginza', 'tokyo_core', '{"zh-TW":"銀座","ja":"銀座","en":"Ginza"}', 'station', 'POINT(139.7665 35.6712)', true, true, NULL, '[]', '{"zh-TW":["奢華"],"ja":["ラグジュアリー"],"en":["luxury"]}', '[{"mainCategory":"shopping","subCategory":"department","name":"Ginza Mitsukoshi","distanceMeters":50,"direction":"Exit A7"},{"mainCategory":"shopping","subCategory":"department","name":"Wako","distanceMeters":50,"direction":"Exit A10"},{"mainCategory":"shopping","subCategory":"department","name":"GINZA SIX","distanceMeters":200,"direction":"Exit A3"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Kyobashi', 'tokyo_core', '{"zh-TW":"京橋","ja":"京橋","en":"Kyobashi"}', 'station', 'POINT(139.7702 35.6766)', true, false, NULL, '[]', '{"zh-TW":["藝術"],"ja":["アート"],"en":["art"]}', '[{"mainCategory":"leisure","subCategory":"culture","detailCategory":"museum","name":"Artizon Museum","distanceMeters":300,"direction":"Exit 6"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Mitsukoshimae', 'tokyo_core', '{"zh-TW":"三越前","ja":"三越前","en":"Mitsukoshimae"}', 'station', 'POINT(139.7746 35.6846)', true, false, NULL, '[]', '{"zh-TW":["歷史商業"],"ja":["歴史"],"en":["historic_commerce"]}', '[{"mainCategory":"shopping","subCategory":"department_store","name":"Nihombashi Mitsukoshi Main Store","distanceMeters":0,"direction":"Direct Access"},{"mainCategory":"shopping","subCategory":"department_store","name":"COREDO Muromachi","distanceMeters":100,"direction":"Exit A4"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Kayabacho', 'tokyo_core', '{"zh-TW":"茅場町","ja":"茅場町","en":"Kayabacho"}', 'station', 'POINT(139.7801 35.6797)', true, false, NULL, '[]', '{"zh-TW":["商業"],"ja":["ビジネス"],"en":["business"]}', '[{"mainCategory":"service","subCategory":"office","name":"Tokyo Stock Exchange","distanceMeters":200,"direction":"Exit 11"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:JR-East.Hatchobori', 'tokyo_core', '{"zh-TW":"八丁堀","ja":"八丁堀","en":"Hatchobori"}', 'station', 'POINT(139.7779 35.6749)', true, true, NULL, '[]', '{"zh-TW":["住宅商業"],"ja":["居住"],"en":["residential_business"]}', '[{"mainCategory":"leisure","subCategory":"nature","detailCategory":"park","name":"Sumida River Terrace","distanceMeters":300,"direction":"Exit B4"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

-- Kanda Area (神田區域)
('odpt:Station:JR-East.Kanda', 'tokyo_core', '{"zh-TW":"神田","ja":"神田","en":"Kanda"}', 'station', 'POINT(139.7707 35.6917)', true, true, NULL, '[]', '{"zh-TW":["咖哩"],"ja":["カレー"],"en":["curry"]}', '[{"mainCategory":"dining","subCategory":"restaurant","name":"Kanda Curry District","distanceMeters":50,"direction":"Exit West"},{"mainCategory":"leisure","subCategory":"culture","detailCategory":"shrine","name":"Kanda Myojin","distanceMeters":400,"direction":"Exit North"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Kanda', 'tokyo_core', '{"zh-TW":"神田","ja":"神田","en":"Kanda"}', 'station', 'POINT(139.7707 35.6917)', true, false, 'odpt:Station:JR-East.Kanda', '[]', '{"zh-TW":["咖哩"],"ja":["カレー"],"en":["curry"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    parent_hub_id = EXCLUDED.parent_hub_id,
    updated_at = NOW();

-- Asakusa Line - Chuo (淺草線 - 中央區)
('odpt:Station:Toei.HigashiGinza', 'tokyo_core', '{"zh-TW":"東銀座","ja":"東銀座","en":"Higashi-ginza"}', 'station', 'POINT(139.7675 35.6694)', true, false, NULL, '[]', '{"zh-TW":["劇場"],"ja":["シアター"],"en":["theater"]}', '[{"mainCategory":"leisure","subCategory":"culture","detailCategory":"theater","name":"Kabukiza Theatre","distanceMeters":0,"direction":"Direct Access"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Nihombashi', 'tokyo_core', '{"zh-TW":"日本橋","ja":"日本橋","en":"Nihombashi"}', 'station', 'POINT(139.7745 35.6812)', true, false, 'odpt:Station:Toei.Nihombashi', '[]', '{"zh-TW":["傳統"],"ja":["伝統"],"en":["tradition"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    parent_hub_id = EXCLUDED.parent_hub_id,
    updated_at = NOW();

('odpt:Station:Toei.Nihombashi', 'tokyo_core', '{"zh-TW":"日本橋","ja":"日本橋","en":"Nihombashi"}', 'station', 'POINT(139.7745 35.6812)', true, true, NULL, '[]', '{"zh-TW":["傳統"],"ja":["伝統"],"en":["tradition"]}', '[{"mainCategory":"shopping","subCategory":"department","name":"Nihombashi Takashimaya S.C.","distanceMeters":50,"direction":"Exit B2"},{"mainCategory":"leisure","subCategory":"culture","detailCategory":"historic_building","name":"Nihonbashi Bridge","distanceMeters":100,"direction":"Exit B12"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:Toei.Ningyocho', 'tokyo_core', '{"zh-TW":"人形町","ja":"人形町","en":"Ningyocho"}', 'station', 'POINT(139.7821 35.6865)', true, false, NULL, '[]', '{"zh-TW":["下町"],"ja":["下町"],"en":["shitamachi"]}', '[{"mainCategory":"leisure","subCategory":"culture","detailCategory":"shrine","name":"Suitengu Shrine","distanceMeters":300,"direction":"Exit A2"},{"mainCategory":"shopping","subCategory":"market","name":"Amazake Yokocho","distanceMeters":50,"direction":"Exit A1"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

-- Shinjuku Area (新宿區域)
('odpt:Station:TokyoMetro.Shinjuku', 'tokyo_core', '{"zh-TW":"新宿","ja":"新宿","en":"Shinjuku"}', 'station', 'POINT(139.7006 35.6896)', true, false, 'odpt:Station:JR-East.Shinjuku', '[]', '{"zh-TW":["大都會"],"ja":["メトロpolis"],"en":["metropolis"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    parent_hub_id = EXCLUDED.parent_hub_id,
    updated_at = NOW();

('odpt:Station:JR-East.Shinjuku', 'tokyo_core', '{"zh-TW":"新宿","ja":"新宿","en":"Shinjuku"}', 'station', 'POINT(139.7006 35.6896)', true, true, NULL, '[]', '{"zh-TW":["大都會"],"ja":["メトロpolis"],"en":["metropolis"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

-- Shibuya Area (渋谷區域)
('odpt:Station:TokyoMetro.Shibuya', 'tokyo_core', '{"zh-TW":"澀谷","ja":"渋谷","en":"Shibuya"}', 'station', 'POINT(139.7016 35.6580)', true, false, 'odpt:Station:JR-East.Shibuya', '[]', '{"zh-TW":["青年文化"],"ja":["ユース"],"en":["youth_culture"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    parent_hub_id = EXCLUDED.parent_hub_id,
    updated_at = NOW();

('odpt:Station:JR-East.Shibuya', 'tokyo_core', '{"zh-TW":"澀谷","ja":"渋谷","en":"Shibuya"}', 'station', 'POINT(139.7016 35.6580)', true, true, NULL, '[]', '{"zh-TW":["青年文化"],"ja":["ユース"],"en":["youth_culture"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

-- Ikebukuro Area (池袋區域)
('odpt:Station:TokyoMetro.Ikebukuro', 'tokyo_core', '{"zh-TW":"池袋","ja":"池袋","en":"Ikebukuro"}', 'station', 'POINT(139.7109 35.7289)', true, false, 'odpt:Station:JR-East.Ikebukuro', '[]', '{"zh-TW":["娛樂"],"ja":["エンターテインメント"],"en":["entertainment"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    parent_hub_id = EXCLUDED.parent_hub_id,
    updated_at = NOW();

('odpt:Station:JR-East.Ikebukuro', 'tokyo_core', '{"zh-TW":"池袋","ja":"池袋","en":"Ikebukuro"}', 'station', 'POINT(139.7109 35.7289)', true, true, NULL, '[]', '{"zh-TW":["娛樂"],"ja":["エンターテインメント"],"en":["entertainment"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

-- HigashiNihombashi Area (東日本橋區域)
('odpt:Station:Toei.BakuroYokoyama', 'tokyo_core', '{"zh-TW":"馬喰橫山","ja":"馬喰横山","en":"Bakuro-yokoyama"}', 'station', 'POINT(139.7840 35.6922)', true, false, 'odpt:Station:Toei.HigashiNihombashi', '[]', NULL, NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    parent_hub_id = EXCLUDED.parent_hub_id,
    updated_at = NOW();

('odpt:Station:Toei.HigashiNihombashi', 'tokyo_core', '{"zh-TW":"東日本橋・馬喰橫山","ja":"東日本橋・馬喰横山","en":"Higashi-nihombashi / Bakuro-yokoyama"}', 'station', 'POINT(139.7840 35.6922)', true, true, NULL, '[]', '{"zh-TW":["批發"],"ja":["卸売"],"en":["wholesale"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

-- Taito Ward (台東區)
('odpt:Station:TokyoMetro.Asakusa', 'tokyo_core', '{"zh-TW":"淺草","ja":"浅草","en":"Asakusa"}', 'station', 'POINT(139.7967 35.7106)', true, true, NULL, '[]', '{"zh-TW":["傳統"],"ja":["伝統"],"en":["traditional"]}', '[{"mainCategory":"shopping","subCategory":"specialty","detailCategory":"souvenir","name":"仲見世商店街","distanceMeters":200,"direction":"Exit 1"},{"mainCategory":"leisure","subCategory":"tourist","detailCategory":"temple","name":"Senso-ji","distanceMeters":350,"direction":"North"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:Toei.Kuramae', 'tokyo_core', '{"zh-TW":"藏前","ja":"蔵前","en":"Kuramae"}', 'station', 'POINT(139.7905 35.7050)', true, false, NULL, '[]', '{"zh-TW":["工藝"],"ja":["クラフト"],"en":["craft"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:JR-East.Okachimachi', 'tokyo_core', '{"zh-TW":"御徒町・上野御徒町","ja":"御徒町・上野御徒町","en":"Okachimachi / Ueno-Okachimachi"}', 'station', 'POINT(139.7752 35.7075)', true, true, NULL, '[]', '{"zh-TW":["市場"],"ja":["マーケット"],"en":["market"]}', '[{"mainCategory":"shopping","subCategory":"department","name":"Matsuzakaya Ueno","distanceMeters":100,"direction":"South Exit"},{"mainCategory":"shopping","subCategory":"market","name":"Ameya-Yokocho","distanceMeters":50,"direction":"North Exit"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:JR-East.Uguisudani', 'tokyo_core', '{"zh-TW":"鶯谷","ja":"鶯谷","en":"Uguisudani"}', 'station', 'POINT(139.7788 35.7225)', true, false, NULL, '[]', '{"zh-TW":["復古"],"ja":["レトロ"],"en":["retro"]}', '[{"mainCategory":"leisure","subCategory":"culture","detailCategory":"museum","name":"Tokyo National Museum","distanceMeters":600,"direction":"South Exit"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:Toei.Asakusabashi', 'tokyo_core', '{"zh-TW":"淺草橋","ja":"浅草橋","en":"Asakusabashi"}', 'station', 'POINT(139.7865 35.6974)', true, false, NULL, '[]', '{"zh-TW":["批發工藝"],"ja":["卸売"],"en":["wholesale_craft"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Tawaramachi', 'tokyo_core', '{"zh-TW":"田原町","ja":"田原町","en":"Tawaramachi"}', 'station', 'POINT(139.7892 35.7107)', true, false, NULL, '[]', '{"zh-TW":["廚房"],"ja":["キッチン"],"en":["kitchen"]}', '[{"mainCategory":"shopping","subCategory":"specialty","name":"Kappabashi Kitchen Town","distanceMeters":150,"direction":"Exit 3"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Iriya', 'tokyo_core', '{"zh-TW":"入谷","ja":"入谷","en":"Iriya"}', 'station', 'POINT(139.7850 35.7208)', true, false, NULL, '[]', '{"zh-TW":["寧靜"],"ja":["静かな"],"en":["quiet"]}', '[{"mainCategory":"leisure","subCategory":"culture","detailCategory":"temple","name":"Shingen-ji (Kishibojin)","distanceMeters":100,"direction":"Exit 1"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Inaricho', 'tokyo_core', '{"zh-TW":"稻荷町","ja":"稲荷町","en":"Inaricho"}', 'station', 'POINT(139.7825 35.7115)', true, false, NULL, '[]', '{"zh-TW":["寺廟"],"ja":["寺"],"en":["temple"]}', '[{"mainCategory":"leisure","subCategory":"culture","detailCategory":"shrine","name":"Shitaya Shrine","distanceMeters":100,"direction":"Exit 1"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Minowa', 'tokyo_core', '{"zh-TW":"三之輪","ja":"三ノ輪","en":"Minowa"}', 'station', 'POINT(139.7914 35.7296)', true, false, NULL, '[]', '{"zh-TW":["電車"],"ja":["トラム"],"en":["tram"]}', '[{"mainCategory":"leisure","subCategory":"tourist","detailCategory":"activity","name":"Toden Minowabashi Station","distanceMeters":250,"direction":"Exit 3"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:Toei.ShinOkachimachi', 'tokyo_core', '{"zh-TW":"新御徒町","ja":"新御徒町","en":"Shin-Okachimachi"}', 'station', 'POINT(139.7868 35.7071)', true, true, NULL, '[]', '{"zh-TW":["遊戲場"],"ja":["アーケード"],"en":["arcade"]}', '[{"mainCategory":"shopping","subCategory":"market","name":"Satake Shopping Arcade","distanceMeters":50,"direction":"Exit A2"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Yushima', 'tokyo_core', '{"zh-TW":"湯島","ja":"湯島","en":"Yushima"}', 'station', 'POINT(139.7711 35.7077)', true, false, NULL, '[]', '{"zh-TW":["學者"],"ja":[" scholar"],"en":["scholar"]}', '[{"mainCategory":"leisure","subCategory":"culture","detailCategory":"shrine","name":"Yushima Tenjin","distanceMeters":150,"direction":"Exit 3"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

-- Bunkyo Ward (文京區)
('odpt:Station:TokyoMetro.Tsukiji', 'tokyo_core', '{"zh-TW":"築地","ja":"築地","en":"Tsukiji"}', 'station', 'POINT(139.7715 35.6695)', true, false, NULL, '[]', '{"zh-TW":["市場"],"ja":["マーケット"],"en":["market"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Ochanomizu', 'tokyo_core', '{"zh-TW":"御茶之水","ja":"御茶ノ水","en":"Ochanomizu"}', 'station', 'POINT(139.7638 35.6994)', true, false, NULL, '[]', '{"zh-TW":["學術"],"ja":["アカデミック"],"en":["academic"]}', '[{"mainCategory":"service","subCategory":"hospital","name":"Juntendo University Hospital","distanceMeters":200,"direction":"Exit 1"},{"mainCategory":"leisure","subCategory":"culture","detailCategory":"shrine","name":"Kanda Myojin","distanceMeters":300,"direction":"Exit 1"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Kasumigaseki', 'tokyo_core', '{"zh-TW":"霞關","ja":"霞ヶ関","en":"Kasumigaseki"}', 'station', 'POINT(139.7513 35.6726)', true, false, NULL, '[]', '{"zh-TW":["政府"],"ja":["政府"],"en":["government"]}', '[{"mainCategory":"service","subCategory":"government","name":"Ministry of Foreign Affairs","distanceMeters":100,"direction":"Exit A4"},{"mainCategory":"leisure","subCategory":"nature","detailCategory":"park","name":"Hibiya Park","distanceMeters":100,"direction":"Exit B2"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Iidabashi', 'tokyo_core', '{"zh-TW":"飯田橋","ja":"飯田橋","en":"Iidabashi"}', 'station', 'POINT(139.7450 35.7021)', true, false, 'odpt:Station:JR-East.Iidabashi', '[]', '{"zh-TW":["樞紐"],"ja":["ハブ"],"en":["hub"]}', '[{"mainCategory":"leisure","subCategory":"culture","detailCategory":"shrine","name":"Tokyo Daijingu","distanceMeters":350,"direction":"Exit A4"},{"mainCategory":"leisure","subCategory":"nature","detailCategory":"garden","name":"Koishikawa Korakuen","distanceMeters":400,"direction":"Exit C3"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    parent_hub_id = EXCLUDED.parent_hub_id,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:JR-East.Iidabashi', 'tokyo_core', '{"zh-TW":"飯田橋","ja":"飯田橋","en":"Iidabashi"}', 'station', 'POINT(139.7450 35.7021)', true, true, NULL, '[]', '{"zh-TW":["樞紐"],"ja":["ハブ"],"en":["hub"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Hibiya', 'tokyo_core', '{"zh-TW":"日比谷","ja":"日比谷","en":"Hibiya"}', 'station', 'POINT(139.7599 35.6738)', true, true, NULL, '[]', '{"zh-TW":["文化"],"ja":["カルチャー"],"en":["culture"]}', '[{"mainCategory":"leisure","subCategory":"culture","detailCategory":"museum","name":"Tokyo Takarazuka Theater","distanceMeters":100,"direction":"Exit A5"},{"mainCategory":"leisure","subCategory":"nature","detailCategory":"park","name":"Hibiya Park","distanceMeters":0,"direction":"Direct Access"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Otemachi', 'tokyo_core', '{"zh-TW":"大手町","ja":"大手町","en":"Otemachi"}', 'station', 'POINT(139.7639 35.6867)', true, false, 'odpt:Station:JR-East.Tokyo', '[]', '{"zh-TW":["商業"],"ja":["ビジネス"],"en":["business"]}', '[{"mainCategory":"leisure","subCategory":"nature","detailCategory":"park","name":"Imperial Palace East Gardens","distanceMeters":200,"direction":"Exit C13a"}]', NOW())
ON CONFLICT (id) DO UPDATE SET
    parent_hub_id = EXCLUDED.parent_hub_id,
    vibe_tags = EXCLUDED.vibe_tags,
    facility_tags = EXCLUDED.facility_tags,
    updated_at = NOW();

-- Minato Ward (港區)
('odpt:Station:TokyoMetro.Shimbashi', 'tokyo_core', '{"zh-TW":"新橋","ja":"新橋","en":"Shimbashi"}', 'station', 'POINT(139.7582 35.6665)', true, true, NULL, '[]', '{"zh-TW":["上班族"],"ja":["サラリー"],"en":["salaryman"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Roppongi', 'tokyo_core', '{"zh-TW":"六本木","ja":"六本木","en":"Roppongi"}', 'station', 'POINT(139.7322 35.6633)', true, true, NULL, '[]', '{"zh-TW":["夜生活"],"ja":["ナイトライフ"],"en":["nightlife"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:JR-East.Hamamatsucho', 'tokyo_core', '{"zh-TW":"濱松町・大門","ja":"浜松町・大門","en":"Hamamatsucho / Daimon"}', 'station', 'POINT(139.7571 35.6551)', true, true, NULL, '[]', '{"zh-TW":["機場門戶"],"ja":["エアポート"],"en":["airport_gateway"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Omotesando', 'tokyo_core', '{"zh-TW":"表參道","ja":"表参道","en":"Omotesando"}', 'station', 'POINT(139.7126 35.6653)', true, true, NULL, '[]', '{"zh-TW":["時尚"],"ja":["ファッション"],"en":["fashion"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Hiroo', 'tokyo_core', '{"zh-TW":"廣尾","ja":"広尾","en":"Hiroo"}', 'station', 'POINT(139.7219 35.6532)', true, false, NULL, '[]', '{"zh-TW":["國際"],"ja":["インターナショナル"],"en":["international"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:TokyoMetro.Akasakamitsuke', 'tokyo_core', '{"zh-TW":"赤坂見附","ja":"赤坂見附","en":"Akasaka-mitsuke"}', 'station', 'POINT(139.7371 35.6770)', true, true, NULL, '[]', '{"zh-TW":["美食"],"ja":["グルメ"],"en":["gourmet"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

-- Chuo Ward - Toei Subway (中央區 - 都營地下鐵)
('odpt:Station:Toei.Takaracho', 'tokyo_core', '{"zh-TW":"寶町","ja":"宝町","en":"Takaracho"}', 'station', 'POINT(139.7719 35.6754)', true, false, NULL, '[]', '{"zh-TW":["商業"],"ja":["ビジネス"],"en":["business"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:Toei.Kachidoki', 'tokyo_core', '{"zh-TW":"勝鬨","ja":"勝どき","en":"Kachidoki"}', 'station', 'POINT(139.7771 35.6590)', true, false, NULL, '[]', '{"zh-TW":["住宅"],"ja":["レジデンス"],"en":["residential"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:Toei.Tsukishima', 'tokyo_core', '{"zh-TW":"月島","ja":"月島","en":"Tsukishima"}', 'station', 'POINT(139.7846 35.6645)', true, false, NULL, '[]', '{"zh-TW":["文字燒"],"ja":["もんじゃ"],"en":["monja"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:Toei.Tsukijishijo', 'tokyo_core', '{"zh-TW":"築地市場","ja":"築地市場","en":"Tsukijishijo"}', 'station', 'POINT(139.7671 35.6649)', true, false, NULL, '[]', '{"zh-TW":["市場歷史"],"ja":["歴史"],"en":["market_history"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:Toei.Hamacho', 'tokyo_core', '{"zh-TW":"濱町","ja":"浜町","en":"Hamacho"}', 'station', 'POINT(139.7891 35.6882)', true, false, NULL, '[]', '{"zh-TW":["住宅公園"],"ja":["公園"],"en":["residential_park"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

-- Chiyoda Ward - Toei Subway (千代田區 - 都營地下鐵)
('odpt:Station:Toei.Jimbocho', 'tokyo_core', '{"zh-TW":"神保町","ja":"神保町","en":"Jimbocho"}', 'station', 'POINT(139.7577 35.6959)', true, true, NULL, '[]', '{"zh-TW":["書籍"],"ja":["ブック"],"en":["books"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:Toei.Ogawamachi', 'tokyo_core', '{"zh-TW":"小川町","ja":"小川町","en":"Ogawamachi"}', 'station', 'POINT(139.7667 35.6951)', true, false, NULL, '[]', '{"zh-TW":["運動"],"ja":["スポーツ"],"en":["sports"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:Toei.Kudanshita', 'tokyo_core', '{"zh-TW":"九段下","ja":"九段下","en":"Kudanshita"}', 'station', 'POINT(139.7514 35.6954)', true, true, NULL, '[]', '{"zh-TW":["武道館"],"ja":["武道館"],"en":["budokan"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:Toei.Iwamotocho', 'tokyo_core', '{"zh-TW":"岩本町","ja":"岩本町","en":"Iwamotocho"}', 'station', 'POINT(139.7759 35.6955)', true, false, NULL, '[]', '{"zh-TW":["秋葉原鄰居"],"ja":["秋葉原"],"en":["akiba_neighbor"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:Toei.Hibiya', 'tokyo_core', '{"zh-TW":"日比谷","ja":"日比谷","en":"Hibiya"}', 'station', 'POINT(139.7593 35.6762)', true, true, NULL, '[]', '{"zh-TW":["劇場"],"ja":["シアター"],"en":["theater"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:Toei.Uchisaiwaicho', 'tokyo_core', '{"zh-TW":"內幸町","ja":"内幸町","en":"Uchisaiwaicho"}', 'station', 'POINT(139.7555 35.6694)', true, false, NULL, '[]', '{"zh-TW":["商業"],"ja":["ビジネス"],"en":["business"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

('odpt:Station:Toei.Ichigaya', 'tokyo_core', '{"zh-TW":"市谷","ja":"市ヶ谷","en":"Ichigaya"}', 'station', 'POINT(139.7377 35.6871)', true, true, NULL, '[]', '{"zh-TW":["護城河"],"ja":["堀"],"en":["moat"]}', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    is_hub = EXCLUDED.is_hub,
    vibe_tags = EXCLUDED.vibe_tags,
    updated_at = NOW();

-- 驗證同步結果
SELECT COUNT(*) as synced_nodes FROM nodes;

-- 顯示同步後的節點分類
SELECT
    CASE
        WHEN is_hub = true AND parent_hub_id IS NULL THEN 'Hub'
        WHEN is_hub = false AND parent_hub_id IS NOT NULL THEN 'Child'
        ELSE 'Standalone'
    END as node_type,
    COUNT(*) as count
FROM nodes
GROUP BY node_type;
