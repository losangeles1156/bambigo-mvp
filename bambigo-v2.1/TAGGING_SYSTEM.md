# BambiGO 四層標籤化數據模型 (Four-Layer Tagging System)
# 版本：v2.0
# 用途：完整說明 L1-L4 標籤系統的架構設計與標籤定義

---

## 🎯 本文件的使用方式

> **給 AI 開發代理的說明：**
> 
> BambiGO 的核心創新是「四層標籤化數據模型」。
> 每個節點透過多層標籤的組合，呈現出獨特的「地方性格」。
> 
> 本文件詳細說明：
> 1. 四層的定義與本質差異
> 2. L1 生活機能標籤的層次結構（主類別→次類別→子類別）
> 3. L3 服務設施的分類與屬性
> 4. 各層如何互動產生 L4 行動建議

---

## 1. 四層總覽

### 概念模型

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  L1 地點基因 (Location DNA)                                     │
│  「這個地方是什麼樣的地方」                                      │
│  ─────────────────────────────────────────────────────────────  │
│  • 絕對地理位置（經緯度、地址）                                   │
│  • 周邊 100~500m 的生活機能標籤                                  │
│  • 層次結構：主類別 → 次類別 → 子類別                            │
│  • 透過標籤組合呈現地方特色                                      │
│                                                                 │
│  更新頻率：每季 | 資料性質：冷數據（靜態）                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  L2 即時狀態 (Live Status)                                      │
│  「這個地方現在怎樣」                                            │
│  ─────────────────────────────────────────────────────────────  │
│  • 路線運行狀態（正常/延誤/停駛）                                 │
│  • 擁擠程度                                                     │
│  • 天氣狀況                                                     │
│  • 共享單車可用數量                                              │
│                                                                 │
│  更新頻率：15 分鐘~即時 | 資料性質：熱數據（動態）                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  L3 服務設施 (Service Facilities)                               │
│  「這個地方有什麼可用的服務設施」                                 │
│  ─────────────────────────────────────────────────────────────  │
│  • 廁所（公共、車站、百貨、咖啡廳提供）                           │
│  • 充電（免費插座、行動電源租借）                                 │
│  • WiFi（免費熱點）                                             │
│  • 置物櫃（各種尺寸、價格）                                      │
│  • 無障礙設施（電梯、坡道、導盲磚）                               │
│  • 每個設施的屬性標籤                                            │
│                                                                 │
│  更新頻率：每月 | 資料性質：溫數據（半靜態）                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  L4 行動策略 (Mobility Strategy)                                │
│  「所以你該怎麼做」                                              │
│  ─────────────────────────────────────────────────────────────  │
│  • AI 綜合 L1+L2+L3+用戶情境                                    │
│  • 生成具同理心的行動建議                                        │
│  • 輸出：Primary Card + Secondary Cards                         │
│                                                                 │
│  更新頻率：即時生成 | 資料性質：計算結果（不儲存）                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 核心差異

| 層級 | 本質 | 內容 | 範例 |
|------|------|------|------|
| **L1** | 生活機能標籤 | 周邊有什麼類型的商家/機構 | 這裡有藥妝店、居酒屋、牙科診所 |
| **L2** | 即時狀態 | 現在的動態資訊 | 銀座線延誤 15 分鐘 |
| **L3** | 服務設施 | 可使用的公共/半公共設施 | 北口有免費廁所、B1 有置物櫃 |
| **L4** | 行動建議 | AI 生成的決策建議 | 建議搭計程車，因為有延誤 |

---

## 2. L1 地點基因 - 生活機能標籤系統

### 2.1 L1 的本質

```
L1 回答：「這個地方周邊有什麼樣的生活機能？」

L1 由兩部分組成：
1. 絕對地理位置（經緯度、地址、所屬區域）
2. 周邊生活機能標籤（100~500m 範圍內的商家/機構類型）

生活機能標籤是「層次結構」：
  主類別 (Main Category)
    └── 次類別 (Sub Category)
          └── 子類別 (Detail Category)

透過標籤的「組合」與「聚集」，呈現地方特色：
- 某條街有 10 家藥妝店 → 藥妝激戰區
- 某車站旁有 7 家居酒屋 → 上班族聚集地
- 某路上有 6 家咖啡廳 → 文青聚落
```

### 2.2 生活機能標籤層次結構

#### 主類別定義（完整擴充版）

| 主類別 ID | 名稱 | 圖示 | 說明 |
|-----------|------|------|------|
| `medical` | 醫療 | 🏥 | 醫療院所、藥局 |
| `shopping` | 購物 | 🛒 | 各類零售商店 |
| `dining` | 餐飲 | 🍜 | 餐廳、咖啡廳、飲料店 |
| `leisure` | 休閒 | 🎭 | 娛樂、運動、文化場所 |
| `education` | 教育 | 🎓 | 學校、補習班、圖書館 |
| `finance` | 金融 | 🏦 | 銀行、ATM、兌換所 |
| `accommodation` | 住宿 | 🏨 | 飯店、旅館、民宿 |
| `workspace` | 辦公 | 💼 | 辦公大樓、共享空間 |
| `housing` | 居住 | 🏠 | 住宅區、公寓、宿舍 |
| `religion` | 信仰 | ⛩️ | 神社、寺廟、教堂 |
| `nature` | 自然 | 🌳 | 公園、河流、山岳 |

