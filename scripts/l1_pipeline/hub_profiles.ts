export interface StationProfile {
    id: string; // Match primary ID or part of it
    name: string;
    description: string; // Expert description
    core_vibes: string[]; // Mandatory vibes
    priority_categories: Record<string, number>; // Custom limits for specific categories
    mandatory_landmarks: string[]; // Must-have POI keywords for validation
}

export const HUB_PROFILES: Record<string, StationProfile> = {
    // 1. Ueno (上野) - 下町、文化、交通樞紐
    'Ueno': {
        id: 'Ueno',
        name: '上野',
        description: '東京の北の玄関口。上野公園の文化施設、アメ横の活気、下町情緒が融合する多面的な街。',
        core_vibes: ['Shitamachi Culture (下町)', 'Museum Hub', 'Ameyoko Market', 'Transport Hub'],
        priority_categories: {
            'culture': 100, // Keep all museums
            'shopping': 80, // High density for Ameyoko
            'nature': 20    // Ueno Park
        },
        mandatory_landmarks: ['Ameyoko', 'Ueno Park', 'National Museum', 'Zoo']
    },
    // 2. Tokyo (東京) - 首都玄關、商務、歷史
    'Tokyo': {
        id: 'Tokyo',
        name: '東京',
        description: '日本の中心駅。丸の内のオフィス街と歴史的な赤レンガ駅舎、八重洲の商業エリア。',
        core_vibes: ['Capital Gateway', 'Business District', 'Historical Architecture'],
        priority_categories: {
            'business': 50,
            'shopping': 80, // Character Street, Daimaru etc.
            'dining': 60
        },
        mandatory_landmarks: ['Imperial Palace', 'Marunouchi', 'Yaesu']
    },
    // 3. Akihabara (秋葉原) - 電器、次文化
    'Akihabara': {
        id: 'Akihabara',
        name: '秋葉原',
        description: '世界有数の電気街であり、アニメ・ゲーム・アイドルなどサブカルチャーの聖地。',
        core_vibes: ['Electric Town', 'Otaku Culture', 'Maid Cafe'],
        priority_categories: {
            'shopping': 100, // Electronics & Anime goods
            'dining': 50     // Maid cafes etc.
        },
        mandatory_landmarks: ['Electric Town', 'Radio Kaikan']
    },
    // 4. Asakusa (浅草) - 傳統、觀光
    'Asakusa': {
        id: 'Asakusa',
        name: '浅草',
        description: '東京を代表する観光地。浅草寺雷門と仲見世通り、江戸情緒が色濃く残る街。',
        core_vibes: ['Traditional Japan', 'Sightseeing Hub', 'Senso-ji Temple'],
        priority_categories: {
            'culture': 50, // Temples
            'shopping': 60, // Souvenirs
            'dining': 60    // Traditional food
        },
        mandatory_landmarks: ['Senso-ji', 'Kaminarimon', 'Nakamise']
    },
    // 5. Shibuya (渋谷) - 潮流、IT、年輕人
    'Shibuya': {
        id: 'Shibuya',
        name: '渋谷',
        description: '若者文化の発信地。スクランブル交差点、IT企業が集積するビットバレー。',
        core_vibes: ['Youth Culture', 'IT Hub (Bit Valley)', 'Fashion Center'],
        priority_categories: {
            'shopping': 80, // Fashion
            'business': 50, // IT offices
            'dining': 60
        },
        mandatory_landmarks: ['Scramble Crossing', 'Hachiko', 'Center Gai']
    },
    // 6. Shinjuku (新宿) - 巨大迷宮、摩天樓、歌舞伎町
    'Shinjuku': {
        id: 'Shinjuku',
        name: '新宿',
        description: '世界一の乗降客数を誇る巨大ターミナル。西口の摩天楼と東口の歓楽街（歌舞伎町）。',
        core_vibes: ['Mega Terminal', 'Skyscraper District', 'Nightlife (Kabukicho)'],
        priority_categories: {
            'dining': 80,   // High density
            'shopping': 80, // Department stores
            'business': 50
        },
        mandatory_landmarks: ['Kabukicho', 'Tokyo Metropolitan Government', 'Gyoen']
    },
    // 7. Ikebukuro (池袋) - 乙女路、副都心
    'Ikebukuro': {
        id: 'Ikebukuro',
        name: '池袋',
        description: '埼玉方面からの玄関口。西武・東武の巨大デパートと、乙女ロードなどのサブカル文化。',
        core_vibes: ['Subcenter', 'Otome Road', 'Department Store Battleground'],
        priority_categories: {
            'shopping': 80,
            'culture': 40   // Theaters
        },
        mandatory_landmarks: ['Sunshine City', 'West Gate Park']
    },
    // 8. Roppongi (六本木) - 藝術、外國人、夜生活
    'Roppongi': {
        id: 'Roppongi',
        name: '六本木',
        description: 'アートと国際色豊かな街。六本木ヒルズ、ミッドタウンなどの複合施設と美術館。',
        core_vibes: ['Art Triangle', 'International Hub', 'Nightlife'],
        priority_categories: {
            'culture': 50, // Art Museums
            'dining': 60   // International cuisine
        },
        mandatory_landmarks: ['Roppongi Hills', 'Tokyo Midtown', 'Mori Art Museum']
    },
    // 9. Ginza (銀座) - 高級、歷史
    'Ginza': {
        id: 'Ginza', // Often associated with Yurakucho/Higashi-Ginza too
        name: '銀座',
        description: '日本を代表する高級商業地。老舗百貨店とブランドショップが立ち並ぶ。',
        core_vibes: ['Luxury Shopping', 'High-end Dining', 'Gallery'],
        priority_categories: {
            'shopping': 80,
            'dining': 60
        },
        mandatory_landmarks: ['Wako', 'Ginza Six', 'Kabukiza']
    },
    // 10. Shinbashi (新橋) - 薩拉里曼聖地
    'Shinbashi': {
        id: 'Shinbashi',
        name: '新橋',
        description: 'サラリーマンの街。SL広場とガード下の飲み屋街。',
        core_vibes: ['Salaryman Sanctuary', 'Izakaya Under Tracks'],
        priority_categories: {
            'dining': 80 // Izakayas
        },
        mandatory_landmarks: ['SL Plaza']
    },
    // 11. Otemachi (大手町) - 金融、媒體
    'Otemachi': {
        id: 'Otemachi',
        name: '大手町',
        description: '日本屈指のビジネス街。金融機関、新聞社、商社が本社を構える。',
        core_vibes: ['Financial District', 'Media Hub'],
        priority_categories: {
            'business': 80
        },
        mandatory_landmarks: []
    },
    // 12. Harajuku (原宿) - 潮流發源
    'Harajuku': {
        id: 'Harajuku', // Also Meiji-jingumae
        name: '原宿',
        description: 'カワイイ文化の発信地。竹下通りと表参道の対比。明治神宮の森。',
        core_vibes: ['Kawaii Culture', 'Fashion Trend', 'Spiritual Forest'],
        priority_categories: {
            'shopping': 80,
            'nature': 30 // Meiji Jingu
        },
        mandatory_landmarks: ['Takeshita Street', 'Meiji Jingu', 'Omotesando']
    },
    // 13. Nakano (中野) - 次文化、百老匯
    'Nakano': {
        id: 'Nakano',
        name: '中野',
        description: '中野ブロードウェイを中心としたサブカルチャーの聖地。',
        core_vibes: ['Subculture Arcade', 'Broadway'],
        priority_categories: {
            'shopping': 60
        },
        mandatory_landmarks: ['Nakano Broadway', 'Sun Mall']
    },
    // 14. Jimbocho (神保町) - 古書、咖哩
    'Jimbocho': {
        id: 'Jimbocho',
        name: '神保町',
        description: '世界最大級の古書店街。カレーの激戦区としても有名。',
        core_vibes: ['Book Town', 'Curry Battleground'],
        priority_categories: {
            'shopping': 80, // Books
            'dining': 50    // Curry
        },
        mandatory_landmarks: []
    },
    // 15. Kanda (神田) - 學生、商業
    'Kanda': {
        id: 'Kanda',
        name: '神田',
        description: '江戸の職人文化とビジネスが混在。居酒屋が多く、学生街の側面も。',
        core_vibes: ['Business & Tradition', 'Izakaya'],
        priority_categories: {
            'dining': 60
        },
        mandatory_landmarks: ['Kanda Myojin']
    },
     // 16. Ochanomizu (御茶ノ水) - 學生、樂器、醫院
    'Ochanomizu': {
        id: 'Ochanomizu',
        name: '御茶ノ水',
        description: '大学病院と大学が集まる学生街。楽器店街としても有名。',
        core_vibes: ['Student Area', 'Musical Instruments', 'Medical Hub'],
        priority_categories: {
            'shopping': 60, // Instruments
            'medical': 40
        },
        mandatory_landmarks: ['Kanda River', 'Nicole Lai']
    },
    // 17. Iidabashi (飯田橋) - 交通結點、神樂坂
    'Iidabashi': {
        id: 'Iidabashi',
        name: '飯田橋',
        description: '神楽坂の玄関口。外濠の桜とビジネス街。',
        core_vibes: ['Kagurazaka Gateway', 'Canal Cafe'],
        priority_categories: {
            'dining': 60,
            'nature': 30 // Canal
        },
        mandatory_landmarks: ['Kagurazaka', 'Canal Cafe']
    },
    // 18. Shinagawa (品川) - 新幹線、商務
    'Shinagawa': {
        id: 'Shinagawa',
        name: '品川',
        description: '東海道新幹線の発着駅。港南口のオフィスビル群と高輪のホテル群。',
        core_vibes: ['Shinkansen Gateway', 'Corporate HQ'],
        priority_categories: {
            'business': 60,
            'accommodation': 60
        },
        mandatory_landmarks: []
    },
    // 19. Ebisu (恵比寿) - 成熟、時尚
    'Ebisu': {
        id: 'Ebisu',
        name: '恵比寿',
        description: '大人の街。恵比寿ガーデンプレイスと洗練された飲食店。',
        core_vibes: ['Sophisticated Dining', 'Garden Place'],
        priority_categories: {
            'dining': 60
        },
        mandatory_landmarks: ['Yebisu Garden Place']
    },
    // 20. Nihombashi (日本橋) - 傳統、金融原點
    'Nihombashi': {
        id: 'Nihombashi',
        name: '日本橋',
        description: '五街道の起点。老舗百貨店と金融街が融合。',
        core_vibes: ['Zero Mile Marker', 'Historical Department Stores'],
        priority_categories: {
            'shopping': 60,
            'culture': 40
        },
        mandatory_landmarks: ['Nihonbashi Bridge', 'Mitsukoshi']
    },
    // 21. Kinshicho (錦糸町) - 墨東繁華街
    'Kinshicho': {
        id: 'Kinshicho',
        name: '錦糸町',
        description: '東京東部の繁華街。家族向けの公園と夜の歓楽街が共存。',
        core_vibes: ['East Tokyo Hub', 'Family & Nightlife'],
        priority_categories: {
            'shopping': 60,
            'nature': 30 // Kinshi Park
        },
        mandatory_landmarks: ['Kinshi Park']
    },
    // 22. Oshiage (押上) - 晴空塔
    'Oshiage': {
        id: 'Oshiage',
        name: '押上',
        description: '東京スカイツリーの膝元。下町と最新観光地が融合。',
        core_vibes: ['Skytree Town', 'Shitamachi'],
        priority_categories: {
            'shopping': 60, // Solamachi
            'culture': 40
        },
        mandatory_landmarks: ['Skytree', 'Solamachi']
    },
    // 23. Nakameguro (中目黒) - 目黑川、時尚
    'Nakameguro': {
        id: 'Nakameguro',
        name: '中目黒',
        description: '目黒川の桜並木と、おしゃれなカフェ・雑貨店。',
        core_vibes: ['Sakura Promenade', 'Trendy Cafes'],
        priority_categories: {
            'dining': 60,
            'nature': 30
        },
        mandatory_landmarks: ['Meguro River']
    },
    // 24. Akasaka (赤坂) - 媒體、高級餐飲
    'Akasaka': {
        id: 'Akasaka', // Also Akasaka-mitsuke
        name: '赤坂',
        description: 'TBSを中心としたメディアと、料亭・高級飲食店の街。',
        core_vibes: ['Media City', 'Upscale Dining'],
        priority_categories: {
            'dining': 60,
            'business': 40
        },
        mandatory_landmarks: ['TBS', 'Hie Shrine']
    },
    // 25. Nippori (日暮里) - 谷根千、纖維街
    'Nippori': {
        id: 'Nippori',
        name: '日暮里',
        description: '谷根千散策の入口。繊維街と夕焼けだんだん。',
        core_vibes: ['Yanesen Gateway', 'Fabric Town', 'Cat Town'],
        priority_categories: {
            'shopping': 60, // Fabric street
            'culture': 50   // Temples
        },
        mandatory_landmarks: ['Yanaka Ginza', 'Textile Town']
    }
};

export function getStationProfile(stationId: string): StationProfile | undefined {
    for (const key in HUB_PROFILES) {
        // Precise matching: Ensure key is a distinct path segment or the end of the ID
        // e.g. .Ueno or .Ueno.
        if (stationId.endsWith(`.${key}`) || stationId.includes(`.${key}.`)) {
            return HUB_PROFILES[key];
        }
    }
    return undefined;
}
