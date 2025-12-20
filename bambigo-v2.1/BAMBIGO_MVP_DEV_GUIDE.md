# BambiGO MVP 開發指引

> **文件目的**：提供 AI 開發代理明確的開發範圍、優先級與資料來源
> **版本**：v1.0
> **截止日期**：2025/01/12
> **最後更新**：2024/12/19

---

## 🎯 開發優先級總覽

```
┌─────────────────────────────────────────────────────────────┐
│                    MVP 開發優先級                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔴 P0 最優先（必須完成）                                    │
│  ├── ODPT 列車即時位置                                      │
│  ├── ODPT 列車延誤情報                                      │
│  └── ODPT 車站步行空間無障礙數據                            │
│                                                             │
│  🟠 P1 次優先（應該完成）                                    │
│  ├── L1 指定 14 車站周邊設施標籤                            │
│  └── L2 緊急天氣警報（RSS）                                 │
│                                                             │
│  🟡 P2 可延後（有時間再做）                                  │
│  ├── L3 服務設施基本爬蟲                                    │
│  └── 在地專家通報功能                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📍 地理範圍限定

### 驗證三區

| 區域 | 日文 | 英文 |
|------|------|------|
| 台東區 | 台東区 | Taito |
| 千代田區 | 千代田区 | Chiyoda |
| 中央區 | 中央区 | Chuo |

### 指定 14 車站節點

```
┌─────────────────────────────────────────────────────────────┐
│  台東區（5 站）                                              │
│  ├── 上野 (Ueno)                                            │
│  ├── 淺草 (Asakusa)                                         │
│  ├── 藏前 (Kuramae)                                         │
│  ├── 新御徒町 (Shin-Okachimachi)                            │
│  └── 御徒町 ※如需要可追加                                   │
├─────────────────────────────────────────────────────────────┤
│  千代田區（5 站）                                            │
│  ├── 東京 (Tokyo)                                           │
│  ├── 神田 (Kanda)                                           │
│  ├── 秋葉原 (Akihabara)                                     │
│  ├── 御茶ノ水 (Ochanomizu)                                  │
│  ├── 霞ケ関 (Kasumigaseki)                                  │
│  ├── 飯田橋 (Iidabashi)                                     │
│  └── 大手町 (Otemachi)                                      │
├─────────────────────────────────────────────────────────────┤
│  中央區（4 站）                                              │
│  ├── 銀座 (Ginza)                                           │
│  ├── 築地 (Tsukiji)                                         │
│  └── 人形町 (Ningyocho)                                     │
└─────────────────────────────────────────────────────────────┘
```

### 節點基本資料表

```sql
-- 節點資料表
CREATE TABLE IF NOT EXISTS nodes (
  id TEXT PRIMARY KEY,
  name_ja TEXT NOT NULL,
  name_en TEXT,
  name_zh_tw TEXT,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  ward TEXT NOT NULL,
  zone TEXT DEFAULT 'core',
  odpt_station_ids TEXT[],  -- ODPT 站點 ID（可能有多個路線）
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14 車站初始資料
INSERT INTO nodes (id, name_ja, name_en, name_zh_tw, lat, lng, ward) VALUES
-- 台東區
('ueno', '上野', 'Ueno', '上野', 35.7141, 139.7774, '台東区'),
('asakusa', '浅草', 'Asakusa', '淺草', 35.7112, 139.7963, '台東区'),
('kuramae', '蔵前', 'Kuramae', '藏前', 35.7019, 139.7867, '台東区'),
('shin_okachimachi', '新御徒町', 'Shin-Okachimachi', '新御徒町', 35.7073, 139.7793, '台東区'),
-- 千代田區
('tokyo', '東京', 'Tokyo', '東京', 35.6812, 139.7671, '千代田区'),
('kanda', '神田', 'Kanda', '神田', 35.6918, 139.7709, '千代田区'),
('akihabara', '秋葉原', 'Akihabara', '秋葉原', 35.6984, 139.7731, '千代田区'),
('ochanomizu', '御茶ノ水', 'Ochanomizu', '御茶之水', 35.6999, 139.7652, '千代田区'),
('kasumigaseki', '霞ケ関', 'Kasumigaseki', '霞關', 35.6737, 139.7507, '千代田区'),
('iidabashi', '飯田橋', 'Iidabashi', '飯田橋', 35.7020, 139.7453, '千代田区'),
('otemachi', '大手町', 'Otemachi', '大手町', 35.6867, 139.7639, '千代田区'),
-- 中央區
('ginza', '銀座', 'Ginza', '銀座', 35.6717, 139.7636, '中央区'),
('tsukiji', '築地', 'Tsukiji', '築地', 35.6670, 139.7706, '中央区'),
('ningyocho', '人形町', 'Ningyocho', '人形町', 35.6864, 139.7825, '中央区')
ON CONFLICT (id) DO NOTHING;
```

---

# 🔴 P0：ODPT 列車數據（最優先）

## P0-1：列車即時位置

### API 說明

```
端點：odpt:Train
說明：取得列車即時位置（哪一班車現在在哪一站）
範圍：完整東京都內所有路線（不限三區）
更新頻率：每 15-30 秒

文件：https://developer.odpt.org/
```

### API 呼叫範例

```bash
# 取得所有列車即時位置
curl "https://api.odpt.org/api/v4/odpt:Train?acl:consumerKey=${ODPT_API_KEY}"

# 取得特定路線的列車位置（例：銀座線）
curl "https://api.odpt.org/api/v4/odpt:Train?odpt:railway=odpt.Railway:TokyoMetro.Ginza&acl:consumerKey=${ODPT_API_KEY}"
```

### 回應範例

```json
{
  "@type": "odpt:Train",
  "dc:date": "2024-12-19T14:30:00+09:00",
  "odpt:railway": "odpt.Railway:TokyoMetro.Ginza",
  "odpt:trainNumber": "A1234",
  "odpt:trainType": "odpt.TrainType:TokyoMetro.Local",
  "odpt:fromStation": "odpt.Station:TokyoMetro.Ginza.Ueno",
  "odpt:toStation": "odpt.Station:TokyoMetro.Ginza.Uenohirokoji",
  "odpt:railDirection": "odpt.RailDirection:TokyoMetro.Shibuya",
  "odpt:delay": 0
}
```

### 資料表設計

```sql
-- 列車即時位置（熱數據，短期保留）
CREATE TABLE l2_train_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 列車識別
  train_number TEXT NOT NULL,
  railway_id TEXT NOT NULL,        -- odpt.Railway:TokyoMetro.Ginza
  railway_name TEXT,               -- 銀座線
  
  -- 位置
  from_station_id TEXT,            -- 出發站
  to_station_id TEXT,              -- 到達站
  direction TEXT,                  -- 方向
  
  -- 狀態
  train_type TEXT,                 -- 列車種別
  delay_seconds INTEGER DEFAULT 0, -- 延誤秒數
  
  -- 元數據
  odpt_date TIMESTAMPTZ NOT NULL,  -- ODPT 資料時間
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL  -- 過期時間（+5分鐘）
);

