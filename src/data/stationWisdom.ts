export interface StationTrap {
    type: 'depth' | 'transfer' | 'exit' | 'crowd';
    title: string;
    content: string;
    advice: string;
    severity: 'medium' | 'high' | 'critical';
}

// L3 設施資料結構 - 供 AI Agent 參照
export interface StationFacility {
    type: 'toilet' | 'locker' | 'elevator' | 'wifi' | 'charging' | 'nursing';
    location: string;      // 精確位置描述
    floor: string;         // 'JR 3F' | 'Metro B1' | 'Metro B2' | 'JR 1F'
    operator: 'JR' | 'Metro' | 'Toei' | 'Private';
    attributes?: {
        count?: number;           // 置物櫃數量
        sizes?: string[];         // 置物櫃尺寸
        wheelchair?: boolean;     // 無障礙
        hasWashlet?: boolean;     // 溫水洗淨
        hasBabyRoom?: boolean;    // 育嬰室
        hours?: string;           // 營業時間
        ssid?: string;            // WiFi SSID
        note?: string;            // 備註
    };
    source?: string;       // 資料來源 URL
}

// 無障礙步行路線 - 基於 MLIT 歩行空間ネットワークデータ
export interface AccessibilityRoute {
    name: string;                       // 路線名稱
    from: string;                       // 起點
    to: string;                         // 終點
    rank: 'SAA' | 'SBA' | 'SBB' | 'AAA' | 'ABB'; // 無障礙等級 (S=最佳推薦)
    distance?: number;                  // 距離 (公尺)
    hasTactilePaving: boolean;          // 點字磚 (視障導引)
    hasRoof: boolean;                   // 有遮蔽 (雨天適用)
    hasElevator: boolean;               // 電梯可用
    widthLevel: 1 | 2 | 3 | 4 | 5;      // 路徑寬度 (1=狹窄, 5=寬敞)
    slopeLevel?: 1 | 2 | 3 | 4 | 5;     // 坡度 (1=平坦)
    note?: string;
    source: string;                     // 資料來源
}

export interface StationWisdomData {
    traps: StationTrap[];
    hacks?: string[];
    l3Facilities?: StationFacility[];           // L3 設施資料 - AI 可參照
    accessibilityRoutes?: AccessibilityRoute[]; // 無障礙路線 - MLIT 資料
}

