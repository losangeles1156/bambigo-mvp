import { L1Category } from '@/lib/types/stationStandard';

export const STATIC_L1_DATA: Record<string, L1Category[]> = {
    // Ueno Station
    'odpt:Station:TokyoMetro.Ueno': [
        {
            id: 'culture',
            label: { ja: '文化・芸術', en: 'Culture', zh: '文化藝術' },
            icon: 'culture',
            items: [
                {
                    id: 'tnm',
                    name: { ja: '東京国立博物館', en: 'Tokyo National Museum', zh: '東京國立博物館' },
                    location: { ja: '公園口 徒歩10分', en: 'Park Exit, 10 min walk', zh: '公園口 步行10分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                },
                {
                    id: 'nmwa',
                    name: { ja: '国立西洋美術館', en: 'National Museum of Western Art', zh: '國立西洋美術館' },
                    location: { ja: '公園口 徒歩1分', en: 'Park Exit, 1 min walk', zh: '公園口 步行1分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                },
                {
                    id: 'kahaku',
                    name: { ja: '国立科學博物館', en: 'National Museum of Nature and Science', zh: '國立科學博物館' },
                    location: { ja: '公園口 徒歩5分', en: 'Park Exit, 5 min walk', zh: '公園口 步行5分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                }
            ]
        },
        {
            id: 'nature',
            label: { ja: '自然・公園', en: 'Nature', zh: '自然公園' },
            icon: 'nature',
            items: [
                {
                    id: 'ueno_park',
                    name: { ja: '上野恩賜公園', en: 'Ueno Park', zh: '上野恩賜公園' },
                    location: { ja: '公園口 直結', en: 'Park Exit, Direct Access', zh: '公園口 直結' },
                    googleMapLink: 'https://goo.gl/maps/...'
                },
                {
                    id: 'shinobazu',
                    name: { ja: '不忍池', en: 'Shinobazu Pond', zh: '不忍池' },
                    location: { ja: '不忍口 徒歩3分', en: 'Shinobazu Exit, 3 min walk', zh: '不忍口 步行3分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                }
            ]
        },
        {
            id: 'shopping',
            label: { ja: '買い物', en: 'Shopping', zh: '購物' },
            icon: 'shopping',
            items: [
                {
                    id: 'ameayoko',
                    name: { ja: 'アメ横商店街', en: 'Ameyoko Shopping Street', zh: '阿美橫町商店街' },
                    location: { ja: '不忍口/中央改札 徒歩2分', en: 'Central/Shinobazu Exit', zh: '不忍口/中央改札 步行2分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                },
                {
                    id: 'takeya',
                    name: { ja: '多慶屋', en: 'Takeya', zh: '多慶屋' },
                    location: { ja: '広小路口 徒歩10分', en: 'Hirokoji Exit, 10 min walk', zh: '廣小路口 步行10分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                }
            ]
        },
        {
            id: 'dining',
            label: { ja: '食事', en: 'Dining', zh: '美食' },
            icon: 'dining',
            items: [
                {
                    id: 'izuei',
                    name: { ja: '伊豆栄 梅川亭', en: 'Izuei Umekawatei (Eel)', zh: '伊豆榮 梅川亭 (鰻魚飯)' },
                    location: { ja: '公園内', en: 'Inside Park', zh: '公園內' },
                    googleMapLink: 'https://goo.gl/maps/...'
                },
                {
                    id: 'usagiya',
                    name: { ja: 'うさぎや', en: 'Usagiya (Dorayaki)', zh: '兔屋 (銅鑼燒)' },
                    location: { ja: '広小路口 徒歩5分', en: 'Hirokoji Exit, 5 min walk', zh: '廣小路口 步行5分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                }
            ]
        },
        {
            id: 'leisure',
            label: { ja: 'レジャー', en: 'Leisure', zh: '休閒' },
            icon: 'leisure',
            items: [
                {
                    id: 'zoo',
                    name: { ja: '上野動物園', en: 'Ueno Zoo', zh: '上野動物園' },
                    location: { ja: '公園口 徒歩5分', en: 'Park Exit, 5 min walk', zh: '公園口 步行5分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                }
            ]
        }
    ],

    // Tokyo Station
    'odpt:Station:TokyoMetro.Tokyo': [
        {
            id: 'culture',
            label: { ja: '歴史・文化', en: 'History & Culture', zh: '歷史文化' },
            icon: 'culture',
            items: [
                {
                    id: 'imperial_palace',
                    name: { ja: '皇居', en: 'Imperial Palace', zh: '皇居' },
                    location: { ja: '丸の内中央口 徒歩10分', en: 'Marunouchi Central Exit', zh: '丸之內中央口 步行10分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                },
                {
                    id: 'station_bldg',
                    name: { ja: '赤レンガ駅舎', en: 'Red Brick Station Building', zh: '紅磚站舍' },
                    location: { ja: '丸の内口', en: 'Marunouchi Exit', zh: '丸之內口' },
                    googleMapLink: 'https://goo.gl/maps/...'
                }
            ]
        },
        {
            id: 'shopping',
            label: { ja: '買い物', en: 'Shopping', zh: '購物' },
            icon: 'shopping',
            items: [
                {
                    id: 'kitte',
                    name: { ja: 'KITTE丸の内', en: 'KITTE Marunouchi', zh: 'KITTE丸之內' },
                    location: { ja: '丸の内南口 徒歩1分', en: 'Marunouchi South Exit', zh: '丸之內南口 步行1分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                },
                {
                    id: 'yaesu_chikagai',
                    name: { ja: '八重洲地下街', en: 'Yaesu Shopping Mall', zh: '八重洲地下街' },
                    location: { ja: '八重洲口 直結', en: 'Yaesu Exit, Direct', zh: '八重洲口 直結' },
                    googleMapLink: 'https://goo.gl/maps/...'
                }
            ]
        },
        {
            id: 'dining',
            label: { ja: '食事', en: 'Dining', zh: '美食' },
            icon: 'dining',
            items: [
                {
                    id: 'ramen_street',
                    name: { ja: '東京ラーメンストリート', en: 'Tokyo Ramen Street', zh: '東京拉麵街' },
                    location: { ja: '八重洲南口 B1', en: 'Yaesu South Exit B1', zh: '八重洲南口 B1' },
                    googleMapLink: 'https://goo.gl/maps/...'
                }
            ]
        }
    ],

    // Akihabara
    'odpt:Station:JR-East.Akihabara': [
        {
            id: 'shopping',
            label: { ja: '電気・ホビー', en: 'Electric & Hobby', zh: '電器與動漫' },
            icon: 'shopping',
            items: [
                {
                    id: 'yodobashi',
                    name: { ja: 'ヨドバシAkiba', en: 'Yodobashi Camera Akiba', zh: '友都八喜 Akiba' },
                    location: { ja: '昭和通り口 直結', en: 'Showa-dori Exit', zh: '昭和通口 直結' },
                    googleMapLink: 'https://goo.gl/maps/...'
                },
                {
                    id: 'radio_kaikan',
                    name: { ja: '秋葉原ラジオ会館', en: 'Radio Kaikan', zh: '無線電會館' },
                    location: { ja: '電気街口 徒歩1分', en: 'Electric Town Exit', zh: '電器街口 步行1分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                }
            ]
        },
        {
            id: 'culture',
            label: { ja: 'サブカルチャー', en: 'Subculture', zh: '次文化' },
            icon: 'culture',
            items: [
                {
                    id: 'kanda_myoujin',
                    name: { ja: '神田明神', en: 'Kanda Myoujin Shrine', zh: '神田明神' },
                    location: { ja: '電気街口 徒歩10分', en: 'Electric Town Exit, 10 min', zh: '電器街口 步行10分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                }
            ]
        }
    ],

    // Asakusa
    'odpt:Station:TokyoMetro.Ginza.Asakusa': [
        {
            id: 'culture',
            label: { ja: '名所・旧跡', en: 'Sightseeing', zh: '名勝古蹟' },
            icon: 'culture',
            items: [
                {
                    id: 'sensoji',
                    name: { ja: '浅草寺・雷門', en: 'Senso-ji Temple / Kaminarimon', zh: '淺草寺・雷門' },
                    location: { ja: '1番出口 徒歩1分', en: 'Exit 1, 1 min walk', zh: '1號出口 步行1分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                },
                {
                    id: 'skytree',
                    name: { ja: '東京スカイツリー', en: 'Tokyo Skytree', zh: '東京晴空塔' },
                    location: { ja: '吾妻橋越えて徒歩15分', en: 'Across Azuma Bridge', zh: '過吾妻橋 步行15分' },
                    googleMapLink: 'https://goo.gl/maps/...'
                }
            ]
        },
        {
            id: 'dining',
            label: { ja: '食事', en: 'Dining', zh: '美食' },
            icon: 'dining',
            items: [
                {
                    id: 'nakamise',
                    name: { ja: '仲見世通り', en: 'Nakamise Shopping Street', zh: '仲見世商店街' },
                    location: { ja: '雷門直結', en: 'Next to Kaminarimon', zh: '雷門直結' },
                    googleMapLink: 'https://goo.gl/maps/...'
                }
            ]
        }
    ]
};