-- 索引
CREATE INDEX idx_train_railway ON l2_train_positions(railway_id);
CREATE INDEX idx_train_expires ON l2_train_positions(expires_at);

-- 自動清理過期資料的函數
CREATE OR REPLACE FUNCTION cleanup_expired_trains()
RETURNS void AS $$
BEGIN
  DELETE FROM l2_train_positions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
```

### n8n 工作流程

```
名稱：P0_Train_Position_Update
觸發：Schedule Trigger（每 1 分鐘）
流程：

[Schedule Trigger: 每 1 分鐘]
       │
       ▼
[HTTP Request: ODPT Train API]
  URL: https://api.odpt.org/api/v4/odpt:Train
  Method: GET
  Query: acl:consumerKey={{$env.ODPT_API_KEY}}
       │
       ▼
[Split In Batches: 每 50 筆]
       │
       ▼
[Function: 資料轉換]
  - 解析 railway, station 名稱
  - 計算 expires_at = NOW() + 5 minutes
       │
       ▼
[Supabase: Upsert]
  Table: l2_train_positions
  Conflict: train_number, railway_id
       │
       ▼
[Function: 清理過期資料]
  SQL: SELECT cleanup_expired_trains()
```

---

## P0-2：列車延誤情報

### API 說明

```
端點：odpt:TrainInformation
說明：取得路線運行狀態（正常/延誤/停駛）
範圍：完整東京都內所有路線
更新頻率：即時（有異常時更新）
```

### API 呼叫範例

```bash
# 取得所有路線運行狀態
curl "https://api.odpt.org/api/v4/odpt:TrainInformation?acl:consumerKey=${ODPT_API_KEY}"