---

#### 醫療 (medical) 完整層次

```
醫療 🏥
│
├── 醫院 (hospital)
│   ├── 大學附設醫院 (university_hospital)
│   ├── 區域教學醫院 (regional_hospital)
│   ├── 地區醫院 (local_hospital)
│   └── 專科醫院 (specialty_hospital)
│
├── 診所 (clinic)
│   ├── 內科 (internal_medicine)
│   ├── 外科 (surgery)
│   ├── 牙科 (dental)
│   ├── 眼科 (ophthalmology)
│   ├── 皮膚科 (dermatology)
│   ├── 耳鼻喉科 (ent)
│   ├── 小兒科 (pediatrics)
│   ├── 婦產科 (obstetrics_gynecology)
│   ├── 骨科 (orthopedics)
│   ├── 精神科 (psychiatry)
│   ├── 復健科 (rehabilitation)
│   └── 中醫/漢方 (traditional_medicine)
│
├── 醫療中心 (medical_center)
│   ├── 健檢中心 (health_checkup)
│   ├── 洗腎中心 (dialysis)
│   └── 影像診斷中心 (imaging)
│
└── 藥局 (pharmacy)
    ├── 調劑藥局 (dispensing_pharmacy)
    └── 藥妝店 (drugstore) ← 也屬於購物類
```

---

#### 購物 (shopping) 完整層次

```
購物 🛒
│
├── 百貨/商場 (department)
│   ├── 百貨公司 (department_store)
│   ├── 購物中心 (shopping_mall)
│   └── 地下街 (underground_mall)
│
├── 超市/量販 (supermarket)
│   ├── 超級市場 (supermarket)
│   ├── 量販店 (hypermarket)
│   └── 生鮮超市 (fresh_market)
│
├── 便利商店 (convenience)
│   ├── 7-Eleven
│   ├── FamilyMart
│   ├── Lawson
│   └── 其他 (other_cvs)
│
├── 藥妝店 (drugstore)
│   ├── 松本清 (matsumotokiyoshi)
│   ├── 大國藥妝 (daikoku)
│   ├── Sundrug
│   ├── Welcia
│   └── 其他 (other_drugstore)
│
├── 服飾 (clothing)
│   ├── 男裝 (menswear)
│   ├── 女裝 (womenswear)
│   ├── 童裝 (childrenswear)
│   ├── 運動用品 (sportswear)
│   ├── 鞋店 (shoes)
│   └── 飾品 (accessories)
│
├── 3C/電器 (electronics)
│   ├── 家電量販 (electronics_store)
│   │   ├── BIC CAMERA
│   │   ├── Yodobashi
│   │   └── 其他
│   ├── 手機店 (mobile_shop)
│   └── 電腦/周邊 (computer)
│
├── 書店/文具 (books_stationery)
│   ├── 書店 (bookstore)
│   ├── 文具店 (stationery)
│   └── 唱片行 (record_shop)
│
├── 生活雜貨 (lifestyle)
│   ├── 雜貨店 (variety_store)
│   │   ├── 唐吉軻德 (don_quijote)
│   │   ├── Loft
│   │   ├── 東急Hands
│   │   └── 其他
│   ├── 百元店 (100yen_shop)
│   ├── 家飾 (home_decor)
│   └── 花店 (florist)
│
├── 專賣店 (specialty)
│   ├── 伴手禮/土產 (souvenir)
│   ├── 酒類專賣 (liquor)
│   ├── 菸草店 (tobacco)
│   ├── 眼鏡行 (optical)
│   └── 鐘錶店 (watch)
│
└── 二手/中古 (secondhand)
    ├── 二手衣 (thrift_clothing)
    ├── 中古 3C (used_electronics)
    └── 古書店 (used_books)
```

---

#### 餐飲 (dining) 完整層次