export const STATION_WISDOM: Record<string, StationWisdomData> = {
    // Ueno Station (Target for verification)
    'odpt:Station:TokyoMetro.Ueno': {
        traps: [
            {
                type: 'depth',
                title: '🚄 新幹線搭乘警示 (High Depth)',
                content: '上野站的新幹線月臺位於地下四層，非常深！從上野公園/不忍口進站後，需連續搭乘 **四段長扶梯** 才能抵達。',
                advice: '⚠️ 心理建設：請務必預留 **至少 15 分鐘** 的進站緩衝時間。絕對不要在發車前 5 分鐘才抵達驗票口，你會趕不上。',
                severity: 'critical'
            }
        ],
        hacks: [
            '🏛️ **文化天橋 (Panda Bridge)**：從公園口出站後，可直接走天橋（官方稱熊貓橋）通往國立科學博物館與上野大廳，避開 1F 的擁擠人潮。',
            '🛍️ **阿美橫町切入點**：想去阿美橫町？不要走「中央改札」，改走「不忍改札」過馬路就是入口，省下 5 分鐘迷路時間。'
        ],
        // L3 設施資料 - 基於 Tokyo Metro 及 JR East 官方資料
        l3Facilities: [
            // === 廁所 (Toilets) ===
            { type: 'toilet', floor: 'Metro B1', operator: 'Metro', location: '銀座線 往JR方向驗票口內', attributes: { wheelchair: true, hasWashlet: true }, source: 'https://www.tokyometro.jp/lang_tcn/station/ueno/accessibility/' },
            { type: 'toilet', floor: 'Metro B1', operator: 'Metro', location: '日比谷線 電梯專用出口驗票口外', attributes: { wheelchair: true, hasWashlet: true }, source: 'https://www.tokyometro.jp/lang_tcn/station/ueno/accessibility/' },
            { type: 'toilet', floor: 'JR 3F', operator: 'JR', location: '大連絡橋通道', attributes: { wheelchair: true, hasWashlet: true }, source: 'https://www.jreast.co.jp/estation/stations/204.html' },
            { type: 'toilet', floor: 'JR 3F', operator: 'JR', location: 'ecute Ueno 內', attributes: { wheelchair: true, hasWashlet: true, hasBabyRoom: true, note: '含育嬰室' }, source: 'https://www.jreast.co.jp/estation/stations/204.html' },
            // === 置物櫃 (Lockers) ===
            { type: 'locker', floor: 'JR 1F', operator: 'JR', location: '中央口改札外', attributes: { count: 300, sizes: ['S', 'M', 'L', 'XL'], note: '最大量置物櫃區' }, source: 'https://www.jreast.co.jp/estation/stations/204.html' },
            { type: 'locker', floor: 'Metro B1', operator: 'Metro', location: '不忍口改札外', attributes: { count: 80, sizes: ['S', 'M', 'L'] } },
            { type: 'locker', floor: 'JR 3F', operator: 'JR', location: '公園口改札內', attributes: { count: 100, sizes: ['S', 'M', 'L'] }, source: 'https://www.jreast.co.jp/estation/stations/204.html' },
            { type: 'locker', floor: 'JR 3F', operator: 'JR', location: '入谷口改札內', attributes: { count: 150, sizes: ['S', 'M', 'L', 'XL'], note: 'ecute 方向通道' }, source: 'https://www.jreast.co.jp/estation/stations/204.html' },
            // === 電梯 (Elevators) - 無障礙設施 ===
            { type: 'elevator', floor: 'Metro B1', operator: 'Metro', location: '銀座線月台 → JR方向驗票口', attributes: { wheelchair: true }, source: 'https://www.tokyometro.jp/lang_tcn/station/ueno/accessibility/' },
            { type: 'elevator', floor: 'Metro B1', operator: 'Metro', location: '公園驗票口 → 5a出口', attributes: { wheelchair: true, note: '通往上野公園' }, source: 'https://www.tokyometro.jp/lang_tcn/station/ueno/accessibility/' },
            { type: 'elevator', floor: 'Metro B2', operator: 'Metro', location: '日比谷線1號月台 → 驗票口', attributes: { wheelchair: true }, source: 'https://www.tokyometro.jp/lang_tcn/station/ueno/accessibility/' },
            { type: 'elevator', floor: 'JR 1F', operator: 'JR', location: '正面廣場 → Metro驗票口層', attributes: { wheelchair: true, hours: '7:30-22:00', note: '僅限營業時間' }, source: 'https://www.tokyometro.jp/lang_tcn/station/ueno/accessibility/' },
            // === WiFi ===
            { type: 'wifi', floor: 'Metro 全層', operator: 'Metro', location: '改札內全區', attributes: { ssid: 'METRO_FREE_WiFi', note: '限時30分' } },
            { type: 'wifi', floor: 'JR 全層', operator: 'JR', location: '改札內外全站', attributes: { ssid: 'JR-EAST_FREE_WiFi', note: '需登錄' } },
            // === 充電 (Charging) ===
            { type: 'charging', floor: 'JR 3F', operator: 'JR', location: 'ecute Ueno 咖啡廳', attributes: { note: 'Type-A, Type-C 插座' } }
        ],
        // 無障礙步行路線 - 基於 MLIT 歩行空間ネットワークデータ (台東区上野駅周辺)
        accessibilityRoutes: [
            {
                name: 'JR中央口→不忍池 (推薦路線)',
                from: 'JR上野站中央口',
                to: '不忍池弁天堂',
                rank: 'SAA',
                distance: 350,
                hasTactilePaving: true,
                hasRoof: true,
                hasElevator: true,
                widthLevel: 4,
                slopeLevel: 2,
                note: '經不忍口地下道，全程有遮蔽，輪椅/嬰兒車友善',
                source: 'https://ckan.hokonavi.go.jp/dataset/2df4cb39-8b2e-4692-97ea-3f6b4132c109'
            },
            {
                name: '公園口→上野公園 (最短路線)',
                from: 'JR上野站公園口',
                to: '上野公園噴水廣場',
                rank: 'SAA',
                distance: 200,
                hasTactilePaving: true,
                hasRoof: false,
                hasElevator: true,
                widthLevel: 5,
                slopeLevel: 1,
                note: '出站即是公園入口，路面平坦寬敞，無遮蔽需注意天氣',
                source: 'https://ckan.hokonavi.go.jp/dataset/2df4cb39-8b2e-4692-97ea-3f6b4132c109'
            },
            {
                name: '不忍改札→阿美橫町',
                from: 'Metro上野站不忍改札',
                to: '阿美橫町北入口',
                rank: 'SBA',
                distance: 100,
                hasTactilePaving: true,
                hasRoof: false,
                hasElevator: false,
                widthLevel: 3,
                slopeLevel: 2,
                note: '過馬路後即抵達，但需走樓梯出站',
                source: 'https://ckan.hokonavi.go.jp/dataset/2df4cb39-8b2e-4692-97ea-3f6b4132c109'
            },
            {
                name: '廣小路口→松坂屋 (百貨購物)',
                from: 'JR上野站廣小路口',
                to: '松坂屋上野店',
                rank: 'AAA',
                distance: 150,
                hasTactilePaving: true,
                hasRoof: true,
                hasElevator: true,
                widthLevel: 4,
                slopeLevel: 1,
                note: '地下連通道直達，全程室內，雨天最佳',
                source: 'https://ckan.hokonavi.go.jp/dataset/2df4cb39-8b2e-4692-97ea-3f6b4132c109'
            },
            {
                name: '公園口→國立西洋美術館',
                from: 'JR上野站公園口',
                to: '國立西洋美術館',
                rank: 'SAA',
                distance: 300,
                hasTactilePaving: true,
                hasRoof: false,
                hasElevator: true,
                widthLevel: 5,
                slopeLevel: 1,
                note: '經上野公園主幹道，平坦寬敞，輪椅完全無障礙',
                source: 'https://ckan.hokonavi.go.jp/dataset/2df4cb39-8b2e-4692-97ea-3f6b4132c109'
            }
        ]
    },


    // Tokyo Station (Reference)
    'odpt:Station:TokyoMetro.Tokyo': {
        traps: [
            {
                type: 'transfer',
                title: '🏃 京葉線轉乘陷阱 (Far Transfer)',
                content: '京葉線（去迪士尼的路線）月臺距離山手線非常遠，實際上接近「有樂町站」。',
                advice: '⚠️ 心理建設：轉乘通道長達 800 公尺，步行需 15-20 分鐘。請把它當作是「走到下一站」的距離感。',
                severity: 'high'
            }
        ]
    },

    // Toei Asakusa Line Wisdom
    'odpt:Station:Toei.Asakusa.Oshiage': {
        traps: [
            {
                type: 'crowd',
                title: '🗼 晴空塔人潮 (Skytree Crowds)',
                content: '押上站是前往晴空塔的主要車站，假日與連假期間人潮非常洶湧。',
                advice: '💡 建議：若要前往晴空塔，請預留出站時間。回程若遇人潮管制，可考慮步行至鄰近車站搭乘。',
                severity: 'medium'
            }
        ],
        hacks: [
            '✈️ **直通成田**：此站直通京成線往成田機場，是個非常方便的轉運點。'
        ]
    },
    'odpt:Station:Toei.Asakusa.Asakusa': {
        traps: [
            {
                type: 'exit',
                title: '🧳 電梯陷阱 (Elevator Trap)',
                content: '淺草站出口雖多，但直通地面的電梯 **只有一座**！',
                advice: '⚠️ 行動建議：攜帶大型行李的旅客，請務必尋找「駒形橋方面」的 **A2b 出口**，这是唯一的直達電梯出口。',
                severity: 'high'
            }
        ]
    },
    'odpt:Station:Toei.Asakusa.Kuramae': {
        traps: [
            {
                type: 'transfer',
                title: '🚅 列車過站不停警示 (Skip Stop)',
                content: '注意！都營淺草線的「Airport快特 (Airport Kaitoku)」列車 **不會停靠** 藏前站。',
                advice: '🛑 能夠搭乘的車種：除了 Airport 快特以外的車種（普通、快速、特急等）皆可搭乘。若誤搭快特，請在下一站換車折返。',
                severity: 'high'
            },
            {
                type: 'transfer',
                title: '🔄 大江戶線轉乘陷阱 (Street Transfer)',
                content: '淺草線藏前站與大江戶線藏前站 **在站外轉乘**，需出站走一般道路約 300 公尺。',
                advice: '⚠️ 心理建設：這不是站內轉乘，請做好要走出戶外過馬路的準備。轉乘時間需抓 10-15 分鐘。',
                severity: 'medium'
            }
        ]
    },
    'odpt:Station:Toei.Asakusa.Asakusabashi': {
        traps: [
            {
                type: 'transfer',
                title: '🪜 轉乘陷阱 (Stair Master)',
                content: '雖然淺草橋站有 JR 總武線和都營淺草線，但兩者轉乘 **需要出站並走一段樓梯**，且電梯位置隱密。',
                advice: '⚠️ 心理建設：攜帶大件行李者，請務必尋找 A3 出口（有電梯），否則將面臨長長的樓梯挑戰。',
                severity: 'medium'
            }
        ],
        hacks: [
            '🧵 **手作天堂**：出站即是「江戶通」，滿街都是飾品材料、皮革、珠寶的批發店，價格甚至是市價的一半！',
            '🎎 **人形老舖**：此地也是著名的「久月」等人形娃娃專賣區。'
        ]
    },
    'odpt:Station:TokyoMetro.Tawaramachi': {
        traps: [
            {
                type: 'exit',
                title: '🍳 合羽橋道具街陷阱 (Kitchen Street)',
                content: '想去合羽橋道具街？最近的出口是 3 號，但 **只有樓梯**。',
                advice: '⚠️ 行動建議：若有重物，請改走 2 號出口（有電梯），雖然要多過一個馬路，但省力很多。',
                severity: 'medium'
            }
        ],
        hacks: [
            '🍞 **知名麵包店**：著名的「Pelican」麵包店就在附近，需預約才買得到！'
        ]
    },
    'odpt:Station:JR-East.Uguisudani': {
        traps: [
            {
                type: 'exit',
                title: '🎭 南北出口大不同 (North vs South)',
                content: '鶯谷站的北口與南口氛圍截然不同！北口是著名的「摩鐵街 (Love Hotel Hill)」，南口則是通往上野公園與博物館的文教區。',
                advice: '💡 若要去東京國立博物館，請務必走 **南口**，北口走出來會讓你懷疑人生（或非常尷尬）。',
                severity: 'high'
            }
        ]
    },
    'odpt:Station:JR-East.Okachimachi': {
        traps: [],
        hacks: [
            '🐟 **阿美橫町尾端**：這裡是阿美橫町的另一端，相較於上野站的擁擠，從御徒町進入通常人潮稍少一點，且海鮮丼名店多集中在此側。',
            '💎 **珠寶批發**：車站周邊是日本最大的珠寶飾品批發區。'
        ]
    },
    'odpt:Station:TokyoMetro.Iriya': {
        traps: [],
        hacks: [
            '👻 **鬼子母神**：每年七月的「朝顏市（牽牛花市）」非常熱鬧。',
            '🍲 **老舖天丼**：附近有許多百年老店，價格比淺草親民許多。'
        ]
    },
    'odpt:Station:Toei.Asakusa.Ningyocho': {
        traps: [
            {
                type: 'transfer',
                title: '🚅 列車過站不停警示 (Skip Stop)',
                content: '注意！都營淺草線的「Airport快特 (Airport Kaitoku)」列車 **不會停靠** 人形町站。',
                advice: '🛑 能夠搭乘的車種：請搭乘普通或各站停車的班次。',
                severity: 'medium'
            }
        ],
        hacks: [
            '⛩️ **洗錢神社**：步行可達著名的小網神社（求財運），是近年熱門景點。'
        ]
    },
    'odpt:Station:Toei.Asakusa.Higashiginza': {
        traps: [
            {
                type: 'transfer',
                title: '🚅 列車過站不停警示 (Skip Stop)',
                content: '注意！都營淺草線的「Airport快特 (Airport Kaitoku)」列車 **不會停靠** 東銀座站。',
                advice: '🛑 能夠搭乘的車種：請搭乘普通或各站停車的班次。',
                severity: 'medium'
            }
        ]
    },
    'odpt:Station:Toei.Asakusa.Sengakuji': {
        traps: [
            {
                type: 'transfer',
                title: '🔀 命運的分歧點 (Destination Trap)',
                content: '泉岳寺站是淺草線往「西馬込」與「京急線（羽田機場）」的分歧點。',
                advice: '⚠️ 轉乘攻略：若要往五反田、西馬込方向，無論何種列車都可先上車，只需在 **泉岳寺站** 下車換乘往西馬込的列車即可，無需在月台苦等直達車。',
                severity: 'high'
            }
        ]
    },
    // Shinjuku Station (The Boss)
    'odpt:Station:JR-East.Shinjuku': {
        traps: [
            {
                type: 'exit',
                title: '🌀 東西出口迷宮 (East/West Maze)',
                content: '新宿站的 JR 系統，東口與西口在地下不互通（除非走特定通道）。一旦出錯閘門，要繞外圍一大圈才能到對面。',
                advice: '⚠️ 絕對守則：出閘門前請確認目標是「東口」還是「西口」。若走錯，建議不下樓，直接走地面層的「大ガード (大鐵橋)」繞過去。',
                severity: 'critical'
            },
            {
                type: 'transfer',
                title: '🚇 大江戶線轉乘地獄 (Deep Transfer)',
                content: '大江戶線的「新宿站」位於地下七層，距離 JR 改札口極遠。',
                advice: '💡 行動建議：若要轉乘大江戶線，請改去「新宿西口站」而非「新宿站」，兩者其實更近且沒那麼深。',
                severity: 'high'
            }
        ],
        hacks: [
            '🌧️ **地下通路王**：新宿三丁目到西口都廳，均有地下道相連。下雨天可從「Subnade」地下街一路逛到東口，完全不必淋雨。',
            '🆕 **新南口直達**：要去「Busta 新宿 (巴士轉運站)」請務必找「新南改札」，出來直達手扶梯上樓即是，千萬別走去東/西口。'
        ]
    },

    // Shibuya Station (The Labyrinth)
    'odpt:Station:TokyoMetro.Shibuya': {
        traps: [
            {
                type: 'transfer',
                title: '🆙 銀座線空口謎題 (Sky Subway)',
                content: '雖然是地下鐵，但澀谷站的銀座線月台在 **三樓**！而副都心線在地下五樓。',
                advice: '⚠️ 轉乘警示：銀座線轉乘副都心線/東橫線，垂直移動距離極大，請預留 10-15 分鐘的「登山」時間。',
                severity: 'high'
            },
            {
                type: 'exit',
                title: '🚧 迷宮工事中 (Construction Chaos)',
                content: '澀谷站周邊工程持續進行中，出口位置常有變動。',
                advice: '🛑 能夠搭乘的車種：請認準「Hachiko Gate (八公改札)」作為唯一真理，其他出口容易迷失在工地迷宮中。',
                severity: 'medium'
            }
        ],
        hacks: [
            '🏙️ **Scramble Square 捷徑**：利用 Scramble Square 百貨的電梯，可以直接從 B2 地鐵層殺到 3F 的銀座線/JR 連通道，避開人擠人的手扶梯。',
            '🖼️ **神話明日壁畫**：在通往井之頭線的連通道上，有岡本太郎巨大的壁畫「明日的神話」，是免費且震撼的藝術景點。'
        ]
    },

    // Ikebukuro Station (The Owl)
    'odpt:Station:JR-East.Ikebukuro': {
        traps: [
            {
                type: 'exit',
                title: '🦉 東西百貨悖論 (West-East Paradox)',
                content: '池袋的最大陷阱：「西武百貨在東口，東武百貨在西口」。',
                advice: '⚠️ 記憶口訣：東口是西武 (Seibu)，西口是東武 (Tobu)。想去西武百貨請往「東口」走！',
                severity: 'critical'
            }
        ],
        hacks: [
            '🦉 **貓頭鷹地標**：東口的「Ikefukurou (貓頭鷹石像)」是最佳會合點，比八公像難找一點但人也比較少。',
            '🍜 **拉麵激戰區**：東口往 SunShine City 的路上是拉麵一級戰區，無敵家、一蘭都在這附近。'
        ]
    }
};