# 取得特定營運商的運行狀態
curl "https://api.odpt.org/api/v4/odpt:TrainInformation?odpt:operator=odpt.Operator:TokyoMetro&acl:consumerKey=${ODPT_API_KEY}"
```

### 回應範例

```json
{
  "@type": "odpt:TrainInformation",
  "dc:date": "2024-12-19T14:30:00+09:00",
  "odpt:operator": "odpt.Operator:TokyoMetro",
  "odpt:railway": "odpt.Railway:TokyoMetro.Ginza",
  "odpt:trainInformationStatus": "odpt.TrainInformationStatus:Normal",
  "odpt:trainInformationText": "現在、平常どおり運転しています。"
}
```

```json
{
  "@type": "odpt:TrainInformation",
  "dc:date": "2024-12-19T14:30:00+09:00",
  "odpt:operator": "odpt.Operator:TokyoMetro",
  "odpt:railway": "odpt.Railway:TokyoMetro.Marunouchi",
  "odpt:trainInformationStatus": "odpt.TrainInformationStatus:Delay",
  "odpt:trainInformationText": "人身事故の影響で、一部列車に遅れが出ています。",
  "odpt:trainInformationCause": "人身事故",
  "odpt:transferRailways": [
    "odpt.Railway:JR-East.ChuoRapid",
    "odpt.Railway:Toei.Oedo"
  ]
}
```

### 狀態對應表

| ODPT 狀態 | 中文 | 英文 | 等級 |
|-----------|------|------|------|
| `Normal` | 正常運行 | Normal | 🟢 |
| `Delay` | 延誤 | Delay | 🟡 |
| `Suspended` | 停駛 | Suspended | 🔴 |
| `Operation` | 臨時運行 | Special Operation | 🟠 |
| `InquiryService` | 查詢中 | Checking | ⚪ |

### 資料表設計

```sql
-- 路線運行狀態
CREATE TABLE l2_train_information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 路線識別
  railway_id TEXT NOT NULL UNIQUE,  -- odpt.Railway:TokyoMetro.Ginza
  railway_name_ja TEXT,             -- 銀座線
  railway_name_en TEXT,             -- Ginza Line
  operator_id TEXT,                 -- odpt.Operator:TokyoMetro
  operator_name TEXT,               -- 東京メトロ
  
  -- 狀態
  status TEXT NOT NULL,             -- Normal, Delay, Suspended...
  status_level INTEGER DEFAULT 0,   -- 0=正常, 1=輕微, 2=中度, 3=嚴重
  
  -- 詳細資訊
  information_text_ja TEXT,         -- 日文說明
  information_text_en TEXT,         -- 英文說明（如有）
  cause TEXT,                       -- 原因
  
  -- 影響範圍
  affected_sections JSONB,          -- 受影響區間
  transfer_railways TEXT[],         -- 替代路線
  
  -- 時間
  odpt_date TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 運行狀態歷史（可選，用於分析）
CREATE TABLE l2_train_information_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  railway_id TEXT NOT NULL,
  status TEXT NOT NULL,
  information_text_ja TEXT,
  cause TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);
```

### n8n 工作流程

```
名稱：P0_Train_Information_Update
觸發：Schedule Trigger（每 3 分鐘）
流程：

[Schedule Trigger: 每 3 分鐘]
       │
       ▼
[HTTP Request: ODPT TrainInformation API]
  URL: https://api.odpt.org/api/v4/odpt:TrainInformation
       │
       ▼
[Function: 解析狀態等級]
  - Normal → 0
  - Delay → 1 or 2（依延誤時間）
  - Suspended → 3
       │
       ▼
[IF: 狀態有變化?]
       │
   ┌───┴───┐
  是       否
   │        │
   ▼        ▼
[記錄歷史]  [跳過]
   │
   ▼
[Supabase: Upsert]
  Table: l2_train_information
  Conflict: railway_id
       │
       ▼
[IF: 有異常狀態?]
       │
   ┌───┴───┐
  是       否
   │        │
   ▼        ▼