```
餐飲 🍜
│
├── 日式料理 (japanese)
│   ├── 壽司 (sushi)
│   ├── 拉麵 (ramen)
│   ├── 蕎麥/烏龍 (noodles)
│   ├── 丼飯 (donburi)
│   ├── 定食 (teishoku)
│   ├── 居酒屋 (izakaya)
│   ├── 燒肉 (yakiniku)
│   ├── 燒鳥 (yakitori)
│   ├── 天婦羅 (tempura)
│   ├── 鰻魚 (unagi)
│   ├── 懷石/割烹 (kaiseki)
│   └── 迴轉壽司 (conveyor_sushi)
│
├── 異國料理 (international)
│   ├── 中華料理 (chinese)
│   ├── 韓國料理 (korean)
│   ├── 義大利料理 (italian)
│   ├── 法國料理 (french)
│   ├── 印度料理 (indian)
│   ├── 泰國料理 (thai)
│   ├── 越南料理 (vietnamese)
│   └── 其他異國 (other_international)
│
├── 速食 (fast_food)
│   ├── 漢堡 (burger)
│   │   ├── McDonald's
│   │   ├── MOS Burger
│   │   └── 其他
│   ├── 炸雞 (fried_chicken)
│   ├── 披薩 (pizza)
│   └── 牛丼連鎖 (gyudon_chain)
│       ├── 吉野家 (yoshinoya)
│       ├── 松屋 (matsuya)
│       └── すき家 (sukiya)
│
├── 咖啡/茶飲 (cafe)
│   ├── 咖啡廳 (coffee_shop)
│   │   ├── Starbucks
│   │   ├── Doutor
│   │   ├── Tully's
│   │   ├── 獨立咖啡廳 (independent_cafe)
│   │   └── 其他連鎖
│   ├── 茶館 (tea_house)
│   ├── 手搖飲 (bubble_tea)
│   └── 果汁吧 (juice_bar)
│
├── 甜點/麵包 (dessert_bakery)
│   ├── 麵包店 (bakery)
│   ├── 蛋糕店 (cake_shop)
│   ├── 甜甜圈 (donut)
│   ├── 冰淇淋 (ice_cream)
│   └── 和菓子 (wagashi)
│
├── 酒吧 (bar)
│   ├── 酒吧 (bar)
│   ├── 啤酒屋 (beer_hall)
│   ├── 紅酒吧 (wine_bar)
│   └── 立飲 (standing_bar)
│
└── 外帶/便當 (takeout)
    ├── 便當店 (bento)
    ├── 熟食店 (deli)
    └── 食品攤販 (food_stall)
```

---

#### 休閒 (leisure) 完整層次

```
休閒 🎭
│
├── 觀光景點 (tourist)
│   ├── 神社 (shrine)
│   ├── 寺廟 (temple)
│   ├── 歷史建築 (historic_building)
│   ├── 觀景台 (observation_deck)
│   └── 主題樂園 (theme_park)
│
├── 文化設施 (culture)
│   ├── 博物館 (museum)
│   ├── 美術館 (art_gallery)
│   ├── 劇場 (theater)
│   ├── 音樂廳 (concert_hall)
│   └── 電影院 (cinema)
│
├── 運動設施 (sports)
│   ├── 健身房 (gym)
│   ├── 游泳池 (pool)
│   ├── 瑜珈教室 (yoga)
│   ├── 高爾夫練習場 (golf)
│   └── 保齡球館 (bowling)
│
├── 娛樂場所 (entertainment)
│   ├── 卡拉OK (karaoke)
│   ├── 遊戲中心 (game_center)
│   ├── 網咖 (internet_cafe)
│   ├── 漫畫咖啡 (manga_cafe)
│   ├── 柏青哥 (pachinko)
│   └── 撞球間 (billiards)
│
├── 戶外空間 (outdoor)
│   ├── 公園 (park)
│   ├── 庭園 (garden)
│   ├── 河濱 (riverside)
│   └── 廣場 (plaza)
│
└── 放鬆療癒 (relaxation)
    ├── 溫泉/錢湯 (onsen_sento)
    ├── SPA (spa)
    ├── 按摩 (massage)
    └── 美容沙龍 (beauty_salon)
```

---

#### 教育 (education) 完整層次

```
教育 🎓
│
├── 學校 (school)
│   ├── 大學 (university)
│   ├── 專門學校 (vocational)
│   ├── 高中 (high_school)
│   ├── 國中 (junior_high)
│   ├── 小學 (elementary)
│   └── 幼稚園 (kindergarten)
│
├── 補習/才藝 (tutoring)
│   ├── 補習班 (cram_school)
│   ├── 語言學校 (language_school)
│   ├── 音樂教室 (music_school)
│   ├── 美術教室 (art_school)
│   └── 程式教室 (coding_school)
│
└── 公共學習 (public_learning)
    ├── 圖書館 (library)
    ├── 文化中心 (cultural_center)
    └── 自習室 (study_room)
```

---

#### 金融 (finance) 完整層次

```
金融 🏦
│
├── 銀行 (bank)
│   ├── 都市銀行 (city_bank)
│   ├── 地方銀行 (regional_bank)
│   ├── 郵局 (post_office)
│   └── 網路銀行 (online_bank)
│
├── ATM (atm)
│   ├── 銀行 ATM (bank_atm)
│   ├── 便利商店 ATM (cvs_atm)
│   └── 7 銀行 ATM (seven_bank)
│
└── 兌換服務 (exchange)
    ├── 外幣兌換所 (currency_exchange)
    └── 兌換機 (exchange_machine)
```

---

#### 住宿 (accommodation) 完整層次

```
住宿 🏨
│
├── 飯店 (hotel)
│   ├── 五星級飯店 (luxury_hotel)
│   ├── 商務飯店 (business_hotel)
│   ├── 溫泉旅館 (onsen_ryokan)
│   ├── 膠囊旅館 (capsule_hotel)
│   └── 設計旅店 (boutique_hotel)
│
├── 民宿/短租 (guesthouse)
│   ├── Airbnb (airbnb)
│   ├── 青年旅館 (hostel)
│   └── 傳統民宿 (minshuku)
│
└── 其他住宿 (other_accommodation)
    ├── 網咖留宿 (internet_cafe_stay)
    └── 露營地 (campsite)
```

