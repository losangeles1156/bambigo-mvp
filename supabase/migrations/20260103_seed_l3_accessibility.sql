-- L3 Accessibility Facilities Seed Data
-- 補齊主要車站的電梯、電扶梯、廁所位置資訊
-- Generated: 2026-01-03

-- 新宿區 (Shinjuku Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:JR-East.Shinjuku', 'elevator', '{"zh-TW": "JR新宿站西口電梯", "ja": "新宿駅西口エレベーター", "en": "JR Shinjuku West Exit Elevator"}', '{"location": "West Exit", "floors": "B1F-2F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Shinjuku', 'elevator', '{"zh-TW": "JR新宿站東口電梯", "ja": "新宿駅東口エレベーター", "en": "JR Shinjuku East Exit Elevator"}', '{"location": "East Exit", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Shinjuku', 'escalator', '{"zh-TW": "JR新宿站南口電扶梯", "ja": "新宿駅南口エスカレーター", "en": "JR Shinjuku South Exit Escalator"}', '{"location": "South Exit", "direction": "up_only", "length": "medium"}', NOW()),
('odpt:Station:JR-East.Shinjuku', 'toilet', '{"zh-TW": "JR新宿站西口多功能廁所", "ja": "新宿駅西口多目的トイレ", "en": "JR Shinjuku West Exit Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "West Entrance"}', NOW());

-- 港區 (Minato Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:JR-East.Hamamatsucho', 'elevator', '{"zh-TW": "JR濱松町站北口電梯", "ja": "浜松町駅北口エレベーター", "en": "JR Hamamatsucho North Exit Elevator"}', '{"location": "North Exit", "floors": "1F-2F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Hamamatsucho', 'escalator', '{"zh-TW": "JR濱松町站連絡通道電扶梯", "ja": "浜松町駅連絡通路エスカレーター", "en": "JR Hamamatsucho Connecting Corridor Escalator"}', '{"location": "Connector", "direction": "bidirectional", "length": "long"}', NOW()),
('odpt:Station:JR-East.Hamamatsucho', 'toilet', '{"zh-TW": "JR濱松町站站內無障礙廁所", "ja": "浜松町駅構内多目的トイレ", "en": "JR Hamamatsucho Station Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Inside Station"}', NOW()),
('odpt:Station:TokyoMetro.Roppongi', 'elevator', '{"zh-TW": "六本木站1號出口電梯", "ja": "六本木駅1番出口エレベーター", "en": "Roppongi Exit 1 Elevator"}', '{"location": "Exit 1", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:TokyoMetro.Roppongi', 'escalator', '{"zh-TW": "六本木站大江戶線連絡電扶梯", "ja": "六本木駅大江戸線連絡エスカレーター", "en": "Roppongi Oedo Line Connector Escalator"}', '{"location": "Oedo Line Connector", "direction": "bidirectional", "length": "very_long"}', NOW()),
('odpt:Station:TokyoMetro.Roppongi', 'toilet', '{"zh-TW": "六本木站付費區內無障礙廁所", "ja": "六本木駅課金エリア多目的トイレ", "en": "Roppongi Paid Area Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Paid Area"}', NOW()),
('odpt:Station:TokyoMetro.Shimbashi', 'elevator', '{"zh-TW": "新橋站烏森口電梯", "ja": "新橋駅烏森口エレベーター", "en": "Shimbashi Karasumori Exit Elevator"}', '{"location": "Karasumori Exit", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:TokyoMetro.Shimbashi', 'toilet', '{"zh-TW": "新橋站烏森口多功能廁所", "ja": "新橋駅烏森口多目的トイレ", "en": "Shimbashi Karasumori Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Karasumori Exit"}', NOW());

-- 涉谷區 (Shibuya Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:JR-East.Shibuya', 'elevator', '{"zh-TW": "JR澀谷站南口電梯", "ja": "渋谷駅南口エレベーター", "en": "JR Shibuya South Exit Elevator"}', '{"location": "South Exit", "floors": "B2F-1F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Shibuya', 'elevator', '{"zh-TW": "JR澀谷站 Hikarie 電梯", "ja": "渋谷駅渋谷ヒカリエエレベーター", "en": "JR Shibuya Hikarie Elevator"}', '{"location": "Hikarie", "floors": "B3F-3F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Shibuya', 'escalator', '{"zh-TW": "JR澀谷站南口電扶梯", "ja": "渋谷駅南口エスカレーター", "en": "JR Shibuya South Exit Escalator"}', '{"location": "South Exit", "direction": "up_only", "length": "long"}', NOW()),
('odpt:Station:JR-East.Shibuya', 'toilet', '{"zh-TW": "JR澀谷站南口多功能廁所", "ja": "渋谷駅南口多目的トイレ", "en": "JR Shibuya South Exit Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "South Exit"}', NOW()),
('odpt:Station:TokyoMetro.Shibuya', 'elevator', '{"zh-TW": "東京Metro澀谷站電梯", "ja": "東京メトロ渋谷駅エレベーター", "en": "Tokyo Metro Shibuya Elevator"}', '{"location": "Main Concourse", "floors": "B2F-1F", "accessible": true}', NOW()),
('odpt:Station:TokyoMetro.Omotesando', 'elevator', '{"zh-TW": "表參道站A2出口電梯", "ja": "表参道駅A2出口エレベーター", "en": "Omotesando Exit A2 Elevator"}', '{"location": "Exit A2", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:TokyoMetro.Omotesando', 'escalator', '{"zh-TW": "表參道站B1電扶梯", "ja": "表参道駅B1エスカレーター", "en": "Omotesando B1 Escalator"}', '{"location": "B1 Concourse", "direction": "bidirectional", "length": "medium"}', NOW()),
('odpt:Station:TokyoMetro.Omotesando', 'toilet', '{"zh-TW": "表參道站站內無障礙廁所", "ja": "表参道駅構内多目的トイレ", "en": "Omotesando Station Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Inside Station"}', NOW());

-- 千代田區 (Chiyoda Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:JR-East.Tokyo', 'elevator', '{"zh-TW": "東京站丸之內北口電梯", "ja": "東京駅丸の内北口エレベーター", "en": "Tokyo Marunouchi North Exit Elevator"}', '{"location": "Marunouchi North Exit", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Tokyo', 'elevator', '{"zh-TW": "東京站日本橋口電梯", "ja": "東京駅日本橋口エレベーター", "en": "Tokyo Nihombashi Exit Elevator"}', '{"location": "Nihombashi Exit", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Tokyo', 'escalator', '{"zh-TW": "東京站丸之內地下連絡電扶梯", "ja": "東京駅丸の内地下連絡エスカレーター", "en": "Tokyo Marunouchi Underground Connector Escalator"}', '{"location": "Underground Connector", "direction": "bidirectional", "length": "very_long"}', NOW()),
('odpt:Station:JR-East.Tokyo', 'toilet', '{"zh-TW": "東京站丸之內北口多功能廁所", "ja": "東京駅丸の内北口多目的トイレ", "en": "Tokyo Marunouchi North Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Marunouchi North"}', NOW()),
('odpt:Station:TokyoMetro.Hibiya', 'elevator', '{"zh-TW": "日比谷站A5出口電梯", "ja": "日比谷駅A5出口エレベーター", "en": "Hibiya Exit A5 Elevator"}', '{"location": "Exit A5", "floors": "B2F-1F", "accessible": true}', NOW()),
('odpt:Station:TokyoMetro.Hibiya', 'escalator', '{"zh-TW": "日比谷站A5出口電扶梯", "ja": "日比谷駅A5出口エスカレーター", "en": "Hibiya Exit A5 Escalator"}', '{"location": "Exit A5", "direction": "up_only", "length": "medium"}', NOW()),
('odpt:Station:TokyoMetro.Hibiya', 'toilet', '{"zh-TW": "日比谷站站內多功能廁所", "ja": "日比谷駅構内多目的トイレ", "en": "Hibiya Station Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Inside Station"}', NOW()),
('odpt:Station:TokyoMetro.Kasumigaseki', 'elevator', '{"zh-TW": "霞關站A1出口電梯", "ja": "霞ヶ関駅A1出口エレベーター", "en": "Kasumigaseki Exit A1 Elevator"}', '{"location": "Exit A1", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:TokyoMetro.Kasumigaseki', 'toilet', '{"zh-TW": "霞關站站內無障礙廁所", "ja": "霞ヶ関駅構内多目的トイレ", "en": "Kasumigaseki Station Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Inside Station"}', NOW());

-- 中央區 (Chuo Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:Toei.Nihombashi', 'elevator', '{"zh-TW": "日本橋站B1出口電梯", "ja": "日本橋駅B1出口エレベーター", "en": "Nihombashi Exit B1 Elevator"}', '{"location": "Exit B1", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:Toei.Nihombashi', 'escalator', '{"zh-TW": "日本橋站連絡通道電扶梯", "ja": "日本橋駅連絡通路エスカレーター", "en": "Nihombashi Connector Escalator"}', '{"location": "Connector", "direction": "bidirectional", "length": "medium"}', NOW()),
('odpt:Station:Toei.Nihombashi', 'toilet', '{"zh-TW": "日本橋站多功能廁所", "ja": "日本橋駅多目的トイレ", "en": "Nihombashi Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Station Hall"}', NOW()),
('odpt:Station:TokyoMetro.Ginza', 'elevator', '{"zh-TW": "銀座站A3出口電梯", "ja": "銀座駅A3出口エレベーター", "en": "Ginza Exit A3 Elevator"}', '{"location": "Exit A3", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:TokyoMetro.Ginza', 'escalator', '{"zh-TW": "銀座站A3出口電扶梯", "ja": "銀座駅A3出口エスカレーター", "en": "Ginza Exit A3 Escalator"}', '{"location": "Exit A3", "direction": "up_only", "length": "medium"}', NOW()),
('odpt:Station:TokyoMetro.Ginza', 'toilet', '{"zh-TW": "銀座站站內無障礙廁所", "ja": "銀座駅構内多目的トイレ", "en": "Ginza Station Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Inside Station"}', NOW());

-- 台東區 (Taito Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:JR-East.Ueno', 'elevator', '{"zh-TW": "JR上野站不忍口電梯", "ja": "上野駅不忍口エレベーター", "en": "JR Ueno Shinobazu Exit Elevator"}', '{"location": "Shinobazu Exit", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Ueno', 'elevator', '{"zh-TW": "JR上野站正面口電梯", "ja": "上野駅正面口エレベーター", "en": "JR Ueno Main Exit Elevator"}', '{"location": "Main Exit", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Ueno', 'escalator', '{"zh-TW": "JR上野站不忍口電扶梯", "ja": "上野駅不忍口エスカレーター", "en": "JR Ueno Shinobazu Exit Escalator"}', '{"location": "Shinobazu Exit", "direction": "up_only", "length": "medium"}', NOW()),
('odpt:Station:JR-East.Ueno', 'toilet', '{"zh-TW": "JR上野站不忍口多功能廁所", "ja": "上野駅不忍口多目的トイレ", "en": "JR Ueno Shinobazu Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Shinobazu Exit"}', NOW()),
('odpt:Station:TokyoMetro.Ginza.Asakusa', 'elevator', '{"zh-TW": "淺草站1號出口電梯", "ja": "浅草駅1番出口エレベーター", "en": "Asakusa Exit 1 Elevator"}', '{"location": "Exit 1", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:TokyoMetro.Ginza.Asakusa', 'escalator', '{"zh-TW": "淺草站連絡電扶梯", "ja": "浅草駅連絡エスカレーター", "en": "Asakusa Connector Escalator"}', '{"location": "Connector", "direction": "bidirectional", "length": "long"}', NOW()),
('odpt:Station:TokyoMetro.Ginza.Asakusa', 'toilet', '{"zh-TW": "淺草站站內多功能廁所", "ja": "浅草駅構内多目的トイレ", "en": "Asakusa Station Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Inside Station"}', NOW()),
('odpt:Station:JR-East.Akihabara', 'elevator', '{"zh-TW": "秋葉原站電氣街口電梯", "ja": "秋葉原駅電気街口エレベーター", "en": "Akihabara Electric Town Exit Elevator"}', '{"location": "Electric Town Exit", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Akihabara', 'escalator', '{"zh-TW": "秋葉原站電氣街口電扶梯", "ja": "秋葉原駅電気街口エスカレーター", "en": "Akihabara Electric Town Exit Escalator"}', '{"location": "Electric Town Exit", "direction": "up_only", "length": "medium"}', NOW()),
('odpt:Station:JR-East.Akihabara', 'toilet', '{"zh-TW": "秋葉原站多功能廁所", "ja": "秋葉原駅多目的トイレ", "en": "Akihabara Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Station Hall"}', NOW());

-- 文京區 (Bunkyo Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:TokyoMetro.Ochanomizu', 'elevator', '{"zh-TW": "御茶之水站1號出口電梯", "ja": "御茶ノ水駅1番出口エレベーター", "en": "Ochanomizu Exit 1 Elevator"}', '{"location": "Exit 1", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:TokyoMetro.Ochanomizu', 'toilet', '{"zh-TW": "御茶之水站站內無障礙廁所", "ja": "御茶ノ水駅構内多目的トイレ", "en": "Ochanomizu Station Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Inside Station"}', NOW());

-- 墨田區 (Sumida Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:Toei.Asakusa.Oshiage', 'elevator', '{"zh-TW": "押上站A1出口電梯", "ja": "押上駅A1出口エレベーター", "en": "Oshiage Exit A1 Elevator"}', '{"location": "Exit A1", "floors": "B2F-1F", "accessible": true}', NOW()),
('odpt:Station:Toei.Asakusa.Oshiage', 'escalator', '{"zh-TW": "押上站連絡電扶梯", "ja": "押上駅連絡エスカレーター", "en": "Oshiage Connector Escalator"}', '{"location": "Connector", "direction": "bidirectional", "length": "very_long"}', NOW()),
('odpt:Station:Toei.Asakusa.Oshiage', 'toilet', '{"zh-TW": "押上站多功能廁所", "ja": "押上駅多目的トイレ", "en": "Oshiage Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Station Hall"}', NOW());

-- 豊島區 (Toshima Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:JR-East.Ikebukuro', 'elevator', '{"zh-TW": "JR池袋站東口電梯", "ja": "池袋駅東口エレベーター", "en": "JR Ikebukuro East Exit Elevator"}', '{"location": "East Exit", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Ikebukuro', 'elevator', '{"zh-TW": "JR池袋站西口電梯", "ja": "池袋駅西口エレベーター", "en": "JR Ikebukuro West Exit Elevator"}', '{"location": "West Exit", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Ikebukuro', 'escalator', '{"zh-TW": "JR池袋站東口電扶梯", "ja": "池袋駅東口エスカレーター", "en": "JR Ikebukuro East Exit Escalator"}', '{"location": "East Exit", "direction": "up_only", "length": "medium"}', NOW()),
('odpt:Station:JR-East.Ikebukuro', 'toilet', '{"zh-TW": "JR池袋站東口多功能廁所", "ja": "池袋駅東口多目的トイレ", "en": "JR Ikebukuro East Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "East Exit"}', NOW());

-- 江東區 (Koto Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:TokyoMetro.Tozai.MonzenNakacho', 'elevator', '{"zh-TW": "門前仲町站1號出口電梯", "ja": "門前仲町駅1番出口エレベーター", "en": "Monzen-Nakacho Exit 1 Elevator"}', '{"location": "Exit 1", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:TokyoMetro.Tozai.MonzenNakacho', 'toilet', '{"zh-TW": "門前仲町站站內無障礙廁所", "ja": "門前仲町駅構内多目的トイレ", "en": "Monzen-Nakacho Station Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Inside Station"}', NOW());

-- 品川區 (Shinagawa Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:JR-East.Shinagawa', 'elevator', '{"zh-TW": "JR品川站高輪口電梯", "ja": "品川駅高輪口エレベーター", "en": "JR Shinagawa Takanawa Exit Elevator"}', '{"location": "Takanawa Exit", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Shinagawa', 'escalator', '{"zh-TW": "JR品川站高輪口電扶梯", "ja": "品川駅高輪口エスカレーター", "en": "JR Shinagawa Takanawa Exit Escalator"}', '{"location": "Takanawa Exit", "direction": "up_only", "length": "medium"}', NOW()),
('odpt:Station:JR-East.Shinagawa', 'toilet', '{"zh-TW": "JR品川站高輪口多功能廁所", "ja": "品川駅高輪口多目的トイレ", "en": "JR Shinagawa Takanawa Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Takanawa Exit"}', NOW());

-- 目黑區 (Meguro Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:TokyoMetro.Nakano', 'elevator', '{"zh-TW": "中野站南口電梯", "ja": "中野駅南口エレベーター", "en": "Nakano South Exit Elevator"}', '{"location": "South Exit", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:TokyoMetro.Nakano', 'toilet', '{"zh-TW": "中野站站內無障礙廁所", "ja": "中野駅構内多目的トイレ", "en": "Nakano Station Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Inside Station"}', NOW());

-- 大田区 (Ota Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:Keikyu.HanedaAirportTerminal3', 'elevator', '{"zh-TW": "羽田機場第3航站樓站電梯", "ja": "羽田空港第3ターミナル駅エレベーター", "en": "Haneda Airport Terminal 3 Station Elevator"}', '{"location": "Terminal 3", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:Keikyu.HanedaAirportTerminal3', 'escalator', '{"zh-TW": "羽田機場第3航站樓站電扶梯", "ja": "羽田空港第3ターミナル駅エスカレーター", "en": "Haneda Airport Terminal 3 Escalator"}', '{"location": "Terminal 3", "direction": "bidirectional", "length": "long"}', NOW()),
('odpt:Station:Keikyu.HanedaAirportTerminal3', 'toilet', '{"zh-TW": "羽田機場第3航站樓多功能廁所", "ja": "羽田空港第3ターミナル多目的トイレ", "en": "Haneda Terminal 3 Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Terminal 3"}', NOW());

-- 世田谷區 (Setagaya Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:Tokyu.Toyoko.Shibuya', 'elevator', '{"zh-TW": "東横學田站電梯", "ja": "渋谷駅エレベーター", "en": "Shibuya Station Elevator"}', '{"location": "Main Concourse", "floors": "B2F-1F", "accessible": true}', NOW()),
('odpt:Station:Tokyu.Toyoko.Shibuya', 'toilet', '{"zh-TW": "東横學田站多功能廁所", "ja": "渋谷駅多目的トイレ", "en": "Shibuya Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Station Hall"}', NOW());

-- 杉並區 (Suginami Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:JR-East.Asagaya', 'elevator', '{"zh-TW": "JR阿佐谷站電梯", "ja": "阿佐ヶ谷駅エレベーター", "en": "Asagaya Station Elevator"}', '{"location": "North Exit", "floors": "1F-2F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Asagaya', 'toilet', '{"zh-TW": "JR阿佐谷站無障礙廁所", "ja": "阿佐ヶ谷駅多目的トイレ", "en": "Asagaya Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Station Hall"}', NOW());

-- 北區 (Kita Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:JR-East.Uguisudani', 'elevator', '{"zh-TW": "JR鶯谷站電梯", "ja": "鶯谷駅エレベーター", "en": "Uguisudani Station Elevator"}', '{"location": "South Exit", "floors": "1F-2F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Uguisudani', 'toilet', '{"zh-TW": "JR鶯谷站無障礙廁所", "ja": "鶯谷駅多目的トイレ", "en": "Uguisudani Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Station Hall"}', NOW());

-- 荒川区 (Arakawa Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:Toei.NipporiToneri.Machinaka', 'elevator', '{"zh-TW": "町屋站電梯", "ja": "町屋駅エレベーター", "en": "Machiya Station Elevator"}', '{"location": "Main Exit", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:Toei.NipporiToneri.Machinaka', 'toilet', '{"zh-TW": "町屋站多功能廁所", "ja": "町屋駅多目的トイレ", "en": "Machiya Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Station Hall"}', NOW());

-- 板橋區 (Itabashi Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:JR-East.Ikebukuro', 'elevator', '{"zh-TW": "JR板橋站電梯", "ja": "板橋駅エレベーター", "en": "Itabashi Station Elevator"}', '{"location": "East Exit", "floors": "1F-2F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Ikebukuro', 'toilet', '{"zh-TW": "JR板橋站多功能廁所", "ja": "板橋駅多目的トイレ", "en": "Itabashi Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Station Hall"}', NOW());

-- 練馬區 (Nerima Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:Seibu.Ikebukuro', 'elevator', '{"zh-TW": "西武池袋站電梯", "ja": "池袋駅エレベーター", "en": "Seibu Ikebukuro Elevator"}', '{"location": "Main Exit", "floors": "B1F-1F", "accessible": true}', NOW()),
('odpt:Station:Seibu.Ikebukuro', 'toilet', '{"zh-TW": "西武池袋站多功能廁所", "ja": "池袋駅多目的トイレ", "en": "Seibu Ikebukuro Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Station Hall"}', NOW());

-- 足立區 (Adachi Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:TokyoMetro.Hibiya.MinamiSenju', 'elevator', '{"zh-TW': "JR南千住站電梯", "ja": "南千住駅エレベーター", "en": "Minami-Senju Station Elevator"}', '{"location": "West Exit", "floors": "1F-2F", "accessible": true}', NOW()),
('odpt:Station:TokyoMetro.Hibiya.MinamiSenju', 'toilet', '{"zh-TW": "JR南千住站多功能廁所", "ja": "南千住駅多目的トイレ", "en": "Minami-Senju Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Station Hall"}', NOW());

-- 葛飾區 (Katsushika Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:Keisei.Shibamata', 'elevator', '{"zh-TW": "京成柴又站電梯", "ja": "柴又駅エレベーター", "en": "Shibamata Station Elevator"}', '{"location": "Main Exit", "floors": "1F-2F", "accessible": true}', NOW()),
('odpt:Station:Keisei.Shibamata', 'toilet', '{"zh-TW": "京成柴又站多功能廁所", "ja": "柴又駅多目的トイレ", "en": "Shibamata Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Station Hall"}', NOW());

-- 江戶川區 (Edogawa Ward)
INSERT INTO public.l3_facilities (station_id, type, name_i18n, attributes, updated_at) VALUES
('odpt:Station:JR-East.Kasai', 'elevator', '{"zh-TW": "JR葛西站電梯", "ja": "葛西駅エレベーター", "en": "Kasai Station Elevator"}', '{"location": "North Exit", "floors": "1F-2F", "accessible": true}', NOW()),
('odpt:Station:JR-East.Kasai', 'toilet', '{"zh-TW": "JR葛西站多功能廁所", "ja": "葛西駅多目的トイレ", "en": "Kasai Multi-purpose Toilet"}', '{"accessible": true, "ostomate": true, "baby_friendly": true, "location": "Station Hall"}', NOW());

-- 統計: 總計 100+ 設施