[觸發通知] [結束]
```

---

## P0-3：車站步行空間無障礙數據

### API 說明

```
端點：odpt:StationFacility
說明：車站設施資訊（電梯、手扶梯、廁所等）
範圍：優先處理 14 個指定車站
更新頻率：靜態資料，建置一次即可
```

### API 呼叫範例

```bash
# 取得特定車站的設施資訊
curl "https://api.odpt.org/api/v4/odpt:StationFacility?odpt:station=odpt.Station:TokyoMetro.Ginza.Ueno&acl:consumerKey=${ODPT_API_KEY}"
```

### 回應範例

```json
{
  "@type": "odpt:StationFacility",
  "odpt:station": "odpt.Station:TokyoMetro.Ginza.Ueno",
  "odpt:barrierfreeFacility": [
    {
      "@type": "odpt:BarrierfreeFacility",
      "odpt:barrierfreeFacilityType": "odpt.BarrierfreeFacilityType.Elevator",
      "odpt:serviceStartStationFloor": "B2F",
      "odpt:serviceEndStationFloor": "1F",
      "odpt:remark": "改札外"
    },
    {
      "@type": "odpt:BarrierfreeFacility",
      "odpt:barrierfreeFacilityType": "odpt.BarrierfreeFacilityType.Toilet",
      "odpt:placeName": "改札内",
      "odpt:hasWheelchairAccessibleRestroom": true
    }
  ]
}
```

### 設施類型對應

| ODPT 類型 | 中文 | 說明 |
|-----------|------|------|
| `Elevator` | 電梯 | 連接樓層資訊 |
| `Escalator` | 手扶梯 | 上下方向 |
| `Toilet` | 廁所 | 含無障礙廁所標記 |
| `WheelchairAccessibleRoute` | 無障礙通道 | 輪椅可通行路線 |
| `TactileGuide` | 導盲磚 | 視障導引 |
| `BabyCarriageAccessibleRoute` | 嬰兒車通道 | 嬰兒車可通行 |

### 資料表設計

```sql
-- 車站無障礙設施
CREATE TABLE l3_accessibility_facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id TEXT NOT NULL REFERENCES nodes(id),
  
  -- 設施類型
  facility_type TEXT NOT NULL,      -- elevator, escalator, toilet...
  
  -- 位置
  floor_from TEXT,                  -- 起始樓層
  floor_to TEXT,                    -- 終點樓層
  location_area TEXT,               -- 改札内, 改札外, ホーム
  location_detail TEXT,             -- 具體位置描述
  
  -- 屬性
  attributes JSONB DEFAULT '{}',
  -- elevator: {"connects": ["B2F", "1F"], "wheelchair": true}
  -- toilet: {"wheelchair": true, "baby_seat": true, "ostomate": false}
  
  -- 來源
  source TEXT DEFAULT 'odpt',
  odpt_raw JSONB,                   -- 原始 ODPT 資料
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_accessibility_node ON l3_accessibility_facilities(node_id);
CREATE INDEX idx_accessibility_type ON l3_accessibility_facilities(facility_type);
```

### n8n 工作流程

```
名稱：P0_Station_Accessibility_Init
觸發：Manual Trigger（一次性建置）
流程：

[Manual Trigger]
       │
       ▼
[Supabase: 讀取節點清單]
  SELECT id, name_ja FROM nodes
       │
       ▼
[Loop: 每個節點]
       │
       ▼
[Function: 組合 ODPT Station ID]
  // 注意：一個車站可能有多個 ODPT ID（多條路線）
  // 例：上野 = TokyoMetro.Ginza.Ueno, TokyoMetro.Hibiya.Ueno, JR-East.Ueno
       │
       ▼
[HTTP Request: ODPT StationFacility API]
  URL: https://api.odpt.org/api/v4/odpt:StationFacility
  Query: odpt:station={{$json.odpt_station_id}}
       │
       ▼
[Function: 解析設施資料]
  - 提取電梯、手扶梯、廁所
  - 轉換為統一格式
       │
       ▼
[Supabase: Insert]
  Table: l3_accessibility_facilities
       │
       ▼
[等待 1 秒]  // 避免 API 限制
       │
       ▼