---

#### 辦公/產業 (workspace) 完整層次

```
辦公 💼
│
├── 辦公場所 (office)
│   ├── 辦公大樓 (office_building)
│   ├── 政府機關 (government_office)
│   ├── 企業總部 (headquarters)
│   └── 新創園區 (startup_campus)
│
├── 共享空間 (coworking)
│   ├── 共享辦公室 (coworking_space)
│   ├── 自習室 (study_room)
│   └── 會議室租借 (meeting_room)
│
└── 產業設施 (industry)
    ├── 工廠 (factory)
    ├── 倉庫/物流 (warehouse)
    ├── 批發市場 (wholesale_market)
    └── 農場 (farm)
```

---

#### 居住 (housing) 完整層次

```
居住 🏠
│
├── 住宅區 (residential_area)
│   ├── 獨棟住宅 (detached_house)
│   ├── 公寓大樓 (apartment_complex)
│   ├── 高級大廈 (mansion)
│   └── 社會住宅 (public_housing)
│
└── 宿舍 (dormitory)
    ├── 學生宿舍 (student_dorm)
    └── 員工宿舍 (company_dorm)
```

---

#### 信仰 (religion) 完整層次

```
信仰 ⛩️
│
├── 神道教 (shinto)
│   ├── 神社 (shrine)
│   └── 大社/神宮 (grand_shrine)
│
├── 佛教 (buddhism)
│   ├── 寺廟 (temple)
│   └── 佛塔 (pagoda)
│
└── 其他宗教 (other_religion)
    ├── 教堂 (church)
    ├── 清真寺 (mosque)
    └── 靈園/墓地 (cemetery)
```

---

#### 自然 (nature) 完整層次

```
自然 🌳
│
├── 綠地 (green_space)
│   ├── 公園 (park)
│   ├── 植物園 (botanical_garden)
│   ├── 森林 (forest)
│   └── 行道樹/林蔭道 (tree_lined_street)
│
├── 水域 (water)
│   ├── 河流 (river)
│   ├── 湖泊/池塘 (lake)
│   ├── 海岸 (coast)
│   └── 運河 (canal)
│
└── 地貌 (landform)
    ├── 山岳 (mountain)
    ├── 丘陵 (hill)
    └── 觀景點 (viewpoint)
```

---

### 2.3 標籤的聚集效應

```
L1 標籤不是簡單的「數量統計」，而是透過標籤的「組合」與「聚集」
來呈現一個地方的特色。

範例分析：

┌─────────────────────────────────────────────────────────────┐
│ 阿美橫町商圈 (上野站南側)                                    │
│                                                             │
│ 標籤聚集：                                                   │
│ • 藥妝店 x 8 (松本清 x2, 大國 x3, Sundrug x2, 其他 x1)       │
│ • 伴手禮店 x 12                                              │
│ • 海鮮店 x 6                                                 │
│ • 乾貨店 x 15                                                │
│                                                             │
│ 特色解讀：觀光客購物天堂、藥妝激戰區、在地市場感              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 神田站周邊                                                   │
│                                                             │
│ 標籤聚集：                                                   │
│ • 居酒屋 x 15                                                │
│ • 立飲 x 4                                                   │
│ • 拉麵 x 6                                                   │
│ • 牛丼連鎖 x 3                                               │
│ • 銀行 x 8                                                   │
│                                                             │
│ 特色解讀：商業區、上班族聚集、平價快食、下班小酌              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 根津站周邊                                                   │
│                                                             │
│ 標籤聚集：                                                   │
│ • 獨立咖啡廳 x 5                                             │
│ • 古書店 x 3                                                 │
│ • 和菓子 x 2                                                 │
│ • 神社 x 1 (根津神社)                                        │
│                                                             │
│ 特色解讀：文青聚落、下町風情、慢步調                          │
└─────────────────────────────────────────────────────────────┘
```

### 2.4 L1 資料結構

```typescript
// L1 節點的生活機能標籤

interface L1LocationDNA {
  // 絕對地理位置
  nodeId: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  address: LocalizedText;
  
  // 生活機能標籤集合
  facilityTags: FacilityTag[];
}

interface FacilityTag {
  // 層次結構
  mainCategory: string;      // 'medical', 'shopping', 'dining'...
  subCategory: string;       // 'drugstore', 'izakaya', 'dental'...
  detailCategory?: string;   // 更細的分類（如有）
  
  // 標籤屬性
  name?: string;             // 店家名稱（如果是知名品牌）
  brand?: string;            // 品牌（7-11, 松本清...）
  
  // 位置關係
  distanceMeters: number;    // 距離節點幾公尺
  direction?: string;        // 方位描述（北口方向）
  street?: string;           // 所在街道
}

// 範例：上野站的 L1 標籤
const uenoL1: L1LocationDNA = {
  nodeId: 'odpt.Station:TokyoMetro.Ueno',
  coordinates: { lat: 35.7141, lon: 139.7774 },
  address: { 'ja': '東京都台東区上野七丁目', 'zh-TW': '東京都台東區上野七丁目' },
  
  facilityTags: [
    // 藥妝店聚集
    { mainCategory: 'shopping', subCategory: 'drugstore', brand: '松本清', distanceMeters: 50, direction: '南口' },
    { mainCategory: 'shopping', subCategory: 'drugstore', brand: '松本清', distanceMeters: 120, street: 'アメ横' },
    { mainCategory: 'shopping', subCategory: 'drugstore', brand: '大國', distanceMeters: 80, street: 'アメ横' },
    { mainCategory: 'shopping', subCategory: 'drugstore', brand: '大國', distanceMeters: 150, street: 'アメ横' },
    
    // 餐飲
    { mainCategory: 'dining', subCategory: 'izakaya', distanceMeters: 100, direction: '不忍口' },
    { mainCategory: 'dining', subCategory: 'ramen', name: '一蘭', distanceMeters: 200 },
    { mainCategory: 'dining', subCategory: 'coffee_shop', brand: 'Starbucks', distanceMeters: 30 },
    
    // 醫療
    { mainCategory: 'medical', subCategory: 'clinic', detailCategory: 'dental', distanceMeters: 150 },
    { mainCategory: 'medical', subCategory: 'pharmacy', distanceMeters: 80 },
    
    // 觀光
    { mainCategory: 'leisure', subCategory: 'museum', name: '國立西洋美術館', distanceMeters: 400 },
    { mainCategory: 'leisure', subCategory: 'park', name: '上野恩賜公園', distanceMeters: 300 },
    
    // ... 更多標籤
  ]
};
```

### 2.5 L1 標籤的查詢應用

```typescript
// 查詢範例

// 1. 查詢某節點周邊的藥妝店
const drugstores = uenoL1.facilityTags.filter(
  tag => tag.mainCategory === 'shopping' && tag.subCategory === 'drugstore'
);
// 結果：找到 4 家藥妝店 → 「藥妝激戰區」

// 2. 查詢 200m 內的咖啡廳
const nearbyCafes = uenoL1.facilityTags.filter(
  tag => tag.mainCategory === 'dining' && 
         tag.subCategory === 'coffee_shop' && 
         tag.distanceMeters <= 200
);

// 3. 分析某條街的特色
const ameyokoTags = uenoL1.facilityTags.filter(
  tag => tag.street === 'アメ横'
);
// 分析結果：主要是藥妝店和伴手禮店

// 4. 生成地方特色描述
function generateVibeDescription(tags: FacilityTag[]): string[] {
  const vibes: string[] = [];
  
  // 計算各類型數量
  const drugstoreCount = tags.filter(t => t.subCategory === 'drugstore').length;
  const izakayaCount = tags.filter(t => t.subCategory === 'izakaya').length;
  const cafeCount = tags.filter(t => t.subCategory === 'coffee_shop').length;
  
  if (drugstoreCount >= 5) vibes.push('藥妝激戰區');
  if (izakayaCount >= 5) vibes.push('上班族聚集');
  if (cafeCount >= 4) vibes.push('咖啡廳聚落');
  
  return vibes;
}
```

---

## 3. L2 即時狀態 (Live Status)

### 3.1 L2 的本質

```
L2 回答：「這個地方現在狀況如何？」

L2 是動態資訊，會隨時間改變，需要即時或定期更新。
```

### 3.2 L2 包含的資訊

| 類型 | 內容 | 更新頻率 | 資料來源 |
|------|------|---------|---------|
| 路線狀態 | 正常/延誤/停駛、延誤分鐘數、原因 | 15 分鐘 | ODPT API |
| 擁擠程度 | 1-5 級（空→爆滿）| 15 分鐘 | ODPT API |
| 天氣 | 晴/陰/雨/雪、溫度、降雨機率 | 1 小時 | 氣象廳 |
| 共享單車 | 可用車輛數、空位數 | 15 分鐘 | GBFS |
| 異常事件 | 事故、施工、活動 | 事件驅動 | ODPT API |

---

## 4. L3 服務設施 (Service Facilities)

### 4.1 L3 的本質

```
L3 回答：「這裡有什麼可以使用的服務設施？」

⚠️ L1 vs L3 的關鍵差異：

L1：生活機能標籤 = 周邊有什麼「類型」的商家/機構
    例如：這裡有藥妝店、居酒屋、牙科診所

L3：服務設施 = 可以「使用」的公共或半公共設施
    例如：廁所、充電插座、置物櫃、WiFi、無障礙設施

L1 描述「這區有什麼店」（商業氛圍）
L3 描述「這裡有什麼可用的服務」（實用設施）
```

### 4.2 L3 服務設施分類