[下一個節點]
```

---

# 🟠 P1：次優先項目

## P1-1：L1 指定車站周邊設施（僅 14 站）

### 範圍限定

```
只處理 14 個指定車站的周邊 500m 範圍
使用 OpenStreetMap Overpass API
```

### 簡化版 L1 類別

```yaml
# MVP 簡化版，只保留最重要的類別
l1_categories:
  shopping:
    - convenience     # 便利商店
    - drugstore       # 藥妝店
    - department      # 百貨公司
  dining:
    - restaurant      # 餐廳（不細分）
    - cafe            # 咖啡廳
    - fast_food       # 速食
  medical:
    - hospital        # 醫院
    - clinic          # 診所
    - pharmacy        # 藥局
  tourism:
    - shrine          # 神社
    - temple          # 寺廟
    - museum          # 博物館
    - attraction      # 景點
  transport:
    - station         # 其他車站
    - bus_stop        # 公車站
```

### Overpass API 查詢（簡化版）

```
[out:json][timeout:60];
(
  // 便利商店
  node["shop"="convenience"](around:500,{{lat}},{{lng}});
  // 藥妝店
  node["shop"="chemist"](around:500,{{lat}},{{lng}});
  // 餐廳
  node["amenity"="restaurant"](around:500,{{lat}},{{lng}});
  // 咖啡廳
  node["amenity"="cafe"](around:500,{{lat}},{{lng}});
  // 神社寺廟
  node["amenity"="place_of_worship"](around:500,{{lat}},{{lng}});
);
out center;
```

### 資料表設計

```sql
-- L1 周邊設施標籤（簡化版）
CREATE TABLE l1_facility_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id TEXT NOT NULL REFERENCES nodes(id),
  
  category TEXT NOT NULL,         -- shopping, dining, medical...
  sub_category TEXT NOT NULL,     -- convenience, drugstore...
  
  count INTEGER DEFAULT 1,        -- 數量（聚合後）
  
  source TEXT DEFAULT 'osm',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 或者直接用聚合表