```
L3 服務設施
│
├── 廁所 (toilet)
│   ├── 公共廁所 (public_toilet)
│   │   └── 公園廁所、街道公廁
│   ├── 車站廁所 (station_toilet)
│   │   └── 改札內、改札外
│   ├── 商業設施廁所 (commercial_toilet)
│   │   └── 百貨公司、購物中心
│   └── 店家提供廁所 (shop_toilet)
│       └── 咖啡廳、便利商店（消費者可用）
│
├── 充電服務 (charging)
│   ├── 免費插座 (free_outlet)
│   │   └── 咖啡廳、圖書館、公共空間
│   ├── 充電站 (charging_station)
│   │   └── 手機快充設備
│   └── 行動電源租借 (power_bank_rental)
│       └── ChargeSPOT 等服務
│
├── WiFi (wifi)
│   ├── 免費公共 WiFi (free_public_wifi)
│   │   └── 車站、政府提供
│   ├── 商業 WiFi (commercial_wifi)
│   │   └── 咖啡廳、便利商店
│   └── 付費 WiFi (paid_wifi)
│
├── 置物櫃 (locker)
│   ├── 投幣式置物櫃 (coin_locker)
│   │   ├── 小型 (small) - 約 300 円
│   │   ├── 中型 (medium) - 約 500 円
│   │   ├── 大型 (large) - 約 700 円
│   │   └── 特大型 (extra_large) - 約 1000 円
│   └── 寄放服務 (luggage_storage)
│       └── ecbo cloak 等合作店家
│
├── 無障礙設施 (accessibility)
│   ├── 電梯 (elevator)
│   ├── 手扶梯 (escalator)
│   ├── 輪椅坡道 (wheelchair_ramp)
│   ├── 導盲磚 (tactile_paving)
│   ├── 無障礙廁所 (accessible_toilet)
│   └── 哺乳室 (nursing_room)
│
├── 休息空間 (rest_area)
│   ├── 長椅 (bench)
│   ├── 休息區 (rest_zone)
│   └── 等候區 (waiting_area)
│
└── 其他服務 (other_services)
    ├── AED
    ├── 服務中心 (information_center)
    ├── 失物招領 (lost_and_found)
    └── 外幣兌換機 (currency_exchange_machine)
```

### 4.3 L3 設施的屬性標籤 (Supply Tags)

```
每個 L3 設施都有屬性標籤，描述它的特性：

通用屬性：
├── is_free: boolean          // 是否免費
├── is_24h: boolean           // 是否 24 小時
├── requires_purchase: boolean // 是否需要消費
└── wheelchair_accessible: boolean // 輪椅可用

廁所專屬屬性：
├── has_western_style: boolean    // 有西式馬桶
├── has_japanese_style: boolean   // 有和式馬桶
├── has_washlet: boolean          // 有免治馬桶
├── has_baby_seat: boolean        // 有嬰兒座椅
├── has_changing_table: boolean   // 有換尿布台
├── has_ostomate: boolean         // 有人工肛門設備
└── gender: 'male' | 'female' | 'unisex' | 'multi'

充電專屬屬性：
├── outlet_type: string[]     // ['Type-A', 'Type-C', 'USB']
├── max_devices: number       // 可同時充幾台
└── rental_brand: string      // 租借品牌（ChargeSPOT 等）

置物櫃專屬屬性：
├── size: 'S' | 'M' | 'L' | 'XL'
├── price: number             // 價格（円）
├── payment_methods: string[] // ['cash', 'ic_card', 'credit']
├── max_hours: number         // 最長寄放時數
└── available_count: number   // 目前可用數量（L2 動態）

無障礙專屬屬性：
├── connects_floors: string[] // 連接樓層 ['B1', '1F', '2F']
├── width_cm: number          // 寬度（公分）
└── has_braille: boolean      // 有點字
```

### 4.4 L3 資料結構

```typescript
interface L3ServiceFacility {
  id: string;
  nodeId: string;              // 所屬節點
  
  // 設施類型
  category: string;            // 'toilet', 'charging', 'locker'...
  subCategory: string;         // 'public_toilet', 'free_outlet'...
  
  // 位置資訊
  location: {
    coordinates?: { lat: number; lon: number };
    floor: string;             // 'B1', '1F', '改札内'
    direction: string;         // '北口出來右轉 30m'
  };
  
  // 提供者資訊（如果是店家提供）
  provider?: {
    type: 'public' | 'station' | 'commercial' | 'shop';
    name?: string;             // '星巴克上野店'
    requiresPurchase?: boolean;
  };
  
  // 屬性標籤
  attributes: Record<string, any>;
  
  // 營業時間
  openingHours?: string;       // OpenStreetMap 格式
  
  // 資料來源
  source: 'osm' | 'odpt' | 'manual' | 'partner';
  updatedAt: string;
}

// 範例：上野站的廁所
const uenoToilet: L3ServiceFacility = {
  id: 'facility:ueno:toilet:north',
  nodeId: 'odpt.Station:TokyoMetro.Ueno',
  category: 'toilet',
  subCategory: 'station_toilet',
  location: {
    floor: 'B1',
    direction: '北口改札を出て右側すぐ'
  },
  provider: {
    type: 'station',
    requiresPurchase: false
  },
  attributes: {
    is_free: true,
    wheelchair_accessible: true,
    has_western_style: true,
    has_washlet: true,
    has_baby_seat: true,
    has_changing_table: true,
    has_ostomate: true,
    gender: 'multi'
  },
  source: 'manual'
};

// 範例：咖啡廳提供的充電插座
const cafeCharging: L3ServiceFacility = {
  id: 'facility:ueno:charging:starbucks',
  nodeId: 'odpt.Station:TokyoMetro.Ueno',
  category: 'charging',
  subCategory: 'free_outlet',
  location: {
    floor: '1F',
    direction: '中央口出て左側のスターバックス内'
  },
  provider: {
    type: 'shop',
    name: 'Starbucks 上野駅店',
    requiresPurchase: true  // 需要消費才能使用
  },
  attributes: {
    is_free: true,  // 插座免費，但要消費
    outlet_type: ['Type-A'],
    max_devices: 2
  },
  openingHours: 'Mo-Fr 07:00-22:00; Sa-Su 08:00-21:00',
  source: 'manual'
};

// 範例：置物櫃
const locker: L3ServiceFacility = {
  id: 'facility:ueno:locker:central',
  nodeId: 'odpt.Station:TokyoMetro.Ueno',
  category: 'locker',
  subCategory: 'coin_locker',
  location: {
    floor: 'B1',
    direction: '中央改札の横'
  },
  provider: {
    type: 'station'
  },
  attributes: {
    sizes: [
      { size: 'S', price: 300, count: 20 },
      { size: 'M', price: 500, count: 15 },
      { size: 'L', price: 700, count: 10 },
      { size: 'XL', price: 1000, count: 5 }
    ],
    payment_methods: ['cash', 'ic_card'],
    max_hours: 72
  },
  source: 'manual'
};
```

---

## 5. L4 行動策略 (Mobility Strategy)

### 5.1 L4 的本質

```
L4 回答：「綜合以上資訊，你現在該怎麼做？」

L4 不是儲存的數據，而是 AI 即時推理的結果。
它綜合 L1 + L2 + L3 + 用戶情境，生成「單一最佳建議」。
```

### 5.2 L4 的推理流程

```
輸入：
┌─────────────────────────────────────────────────────────────┐
│ L1：用戶在上野站（藥妝激戰區、觀光景點多）                    │
│ L2：銀座線延誤 15 分鐘、外面下小雨                           │
│ L3：北口有無障礙廁所、B1 有置物櫃、附近有 ecbo 寄放          │
│ 用戶情境：帶大行李、想去淺草、行動不便的家人同行              │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│ AI 推理                                                      │
│                                                             │
│ 考量因素：                                                   │
│ 1. 銀座線延誤 → 搭地鐵會等很久                              │
│ 2. 下雨 + 大行李 → 不適合走路或騎車                         │
│ 3. 行動不便家人 → 需要無障礙路線                            │
│ 4. 有 ecbo 服務 → 可以先寄放行李                            │
│                                                             │
│ 決策：建議搭計程車，提供 ecbo 作為備選                       │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
輸出：
┌─────────────────────────────────────────────────────────────┐
│ Primary Card：                                               │
│ 「建議搭計程車去淺草，車程約 12 分鐘，預估 1,500 円。        │
│  因為銀座線目前有延誤，而且外面在下雨。                      │
│  GO Taxi 有無障礙車輛可以預約。」                            │
│  [GO Taxi 叫車]                                              │
│                                                             │
│ Secondary Cards：                                            │
│ • 「先把行李寄放在 ecbo（徒步 3 分鐘），再搭車會更輕鬆」     │
│ • 「如果不趕時間，可以等銀座線恢復（預計 30 分鐘後）」       │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. 層級關係總覽

```
┌─────────────────────────────────────────────────────────────┐
│                     L1 地點基因                              │
│              「這裡是什麼樣的地方」                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 絕對地理位置 + 生活機能標籤                          │   │
│  │                                                     │   │
│  │ 標籤層次：主類別 → 次類別 → 子類別                  │   │
│  │ 範例：醫療 → 診所 → 牙科                            │   │
│  │       購物 → 藥妝店 → 松本清                        │   │
│  │       餐飲 → 居酒屋                                 │   │
│  │                                                     │   │
│  │ 呈現效果：標籤聚集 → 地方特色                       │   │
│  │ 「這條街有 8 家藥妝店」→「藥妝激戰區」              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  更新：每季 | 性質：冷數據                                   │
└─────────────────────────────────────────────────────────────┘
          │
          │ 節點有什麼「商業氛圍」
          ▼
┌─────────────────────────────────────────────────────────────┐
│                     L2 即時狀態                              │
│              「這裡現在怎麼樣」                              │
│                                                             │
│  路線狀態、擁擠度、天氣、共享單車數量                        │
│                                                             │
│  更新：15 分鐘 | 性質：熱數據                                │
└─────────────────────────────────────────────────────────────┘
          │
          │ 現在的狀況
          ▼