CREATE TABLE l1_node_summary (
  node_id TEXT PRIMARY KEY REFERENCES nodes(id),
  
  -- 各類別數量
  convenience_count INTEGER DEFAULT 0,
  drugstore_count INTEGER DEFAULT 0,
  restaurant_count INTEGER DEFAULT 0,
  cafe_count INTEGER DEFAULT 0,
  shrine_count INTEGER DEFAULT 0,
  temple_count INTEGER DEFAULT 0,
  museum_count INTEGER DEFAULT 0,
  
  -- 節點特徵標籤
  vibes TEXT[],                   -- ['購物天堂', '美食激戰區']
  
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## P1-2：緊急天氣警報（RSS）

### 資料來源

```
日本氣象廳 XML/RSS Feed（完全免費）

警報 Feed:
https://www.data.jma.go.jp/developer/xml/feed/extra.xml

內容：
- 大雨警報
- 暴風警報
- 地震速報
- 海嘯警報
- 颱風情報
```

### n8n RSS 工作流程

```
名稱：P1_Weather_Alert_RSS
觸發：Schedule Trigger（每 10 分鐘）
流程：

[Schedule Trigger: 每 10 分鐘]
       │
       ▼
[RSS Feed Read]
  URL: https://www.data.jma.go.jp/developer/xml/feed/extra.xml
       │
       ▼
[IF: 有東京都相關警報?]
  條件: title CONTAINS '東京' OR area CONTAINS '東京'
       │
   ┌───┴───┐
  是       否
   │        │
   ▼        ▼
[解析警報]  [結束]
   │
   ▼
[Supabase: Insert]
  Table: l2_weather_alerts
   │
   ▼
[IF: 嚴重警報?]
   │
  是
   ▼
[通知/標記]
```

### 資料表設計

```sql
-- 天氣警報
CREATE TABLE l2_weather_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  alert_id TEXT UNIQUE,           -- 警報 ID
  alert_type TEXT NOT NULL,       -- warning, advisory, watch
  alert_title TEXT NOT NULL,
  alert_description TEXT,
  
  affected_area TEXT,             -- 東京都
  severity INTEGER,               -- 1-5
  
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  
  source_url TEXT,
  raw_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

# 🟡 P2：可延後項目

## P2-1：L3 服務設施爬蟲

```
優先級：低
原因：MVP 階段可先使用 ODPT 無障礙資料
未來：可用爬蟲補充便利商店廁所、充電站等資訊
```

## P2-2：在地專家通報功能

```
優先級：低
原因：需要用戶系統、審核機制
未來：允許用戶回報設施狀況，擴充資料庫
```

---

# 📋 ODPT 相關路線清單

## 東京 Metro（東京メトロ）

| 路線 ID | 路線名 | 顏色 |
|---------|--------|------|
| `TokyoMetro.Ginza` | 銀座線 | 🟠 橙 |
| `TokyoMetro.Marunouchi` | 丸ノ内線 | 🔴 紅 |
| `TokyoMetro.Hibiya` | 日比谷線 | ⚪ 銀 |
| `TokyoMetro.Tozai` | 東西線 | 🔵 藍 |
| `TokyoMetro.Chiyoda` | 千代田線 | 🟢 綠 |
| `TokyoMetro.Yurakucho` | 有楽町線 | 🟡 金 |
| `TokyoMetro.Hanzomon` | 半蔵門線 | 🟣 紫 |
| `TokyoMetro.Namboku` | 南北線 | 🩵 青綠 |
| `TokyoMetro.Fukutoshin` | 副都心線 | 🟤 褐 |

## 都營地下鐵（東京都交通局）

| 路線 ID | 路線名 | 顏色 |
|---------|--------|------|
| `Toei.Asakusa` | 淺草線 | 🌸 玫瑰 |
| `Toei.Mita` | 三田線 | 🔵 藍 |
| `Toei.Shinjuku` | 新宿線 | 🟢 葉綠 |
| `Toei.Oedo` | 大江戶線 | 🔴 洋紅 |

## JR 東日本（主要路線）

| 路線 ID | 路線名 |
|---------|--------|
| `JR-East.Yamanote` | 山手線 |
| `JR-East.KeihinTohoku` | 京浜東北線 |
| `JR-East.ChuoRapid` | 中央線（快速）|
| `JR-East.ChuoSobuLocal` | 中央・総武線（各停）|
| `JR-East.Sobu` | 総武線 |
| `JR-East.Joban` | 常磐線 |
| `JR-East.Utsunomiya` | 宇都宮線 |
| `JR-East.Takasaki` | 高崎線 |

---

# 🔑 環境變數設定

```bash
# .env

# ODPT API（必須）
ODPT_API_KEY=your_odpt_api_key_here

# Supabase（必須）
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Dify（AI 對話）
DIFY_API_URL=https://your-dify.zeabur.app/v1
DIFY_API_KEY=app-xxxxx

# n8n（如果需要觸發）
N8N_WEBHOOK_URL=https://your-n8n.zeabur.app/webhook/xxxxx
```

---

# ✅ 開發檢查清單

## 環境準備

```
□ ODPT API Key 已申請
□ Supabase 專案已建立
□ n8n 已部署（Zeabur）
□ 環境變數已設定
```

## P0 完成檢查

```
□ nodes 表已建立，14 站資料已匯入
□ l2_train_positions 表已建立
□ l2_train_information 表已建立
□ l3_accessibility_facilities 表已建立
□ n8n: P0_Train_Position_Update 工作流程運作中
□ n8n: P0_Train_Information_Update 工作流程運作中
□ n8n: P0_Station_Accessibility_Init 已執行完成
□ 前端能讀取並顯示列車狀態
□ 前端能顯示車站無障礙設施
```

## P1 完成檢查

```
□ l1_node_summary 表已建立
□ n8n: L1 周邊設施資料已抓取（14 站）
□ l2_weather_alerts 表已建立
□ n8n: RSS 天氣警報監控運作中
```

---

# 🚀 快速開始指令

## 給 AI 代理的第一個任務

```
任務：建立 P0 資料庫表格

1. 連接到 Supabase
2. 執行以下 SQL 建立資料表：
   - nodes（14 站基本資料）
   - l2_train_positions（列車位置）
   - l2_train_information（運行狀態）
   - l3_accessibility_facilities（無障礙設施）
3. 確認表格建立成功
4. 回報結果
```

## 給 AI 代理的第二個任務

```
任務：建立 n8n 列車狀態更新工作流程

1. 在 n8n 建立新的 Workflow
2. 名稱：P0_Train_Information_Update
3. 觸發器：Schedule Trigger，每 3 分鐘
4. HTTP Request 呼叫 ODPT API
5. 解析資料並寫入 Supabase
6. 啟用工作流程
7. 測試執行並回報結果
```

---

*MVP 開發指引 v1.0*
*BambiGO / TAG City*
*2024/12/19*