┌─────────────────────────────────────────────────────────────┐
│                     L3 服務設施                              │
│              「這裡有什麼可用的設施」                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 廁所：公共、車站、百貨、店家提供                     │   │
│  │ 充電：免費插座、充電站、行動電源租借                 │   │
│  │ WiFi：公共、商業、付費                               │   │
│  │ 置物櫃：各種尺寸、價格                               │   │
│  │ 無障礙：電梯、坡道、無障礙廁所                       │   │
│  │                                                     │   │
│  │ 每個設施都有：位置、屬性標籤、營業時間               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  更新：每月 | 性質：溫數據                                   │
└─────────────────────────────────────────────────────────────┘
          │
          │ 有什麼可用的服務
          ▼
┌─────────────────────────────────────────────────────────────┐
│                     L4 行動策略                              │
│              「所以你該怎麼做」                              │
│                                                             │
│  AI 綜合 L1 + L2 + L3 + 用戶情境                            │
│  生成「單一最佳建議」+ 替代方案                              │
│                                                             │
│  更新：即時生成 | 性質：計算結果（不儲存）                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. 常見誤解澄清

### 誤解 1：L1 是「數量統計」

```
❌ 錯誤理解：
L1 是「這裡有 23 家商店、18 家餐廳」的數字統計

✅ 正確理解：
L1 是「層次化的生活機能標籤」
每個標籤有：主類別 → 次類別 → 子類別
透過標籤的「組合」和「聚集」來呈現地方特色

不是簡單說「這裡有 5 家醫療」
而是說「這裡有牙科、眼科、皮膚科、藥局、健檢中心」
這些標籤的組合呈現了「醫療資源豐富」的特色
```

### 誤解 2：L3 是「商家列表」

```
❌ 錯誤理解：
L3 列出所有的餐廳、商店、診所

✅ 正確理解：
L3 是「服務設施」，不是商家
L3 包含：廁所、充電、WiFi、置物櫃、無障礙設施

商家的「類型」屬於 L1（生活機能標籤）
商家提供的「公共服務」才屬於 L3
例如：咖啡廳本身是 L1 標籤，
     但咖啡廳提供的「免費插座」是 L3 設施
```

### 誤解 3：L1 和 L3 重複

```
❌ 錯誤理解：
「藥局」同時出現在 L1 和 L3，不是重複嗎？

✅ 正確理解：
L1 的「藥局」= 這裡有藥局（商業氛圍標籤）
L3 的「藥局」= 不存在，L3 沒有藥局這個類別

藥局的「存在」是 L1
藥局提供的「服務」（如果有公共使用的話）才是 L3

更清楚的對比：
• 便利商店有廁所 → L1 標籤「便利商店」+ L3 設施「店家提供廁所」
• 星巴克有插座 → L1 標籤「咖啡廳」+ L3 設施「免費插座」
• 車站有置物櫃 → L3 設施「置物櫃」（車站本身不是 L1 標籤）
```

---

## 8. 資料庫設計對照

```sql
-- L1：節點 + 生活機能標籤
create table nodes (
  id text primary key,
  coordinates geography(point, 4326),
  address jsonb
);

create table facility_tags (
  id serial primary key,
  node_id text references nodes(id),
  
  main_category text not null,      -- 'medical', 'shopping', 'dining'
  sub_category text not null,       -- 'drugstore', 'izakaya', 'dental'
  detail_category text,             -- 更細分類
  
  brand text,                       -- '松本清', 'Starbucks'
  name text,                        -- 店名
  
  distance_meters int,              -- 距離
  direction text,                   -- 方位
  street text                       -- 街道名
);

-- L3：服務設施
create table service_facilities (
  id text primary key,
  node_id text references nodes(id),
  
  category text not null,           -- 'toilet', 'charging', 'locker'
  sub_category text not null,       -- 'public_toilet', 'free_outlet'
  
  floor text,
  direction text,
  
  provider_type text,               -- 'public', 'station', 'shop'
  provider_name text,
  requires_purchase boolean,
  
  attributes jsonb,                 -- 各種屬性標籤
  opening_hours text,
  
  source text,
  updated_at timestamptz
);
```

---

## 9. 給 AI 開發代理的實作檢查清單

```
□ L1 實作檢查：
  □ 理解 L1 是「層次化標籤」不是「數量統計」
  □ facility_tags 表有 main_category, sub_category, detail_category
  □ 標籤可以聚合分析（同類型聚集 = 地方特色）
  □ 標籤是預先標註的冷數據

□ L3 實作檢查：
  □ 理解 L3 是「服務設施」不是「商家」
  □ L3 只包含：廁所、充電、WiFi、置物櫃、無障礙設施
  □ service_facilities 表有正確的 category 分類
  □ 每個設施都有 attributes（屬性標籤）
  □ 區分「公共設施」和「店家提供設施」

□ L1 vs L3 區分：
  □ 商家類型 → L1 標籤
  □ 服務設施 → L3 設施
  □ 商家提供的公共服務 → L3 設施（標註提供者）
```

---

*本文件定義 BambiGO 四層標籤系統的正確架構。*
*L1 是層次化的生活機能標籤，L3 是可用的服務設施，兩者本質不同。*
