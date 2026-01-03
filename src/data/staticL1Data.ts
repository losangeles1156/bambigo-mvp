import { L1_DNA_Data } from '@/lib/types/stationStandard';

export const STATIC_L1_DATA: Record<string, L1_DNA_Data> = {
    "odpt.Station:JR-East.Yamanote.Ueno": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 340,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "尾花",
                            "en": "Obana",
                            "zh": "尾花"
                        },
                        "osm_id": "587548265"
                    },
                    {
                        "name": {
                            "ja": "じゅらく",
                            "en": "Juraku",
                            "zh": "じゅらく"
                        },
                        "osm_id": "1363293956"
                    },
                    {
                        "name": {
                            "ja": "元祖寿司",
                            "en": "Gansozushi",
                            "zh": "元祖寿司"
                        },
                        "osm_id": "1363293958"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 192,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Ueno Zoo",
                            "en": "Ueno Zoo",
                            "zh": "Ueno Zoo"
                        },
                        "osm_id": "511712655"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "311314017"
                    },
                    {
                        "name": {
                            "ja": "ローソン",
                            "en": "Lawson",
                            "zh": "ローソン"
                        },
                        "osm_id": "1140793768"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 17,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "上野の森美術館",
                            "en": "The Ueno Royal Museum",
                            "zh": "上野の森美術館"
                        },
                        "osm_id": "441655802"
                    },
                    {
                        "name": {
                            "ja": "たいとうアートギャラリー",
                            "en": "たいとうアートギャラリー",
                            "zh": "たいとうアートギャラリー"
                        },
                        "osm_id": "4947850854"
                    },
                    {
                        "name": {
                            "ja": "トーテムポール",
                            "en": "トーテムポール",
                            "zh": "トーテムポール"
                        },
                        "osm_id": "4987605536"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 1,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "公徳公園",
                            "en": "公徳公園",
                            "zh": "公徳公園"
                        },
                        "osm_id": "304931281"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 94,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "東京地下鉄株式会社",
                            "en": "Tokyo Metro Co.",
                            "zh": "東京地下鉄株式会社"
                        },
                        "osm_id": "1420783237"
                    },
                    {
                        "name": {
                            "ja": "日本芸術院",
                            "en": "The Japan Art Academy",
                            "zh": "日本芸術院"
                        },
                        "osm_id": "4458669628"
                    },
                    {
                        "name": {
                            "ja": "鍼灸 東上野治療院",
                            "en": "鍼灸 東上野治療院",
                            "zh": "鍼灸 東上野治療院"
                        },
                        "osm_id": "4948081342"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "shitamachi_culture",
                "label": {
                    "en": "Shitamachi Culture",
                    "ja": "下町",
                    "zh": "下町"
                },
                "score": 3
            },
            {
                "id": "museum_hub",
                "label": {
                    "en": "Museum Hub",
                    "ja": "Museum Hub",
                    "zh": "Museum Hub"
                },
                "score": 3
            },
            {
                "id": "ameyoko_market",
                "label": {
                    "en": "Ameyoko Market",
                    "ja": "Ameyoko Market",
                    "zh": "Ameyoko Market"
                },
                "score": 3
            },
            {
                "id": "transport_hub",
                "label": {
                    "en": "Transport Hub",
                    "ja": "Transport Hub",
                    "zh": "Transport Hub"
                },
                "score": 3
            },
            {
                "id": "izakaya",
                "label": {
                    "en": "Izakaya Alleys",
                    "ja": "飲み屋街",
                    "zh": "居酒屋街"
                },
                "score": 4
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "family_friendly",
                "label": {
                    "en": "Family Friendly",
                    "ja": "家族向け",
                    "zh": "親子友善"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "business",
                "label": {
                    "en": "Business District",
                    "ja": "ビジネス街",
                    "zh": "商業區"
                },
                "score": 4
            },
            {
                "id": "culture",
                "label": {
                    "en": "Cultural Hub",
                    "ja": "文化の中心",
                    "zh": "文化中心"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.257Z"
    },
    "odpt.Station:JR-East.Yamanote.Tokyo": {
        "categories": {
            "shopping": {
                "id": "shopping",
                "count": 100,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ローソン",
                            "en": "Lawson",
                            "zh": "罗森便利店"
                        },
                        "osm_id": "1952141255"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "2065895712"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "2065895720"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 13,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "東京ステーションホテル",
                            "en": "Tokyo Station Hotel",
                            "zh": "東京車站大飯店"
                        },
                        "osm_id": "3555300496"
                    },
                    {
                        "name": {
                            "ja": "スーパーホテルLOHAS",
                            "en": "Lohas Hotel",
                            "zh": "スーパーホテルLOHAS"
                        },
                        "osm_id": "4514611786"
                    },
                    {
                        "name": {
                            "ja": "シャングリ・ラ ホテル",
                            "en": "シャングリ・ラ ホテル",
                            "zh": "シャングリ・ラ ホテル"
                        },
                        "osm_id": "5807637069"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 12,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "オベリスク・ジラフ",
                            "en": "Obelisk Giraffe",
                            "zh": "オベリスク・ジラフ"
                        },
                        "osm_id": "1423728722"
                    },
                    {
                        "name": {
                            "ja": "東京ステーションギャラリー",
                            "en": "Tokyo Station Gallery",
                            "zh": "東京車站畫廊"
                        },
                        "osm_id": "3164340661"
                    },
                    {
                        "name": {
                            "ja": "相田みつを美術館",
                            "en": "Mitsuo Aida Museum",
                            "zh": "相田みつを美術館"
                        },
                        "osm_id": "3666894176"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 24,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "FinoLab Tokyo",
                            "en": "FinoLab Tokyo",
                            "zh": "FinoLab Tokyo"
                        },
                        "osm_id": "4184769090"
                    },
                    {
                        "name": {
                            "ja": "Bain & Company",
                            "en": "Bain & Company",
                            "zh": "Bain & Company"
                        },
                        "osm_id": "4499697002"
                    },
                    {
                        "name": {
                            "ja": "新日鐵住金株式会社",
                            "en": "Nippon Steel & Sumitomo Metal Corporation",
                            "zh": "新日鐵住金株式會社"
                        },
                        "osm_id": "4634759102"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "capital_gateway",
                "label": {
                    "en": "Capital Gateway",
                    "ja": "Capital Gateway",
                    "zh": "Capital Gateway"
                },
                "score": 3
            },
            {
                "id": "business",
                "label": {
                    "en": "Business District",
                    "ja": "ビジネス街",
                    "zh": "商業區"
                },
                "score": 4
            },
            {
                "id": "historical_architecture",
                "label": {
                    "en": "Historical Architecture",
                    "ja": "Historical Architecture",
                    "zh": "Historical Architecture"
                },
                "score": 3
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Local Gourmet",
                    "ja": "ご当地グルメ",
                    "zh": "在地美食"
                },
                "score": 4
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "culture",
                "label": {
                    "en": "Cultural Hub",
                    "ja": "文化の中心",
                    "zh": "文化中心"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.258Z"
    },
    "odpt.Station:JR-East.Yamanote.Akihabara": {
        "categories": {
            "shopping": {
                "id": "shopping",
                "count": 555,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "オフィスコム",
                            "en": "Office-com",
                            "zh": "オフィスコム"
                        },
                        "osm_id": "1231861281"
                    },
                    {
                        "name": {
                            "ja": "文化堂",
                            "en": "Bunkado",
                            "zh": "文化堂"
                        },
                        "osm_id": "1231861289"
                    },
                    {
                        "name": {
                            "ja": "にっしんカメラ",
                            "en": "Nisshin Camera",
                            "zh": "にっしんカメラ"
                        },
                        "osm_id": "1636556390"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 27,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "秋葉原ワシントンホテル",
                            "en": "Akihabara Washington Hotel",
                            "zh": "秋葉原ワシントンホテル"
                        },
                        "osm_id": "1986281360"
                    },
                    {
                        "name": {
                            "ja": "レム秋葉原",
                            "en": "remm AKIHABARA",
                            "zh": "レム秋葉原"
                        },
                        "osm_id": "2021389287"
                    },
                    {
                        "name": {
                            "ja": "豪華 カプセルホテル安心お宿",
                            "en": "Capsule Hotel Anshin Oyado",
                            "zh": "豪華 カプセルホテル安心お宿"
                        },
                        "osm_id": "2271379722"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 4,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "秋葉原公園",
                            "en": "秋葉原公園",
                            "zh": "秋葉原公園"
                        },
                        "osm_id": "47127861"
                    },
                    {
                        "name": {
                            "ja": "秋葉原中央令和広場",
                            "en": "Akihabara chuo reiwa Hiroba",
                            "zh": "秋葉原中央令和広場"
                        },
                        "osm_id": "143144113"
                    },
                    {
                        "name": {
                            "ja": "芳林公園",
                            "en": "Horin Park",
                            "zh": "芳林公園"
                        },
                        "osm_id": "173230197"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 229,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "秋月電子通商",
                            "en": "Akizuki Electronic Trade (Akizuki Denshi)",
                            "zh": "秋月電子通商"
                        },
                        "osm_id": "2059303799"
                    },
                    {
                        "name": {
                            "ja": "OraOrA!",
                            "en": "OraOrA!",
                            "zh": "OraOrA!"
                        },
                        "osm_id": "3607126008"
                    },
                    {
                        "name": {
                            "ja": "日本ソフテック(株)",
                            "en": "Nihon Softech Inc.",
                            "zh": "日本ソフテック(株)"
                        },
                        "osm_id": "4012257155"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "electric_town",
                "label": {
                    "en": "Electric Town",
                    "ja": "Electric Town",
                    "zh": "Electric Town"
                },
                "score": 3
            },
            {
                "id": "otaku_culture",
                "label": {
                    "en": "Otaku Culture",
                    "ja": "Otaku Culture",
                    "zh": "Otaku Culture"
                },
                "score": 3
            },
            {
                "id": "maid_cafe",
                "label": {
                    "en": "Maid Cafe",
                    "ja": "Maid Cafe",
                    "zh": "Maid Cafe"
                },
                "score": 3
            },
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "book_town",
                "label": {
                    "en": "Book Town",
                    "ja": "本の街",
                    "zh": "書街"
                },
                "score": 5
            },
            {
                "id": "electronics",
                "label": {
                    "en": "Electronics District",
                    "ja": "電気街",
                    "zh": "電器街"
                },
                "score": 5
            },
            {
                "id": "otaku",
                "label": {
                    "en": "Otaku Culture",
                    "ja": "オタク文化",
                    "zh": "御宅文化"
                },
                "score": 5
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "power_spot",
                "label": {
                    "en": "Power Spot",
                    "ja": "パワースポット",
                    "zh": "能量景點"
                },
                "score": 3
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "business",
                "label": {
                    "en": "Business District",
                    "ja": "ビジネス街",
                    "zh": "商業區"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.258Z"
    },
    "odpt.Station:TokyoMetro.Ginza.Asakusa": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 359,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "神谷バー",
                            "en": "Kamiya Bar",
                            "zh": "神谷酒吧"
                        },
                        "osm_id": "1138633140"
                    },
                    {
                        "name": {
                            "ja": "十味 小野屋",
                            "en": "Onoya",
                            "zh": "十味 小野屋"
                        },
                        "osm_id": "1148542955"
                    },
                    {
                        "name": {
                            "ja": "大黒屋",
                            "en": "Daikokuya",
                            "zh": "大黒屋"
                        },
                        "osm_id": "1148542956"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 57,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "浅草リトルシアター (Asakusa little theatre)",
                            "en": "Asakusa Mokuba-kan",
                            "zh": "浅草リトルシアター (Asakusa little theatre)"
                        },
                        "osm_id": "1148543032"
                    },
                    {
                        "name": {
                            "ja": "浅草公会堂",
                            "en": "Asakusa Kokaido Theater",
                            "zh": "浅草公会堂"
                        },
                        "osm_id": "1834911434"
                    },
                    {
                        "name": {
                            "ja": "ちいさな硝子の本の博物館",
                            "en": "Little Museum of Glass Books",
                            "zh": "ちいさな硝子の本の博物館"
                        },
                        "osm_id": "2528816507"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 4,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "駒形橋ポケットパーク",
                            "en": "駒形橋ポケットパーク",
                            "zh": "駒形橋ポケットパーク"
                        },
                        "osm_id": "1043647218"
                    },
                    {
                        "name": {
                            "ja": "雷門中部ポケットパーク",
                            "en": "雷門中部ポケットパーク",
                            "zh": "雷門中部ポケットパーク"
                        },
                        "osm_id": "1043647221"
                    },
                    {
                        "name": {
                            "ja": "弁天山児童公園",
                            "en": "Benten'yama Children's Playground",
                            "zh": "弁天山児童公園"
                        },
                        "osm_id": "1043662947"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "traditional_japan",
                "label": {
                    "en": "Traditional Japan",
                    "ja": "Traditional Japan",
                    "zh": "Traditional Japan"
                },
                "score": 3
            },
            {
                "id": "sightseeing_hub",
                "label": {
                    "en": "Sightseeing Hub",
                    "ja": "Sightseeing Hub",
                    "zh": "Sightseeing Hub"
                },
                "score": 3
            },
            {
                "id": "senso-ji_temple",
                "label": {
                    "en": "Senso-ji Temple",
                    "ja": "Senso-ji Temple",
                    "zh": "Senso-ji Temple"
                },
                "score": 3
            },
            {
                "id": "high_end",
                "label": {
                    "en": "High-end",
                    "ja": "高級・洗練",
                    "zh": "高級時尚"
                },
                "score": 4
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "family_friendly",
                "label": {
                    "en": "Family Friendly",
                    "ja": "家族向け",
                    "zh": "親子友善"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "culture",
                "label": {
                    "en": "Cultural Hub",
                    "ja": "文化の中心",
                    "zh": "文化中心"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.258Z"
    },
    "odpt.Station:JR-East.Yamanote.Shibuya": {
        "categories": {
            "shopping": {
                "id": "shopping",
                "count": 356,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ローソン",
                            "en": "Lawson",
                            "zh": "ローソン"
                        },
                        "osm_id": "701831694"
                    },
                    {
                        "name": {
                            "ja": "ミニストップ",
                            "en": "Ministop",
                            "zh": "ミニストップ"
                        },
                        "osm_id": "742561064"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "752870658"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 10,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ホテルメッツ渋谷",
                            "en": "Hotel Mets Shibuya",
                            "zh": "ホテルメッツ渋谷"
                        },
                        "osm_id": "744436432"
                    },
                    {
                        "name": {
                            "ja": "Tokyu Inn",
                            "en": "Tokyu Inn",
                            "zh": "Tokyu Inn"
                        },
                        "osm_id": "1681422026"
                    },
                    {
                        "name": {
                            "ja": "capsule hotel et sauna",
                            "en": "capsule hotel et sauna",
                            "zh": "capsule hotel et sauna"
                        },
                        "osm_id": "5745319923"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 4,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "渋谷区立桜丘公園",
                            "en": "渋谷区立桜丘公園",
                            "zh": "渋谷区立桜丘公園"
                        },
                        "osm_id": "310367830"
                    },
                    {
                        "name": {
                            "ja": "鶯谷児童遊園",
                            "en": "Uguisudani Children's Playground",
                            "zh": "鶯谷児童遊園"
                        },
                        "osm_id": "51768123"
                    },
                    {
                        "name": {
                            "ja": "宮下公園",
                            "en": "Miyashita Park",
                            "zh": "宮下公園"
                        },
                        "osm_id": "116806278"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 65,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "道玄坂上交番前",
                            "en": "Dougenzakaue Koban",
                            "zh": "道玄坂上交番前"
                        },
                        "osm_id": "356644261"
                    },
                    {
                        "name": {
                            "ja": "るーむぴあ",
                            "en": "るーむぴあ",
                            "zh": "るーむぴあ"
                        },
                        "osm_id": "1657287406"
                    },
                    {
                        "name": {
                            "ja": "マックス総合税理士法人",
                            "en": "Max General Tax Accountant Office",
                            "zh": "マックス総合税理士法人"
                        },
                        "osm_id": "1681422079"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "youth_culture",
                "label": {
                    "en": "Youth Culture",
                    "ja": "Youth Culture",
                    "zh": "Youth Culture"
                },
                "score": 3
            },
            {
                "id": "it_hub",
                "label": {
                    "en": "IT Hub",
                    "ja": "Bit Valley",
                    "zh": "Bit Valley"
                },
                "score": 3
            },
            {
                "id": "fashion_center",
                "label": {
                    "en": "Fashion Center",
                    "ja": "Fashion Center",
                    "zh": "Fashion Center"
                },
                "score": 3
            },
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "otaku",
                "label": {
                    "en": "Otaku Culture",
                    "ja": "オタク文化",
                    "zh": "御宅文化"
                },
                "score": 5
            },
            {
                "id": "high_end",
                "label": {
                    "en": "High-end",
                    "ja": "高級・洗練",
                    "zh": "高級時尚"
                },
                "score": 4
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "family_friendly",
                "label": {
                    "en": "Family Friendly",
                    "ja": "家族向け",
                    "zh": "親子友善"
                },
                "score": 4
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "business",
                "label": {
                    "en": "Business District",
                    "ja": "ビジネス街",
                    "zh": "商業區"
                },
                "score": 4
            },
            {
                "id": "sakura",
                "label": {
                    "en": "Sakura Spot",
                    "ja": "桜の名所",
                    "zh": "賞櫻勝地"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.258Z"
    },
    "odpt.Station:JR-East.Yamanote.Shinjuku": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 443,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ファーストキッチン",
                            "en": "First Kitchen",
                            "zh": "ファーストキッチン"
                        },
                        "osm_id": "701888150"
                    },
                    {
                        "name": {
                            "ja": "長崎ちゃんぽん",
                            "en": "長崎ちゃんぽん",
                            "zh": "長崎ちゃんぽん"
                        },
                        "osm_id": "810644324"
                    },
                    {
                        "name": {
                            "ja": "ケンタッキーフライドチキン",
                            "en": "KFC",
                            "zh": "ケンタッキーフライドチキン"
                        },
                        "osm_id": "1189983634"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 8,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "小田急ホテルセンチュリーサザンタワー",
                            "en": "小田急ホテルセンチュリーサザンタワー",
                            "zh": "小田急ホテルセンチュリーサザンタワー"
                        },
                        "osm_id": "475090903"
                    },
                    {
                        "name": {
                            "ja": "Shinjuku Park Hotel",
                            "en": "Shinjuku Park Hotel",
                            "zh": "Shinjuku Park Hotel"
                        },
                        "osm_id": "475090915"
                    },
                    {
                        "name": {
                            "ja": "ホテルサンルートプラザ新宿",
                            "en": "Hotel Sunroute Plaza Shinjuku",
                            "zh": "新宿灿路都广场大饭店"
                        },
                        "osm_id": "475090929"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 11,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "東南口",
                            "en": "South East Exit",
                            "zh": "東南口"
                        },
                        "osm_id": "4527484490"
                    },
                    {
                        "name": {
                            "ja": "シネマカリテ",
                            "en": "シネマカリテ",
                            "zh": "シネマカリテ"
                        },
                        "osm_id": "4794783928"
                    },
                    {
                        "name": {
                            "ja": "新宿武蔵野館",
                            "en": "Shinjuku Musashinokan",
                            "zh": "新宿武蔵野館"
                        },
                        "osm_id": "4794783930"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 15,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Virgin Records Shinjuku",
                            "en": "Virgin Records Shinjuku",
                            "zh": "Virgin Records Shinjuku"
                        },
                        "osm_id": "475090946"
                    },
                    {
                        "name": {
                            "ja": "エーアイアール",
                            "en": "AIR",
                            "zh": "エーアイアール"
                        },
                        "osm_id": "1721357535"
                    },
                    {
                        "name": {
                            "ja": "日建ホーム",
                            "en": "日建ホーム",
                            "zh": "日建ホーム"
                        },
                        "osm_id": "2175070333"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "mega_terminal",
                "label": {
                    "en": "Mega Terminal",
                    "ja": "Mega Terminal",
                    "zh": "Mega Terminal"
                },
                "score": 3
            },
            {
                "id": "skyscraper_district",
                "label": {
                    "en": "Skyscraper District",
                    "ja": "Skyscraper District",
                    "zh": "Skyscraper District"
                },
                "score": 3
            },
            {
                "id": "nightlife",
                "label": {
                    "en": "Nightlife",
                    "ja": "Kabukicho",
                    "zh": "Kabukicho"
                },
                "score": 3
            },
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "izakaya",
                "label": {
                    "en": "Izakaya Alleys",
                    "ja": "飲み屋街",
                    "zh": "居酒屋街"
                },
                "score": 4
            },
            {
                "id": "high_end",
                "label": {
                    "en": "High-end",
                    "ja": "高級・洗練",
                    "zh": "高級時尚"
                },
                "score": 4
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "culture",
                "label": {
                    "en": "Cultural Hub",
                    "ja": "文化の中心",
                    "zh": "文化中心"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.258Z"
    },
    "odpt.Station:JR-East.Yamanote.Ikebukuro": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 349,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "マクドナルド",
                            "en": "McDonald's",
                            "zh": "マクドナルド"
                        },
                        "osm_id": "1028198939"
                    },
                    {
                        "name": {
                            "ja": "伯爵",
                            "en": "Hakushaku",
                            "zh": "伯爵"
                        },
                        "osm_id": "1028199578"
                    },
                    {
                        "name": {
                            "ja": "サブウェイ",
                            "en": "Subway",
                            "zh": "サブウェイ"
                        },
                        "osm_id": "1262280813"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 286,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "1028199658"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "1028199672"
                    },
                    {
                        "name": {
                            "ja": "ジュンク堂書店",
                            "en": "Junkudo",
                            "zh": "ジュンク堂書店"
                        },
                        "osm_id": "1262291400"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 12,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "伝統工芸 青山スクエア",
                            "en": "Japan Traditional Crafts Centre",
                            "zh": "伝統工芸 青山スクエア"
                        },
                        "osm_id": "251055430"
                    },
                    {
                        "name": {
                            "ja": "池袋HUMAXシネマズ",
                            "en": "Humax Cinema",
                            "zh": "池袋HUMAXシネマズ"
                        },
                        "osm_id": "1316303077"
                    },
                    {
                        "name": {
                            "ja": "豊島区立郷土資料館",
                            "en": "Toshima City Local Museum",
                            "zh": "豊島区立郷土資料館"
                        },
                        "osm_id": "1420798090"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 22,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "自動車税総合事務所",
                            "en": "自動車税総合事務所",
                            "zh": "自動車税総合事務所"
                        },
                        "osm_id": "1420785302"
                    },
                    {
                        "name": {
                            "ja": "豊島都税事務所",
                            "en": "豊島都税事務所",
                            "zh": "豊島都税事務所"
                        },
                        "osm_id": "1420785305"
                    },
                    {
                        "name": {
                            "ja": "池袋社会保険事務所",
                            "en": "Ikebukuro Social Insurance Office",
                            "zh": "池袋社会保険事務所"
                        },
                        "osm_id": "1420787789"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "subcenter",
                "label": {
                    "en": "Subcenter",
                    "ja": "Subcenter",
                    "zh": "Subcenter"
                },
                "score": 3
            },
            {
                "id": "otome_road",
                "label": {
                    "en": "Otome Road",
                    "ja": "Otome Road",
                    "zh": "Otome Road"
                },
                "score": 3
            },
            {
                "id": "department_store_battleground",
                "label": {
                    "en": "Department Store Battleground",
                    "ja": "Department Store Battleground",
                    "zh": "Department Store Battleground"
                },
                "score": 3
            },
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "high_end",
                "label": {
                    "en": "High-end",
                    "ja": "高級・洗練",
                    "zh": "高級時尚"
                },
                "score": 4
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "subculture",
                "label": {
                    "en": "Subculture",
                    "ja": "サブカルチャー",
                    "zh": "亞文化"
                },
                "score": 4
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "family_friendly",
                "label": {
                    "en": "Family Friendly",
                    "ja": "家族向け",
                    "zh": "親子友善"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "culture",
                "label": {
                    "en": "Cultural Hub",
                    "ja": "文化の中心",
                    "zh": "文化中心"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.258Z"
    },
    "odpt.Station:TokyoMetro.Hibiya.Roppongi": {
        "categories": {
            "shopping": {
                "id": "shopping",
                "count": 101,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ADEAM Tokyo Midtown",
                            "en": "ADEAM Tokyo Midtown",
                            "zh": "ADEAM Tokyo Midtown"
                        },
                        "osm_id": "7010473737"
                    },
                    {
                        "name": {
                            "ja": "フォルクスワーゲン六本木",
                            "en": "Volkswagen",
                            "zh": "フォルクスワーゲン六本木"
                        },
                        "osm_id": "439115834"
                    },
                    {
                        "name": {
                            "ja": "ソフトバンクショップ",
                            "en": "SoftBank Shop",
                            "zh": "ソフトバンクショップ"
                        },
                        "osm_id": "1509875969"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 5,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Remm Roppongi",
                            "en": "Remm Roppongi",
                            "zh": "Remm Roppongi"
                        },
                        "osm_id": "1509875950"
                    },
                    {
                        "name": {
                            "ja": "the b roppongi",
                            "en": "the b roppongi",
                            "zh": "the b roppongi"
                        },
                        "osm_id": "2331421946"
                    },
                    {
                        "name": {
                            "ja": "Candeo Hotel",
                            "en": "Candeo Hotel",
                            "zh": "Candeo Hotel"
                        },
                        "osm_id": "5593429454"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 10,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "森美術館",
                            "en": "Mori Art Museum",
                            "zh": "森美術館"
                        },
                        "osm_id": "1420786660"
                    },
                    {
                        "name": {
                            "ja": "俳優座劇場",
                            "en": "Haiyuzagekijou",
                            "zh": "俳優座劇場"
                        },
                        "osm_id": "1834960283"
                    },
                    {
                        "name": {
                            "ja": "Key to a dream",
                            "en": "Key to a dream",
                            "zh": "Key to a dream"
                        },
                        "osm_id": "4294058475"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 47,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "シリア・アラブ共和国大使館",
                            "en": "Embassy of the Syrian Arab Rebublic",
                            "zh": "シリア・アラブ共和国大使館"
                        },
                        "osm_id": "556475731"
                    },
                    {
                        "name": {
                            "ja": "アリエルネットワーク株式会社",
                            "en": "Ariel Network",
                            "zh": "アリエルネットワーク株式会社"
                        },
                        "osm_id": "1671699568"
                    },
                    {
                        "name": {
                            "ja": "Mozilla Japan",
                            "en": "Mozilla Japan",
                            "zh": "Mozilla Japan"
                        },
                        "osm_id": "2240310416"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "art_triangle",
                "label": {
                    "en": "Art Triangle",
                    "ja": "Art Triangle",
                    "zh": "Art Triangle"
                },
                "score": 3
            },
            {
                "id": "international_hub",
                "label": {
                    "en": "International Hub",
                    "ja": "International Hub",
                    "zh": "International Hub"
                },
                "score": 3
            },
            {
                "id": "nightlife",
                "label": {
                    "en": "Nightlife",
                    "ja": "Nightlife",
                    "zh": "Nightlife"
                },
                "score": 3
            },
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "culture",
                "label": {
                    "en": "Cultural Hub",
                    "ja": "文化の中心",
                    "zh": "文化中心"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.258Z"
    },
    "odpt.Station:TokyoMetro.Ginza.Ginza": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 386,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "カフェ・ベローチェ",
                            "en": "CAFE VELOCE",
                            "zh": "カフェ・ベローチェ"
                        },
                        "osm_id": "585164417"
                    },
                    {
                        "name": {
                            "ja": "サンマルクカフェ",
                            "en": "Saint Marc Cafe",
                            "zh": "サンマルクカフェ"
                        },
                        "osm_id": "1195197103"
                    },
                    {
                        "name": {
                            "ja": "ドトールコーヒーショップ",
                            "en": "Doutor Coffee Shop",
                            "zh": "ドトールコーヒーショップ"
                        },
                        "osm_id": "1195197230"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 28,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "京橋社会保険事務所",
                            "en": "Kyobashi Social Insurance Office",
                            "zh": "京橋社会保険事務所"
                        },
                        "osm_id": "1420766808"
                    },
                    {
                        "name": {
                            "ja": "阪神高速道路株式会社東京事務所",
                            "en": "阪神高速道路株式会社東京事務所",
                            "zh": "阪神高速道路株式会社東京事務所"
                        },
                        "osm_id": "1420799619"
                    },
                    {
                        "name": {
                            "ja": "ノエビア",
                            "en": "Noevir",
                            "zh": "ノエビア"
                        },
                        "osm_id": "2018185419"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "luxury_shopping",
                "label": {
                    "en": "Luxury Shopping",
                    "ja": "Luxury Shopping",
                    "zh": "Luxury Shopping"
                },
                "score": 3
            },
            {
                "id": "high-end_dining",
                "label": {
                    "en": "High-end Dining",
                    "ja": "High-end Dining",
                    "zh": "High-end Dining"
                },
                "score": 3
            },
            {
                "id": "gallery",
                "label": {
                    "en": "Gallery",
                    "ja": "Gallery",
                    "zh": "Gallery"
                },
                "score": 3
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.258Z"
    },
    "odpt.Station:JR-East.Yamanote.Shimbashi": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 310,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "マクドナルド",
                            "en": "McDonald's",
                            "zh": "マクドナルド"
                        },
                        "osm_id": "260424116"
                    },
                    {
                        "name": {
                            "ja": "月島",
                            "en": "Tsukishima",
                            "zh": "月島"
                        },
                        "osm_id": "474605284"
                    },
                    {
                        "name": {
                            "ja": "モスバーガー",
                            "en": "MOS Burger",
                            "zh": "モスバーガー"
                        },
                        "osm_id": "474605287"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 157,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "文教堂",
                            "en": "Bunkyodo",
                            "zh": "文教堂"
                        },
                        "osm_id": "260423690"
                    },
                    {
                        "name": {
                            "ja": "LABI",
                            "en": "LABI",
                            "zh": "LABI"
                        },
                        "osm_id": "260424181"
                    },
                    {
                        "name": {
                            "ja": "キムラヤ",
                            "en": "Kimuraya",
                            "zh": "キムラヤ"
                        },
                        "osm_id": "260424208"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 12,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "旧新橋停車場鉄道歴史展示室",
                            "en": "Old Shimbashi Station Railway History Exhibition Hall",
                            "zh": "旧新橋停車場鉄道歴史展示室"
                        },
                        "osm_id": "820849494"
                    },
                    {
                        "name": {
                            "ja": "ヤマハホール",
                            "en": "Yamaha Hall",
                            "zh": "ヤマハホール"
                        },
                        "osm_id": "1195197202"
                    },
                    {
                        "name": {
                            "ja": "パナソニック汐留美術館",
                            "en": "Panasonic Shiodome Museum of Art",
                            "zh": "パナソニック汐留美術館"
                        },
                        "osm_id": "1420786016"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 3,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "南桜公園",
                            "en": "Minamisakura Park",
                            "zh": "南桜公園"
                        },
                        "osm_id": "151332916"
                    },
                    {
                        "name": {
                            "ja": "桜田公園",
                            "en": "桜田公園",
                            "zh": "桜田公園"
                        },
                        "osm_id": "151336680"
                    },
                    {
                        "name": {
                            "ja": "塩釜公園",
                            "en": "塩釜公園",
                            "zh": "塩釜公園"
                        },
                        "osm_id": "151350610"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "izakaya",
                "label": {
                    "en": "Izakaya Alleys",
                    "ja": "飲み屋街",
                    "zh": "居酒屋街"
                },
                "score": 4
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "subculture",
                "label": {
                    "en": "Subculture",
                    "ja": "サブカルチャー",
                    "zh": "亞文化"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "culture",
                "label": {
                    "en": "Cultural Hub",
                    "ja": "文化の中心",
                    "zh": "文化中心"
                },
                "score": 4
            },
            {
                "id": "sakura",
                "label": {
                    "en": "Sakura Spot",
                    "ja": "桜の名所",
                    "zh": "賞櫻勝地"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.258Z"
    },
    "odpt.Station:TokyoMetro.Chiyoda.Otemachi": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 66,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "DAY・NITE大手町店",
                            "en": "Day Nite",
                            "zh": "DAY・NITE大手町店"
                        },
                        "osm_id": "1484520147"
                    },
                    {
                        "name": {
                            "ja": "スターバックス",
                            "en": "Starbucks",
                            "zh": "スターバックス"
                        },
                        "osm_id": "1952090142"
                    },
                    {
                        "name": {
                            "ja": "スターバックス",
                            "en": "Starbucks",
                            "zh": "星巴克"
                        },
                        "osm_id": "1952091400"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 33,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ローソン",
                            "en": "Lawson",
                            "zh": "罗森便利店"
                        },
                        "osm_id": "1952141255"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "2065895720"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "2065895733"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 2,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "東京ステーションホテル",
                            "en": "Tokyo Station Hotel",
                            "zh": "東京車站大飯店"
                        },
                        "osm_id": "3555300496"
                    },
                    {
                        "name": {
                            "ja": "星のや東京",
                            "en": "HOSHINOYA Tokyo",
                            "zh": "星のや東京"
                        },
                        "osm_id": "10225282430"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 8,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "東京ステーションギャラリー",
                            "en": "Tokyo Station Gallery",
                            "zh": "東京車站畫廊"
                        },
                        "osm_id": "3164340661"
                    },
                    {
                        "name": {
                            "ja": "イリアッド・ジャパン",
                            "en": "Iliad Japan",
                            "zh": "イリアッド・ジャパン"
                        },
                        "osm_id": "5164721121"
                    },
                    {
                        "name": {
                            "ja": "TOWER OF CONNECT",
                            "en": "TOWER OF CONNECT",
                            "zh": "TOWER OF CONNECT"
                        },
                        "osm_id": "5246522559"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 27,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "FinoLab Tokyo",
                            "en": "FinoLab Tokyo",
                            "zh": "FinoLab Tokyo"
                        },
                        "osm_id": "4184769090"
                    },
                    {
                        "name": {
                            "ja": "ブルームバーグLP",
                            "en": "Bloomberg LP",
                            "zh": "ブルームバーグLP"
                        },
                        "osm_id": "5358926522"
                    },
                    {
                        "name": {
                            "ja": "FIS Global",
                            "en": "FIS Global",
                            "zh": "FIS Global"
                        },
                        "osm_id": "6021650800"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "financial_district",
                "label": {
                    "en": "Financial District",
                    "ja": "Financial District",
                    "zh": "Financial District"
                },
                "score": 3
            },
            {
                "id": "media_hub",
                "label": {
                    "en": "Media Hub",
                    "ja": "Media Hub",
                    "zh": "Media Hub"
                },
                "score": 3
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.258Z"
    },
    "odpt.Station:JR-East.Yamanote.Harajuku": {
        "categories": {
            "accommodation": {
                "id": "accommodation",
                "count": 1,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Tokyu Plaza Harajuku",
                            "en": "Tokyu Plaza Harajuku",
                            "zh": "Tokyu Plaza Harajuku"
                        },
                        "osm_id": "11846679884"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 5,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "太田記念美術館",
                            "en": "Ota Memorial Museum of Art",
                            "zh": "太田記念美術館"
                        },
                        "osm_id": "1420774658"
                    },
                    {
                        "name": {
                            "ja": "渋谷区立中央図書館",
                            "en": "Shibuya Central Library",
                            "zh": "渋谷区立中央図書館"
                        },
                        "osm_id": "1420789147"
                    },
                    {
                        "name": {
                            "ja": "fACING tIME",
                            "en": "fACING tIME",
                            "zh": "fACING tIME"
                        },
                        "osm_id": "2442701439"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 4,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "YOYOGI Park 都立代々木公園",
                            "en": "YOYOGI Park 都立代々木公園",
                            "zh": "YOYOGI Park 都立代々木公園"
                        },
                        "osm_id": "1029462259"
                    },
                    {
                        "name": {
                            "ja": "Tokyo Plaza Harajuku 5F",
                            "en": "Tokyo Plaza Harajuku 5F",
                            "zh": "Tokyo Plaza Harajuku 5F"
                        },
                        "osm_id": "1332592363"
                    },
                    {
                        "name": {
                            "ja": "Tokyo Plaza Harajuku 6F",
                            "en": "Tokyo Plaza Harajuku 6F",
                            "zh": "Tokyo Plaza Harajuku 6F"
                        },
                        "osm_id": "1332592364"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "kawaii_culture",
                "label": {
                    "en": "Kawaii Culture",
                    "ja": "Kawaii Culture",
                    "zh": "Kawaii Culture"
                },
                "score": 3
            },
            {
                "id": "fashion_trend",
                "label": {
                    "en": "Fashion Trend",
                    "ja": "Fashion Trend",
                    "zh": "Fashion Trend"
                },
                "score": 3
            },
            {
                "id": "spiritual_forest",
                "label": {
                    "en": "Spiritual Forest",
                    "ja": "Spiritual Forest",
                    "zh": "Spiritual Forest"
                },
                "score": 3
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "family_friendly",
                "label": {
                    "en": "Family Friendly",
                    "ja": "家族向け",
                    "zh": "親子友善"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Chuo.Nakano": {
        "categories": {
            "culture": {
                "id": "culture",
                "count": 9,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "劇場MOMO",
                            "en": "Gekijo MOMO",
                            "zh": "劇場MOMO"
                        },
                        "osm_id": "1834907976"
                    },
                    {
                        "name": {
                            "ja": "劇場HOPE",
                            "en": "劇場HOPE",
                            "zh": "劇場HOPE"
                        },
                        "osm_id": "1834908026"
                    },
                    {
                        "name": {
                            "ja": "ザ・ポケット",
                            "en": "The Pocket",
                            "zh": "ザ・ポケット"
                        },
                        "osm_id": "1834908028"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 10,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "丘の上のひろば",
                            "en": "丘の上のひろば",
                            "zh": "丘の上のひろば"
                        },
                        "osm_id": "13386877141"
                    },
                    {
                        "name": {
                            "ja": "紅葉山公園",
                            "en": "紅葉山公園",
                            "zh": "紅葉山公園"
                        },
                        "osm_id": "51561079"
                    },
                    {
                        "name": {
                            "ja": "区立 あじさい公園",
                            "en": "Ajisai Park",
                            "zh": "区立 あじさい公園"
                        },
                        "osm_id": "142559866"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 32,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "東京国税局 中野税務署",
                            "en": "東京国税局 中野税務署",
                            "zh": "東京国税局 中野税務署"
                        },
                        "osm_id": "1420782954"
                    },
                    {
                        "name": {
                            "ja": "ヘーベルROOMS",
                            "en": "ヘーベルROOMS",
                            "zh": "ヘーベルROOMS"
                        },
                        "osm_id": "3667863689"
                    },
                    {
                        "name": {
                            "ja": "オクト・ホーム",
                            "en": "オクト・ホーム",
                            "zh": "オクト・ホーム"
                        },
                        "osm_id": "3667974375"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "subculture_arcade",
                "label": {
                    "en": "Subculture Arcade",
                    "ja": "Subculture Arcade",
                    "zh": "Subculture Arcade"
                },
                "score": 3
            },
            {
                "id": "broadway",
                "label": {
                    "en": "Broadway",
                    "ja": "Broadway",
                    "zh": "Broadway"
                },
                "score": 3
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:Toei.Shinjuku.Jimbocho": {
        "categories": {
            "shopping": {
                "id": "shopping",
                "count": 268,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "三省堂書店",
                            "en": "Books Sanseido",
                            "zh": "三省堂書店"
                        },
                        "osm_id": "810027436"
                    },
                    {
                        "name": {
                            "ja": "明倫館書店",
                            "en": "Meirinkan Bookstore",
                            "zh": "明倫館書店"
                        },
                        "osm_id": "810027463"
                    },
                    {
                        "name": {
                            "ja": "みわ書房",
                            "en": "Miwa Book Store",
                            "zh": "みわ書房"
                        },
                        "osm_id": "1276856510"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 9,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "アパホテル神保町",
                            "en": "APA Hotel Jimbocho",
                            "zh": "アパホテル神保町"
                        },
                        "osm_id": "3768549331"
                    },
                    {
                        "name": {
                            "ja": "山の上ホテル",
                            "en": "Hilltop Hotel",
                            "zh": "山の上ホテル"
                        },
                        "osm_id": "3888784785"
                    },
                    {
                        "name": {
                            "ja": "ＹＭＣＡアジア青少年センター",
                            "en": "ＹＭＣＡアジア青少年センター",
                            "zh": "ＹＭＣＡアジア青少年センター"
                        },
                        "osm_id": "5825917523"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 17,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "千代田区立千代田図書館",
                            "en": "Chiyoda Library",
                            "zh": "千代田区立千代田図書館"
                        },
                        "osm_id": "1420770187"
                    },
                    {
                        "name": {
                            "ja": "明治大学博物館",
                            "en": "Meiji University Museum",
                            "zh": "明治大学博物館"
                        },
                        "osm_id": "1420781347"
                    },
                    {
                        "name": {
                            "ja": "日本大学経済学部図書館",
                            "en": "日本大学経済学部図書館",
                            "zh": "日本大学経済学部図書館"
                        },
                        "osm_id": "3606732125"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 5,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "西神田公園",
                            "en": "Nishi-Kanda Park",
                            "zh": "西神田公園"
                        },
                        "osm_id": "175994185"
                    },
                    {
                        "name": {
                            "ja": "錦華公園",
                            "en": "Kinka Park",
                            "zh": "錦華公園"
                        },
                        "osm_id": "184577229"
                    },
                    {
                        "name": {
                            "ja": "神保町愛全公園",
                            "en": "Jimbocho Aizen Park",
                            "zh": "神保町愛全公園"
                        },
                        "osm_id": "374399741"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "mega_terminal",
                "label": {
                    "en": "Mega Terminal",
                    "ja": "Mega Terminal",
                    "zh": "Mega Terminal"
                },
                "score": 3
            },
            {
                "id": "skyscraper_district",
                "label": {
                    "en": "Skyscraper District",
                    "ja": "Skyscraper District",
                    "zh": "Skyscraper District"
                },
                "score": 3
            },
            {
                "id": "nightlife",
                "label": {
                    "en": "Nightlife",
                    "ja": "Kabukicho",
                    "zh": "Kabukicho"
                },
                "score": 3
            },
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "book_town",
                "label": {
                    "en": "Book Town",
                    "ja": "本の街",
                    "zh": "書街"
                },
                "score": 5
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "culture",
                "label": {
                    "en": "Cultural Hub",
                    "ja": "文化の中心",
                    "zh": "文化中心"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Yamanote.Kanda": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 362,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "シディーク",
                            "en": "Siddique",
                            "zh": "シディーク"
                        },
                        "osm_id": "311316773"
                    },
                    {
                        "name": {
                            "ja": "ラーメン花月",
                            "en": "Ramen Kagetsu",
                            "zh": "ラーメン花月"
                        },
                        "osm_id": "516368792"
                    },
                    {
                        "name": {
                            "ja": "Blondie",
                            "en": "Blondie",
                            "zh": "Blondie"
                        },
                        "osm_id": "702355911"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 157,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "860340496"
                    },
                    {
                        "name": {
                            "ja": "オフィスコム",
                            "en": "Office-com",
                            "zh": "オフィスコム"
                        },
                        "osm_id": "1231861281"
                    },
                    {
                        "name": {
                            "ja": "文化堂",
                            "en": "Bunkado",
                            "zh": "文化堂"
                        },
                        "osm_id": "1231861289"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 19,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "神田ステーションホテル",
                            "en": "Kanda Station Hotel",
                            "zh": "神田ステーションホテル"
                        },
                        "osm_id": "1734716412"
                    },
                    {
                        "name": {
                            "ja": "Capsule Value Kanda",
                            "en": "Capsule Value Kanda",
                            "zh": "Capsule Value Kanda"
                        },
                        "osm_id": "4465721893"
                    },
                    {
                        "name": {
                            "ja": "トーセイホテル ココネ神田",
                            "en": "Hotel Tosei Cocone Kanda",
                            "zh": "トーセイホテル ココネ神田"
                        },
                        "osm_id": "5792840091"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 84,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "東京都主税局千代田都税事務所",
                            "en": "Chiyoda Metropolitan Taxation Office",
                            "zh": "東京都主税局千代田都税事務所"
                        },
                        "osm_id": "1420785280"
                    },
                    {
                        "name": {
                            "ja": "大木製薬株式会社",
                            "en": "Oki Pharmacy Co., Ltd.",
                            "zh": "大木製薬株式会社"
                        },
                        "osm_id": "4032269836"
                    },
                    {
                        "name": {
                            "ja": "楓屋",
                            "en": "Kaedeya Co., LTD.",
                            "zh": "楓屋"
                        },
                        "osm_id": "4032288323"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "business_&_tradition",
                "label": {
                    "en": "Business & Tradition",
                    "ja": "Business & Tradition",
                    "zh": "Business & Tradition"
                },
                "score": 3
            },
            {
                "id": "izakaya",
                "label": {
                    "en": "Izakaya Alleys",
                    "ja": "飲み屋街",
                    "zh": "居酒屋街"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "business",
                "label": {
                    "en": "Business District",
                    "ja": "ビジネス街",
                    "zh": "商業區"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Chuo.Ochanomizu": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 278,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "A&A認定ベクターワークスカフェジャパン",
                            "en": "A&A Vectorworks Cafe Japan",
                            "zh": "A&A認定ベクターワークスカフェジャパン"
                        },
                        "osm_id": "582969399"
                    },
                    {
                        "name": {
                            "ja": "ゼッテリア",
                            "en": "Zetteria",
                            "zh": "ゼッテリア"
                        },
                        "osm_id": "599540612"
                    },
                    {
                        "name": {
                            "ja": "スターバックス",
                            "en": "Starbucks",
                            "zh": "スターバックス"
                        },
                        "osm_id": "599541465"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 167,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "670739633"
                    },
                    {
                        "name": {
                            "ja": "丸善",
                            "en": "MARUZEN",
                            "zh": "丸善"
                        },
                        "osm_id": "810027523"
                    },
                    {
                        "name": {
                            "ja": "クロサワ楽器店",
                            "en": "Kurosawa Gakki",
                            "zh": "クロサワ楽器店"
                        },
                        "osm_id": "936119512"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 8,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "御茶ノ水 イン",
                            "en": "Ochanomizu Inn",
                            "zh": "御茶ノ水 イン"
                        },
                        "osm_id": "1130555411"
                    },
                    {
                        "name": {
                            "ja": "ホテル龍名館お茶の水本店",
                            "en": "Hotel Ryumeikan OCHANOMIZU HONTEN",
                            "zh": "ホテル龍名館お茶の水本店"
                        },
                        "osm_id": "3767433293"
                    },
                    {
                        "name": {
                            "ja": "山の上ホテル",
                            "en": "Hilltop Hotel",
                            "zh": "山の上ホテル"
                        },
                        "osm_id": "3888784785"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 20,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "㈶石川文化事業財団お茶の水図書館",
                            "en": "Ochanomizu Library, Ishikawa Cultural Enterprise Foundation",
                            "zh": "㈶石川文化事業財団お茶の水図書館"
                        },
                        "osm_id": "1420763756"
                    },
                    {
                        "name": {
                            "ja": "センチュリーミュージアム",
                            "en": "Century Museum",
                            "zh": "センチュリーミュージアム"
                        },
                        "osm_id": "1420765213"
                    },
                    {
                        "name": {
                            "ja": "文京区立湯島図書館",
                            "en": "文京区立湯島図書館",
                            "zh": "文京区立湯島図書館"
                        },
                        "osm_id": "1420780669"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 5,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "宮本公園",
                            "en": "Miyamoto Park",
                            "zh": "宮本公園"
                        },
                        "osm_id": "52928548"
                    },
                    {
                        "name": {
                            "ja": "お茶の水公園",
                            "en": "Ochanomizu Park",
                            "zh": "お茶の水公園"
                        },
                        "osm_id": "124081178"
                    },
                    {
                        "name": {
                            "ja": "本郷給水所公苑",
                            "en": "Hongo Water Station Park",
                            "zh": "本郷給水所公苑"
                        },
                        "osm_id": "161271086"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "musical_instruments",
                "label": {
                    "en": "Musical Instruments",
                    "ja": "Musical Instruments",
                    "zh": "Musical Instruments"
                },
                "score": 3
            },
            {
                "id": "medical_hub",
                "label": {
                    "en": "Medical Hub",
                    "ja": "Medical Hub",
                    "zh": "Medical Hub"
                },
                "score": 3
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "culture",
                "label": {
                    "en": "Cultural Hub",
                    "ja": "文化の中心",
                    "zh": "文化中心"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Chuo.Iidabashi": {
        "categories": {
            "shopping": {
                "id": "shopping",
                "count": 143,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Inplexe",
                            "en": "Inplexe",
                            "zh": "Inplexe"
                        },
                        "osm_id": "417434047"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "989291902"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "1075317935"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 8,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "The AGNES",
                            "en": "The AGNES",
                            "zh": "The AGNES"
                        },
                        "osm_id": "417434076"
                    },
                    {
                        "name": {
                            "ja": "Tokyo Central Youth Hostel",
                            "en": "Tokyo Central Youth Hostel",
                            "zh": "Tokyo Central Youth Hostel"
                        },
                        "osm_id": "5834370713"
                    },
                    {
                        "name": {
                            "ja": "アパホテル",
                            "en": "APA Hotel",
                            "zh": "アパホテル"
                        },
                        "osm_id": "5887930760"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 4,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "小石川後楽園",
                            "en": "Koishikawa Kōrakuen Gardens",
                            "zh": "小石川後楽園"
                        },
                        "osm_id": "20028327"
                    },
                    {
                        "name": {
                            "ja": "若宮公園",
                            "en": "Wakamiya Park",
                            "zh": "若宮公園"
                        },
                        "osm_id": "35630129"
                    },
                    {
                        "name": {
                            "ja": "新小川公園",
                            "en": "新小川公園",
                            "zh": "新小川公園"
                        },
                        "osm_id": "664141411"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 31,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "野村の仲介＋",
                            "en": "野村の仲介＋",
                            "zh": "野村の仲介＋"
                        },
                        "osm_id": "989291840"
                    },
                    {
                        "name": {
                            "ja": "東京都産業労働局労働相談情報センター",
                            "en": "東京都産業労働局労働相談情報センター",
                            "zh": "東京都産業労働局労働相談情報センター"
                        },
                        "osm_id": "1420785407"
                    },
                    {
                        "name": {
                            "ja": "エイブル",
                            "en": "Able",
                            "zh": "エイブル"
                        },
                        "osm_id": "1576518222"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "kagurazaka_gateway",
                "label": {
                    "en": "Kagurazaka Gateway",
                    "ja": "Kagurazaka Gateway",
                    "zh": "Kagurazaka Gateway"
                },
                "score": 3
            },
            {
                "id": "canal_cafe",
                "label": {
                    "en": "Canal Cafe",
                    "ja": "Canal Cafe",
                    "zh": "Canal Cafe"
                },
                "score": 3
            },
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Yamanote.Shinagawa": {
        "categories": {
            "shopping": {
                "id": "shopping",
                "count": 42,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "265050600"
                    },
                    {
                        "name": {
                            "ja": "デイリーヤマザキ",
                            "en": "Daily Yamazaki",
                            "zh": "デイリーヤマザキ"
                        },
                        "osm_id": "265050634"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "265050797"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 5,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "品川プリンスホテル",
                            "en": "Shinagawa Prince Hotel",
                            "zh": "品川プリンスホテル"
                        },
                        "osm_id": "721997785"
                    },
                    {
                        "name": {
                            "ja": "ストリングスホテル東京インターコンチネンタル",
                            "en": "The Strings by Intercontinental Tokyo",
                            "zh": "ストリングスホテル東京インターコンチネンタル"
                        },
                        "osm_id": "1689120076"
                    },
                    {
                        "name": {
                            "ja": "Shinagawa",
                            "en": "Shinagawa",
                            "zh": "Shinagawa"
                        },
                        "osm_id": "5866323349"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 3,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "T・ジョイPRINCE品川",
                            "en": "T・ジョイPRINCE品川",
                            "zh": "T・ジョイPRINCE品川"
                        },
                        "osm_id": "1745162722"
                    },
                    {
                        "name": {
                            "ja": "ニコン ミュージアム",
                            "en": "NIKON MUSEUM",
                            "zh": "ニコン ミュージアム"
                        },
                        "osm_id": "7194017524"
                    },
                    {
                        "name": {
                            "ja": "クロネコヤマトミュージアム",
                            "en": "クロネコヤマトミュージアム",
                            "zh": "クロネコヤマトミュージアム"
                        },
                        "osm_id": "9223580418"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 10,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ams Japan Co. Ltd.",
                            "en": "ams Japan Co. Ltd.",
                            "zh": "ams Japan Co. Ltd."
                        },
                        "osm_id": "4296966482"
                    },
                    {
                        "name": {
                            "ja": "税理士法人ブラザシップ 東京オフィス",
                            "en": "税理士法人ブラザシップ 東京オフィス",
                            "zh": "税理士法人ブラザシップ 東京オフィス"
                        },
                        "osm_id": "6948420240"
                    },
                    {
                        "name": {
                            "ja": "ゼンリンデータコム",
                            "en": "Zenrin DataCom",
                            "zh": "ゼンリンデータコム"
                        },
                        "osm_id": "7194017525"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "shinkansen_gateway",
                "label": {
                    "en": "Shinkansen Gateway",
                    "ja": "Shinkansen Gateway",
                    "zh": "Shinkansen Gateway"
                },
                "score": 3
            },
            {
                "id": "corporate_hq",
                "label": {
                    "en": "Corporate HQ",
                    "ja": "Corporate HQ",
                    "zh": "Corporate HQ"
                },
                "score": 3
            },
            {
                "id": "high_end",
                "label": {
                    "en": "High-end",
                    "ja": "高級・洗練",
                    "zh": "高級時尚"
                },
                "score": 4
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Local Gourmet",
                    "ja": "ご当地グルメ",
                    "zh": "在地美食"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Yamanote.Ebisu": {
        "categories": {
            "accommodation": {
                "id": "accommodation",
                "count": 2,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ホテルシエスタ",
                            "en": "ホテルシエスタ",
                            "zh": "ホテルシエスタ"
                        },
                        "osm_id": "728435757"
                    },
                    {
                        "name": {
                            "ja": "ホテルエクセレント",
                            "en": "Hotel Excellent",
                            "zh": "ホテルエクセレント"
                        },
                        "osm_id": "60442261"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 3,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "恵比寿南二公園",
                            "en": "恵比寿南二公園",
                            "zh": "恵比寿南二公園"
                        },
                        "osm_id": "257726828"
                    },
                    {
                        "name": {
                            "ja": "恵比寿東公園",
                            "en": "Tako Park",
                            "zh": "恵比寿東公園"
                        },
                        "osm_id": "382975172"
                    },
                    {
                        "name": {
                            "ja": "アメリカ橋公園",
                            "en": "アメリカ橋公園",
                            "zh": "アメリカ橋公園"
                        },
                        "osm_id": "661344557"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 13,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "レッドハット",
                            "en": "Red Hat",
                            "zh": "レッドハット"
                        },
                        "osm_id": "3725764193"
                    },
                    {
                        "name": {
                            "ja": "不動産のシノザキ",
                            "en": "不動産のシノザキ",
                            "zh": "不動産のシノザキ"
                        },
                        "osm_id": "4028237711"
                    },
                    {
                        "name": {
                            "ja": "シェンロン",
                            "en": "Xenlon Co. Ltd.",
                            "zh": "シェンロン"
                        },
                        "osm_id": "6654278163"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "sophisticated_dining",
                "label": {
                    "en": "Sophisticated Dining",
                    "ja": "Sophisticated Dining",
                    "zh": "Sophisticated Dining"
                },
                "score": 3
            },
            {
                "id": "garden_place",
                "label": {
                    "en": "Garden Place",
                    "ja": "Garden Place",
                    "zh": "Garden Place"
                },
                "score": 3
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:TokyoMetro.Ginza.Nihombashi": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 180,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "天松 (Tenmatsu) 'Mark W'",
                            "en": "Tenmatsu 'Mark W'",
                            "zh": "天松 (Tenmatsu) 'Mark W'"
                        },
                        "osm_id": "1367460884"
                    },
                    {
                        "name": {
                            "ja": "カフェ・ベローチェ",
                            "en": "CAFE VELOCE",
                            "zh": "カフェ・ベローチェ"
                        },
                        "osm_id": "1367460898"
                    },
                    {
                        "name": {
                            "ja": "吉田",
                            "en": "吉田",
                            "zh": "吉田"
                        },
                        "osm_id": "1367460908"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 13,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "スーパーホテルLOHAS",
                            "en": "Lohas Hotel",
                            "zh": "スーパーホテルLOHAS"
                        },
                        "osm_id": "4514611786"
                    },
                    {
                        "name": {
                            "ja": "シャングリ・ラ ホテル",
                            "en": "シャングリ・ラ ホテル",
                            "zh": "シャングリ・ラ ホテル"
                        },
                        "osm_id": "5807637069"
                    },
                    {
                        "name": {
                            "ja": "八重洲ターミナルホテル",
                            "en": "八重洲ターミナルホテル",
                            "zh": "八重洲ターミナルホテル"
                        },
                        "osm_id": "6059234799"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 13,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "アーティゾン美術館",
                            "en": "Artizon Museum",
                            "zh": "アーティゾン美術館"
                        },
                        "osm_id": "250668618"
                    },
                    {
                        "name": {
                            "ja": "凧の博物館",
                            "en": "Kite Museum",
                            "zh": "凧の博物館"
                        },
                        "osm_id": "1420767886"
                    },
                    {
                        "name": {
                            "ja": "オベリスク・ジラフ",
                            "en": "Obelisk Giraffe",
                            "zh": "オベリスク・ジラフ"
                        },
                        "osm_id": "1423728722"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "luxury_shopping",
                "label": {
                    "en": "Luxury Shopping",
                    "ja": "Luxury Shopping",
                    "zh": "Luxury Shopping"
                },
                "score": 3
            },
            {
                "id": "high-end_dining",
                "label": {
                    "en": "High-end Dining",
                    "ja": "High-end Dining",
                    "zh": "High-end Dining"
                },
                "score": 3
            },
            {
                "id": "gallery",
                "label": {
                    "en": "Gallery",
                    "ja": "Gallery",
                    "zh": "Gallery"
                },
                "score": 3
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "culture",
                "label": {
                    "en": "Cultural Hub",
                    "ja": "文化の中心",
                    "zh": "文化中心"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Sobu.Kinshicho": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 387,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "カフェ・ド・クリエ",
                            "en": "CAFE de CRIE",
                            "zh": "カフェ・ド・クリエ"
                        },
                        "osm_id": "1916631824"
                    },
                    {
                        "name": {
                            "ja": "スターバックス",
                            "en": "Starbucks",
                            "zh": "スターバックス"
                        },
                        "osm_id": "2006587824"
                    },
                    {
                        "name": {
                            "ja": "スターバックス",
                            "en": "Starbucks",
                            "zh": "スターバックス"
                        },
                        "osm_id": "2006594936"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 8,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Sotetsu Fresa Inn",
                            "en": "Sotetsu Fresa Inn",
                            "zh": "Sotetsu Fresa Inn"
                        },
                        "osm_id": "11770669984"
                    },
                    {
                        "name": {
                            "ja": "MAKOTO HOSTEL",
                            "en": "MAKOTO HOSTEL",
                            "zh": "MAKOTO HOSTEL"
                        },
                        "osm_id": "11871794104"
                    },
                    {
                        "name": {
                            "ja": "ドミトリー錦繍",
                            "en": "Dormitory Kinshu",
                            "zh": "ドミトリー錦繍"
                        },
                        "osm_id": "12365120001"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 8,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ブレーキ博物館",
                            "en": "ブレーキ博物館",
                            "zh": "ブレーキ博物館"
                        },
                        "osm_id": "1420765316"
                    },
                    {
                        "name": {
                            "ja": "すみだトリフォニーホール",
                            "en": "Sumida Triphony Hall",
                            "zh": "すみだトリフォニーホール"
                        },
                        "osm_id": "1703063573"
                    },
                    {
                        "name": {
                            "ja": "TOHOシネマズ",
                            "en": "Toho Cinemas",
                            "zh": "TOHOシネマズ"
                        },
                        "osm_id": "2962576481"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 3,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "錦糸堀公園",
                            "en": "Kinshibori Park",
                            "zh": "錦糸堀公園"
                        },
                        "osm_id": "148642774"
                    },
                    {
                        "name": {
                            "ja": "大横川親水公園",
                            "en": "Ōyokogawa Shinsui Park",
                            "zh": "大横川親水公園"
                        },
                        "osm_id": "155035468"
                    },
                    {
                        "name": {
                            "ja": "竪川第一公園",
                            "en": "竪川第一公園",
                            "zh": "竪川第一公園"
                        },
                        "osm_id": "614496634"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "east_tokyo_hub",
                "label": {
                    "en": "East Tokyo Hub",
                    "ja": "East Tokyo Hub",
                    "zh": "East Tokyo Hub"
                },
                "score": 3
            },
            {
                "id": "family_&_nightlife",
                "label": {
                    "en": "Family & Nightlife",
                    "ja": "Family & Nightlife",
                    "zh": "Family & Nightlife"
                },
                "score": 3
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:TokyoMetro.Hanzomon.Oshiage": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 86,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "スターバックス",
                            "en": "Starbucks",
                            "zh": "スターバックス"
                        },
                        "osm_id": "2006619868"
                    },
                    {
                        "name": {
                            "ja": "タリーズコーヒー",
                            "en": "Tully's Coffee",
                            "zh": "タリーズコーヒー"
                        },
                        "osm_id": "2006638590"
                    },
                    {
                        "name": {
                            "ja": "cafe tokyo",
                            "en": "cafe tokyo",
                            "zh": "cafe tokyo"
                        },
                        "osm_id": "2528729354"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 84,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "2003874560"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "2003935475"
                    },
                    {
                        "name": {
                            "ja": "ローソンストア100",
                            "en": "Lawson Store 100",
                            "zh": "ローソンストア100"
                        },
                        "osm_id": "2008429959"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 3,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "は・は・は",
                            "en": "は・は・は",
                            "zh": "は・は・は"
                        },
                        "osm_id": "10572028660"
                    },
                    {
                        "name": {
                            "ja": "郵政博物館",
                            "en": "Postal Museum Japan",
                            "zh": "郵政博物館"
                        },
                        "osm_id": "11663522219"
                    },
                    {
                        "name": {
                            "ja": "千葉工業大学 東京スカイツリータウン",
                            "en": "Tokyo Skytree Town Campus, Chiba Institute of Technology",
                            "zh": "千葉工業大学 東京スカイツリータウン"
                        },
                        "osm_id": "12374741051"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 5,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "小梅児童遊園",
                            "en": "小梅児童遊園",
                            "zh": "小梅児童遊園"
                        },
                        "osm_id": "98320322"
                    },
                    {
                        "name": {
                            "ja": "わんぱく天国",
                            "en": "わんぱく天国",
                            "zh": "わんぱく天国"
                        },
                        "osm_id": "147939137"
                    },
                    {
                        "name": {
                            "ja": "大横川親水公園",
                            "en": "Ōyokogawa Shinsui Park",
                            "zh": "大横川親水公園"
                        },
                        "osm_id": "155035468"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 21,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "日本イトミック",
                            "en": "日本イトミック",
                            "zh": "日本イトミック"
                        },
                        "osm_id": "1709295523"
                    },
                    {
                        "name": {
                            "ja": "エイブル",
                            "en": "Able",
                            "zh": "エイブル"
                        },
                        "osm_id": "10132679130"
                    },
                    {
                        "name": {
                            "ja": "賃貸住宅サービス",
                            "en": "賃貸住宅サービス",
                            "zh": "賃貸住宅サービス"
                        },
                        "osm_id": "10132691602"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "skytree_town",
                "label": {
                    "en": "Skytree Town",
                    "ja": "Skytree Town",
                    "zh": "Skytree Town"
                },
                "score": 3
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "family_friendly",
                "label": {
                    "en": "Family Friendly",
                    "ja": "家族向け",
                    "zh": "親子友善"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:TokyoMetro.Hibiya.Nakameguro": {
        "categories": {
            "shopping": {
                "id": "shopping",
                "count": 94,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Carlife",
                            "en": "Carlife",
                            "zh": "Carlife"
                        },
                        "osm_id": "631527992"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "1238545299"
                    },
                    {
                        "name": {
                            "ja": "おしゃれさろん クリスタル",
                            "en": "おしゃれさろん クリスタル",
                            "zh": "おしゃれさろん クリスタル"
                        },
                        "osm_id": "1238545300"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 1,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Waves Nakameguro",
                            "en": "Waves Nakameguro",
                            "zh": "Waves Nakameguro"
                        },
                        "osm_id": "12406069801"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 4,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "目黒区立中目黒駅前図書館",
                            "en": "目黒区立中目黒駅前図書館",
                            "zh": "目黒区立中目黒駅前図書館"
                        },
                        "osm_id": "1420790453"
                    },
                    {
                        "name": {
                            "ja": "東京都目黒区立 川の資料館",
                            "en": "東京都目黒区立 川の資料館",
                            "zh": "東京都目黒区立 川の資料館"
                        },
                        "osm_id": "1975522153"
                    },
                    {
                        "name": {
                            "ja": "アート・フロント・ギャラリー",
                            "en": "Art Front Gallery",
                            "zh": "アート・フロント・ギャラリー"
                        },
                        "osm_id": "2376715147"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 5,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "目黒川船入場",
                            "en": "Meguro Riverside Park",
                            "zh": "目黒川船入場"
                        },
                        "osm_id": "49682612"
                    },
                    {
                        "name": {
                            "ja": "中目黒しぜんとなかよし公園",
                            "en": "中目黒しぜんとなかよし公園",
                            "zh": "中目黒しぜんとなかよし公園"
                        },
                        "osm_id": "394842626"
                    },
                    {
                        "name": {
                            "ja": "合流点遊び場",
                            "en": "合流点遊び場",
                            "zh": "合流点遊び場"
                        },
                        "osm_id": "397569902"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "sakura_promenade",
                "label": {
                    "en": "Sakura Promenade",
                    "ja": "Sakura Promenade",
                    "zh": "Sakura Promenade"
                },
                "score": 3
            },
            {
                "id": "trendy_cafes",
                "label": {
                    "en": "Trendy Cafes",
                    "ja": "Trendy Cafes",
                    "zh": "Trendy Cafes"
                },
                "score": 3
            },
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "sakura",
                "label": {
                    "en": "Sakura Spot",
                    "ja": "桜の名所",
                    "zh": "賞櫻勝地"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:TokyoMetro.Chiyoda.Akasaka": {
        "categories": {
            "shopping": {
                "id": "shopping",
                "count": 138,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "TBSマーケット",
                            "en": "TBS The market",
                            "zh": "TBSマーケット"
                        },
                        "osm_id": "207144442"
                    },
                    {
                        "name": {
                            "ja": "ローソン",
                            "en": "Lawson",
                            "zh": "ローソン"
                        },
                        "osm_id": "1111289774"
                    },
                    {
                        "name": {
                            "ja": "ローソン",
                            "en": "Lawson",
                            "zh": "ローソン"
                        },
                        "osm_id": "1126262323"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 30,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "The b' Akasaka",
                            "en": "The b' Akasaka",
                            "zh": "The b' Akasaka"
                        },
                        "osm_id": "618102602"
                    },
                    {
                        "name": {
                            "ja": "Avanshell Akasaka",
                            "en": "Avanshell Akasaka",
                            "zh": "Avanshell Akasaka"
                        },
                        "osm_id": "739064479"
                    },
                    {
                        "name": {
                            "ja": "東横イン 溜池山王駅官邸南",
                            "en": "Toyoko Inn",
                            "zh": "東横イン 溜池山王駅官邸南"
                        },
                        "osm_id": "1185605122"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 1,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "赤坂RED/THEATER",
                            "en": "赤坂RED/THEATER",
                            "zh": "赤坂RED/THEATER"
                        },
                        "osm_id": "10847840531"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 5,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "港区立円通寺坂公園",
                            "en": "港区立円通寺坂公園",
                            "zh": "港区立円通寺坂公園"
                        },
                        "osm_id": "146182086"
                    },
                    {
                        "name": {
                            "ja": "氷川公園",
                            "en": "Hikawa park",
                            "zh": "氷川公園"
                        },
                        "osm_id": "147830819"
                    },
                    {
                        "name": {
                            "ja": "一ツ木公園",
                            "en": "Hitotsugi Park",
                            "zh": "一ツ木公園"
                        },
                        "osm_id": "666468325"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 37,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "TBS企画",
                            "en": "TBS企画",
                            "zh": "TBS企画"
                        },
                        "osm_id": "5412173202"
                    },
                    {
                        "name": {
                            "ja": "TBSテレビ",
                            "en": "TBS Television",
                            "zh": "TBSテレビ"
                        },
                        "osm_id": "7007466085"
                    },
                    {
                        "name": {
                            "ja": "KABA",
                            "en": "KABA",
                            "zh": "KABA"
                        },
                        "osm_id": "2106584193"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "media_city",
                "label": {
                    "en": "Media City",
                    "ja": "Media City",
                    "zh": "Media City"
                },
                "score": 3
            },
            {
                "id": "upscale_dining",
                "label": {
                    "en": "Upscale Dining",
                    "ja": "Upscale Dining",
                    "zh": "Upscale Dining"
                },
                "score": 3
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Yamanote.Nippori": {
        "categories": {
            "shopping": {
                "id": "shopping",
                "count": 84,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "明富夢",
                            "en": "Atomu",
                            "zh": "明富夢"
                        },
                        "osm_id": "506214987"
                    },
                    {
                        "name": {
                            "ja": "後藤の飴",
                            "en": "Goto no Ame",
                            "zh": "後藤の飴"
                        },
                        "osm_id": "506214989"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "1148542981"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 7,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Hotel Sunny",
                            "en": "Hotel Sunny",
                            "zh": "Hotel Sunny"
                        },
                        "osm_id": "2571001911"
                    },
                    {
                        "name": {
                            "ja": "Air bnb",
                            "en": "Air bnb",
                            "zh": "Air bnb"
                        },
                        "osm_id": "4776357922"
                    },
                    {
                        "name": {
                            "ja": "プチホテル アゲイン",
                            "en": "プチホテル アゲイン",
                            "zh": "プチホテル アゲイン"
                        },
                        "osm_id": "5192478531"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 11,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "すぺーす小倉屋",
                            "en": "Space Oguraya",
                            "zh": "すぺーす小倉屋"
                        },
                        "osm_id": "4218532816"
                    },
                    {
                        "name": {
                            "ja": "響",
                            "en": "響",
                            "zh": "響"
                        },
                        "osm_id": "9380618830"
                    },
                    {
                        "name": {
                            "ja": "日暮里サニーホール",
                            "en": "日暮里サニーホール",
                            "zh": "日暮里サニーホール"
                        },
                        "osm_id": "12006072250"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 7,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "防災広場 初音の森",
                            "en": "Disaster Prevention Park",
                            "zh": "防災広場 初音の森"
                        },
                        "osm_id": "41381242"
                    },
                    {
                        "name": {
                            "ja": "岡倉天心 記念公園",
                            "en": "Okakura Tenshin Memorial Park",
                            "zh": "岡倉天心 記念公園"
                        },
                        "osm_id": "45738210"
                    },
                    {
                        "name": {
                            "ja": "日暮里南公園",
                            "en": "日暮里南公園",
                            "zh": "日暮里南公園"
                        },
                        "osm_id": "239270491"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 8,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "タウンハウジング",
                            "en": "Townhousing",
                            "zh": "タウンハウジング"
                        },
                        "osm_id": "5199238814"
                    },
                    {
                        "name": {
                            "ja": "諏方神社社務所",
                            "en": "諏方神社社務所",
                            "zh": "諏方神社社務所"
                        },
                        "osm_id": "6560557825"
                    },
                    {
                        "name": {
                            "ja": "ハウスプラザ",
                            "en": "ハウスプラザ",
                            "zh": "ハウスプラザ"
                        },
                        "osm_id": "9372022523"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "yanesen_gateway",
                "label": {
                    "en": "Yanesen Gateway",
                    "ja": "Yanesen Gateway",
                    "zh": "Yanesen Gateway"
                },
                "score": 3
            },
            {
                "id": "fabric_town",
                "label": {
                    "en": "Fabric Town",
                    "ja": "Fabric Town",
                    "zh": "Fabric Town"
                },
                "score": 3
            },
            {
                "id": "cat_town",
                "label": {
                    "en": "Cat Town",
                    "ja": "Cat Town",
                    "zh": "Cat Town"
                },
                "score": 3
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "wholesale",
                "label": {
                    "en": "Wholesale District",
                    "ja": "問屋街",
                    "zh": "批發街"
                },
                "score": 4
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "culture",
                "label": {
                    "en": "Cultural Hub",
                    "ja": "文化の中心",
                    "zh": "文化中心"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:Keikyu.Airport.HanedaAirportTerminal1And2": {
        "categories": {},
        "vibe_tags": [
            {
                "id": "international_airport",
                "label": {
                    "en": "International Airport",
                    "ja": "International Airport",
                    "zh": "International Airport"
                },
                "score": 3
            },
            {
                "id": "transport_hub",
                "label": {
                    "en": "Transport Hub",
                    "ja": "Transport Hub",
                    "zh": "Transport Hub"
                },
                "score": 3
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:Keikyu.Airport.HanedaAirportTerminal3": {
        "categories": {},
        "vibe_tags": [
            {
                "id": "international_airport",
                "label": {
                    "en": "International Airport",
                    "ja": "International Airport",
                    "zh": "International Airport"
                },
                "score": 3
            },
            {
                "id": "transport_hub",
                "label": {
                    "en": "Transport Hub",
                    "ja": "Transport Hub",
                    "zh": "Transport Hub"
                },
                "score": 3
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "osm:5318592733": {
        "categories": {
            "shopping": {
                "id": "shopping",
                "count": 1,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ローソン",
                            "en": "Lawson",
                            "zh": "ローソン"
                        },
                        "osm_id": "11436145683"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 5,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "タイヤ公園",
                            "en": "タイヤ公園",
                            "zh": "タイヤ公園"
                        },
                        "osm_id": "232012897"
                    },
                    {
                        "name": {
                            "ja": "みなとが丘ふ頭公園",
                            "en": "Minato-ga-oka Port Park",
                            "zh": "みなとが丘ふ頭公園"
                        },
                        "osm_id": "396664384"
                    },
                    {
                        "name": {
                            "ja": "大井ふ頭緑道公園",
                            "en": "Oi Greenway",
                            "zh": "大井ふ頭緑道公園"
                        },
                        "osm_id": "694540970"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:TokyoMetro.Tozai.MonzenNakacho": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 82,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "カフェ東亜サプライ",
                            "en": "CAFE TOA SUPPLY",
                            "zh": "カフェ東亜サプライ"
                        },
                        "osm_id": "1466098805"
                    },
                    {
                        "name": {
                            "ja": "モスバーガー",
                            "en": "MOS Burger",
                            "zh": "モスバーガー"
                        },
                        "osm_id": "1832741403"
                    },
                    {
                        "name": {
                            "ja": "マクドナルド",
                            "en": "McDonald's",
                            "zh": "マクドナルド"
                        },
                        "osm_id": "1832741406"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 51,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "1832741404"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "1832741408"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "1832741409"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 2,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Keisei Richmond Hotel Tokyo Monzennakacho",
                            "en": "Keisei Richmond Hotel Tokyo Monzennakacho",
                            "zh": "Keisei Richmond Hotel Tokyo Monzennakacho"
                        },
                        "osm_id": "13238356986"
                    },
                    {
                        "name": {
                            "ja": "TOKYU STAY",
                            "en": "Tokyo Stay Monzen-Nakacho",
                            "zh": "TOKYU STAY"
                        },
                        "osm_id": "616228277"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 1,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "伊能忠敬像",
                            "en": "Ino Tadataka Statue",
                            "zh": "伊能忠敬像"
                        },
                        "osm_id": "1651573980"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 6,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "臨海公園",
                            "en": "Rinkai Park",
                            "zh": "臨海公園"
                        },
                        "osm_id": "133434828"
                    },
                    {
                        "name": {
                            "ja": "深川公園",
                            "en": "Fukagawa Park",
                            "zh": "深川公園"
                        },
                        "osm_id": "172364202"
                    },
                    {
                        "name": {
                            "ja": "深川一丁目児童公園",
                            "en": "Children's Playground",
                            "zh": "深川一丁目児童公園"
                        },
                        "osm_id": "365814437"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 15,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "(株)高砂不動産",
                            "en": "(株)高砂不動産",
                            "zh": "(株)高砂不動産"
                        },
                        "osm_id": "5826349546"
                    },
                    {
                        "name": {
                            "ja": "株式会社レアシード",
                            "en": "RARESEED",
                            "zh": "株式会社レアシード"
                        },
                        "osm_id": "6380105046"
                    },
                    {
                        "name": {
                            "ja": "江東商事",
                            "en": "江東商事",
                            "zh": "江東商事"
                        },
                        "osm_id": "6725704881"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "family_friendly",
                "label": {
                    "en": "Family Friendly",
                    "ja": "家族向け",
                    "zh": "親子友善"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Chuo.Kichijoji": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 286,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ケンタッキーフライドチキン",
                            "en": "KFC",
                            "zh": "ケンタッキーフライドチキン"
                        },
                        "osm_id": "452816882"
                    },
                    {
                        "name": {
                            "ja": "フレッシュネスバーガー",
                            "en": "Freshness Burger",
                            "zh": "フレッシュネスバーガー"
                        },
                        "osm_id": "508477442"
                    },
                    {
                        "name": {
                            "ja": "マクドナルド",
                            "en": "McDonald's",
                            "zh": "マクドナルド"
                        },
                        "osm_id": "564652656"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 331,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "508585822"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "508585827"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "518431963"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 4,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "シャリル",
                            "en": "シャリル",
                            "zh": "シャリル"
                        },
                        "osm_id": "10687235282"
                    },
                    {
                        "name": {
                            "ja": "みつ井旅館",
                            "en": "みつ井旅館",
                            "zh": "みつ井旅館"
                        },
                        "osm_id": "10734360516"
                    },
                    {
                        "name": {
                            "ja": "吉祥寺東急イン",
                            "en": "吉祥寺東急イン",
                            "zh": "吉祥寺東急イン"
                        },
                        "osm_id": "117671097"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 7,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "野外ステージ",
                            "en": "野外ステージ",
                            "zh": "野外ステージ"
                        },
                        "osm_id": "515618824"
                    },
                    {
                        "name": {
                            "ja": "吉祥寺シアター",
                            "en": "Kichijoji Theatre",
                            "zh": "吉祥寺シアター"
                        },
                        "osm_id": "516003933"
                    },
                    {
                        "name": {
                            "ja": "吉祥寺オデヲン",
                            "en": "Kichijoji Odeon",
                            "zh": "吉祥寺オデヲン"
                        },
                        "osm_id": "560400855"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 5,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "吉祥寺南公園",
                            "en": "Kichijoji Minami Park",
                            "zh": "吉祥寺南公園"
                        },
                        "osm_id": "41790827"
                    },
                    {
                        "name": {
                            "ja": "南町緑地",
                            "en": "南町緑地",
                            "zh": "南町緑地"
                        },
                        "osm_id": "41791666"
                    },
                    {
                        "name": {
                            "ja": "吉祥寺の杜　宮本小路公園",
                            "en": "吉祥寺の杜　宮本小路公園",
                            "zh": "吉祥寺の杜　宮本小路公園"
                        },
                        "osm_id": "310085415"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 24,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "リベスト",
                            "en": "リベスト",
                            "zh": "リベスト"
                        },
                        "osm_id": "982125494"
                    },
                    {
                        "name": {
                            "ja": "リベスト",
                            "en": "リベスト",
                            "zh": "リベスト"
                        },
                        "osm_id": "982153152"
                    },
                    {
                        "name": {
                            "ja": "不二家ハウジング",
                            "en": "不二家ハウジング",
                            "zh": "不二家ハウジング"
                        },
                        "osm_id": "3257492313"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "high_end",
                "label": {
                    "en": "High-end",
                    "ja": "高級・洗練",
                    "zh": "高級時尚"
                },
                "score": 4
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "subculture",
                "label": {
                    "en": "Subculture",
                    "ja": "サブカルチャー",
                    "zh": "亞文化"
                },
                "score": 4
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "family_friendly",
                "label": {
                    "en": "Family Friendly",
                    "ja": "家族向け",
                    "zh": "親子友善"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "sakura",
                "label": {
                    "en": "Sakura Spot",
                    "ja": "桜の名所",
                    "zh": "賞櫻勝地"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Chuo.Koenji": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 273,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "柳亭",
                            "en": "柳亭",
                            "zh": "柳亭"
                        },
                        "osm_id": "1019753403"
                    },
                    {
                        "name": {
                            "ja": "上島珈琲店",
                            "en": "Ueshima Coffee House",
                            "zh": "上島珈琲店"
                        },
                        "osm_id": "1897807576"
                    },
                    {
                        "name": {
                            "ja": "マクドナルド",
                            "en": "McDonald's",
                            "zh": "マクドナルド"
                        },
                        "osm_id": "1935491413"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 357,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ブックスオオトリ",
                            "en": "ブックスオオトリ",
                            "zh": "ブックスオオトリ"
                        },
                        "osm_id": "895736677"
                    },
                    {
                        "name": {
                            "ja": "Jeans Mate",
                            "en": "Jeans Mate",
                            "zh": "Jeans Mate"
                        },
                        "osm_id": "895737478"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "895738981"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 4,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ホテルメッツ高円寺",
                            "en": "ホテルメッツ高円寺",
                            "zh": "ホテルメッツ高円寺"
                        },
                        "osm_id": "1897807575"
                    },
                    {
                        "name": {
                            "ja": "House Koenji Minami",
                            "en": "House Koenji Minami",
                            "zh": "House Koenji Minami"
                        },
                        "osm_id": "6395620812"
                    },
                    {
                        "name": {
                            "ja": "ARK TOWER",
                            "en": "ARK TOWER",
                            "zh": "ARK TOWER"
                        },
                        "osm_id": "7263263577"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 5,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "明石スタジオ",
                            "en": "Akashistudio",
                            "zh": "明石スタジオ"
                        },
                        "osm_id": "1834901143"
                    },
                    {
                        "name": {
                            "ja": "素人の乱12号店",
                            "en": "素人の乱12号店",
                            "zh": "素人の乱12号店"
                        },
                        "osm_id": "3910153867"
                    },
                    {
                        "name": {
                            "ja": "ギャラリーR",
                            "en": "ギャラリーR",
                            "zh": "ギャラリーR"
                        },
                        "osm_id": "3910177581"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 7,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "高円寺北二公園",
                            "en": "高円寺北二公園",
                            "zh": "高円寺北二公園"
                        },
                        "osm_id": "75890537"
                    },
                    {
                        "name": {
                            "ja": "高円寺中央公園",
                            "en": "高円寺中央公園",
                            "zh": "高円寺中央公園"
                        },
                        "osm_id": "225755057"
                    },
                    {
                        "name": {
                            "ja": "高南幼児公園",
                            "en": "高南幼児公園",
                            "zh": "高南幼児公園"
                        },
                        "osm_id": "225755058"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 56,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "日昴",
                            "en": "日昴",
                            "zh": "日昴"
                        },
                        "osm_id": "2697960656"
                    },
                    {
                        "name": {
                            "ja": "株式会社ヴァル研究所",
                            "en": "株式会社ヴァル研究所",
                            "zh": "株式会社ヴァル研究所"
                        },
                        "osm_id": "3991438852"
                    },
                    {
                        "name": {
                            "ja": "日本生命",
                            "en": "Nippon Life",
                            "zh": "日本生命"
                        },
                        "osm_id": "4091090449"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "subculture",
                "label": {
                    "en": "Subculture",
                    "ja": "サブカルチャー",
                    "zh": "亞文化"
                },
                "score": 4
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "business",
                "label": {
                    "en": "Business District",
                    "ja": "ビジネス街",
                    "zh": "商業區"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:TokyoMetro.Yurakucho.Tsukishima": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 57,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "モスバーガー",
                            "en": "MOS Burger",
                            "zh": "モスバーガー"
                        },
                        "osm_id": "1937178443"
                    },
                    {
                        "name": {
                            "ja": "オリジン弁当",
                            "en": "Origin Bentō",
                            "zh": "オリジン弁当"
                        },
                        "osm_id": "2476230302"
                    },
                    {
                        "name": {
                            "ja": "寿司 花ふじ",
                            "en": "寿司 花ふじ",
                            "zh": "寿司 花ふじ"
                        },
                        "osm_id": "2476236883"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 46,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "フジマート",
                            "en": "フジマート",
                            "zh": "フジマート"
                        },
                        "osm_id": "2476228612"
                    },
                    {
                        "name": {
                            "ja": "Cleaning Yatagai",
                            "en": "Cleaning Yatagai",
                            "zh": "Cleaning Yatagai"
                        },
                        "osm_id": "2476231348"
                    },
                    {
                        "name": {
                            "ja": "ローソン",
                            "en": "Lawson",
                            "zh": "ローソン"
                        },
                        "osm_id": "2476233465"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 2,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "中央区立月島図書館",
                            "en": "Tsukishima Library",
                            "zh": "中央区立月島図書館"
                        },
                        "osm_id": "1420766177"
                    },
                    {
                        "name": {
                            "ja": "佃まちかど展示館",
                            "en": "Tsukuda Machikado Museum",
                            "zh": "佃まちかど展示館"
                        },
                        "osm_id": "4609249704"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 11,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "月島第一児童公園",
                            "en": "Tsukishima Dai-ichi  Park",
                            "zh": "月島第一児童公園"
                        },
                        "osm_id": "332632626"
                    },
                    {
                        "name": {
                            "ja": "佃公園",
                            "en": "Tsukuda Distrital Park",
                            "zh": "佃公園"
                        },
                        "osm_id": "466032162"
                    },
                    {
                        "name": {
                            "ja": "月一園",
                            "en": "月一園",
                            "zh": "月一園"
                        },
                        "osm_id": "466052317"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 4,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "都市再生機構東京都心支社勝どき駅前再開発事務所",
                            "en": "Urban Renaissance Agency",
                            "zh": "都市再生機構東京都心支社勝どき駅前再開発事務所"
                        },
                        "osm_id": "1420798614"
                    },
                    {
                        "name": {
                            "ja": "CBC株式会社",
                            "en": "CBC株式会社",
                            "zh": "CBC株式会社"
                        },
                        "osm_id": "5324820933"
                    },
                    {
                        "name": {
                            "ja": "三井のリハウス",
                            "en": "三井のリハウス",
                            "zh": "三井のリハウス"
                        },
                        "osm_id": "5369383115"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Local Gourmet",
                    "ja": "ご当地グルメ",
                    "zh": "在地美食"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:TokyoMetro.Yurakucho.Toyosu": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 93,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "杵屋",
                            "en": "杵屋",
                            "zh": "杵屋"
                        },
                        "osm_id": "942519213"
                    },
                    {
                        "name": {
                            "ja": "ファーストキッチン",
                            "en": "First Kitchen",
                            "zh": "ファーストキッチン"
                        },
                        "osm_id": "1237995845"
                    },
                    {
                        "name": {
                            "ja": "信州そば そじ坊",
                            "en": "信州そば そじ坊",
                            "zh": "信州そば そじ坊"
                        },
                        "osm_id": "1237995852"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 64,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "デイリーヤマザキ",
                            "en": "Daily Yamazaki",
                            "zh": "デイリーヤマザキ"
                        },
                        "osm_id": "2127050534"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "2672580548"
                    },
                    {
                        "name": {
                            "ja": "屋台DELi",
                            "en": "屋台DELi",
                            "zh": "屋台DELi"
                        },
                        "osm_id": "2672580549"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 1,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "三井ガーデンホテル豊洲プレミア",
                            "en": "Mitsui Garden Hotel Toyosu Premier",
                            "zh": "三井ガーデンホテル豊洲プレミア"
                        },
                        "osm_id": "13129739070"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 5,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "江東区立豊洲図書館",
                            "en": "Toyosu Library",
                            "zh": "江東区立豊洲図書館"
                        },
                        "osm_id": "1420787710"
                    },
                    {
                        "name": {
                            "ja": "ユナイテッド・シネマ",
                            "en": "United Cinemas",
                            "zh": "ユナイテッド・シネマ"
                        },
                        "osm_id": "3908984179"
                    },
                    {
                        "name": {
                            "ja": "VIA-Wall",
                            "en": "VIA-Wall",
                            "zh": "VIA-Wall"
                        },
                        "osm_id": "4300127616"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 9,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "豊洲公園",
                            "en": "District Toyosu Park",
                            "zh": "豊洲公園"
                        },
                        "osm_id": "22823726"
                    },
                    {
                        "name": {
                            "ja": "豊洲四丁目公園",
                            "en": "Toyosu 4-chome park",
                            "zh": "豊洲四丁目公園"
                        },
                        "osm_id": "188552624"
                    },
                    {
                        "name": {
                            "ja": "豊洲四丁目公園",
                            "en": "豊洲四丁目公園",
                            "zh": "豊洲四丁目公園"
                        },
                        "osm_id": "188552625"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 8,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "住友林業ホームサービス",
                            "en": "住友林業ホームサービス",
                            "zh": "住友林業ホームサービス"
                        },
                        "osm_id": "4254117291"
                    },
                    {
                        "name": {
                            "ja": "Century21",
                            "en": "Century21",
                            "zh": "Century21"
                        },
                        "osm_id": "11230126282"
                    },
                    {
                        "name": {
                            "ja": "Startline",
                            "en": "Startline",
                            "zh": "Startline"
                        },
                        "osm_id": "11230126287"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "family_friendly",
                "label": {
                    "en": "Family Friendly",
                    "ja": "家族向け",
                    "zh": "親子友善"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Joban.KitaSenju": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 272,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ガスト",
                            "en": "Gusto",
                            "zh": "ガスト"
                        },
                        "osm_id": "1921443824"
                    },
                    {
                        "name": {
                            "ja": "マクドナルド",
                            "en": "McDonald's",
                            "zh": "マクドナルド"
                        },
                        "osm_id": "1921444714"
                    },
                    {
                        "name": {
                            "ja": "モスバーガー",
                            "en": "MOS Burger",
                            "zh": "モスバーガー"
                        },
                        "osm_id": "1993365031"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 264,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "スーパーたなか",
                            "en": "スーパーたなか",
                            "zh": "スーパーたなか"
                        },
                        "osm_id": "892720683"
                    },
                    {
                        "name": {
                            "ja": "イトーヨーカドー",
                            "en": "Ito-Yokado",
                            "zh": "イトーヨーカドー"
                        },
                        "osm_id": "1921443828"
                    },
                    {
                        "name": {
                            "ja": "青山フラワーマーケット",
                            "en": "Aoyama Flower Market",
                            "zh": "青山フラワーマーケット"
                        },
                        "osm_id": "1950724464"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 4,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "グランパーク・イン",
                            "en": "GRANDPARK-INN",
                            "zh": "グランパーク・イン"
                        },
                        "osm_id": "6759749389"
                    },
                    {
                        "name": {
                            "ja": "アーバイン東京・上野 北千住",
                            "en": "Urbain Tokyo Ueno Kitasenju",
                            "zh": "アーバイン東京・上野 北千住"
                        },
                        "osm_id": "9309774587"
                    },
                    {
                        "name": {
                            "ja": "グランパーク・イン",
                            "en": "グランパーク・イン",
                            "zh": "グランパーク・イン"
                        },
                        "osm_id": "9309994467"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 2,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "足立区立常東コミュニティ図書館",
                            "en": "Community Library",
                            "zh": "足立区立常東コミュニティ図書館"
                        },
                        "osm_id": "1420798485"
                    },
                    {
                        "name": {
                            "ja": "シネマブルースタジオ",
                            "en": "シネマブルースタジオ",
                            "zh": "シネマブルースタジオ"
                        },
                        "osm_id": "9488583217"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 4,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "千住旭公園",
                            "en": "千住旭公園",
                            "zh": "千住旭公園"
                        },
                        "osm_id": "33439082"
                    },
                    {
                        "name": {
                            "ja": "千住宿 高札場",
                            "en": "千住宿 高札場",
                            "zh": "千住宿 高札場"
                        },
                        "osm_id": "224120506"
                    },
                    {
                        "name": {
                            "ja": "うさぎとかめのプチテラス",
                            "en": "うさぎとかめのプチテラス",
                            "zh": "うさぎとかめのプチテラス"
                        },
                        "osm_id": "719345438"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 48,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "みずほ銀行不動産販売",
                            "en": "みずほ銀行不動産販売",
                            "zh": "みずほ銀行不動産販売"
                        },
                        "osm_id": "4516476453"
                    },
                    {
                        "name": {
                            "ja": "吉村商事",
                            "en": "Yoshimura's",
                            "zh": "吉村商事"
                        },
                        "osm_id": "4516476475"
                    },
                    {
                        "name": {
                            "ja": "株式会社確認サービス　北千住支店",
                            "en": "株式会社確認サービス　北千住支店",
                            "zh": "株式会社確認サービス　北千住支店"
                        },
                        "osm_id": "4976567201"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "book_town",
                "label": {
                    "en": "Book Town",
                    "ja": "本の街",
                    "zh": "書街"
                },
                "score": 5
            },
            {
                "id": "izakaya",
                "label": {
                    "en": "Izakaya Alleys",
                    "ja": "飲み屋街",
                    "zh": "居酒屋街"
                },
                "score": 4
            },
            {
                "id": "high_end",
                "label": {
                    "en": "High-end",
                    "ja": "高級・洗練",
                    "zh": "高級時尚"
                },
                "score": 4
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "family_friendly",
                "label": {
                    "en": "Family Friendly",
                    "ja": "家族向け",
                    "zh": "親子友善"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Yamanote.Osaki": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 51,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "日本海海の華 (Uminohana)",
                            "en": "日本海海の華 (Uminohana)",
                            "zh": "日本海海の華 (Uminohana)"
                        },
                        "osm_id": "843103042"
                    },
                    {
                        "name": {
                            "ja": "とりいち",
                            "en": "とりいち",
                            "zh": "とりいち"
                        },
                        "osm_id": "843115863"
                    },
                    {
                        "name": {
                            "ja": "Soup Stock",
                            "en": "Soup Stock",
                            "zh": "Soup Stock"
                        },
                        "osm_id": "876563874"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 43,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "843113168"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "843117678"
                    },
                    {
                        "name": {
                            "ja": "トモズ",
                            "en": "Tomod's",
                            "zh": "トモズ"
                        },
                        "osm_id": "1881811902"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 2,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "DualTap",
                            "en": "DualTap",
                            "zh": "DualTap"
                        },
                        "osm_id": "4811638021"
                    },
                    {
                        "name": {
                            "ja": "ダイワロイネットホテル東京大崎",
                            "en": "ダイワロイネットホテル東京大崎",
                            "zh": "ダイワロイネットホテル東京大崎"
                        },
                        "osm_id": "187653176"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 3,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Ｏ美術館",
                            "en": "O Art Museum",
                            "zh": "Ｏ美術館"
                        },
                        "osm_id": "1420800659"
                    },
                    {
                        "name": {
                            "ja": "木立",
                            "en": "木立",
                            "zh": "木立"
                        },
                        "osm_id": "5284966928"
                    },
                    {
                        "name": {
                            "ja": "品川区立大崎図書館分館",
                            "en": "品川区立大崎図書館分館",
                            "zh": "品川区立大崎図書館分館"
                        },
                        "osm_id": "6185790590"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 7,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "北品川ホームズ公園",
                            "en": "北品川ホームズ公園",
                            "zh": "北品川ホームズ公園"
                        },
                        "osm_id": "227890218"
                    },
                    {
                        "name": {
                            "ja": "品川区立 小関公園",
                            "en": "品川区立 小関公園",
                            "zh": "品川区立 小関公園"
                        },
                        "osm_id": "227890219"
                    },
                    {
                        "name": {
                            "ja": "御成橋公園",
                            "en": "御成橋公園",
                            "zh": "御成橋公園"
                        },
                        "osm_id": "283327096"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 5,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "かんぽ生命東京事務サービスセンター",
                            "en": "JP Life Tokyo Service Center",
                            "zh": "かんぽ生命東京事務サービスセンター"
                        },
                        "osm_id": "1420781145"
                    },
                    {
                        "name": {
                            "ja": "岩崎不動産",
                            "en": "岩崎不動産",
                            "zh": "岩崎不動産"
                        },
                        "osm_id": "7669232272"
                    },
                    {
                        "name": {
                            "ja": "テン・リアル エステート",
                            "en": "テン・リアル エステート",
                            "zh": "テン・リアル エステート"
                        },
                        "osm_id": "7669262639"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Yamanote.Takadanobaba": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 173,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "タパス・タパス",
                            "en": "タパス・タパス",
                            "zh": "タパス・タパス"
                        },
                        "osm_id": "1116417294"
                    },
                    {
                        "name": {
                            "ja": "居酒屋 傳王",
                            "en": "居酒屋 傳王",
                            "zh": "居酒屋 傳王"
                        },
                        "osm_id": "1116417304"
                    },
                    {
                        "name": {
                            "ja": "食事処 一膳",
                            "en": "食事処 一膳",
                            "zh": "食事処 一膳"
                        },
                        "osm_id": "1116423369"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 117,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "元祖仲屋むげん堂伍番組",
                            "en": "元祖仲屋むげん堂伍番組",
                            "zh": "元祖仲屋むげん堂伍番組"
                        },
                        "osm_id": "1116417292"
                    },
                    {
                        "name": {
                            "ja": "Shoe Repair Shop",
                            "en": "Shoe Repair Shop",
                            "zh": "Shoe Repair Shop"
                        },
                        "osm_id": "1116417296"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "1116417299"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 4,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "相鉄グランドフレッサ 高田馬場",
                            "en": "sotetsu GrandFresa Takadababa",
                            "zh": "相鉄グランドフレッサ 高田馬場"
                        },
                        "osm_id": "2885338395"
                    },
                    {
                        "name": {
                            "ja": "ホテルリブマックス高田馬場駅前",
                            "en": "Hotel Livemax",
                            "zh": "ホテルリブマックス高田馬場駅前"
                        },
                        "osm_id": "6550480479"
                    },
                    {
                        "name": {
                            "ja": "ホテルニュー高田",
                            "en": "ホテルニュー高田",
                            "zh": "ホテルニュー高田"
                        },
                        "osm_id": "155278617"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 3,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "早稲田松竹",
                            "en": "Waseda Chochiku - 早稲田松竹",
                            "zh": "早稲田松竹"
                        },
                        "osm_id": "1116417295"
                    },
                    {
                        "name": {
                            "ja": "平和の女神像",
                            "en": "平和の女神像",
                            "zh": "平和の女神像"
                        },
                        "osm_id": "1116455531"
                    },
                    {
                        "name": {
                            "ja": "つまみかんざし博物館",
                            "en": "Tsumami Kanzashi Museum",
                            "zh": "つまみかんざし博物館"
                        },
                        "osm_id": "6490388463"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 9,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "神田川親水テラス",
                            "en": "神田川親水テラス",
                            "zh": "神田川親水テラス"
                        },
                        "osm_id": "12599698468"
                    },
                    {
                        "name": {
                            "ja": "都立戸山公園",
                            "en": "Toyama Park",
                            "zh": "都立戸山公園"
                        },
                        "osm_id": "94518684"
                    },
                    {
                        "name": {
                            "ja": "西戸山公園",
                            "en": "西戸山公園",
                            "zh": "西戸山公園"
                        },
                        "osm_id": "467848619"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 16,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ホームメイト",
                            "en": "Homemate",
                            "zh": "ホームメイト"
                        },
                        "osm_id": "1116423380"
                    },
                    {
                        "name": {
                            "ja": "アパマンショップ",
                            "en": "Apaman Shop",
                            "zh": "アパマンショップ"
                        },
                        "osm_id": "1143721571"
                    },
                    {
                        "name": {
                            "ja": "TOJO HOUSE",
                            "en": "TOJO HOUSE",
                            "zh": "TOJO HOUSE"
                        },
                        "osm_id": "5020330824"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "book_town",
                "label": {
                    "en": "Book Town",
                    "ja": "本の街",
                    "zh": "書街"
                },
                "score": 5
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Sobu.NishiFunabashi": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 62,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "マクドナルド",
                            "en": "McDonald's",
                            "zh": "マクドナルド"
                        },
                        "osm_id": "298954114"
                    },
                    {
                        "name": {
                            "ja": "松屋",
                            "en": "Matsuya",
                            "zh": "松屋"
                        },
                        "osm_id": "298954768"
                    },
                    {
                        "name": {
                            "ja": "吉野家",
                            "en": "Yoshinoya",
                            "zh": "吉野家"
                        },
                        "osm_id": "298954831"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 56,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "サンクス",
                            "en": "Sunkus",
                            "zh": "サンクス"
                        },
                        "osm_id": "1093224456"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "1889391254"
                    },
                    {
                        "name": {
                            "ja": "ソフトバンクショップ",
                            "en": "SoftBankShop",
                            "zh": "ソフトバンクショップ"
                        },
                        "osm_id": "1889391258"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 1,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ホテルシャトー",
                            "en": "ホテルシャトー",
                            "zh": "ホテルシャトー"
                        },
                        "osm_id": "1990915722"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 1,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "船橋市西図書館",
                            "en": "Funabashi City West Library",
                            "zh": "船橋市西図書館"
                        },
                        "osm_id": "2199379040"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 3,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "勝間田公園",
                            "en": "Katsumada park",
                            "zh": "勝間田公園"
                        },
                        "osm_id": "27239593"
                    },
                    {
                        "name": {
                            "ja": "西船近隣公園",
                            "en": "西船近隣公園",
                            "zh": "西船近隣公園"
                        },
                        "osm_id": "192613039"
                    },
                    {
                        "name": {
                            "ja": "西船4丁目緑地",
                            "en": "西船4丁目緑地",
                            "zh": "西船4丁目緑地"
                        },
                        "osm_id": "430070504"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 21,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "三井のリハウス",
                            "en": "三井のリハウス",
                            "zh": "三井のリハウス"
                        },
                        "osm_id": "2197550879"
                    },
                    {
                        "name": {
                            "ja": "ピタットハウス",
                            "en": "Pitat House",
                            "zh": "ピタットハウス"
                        },
                        "osm_id": "2199375952"
                    },
                    {
                        "name": {
                            "ja": "ホームメイト",
                            "en": "ホームメイト",
                            "zh": "ホームメイト"
                        },
                        "osm_id": "2199379179"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Joban.MinamiSenju": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 69,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "尾花",
                            "en": "Obana",
                            "zh": "尾花"
                        },
                        "osm_id": "573262199"
                    },
                    {
                        "name": {
                            "ja": "サイゼリヤ",
                            "en": "Saizeriya",
                            "zh": "サイゼリヤ"
                        },
                        "osm_id": "1690493160"
                    },
                    {
                        "name": {
                            "ja": "くら寿司",
                            "en": "Kura Sushi",
                            "zh": "くら寿司"
                        },
                        "osm_id": "1690494619"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 75,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "リブレ京成",
                            "en": "Livre Keisei",
                            "zh": "リブレ京成"
                        },
                        "osm_id": "441689469"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "441689910"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "1690483789"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 12,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ビジネスホテル松島",
                            "en": "ビジネスホテル松島",
                            "zh": "ビジネスホテル松島"
                        },
                        "osm_id": "6679929860"
                    },
                    {
                        "name": {
                            "ja": "ビジネスホテル福千",
                            "en": "ビジネスホテル福千",
                            "zh": "ビジネスホテル福千"
                        },
                        "osm_id": "6679929869"
                    },
                    {
                        "name": {
                            "ja": "サンパレス",
                            "en": "サンパレス",
                            "zh": "サンパレス"
                        },
                        "osm_id": "9175653964"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 2,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "首切地蔵",
                            "en": "Beheading Jizo",
                            "zh": "首切地蔵"
                        },
                        "osm_id": "7888550664"
                    },
                    {
                        "name": {
                            "ja": "松尾芭蕉 奥の細道 矢立初めの地",
                            "en": "松尾芭蕉 奥の細道 矢立初めの地",
                            "zh": "松尾芭蕉 奥の細道 矢立初めの地"
                        },
                        "osm_id": "9175927253"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 6,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "南千住五丁目防災広場",
                            "en": "Minami Senju 5-Chome Disaster Space",
                            "zh": "南千住五丁目防災広場"
                        },
                        "osm_id": "234406665"
                    },
                    {
                        "name": {
                            "ja": "三瑞児童遊園",
                            "en": "三瑞児童遊園",
                            "zh": "三瑞児童遊園"
                        },
                        "osm_id": "234961549"
                    },
                    {
                        "name": {
                            "ja": "南千住六丁目児童遊園",
                            "en": "Minami-Senju Rokuchome Children's Playground",
                            "zh": "南千住六丁目児童遊園"
                        },
                        "osm_id": "234961551"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 7,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "エイケン",
                            "en": "Eiken Anime",
                            "zh": "エイケン"
                        },
                        "osm_id": "7020964110"
                    },
                    {
                        "name": {
                            "ja": "みなと住販",
                            "en": "みなと住販",
                            "zh": "みなと住販"
                        },
                        "osm_id": "9175633516"
                    },
                    {
                        "name": {
                            "ja": "MQA",
                            "en": "MQA",
                            "zh": "MQA"
                        },
                        "osm_id": "9175935845"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "sakura",
                "label": {
                    "en": "Sakura Spot",
                    "ja": "桜の名所",
                    "zh": "賞櫻勝地"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Yamanote.Tamachi": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 300,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "エクセルシオール",
                            "en": "EXELCIOR",
                            "zh": "エクセルシオール"
                        },
                        "osm_id": "393075631"
                    },
                    {
                        "name": {
                            "ja": "マクドナルド",
                            "en": "McDonald's",
                            "zh": "マクドナルド"
                        },
                        "osm_id": "563658800"
                    },
                    {
                        "name": {
                            "ja": "ケンタッキーフライドチキン",
                            "en": "KFC",
                            "zh": "ケンタッキーフライドチキン"
                        },
                        "osm_id": "563658801"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 116,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ローソン",
                            "en": "Lawson",
                            "zh": "ローソン"
                        },
                        "osm_id": "393075655"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "745684629"
                    },
                    {
                        "name": {
                            "ja": "ローソン",
                            "en": "Lawson",
                            "zh": "ローソン"
                        },
                        "osm_id": "750873881"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 7,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "カプセルイン田町",
                            "en": "Capsule Inn Tamachi",
                            "zh": "カプセルイン田町"
                        },
                        "osm_id": "1484734053"
                    },
                    {
                        "name": {
                            "ja": "相鉄フレッサイン",
                            "en": "Sotetsu Fresa Inn",
                            "zh": "相鉄フレッサイン"
                        },
                        "osm_id": "2794707535"
                    },
                    {
                        "name": {
                            "ja": "Hotel Villa Fontaine Tamachi",
                            "en": "Hotel Villa Fontaine Tamachi",
                            "zh": "Hotel Villa Fontaine Tamachi"
                        },
                        "osm_id": "4130115103"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 5,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "港区立港郷土資料館",
                            "en": "Minato Local Museum",
                            "zh": "港区立港郷土資料館"
                        },
                        "osm_id": "1420789248"
                    },
                    {
                        "name": {
                            "ja": "三田NNホール",
                            "en": "Mita NN Hall",
                            "zh": "三田NNホール"
                        },
                        "osm_id": "2163859019"
                    },
                    {
                        "name": {
                            "ja": "健康像",
                            "en": "Health Statue",
                            "zh": "健康像"
                        },
                        "osm_id": "2345123814"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 3,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "本芝公園",
                            "en": "Honshiba Park",
                            "zh": "本芝公園"
                        },
                        "osm_id": "104112028"
                    },
                    {
                        "name": {
                            "ja": "芝浦公園",
                            "en": "Shibaura Park",
                            "zh": "芝浦公園"
                        },
                        "osm_id": "741784663"
                    },
                    {
                        "name": {
                            "ja": "新芝運河沿緑地",
                            "en": "新芝運河沿緑地",
                            "zh": "新芝運河沿緑地"
                        },
                        "osm_id": "1033379660"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 46,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "花判",
                            "en": "Hanahan",
                            "zh": "花判"
                        },
                        "osm_id": "1419123564"
                    },
                    {
                        "name": {
                            "ja": "三菱自動車",
                            "en": "Mitsubishi Motors",
                            "zh": "三菱自動車"
                        },
                        "osm_id": "1633859734"
                    },
                    {
                        "name": {
                            "ja": "Central Tanshi",
                            "en": "Central Tanshi",
                            "zh": "Central Tanshi"
                        },
                        "osm_id": "5616498821"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "high_end",
                "label": {
                    "en": "High-end",
                    "ja": "高級・洗練",
                    "zh": "高級時尚"
                },
                "score": 4
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "power_spot",
                "label": {
                    "en": "Power Spot",
                    "ja": "パワースポット",
                    "zh": "能量景點"
                },
                "score": 3
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "sakura",
                "label": {
                    "en": "Sakura Spot",
                    "ja": "桜の名所",
                    "zh": "賞櫻勝地"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Yamanote.Gotanda": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 116,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ケンタッキーフライドチキン",
                            "en": "KFC",
                            "zh": "ケンタッキーフライドチキン"
                        },
                        "osm_id": "948088082"
                    },
                    {
                        "name": {
                            "ja": "モスバーガー",
                            "en": "MOS Burger",
                            "zh": "モスバーガー"
                        },
                        "osm_id": "948088100"
                    },
                    {
                        "name": {
                            "ja": "吉野家",
                            "en": "Yoshinoya",
                            "zh": "吉野家"
                        },
                        "osm_id": "948088132"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 68,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "1139014156"
                    },
                    {
                        "name": {
                            "ja": "ホームドライ",
                            "en": "ホームドライ",
                            "zh": "ホームドライ"
                        },
                        "osm_id": "1229219134"
                    },
                    {
                        "name": {
                            "ja": "Jan & Taro",
                            "en": "Jan & Taro",
                            "zh": "Jan & Taro"
                        },
                        "osm_id": "1229219139"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 11,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "アリエッタ",
                            "en": "アリエッタ",
                            "zh": "アリエッタ"
                        },
                        "osm_id": "1909537257"
                    },
                    {
                        "name": {
                            "ja": "ホテルロイヤルオーク 五反田",
                            "en": "Hotel Royal Oak Gotanda",
                            "zh": "ホテルロイヤルオーク 五反田"
                        },
                        "osm_id": "2377568463"
                    },
                    {
                        "name": {
                            "ja": "東急ステイ",
                            "en": "東急ステイ",
                            "zh": "東急ステイ"
                        },
                        "osm_id": "2515045296"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 2,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "I am a Girl(元五反田東映)H31212",
                            "en": "I am a Girl(元五反田東映)H31212",
                            "zh": "I am a Girl(元五反田東映)H31212"
                        },
                        "osm_id": "4851163668"
                    },
                    {
                        "name": {
                            "ja": "キリスト像",
                            "en": "Statue of Jesus Christ",
                            "zh": "キリスト像"
                        },
                        "osm_id": "7618153725"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 8,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "五反田南公園",
                            "en": "Gotanda Minami Park",
                            "zh": "五反田南公園"
                        },
                        "osm_id": "201738707"
                    },
                    {
                        "name": {
                            "ja": "光の滝公園",
                            "en": "光の滝公園",
                            "zh": "光の滝公園"
                        },
                        "osm_id": "218950933"
                    },
                    {
                        "name": {
                            "ja": "五反田ふれあい水辺広場",
                            "en": "五反田ふれあい水辺広場",
                            "zh": "五反田ふれあい水辺広場"
                        },
                        "osm_id": "283326134"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 13,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "品川社会保険事務所",
                            "en": "品川社会保険事務所",
                            "zh": "品川社会保険事務所"
                        },
                        "osm_id": "1420771367"
                    },
                    {
                        "name": {
                            "ja": "株式会社ミライト情報システム",
                            "en": "株式会社ミライト情報システム",
                            "zh": "株式会社ミライト情報システム"
                        },
                        "osm_id": "2945833052"
                    },
                    {
                        "name": {
                            "ja": "在東京ペルー総領事館",
                            "en": "Consulate-General of Peru in Tokyo",
                            "zh": "在東京ペルー総領事館"
                        },
                        "osm_id": "6334705090"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Yamanote.Uguisudani": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 106,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "パティシエ・イナムラショウゾウ",
                            "en": "Patissier Inamura Shozo",
                            "zh": "パティシエ・イナムラショウゾウ"
                        },
                        "osm_id": "380533962"
                    },
                    {
                        "name": {
                            "ja": "ホテルオークラ ガーデンテラス",
                            "en": "Hotel Okura Garden Terrace",
                            "zh": "ホテルオークラ ガーデンテラス"
                        },
                        "osm_id": "2295399998"
                    },
                    {
                        "name": {
                            "ja": "Gokan Kitchen",
                            "en": "Gokan Kitchen",
                            "zh": "Gokan Kitchen"
                        },
                        "osm_id": "3166206383"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 70,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "3730548024"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "3981432026"
                    },
                    {
                        "name": {
                            "ja": "ローソン",
                            "en": "Lawson",
                            "zh": "ローソン"
                        },
                        "osm_id": "5050469889"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 8,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Oak Hostel Zen",
                            "en": "Oak Hostel Zen",
                            "zh": "Oak Hostel Zen"
                        },
                        "osm_id": "4317791280"
                    },
                    {
                        "name": {
                            "ja": "Inno Hostel & Pub Lounge Ueno",
                            "en": "Inno Hostel & Pub Lounge Ueno",
                            "zh": "Inno Hostel & Pub Lounge Ueno"
                        },
                        "osm_id": "5123679166"
                    },
                    {
                        "name": {
                            "ja": "Lodging Tokyo Uguisudani",
                            "en": "Lodging Tokyo Uguisudani",
                            "zh": "Lodging Tokyo Uguisudani"
                        },
                        "osm_id": "11408963769"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 9,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "台東区立書道博物館",
                            "en": "Calligraphy Museum",
                            "zh": "台東区立書道博物館"
                        },
                        "osm_id": "1420771103"
                    },
                    {
                        "name": {
                            "ja": "国際こども図書館",
                            "en": "International Library of Children's Literature",
                            "zh": "国际儿童图书馆"
                        },
                        "osm_id": "2768956946"
                    },
                    {
                        "name": {
                            "ja": "東京藝術大学奏楽堂",
                            "en": "Sogakudo Concert Hall",
                            "zh": "東京藝術大学奏楽堂"
                        },
                        "osm_id": "4218446136"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 4,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "防災広場 根岸の里",
                            "en": "Negishi-no-Sato Disaster Prevention Park",
                            "zh": "防災広場 根岸の里"
                        },
                        "osm_id": "237215687"
                    },
                    {
                        "name": {
                            "ja": "鶯谷公園",
                            "en": "Uguisudani Park",
                            "zh": "鶯谷公園"
                        },
                        "osm_id": "238465930"
                    },
                    {
                        "name": {
                            "ja": "根岸2丁目児童遊園",
                            "en": "根岸2丁目児童遊園",
                            "zh": "根岸2丁目児童遊園"
                        },
                        "osm_id": "254602421"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 13,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "菊池税務会計",
                            "en": "菊池税務会計",
                            "zh": "菊池税務会計"
                        },
                        "osm_id": "5051493204"
                    },
                    {
                        "name": {
                            "ja": "城北商事不動産部",
                            "en": "城北商事不動産部",
                            "zh": "城北商事不動産部"
                        },
                        "osm_id": "5051493206"
                    },
                    {
                        "name": {
                            "ja": "トキエステート",
                            "en": "Toki Estate",
                            "zh": "トキエステート"
                        },
                        "osm_id": "5119793632"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "student_area",
                "label": {
                    "en": "Student Area",
                    "ja": "学生街",
                    "zh": "學生區"
                },
                "score": 3
            },
            {
                "id": "high_end",
                "label": {
                    "en": "High-end",
                    "ja": "高級・洗練",
                    "zh": "高級時尚"
                },
                "score": 4
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "family_friendly",
                "label": {
                    "en": "Family Friendly",
                    "ja": "家族向け",
                    "zh": "親子友善"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "sakura",
                "label": {
                    "en": "Sakura Spot",
                    "ja": "桜の名所",
                    "zh": "賞櫻勝地"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Yamanote.Sugamo": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 97,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "スカイ",
                            "en": "Sky",
                            "zh": "スカイ"
                        },
                        "osm_id": "1870958141"
                    },
                    {
                        "name": {
                            "ja": "マクドナルド",
                            "en": "McDonald's",
                            "zh": "マクドナルド"
                        },
                        "osm_id": "1880776561"
                    },
                    {
                        "name": {
                            "ja": "鰻 ながしま",
                            "en": "Nagashima",
                            "zh": "鰻 ながしま"
                        },
                        "osm_id": "1880786572"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 137,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "伊勢屋",
                            "en": "Iseya",
                            "zh": "伊勢屋"
                        },
                        "osm_id": "1870958137"
                    },
                    {
                        "name": {
                            "ja": "近江",
                            "en": "近江",
                            "zh": "近江"
                        },
                        "osm_id": "1871346809"
                    },
                    {
                        "name": {
                            "ja": "大阪屋プラザ",
                            "en": "Osakaya Plaza",
                            "zh": "大阪屋プラザ"
                        },
                        "osm_id": "1871348580"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 5,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "アパホテル 巣鴨駅前",
                            "en": "APA Hotel",
                            "zh": "アパホテル 巣鴨駅前"
                        },
                        "osm_id": "5559190032"
                    },
                    {
                        "name": {
                            "ja": "ホテル メンテルス 巣鴨",
                            "en": "ホテル メンテルス 巣鴨",
                            "zh": "ホテル メンテルス 巣鴨"
                        },
                        "osm_id": "5564136320"
                    },
                    {
                        "name": {
                            "ja": "ネットルーム マンボー 巣鴨店",
                            "en": "ネットルーム マンボー 巣鴨店",
                            "zh": "ネットルーム マンボー 巣鴨店"
                        },
                        "osm_id": "5564363181"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 4,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "LIVE HOUSE 獅子王",
                            "en": "Live House Shishio",
                            "zh": "LIVE HOUSE 獅子王"
                        },
                        "osm_id": "6218895385"
                    },
                    {
                        "name": {
                            "ja": "MADAMADA",
                            "en": "MADAMADA",
                            "zh": "MADAMADA"
                        },
                        "osm_id": "7365694644"
                    },
                    {
                        "name": {
                            "ja": "KOREKARA",
                            "en": "KOREKARA",
                            "zh": "KOREKARA"
                        },
                        "osm_id": "12395567240"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 4,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "江戸橋公園",
                            "en": "江戸橋公園",
                            "zh": "江戸橋公園"
                        },
                        "osm_id": "176156954"
                    },
                    {
                        "name": {
                            "ja": "文京宮下公園",
                            "en": "Bunkyomiya-shita Park",
                            "zh": "文京宮下公園"
                        },
                        "osm_id": "176688064"
                    },
                    {
                        "name": {
                            "ja": "駒込西公園",
                            "en": "駒込西公園",
                            "zh": "駒込西公園"
                        },
                        "osm_id": "566098102"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 31,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ガモールSHODAI",
                            "en": "ガモールSHODAI",
                            "zh": "ガモールSHODAI"
                        },
                        "osm_id": "1872086296"
                    },
                    {
                        "name": {
                            "ja": "有限会社デザインオフィスアドップ",
                            "en": "Design Office Adop",
                            "zh": "有限会社デザインオフィスアドップ"
                        },
                        "osm_id": "2358885245"
                    },
                    {
                        "name": {
                            "ja": "KMビル",
                            "en": "KM Building",
                            "zh": "KMビル"
                        },
                        "osm_id": "2530414104"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "power_spot",
                "label": {
                    "en": "Power Spot",
                    "ja": "パワースポット",
                    "zh": "能量景點"
                },
                "score": 3
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "grandma_harajuku",
                "label": {
                    "en": "Grandma's Harajuku",
                    "ja": "おばあちゃんの原宿",
                    "zh": "老奶奶的原宿"
                },
                "score": 5
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.KeihinTohoku.Akabane": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 160,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "白頭山",
                            "en": "Hakutosan",
                            "zh": "白頭山"
                        },
                        "osm_id": "1405238402"
                    },
                    {
                        "name": {
                            "ja": "ケンタッキーフライドチキン",
                            "en": "KFC",
                            "zh": "ケンタッキーフライドチキン"
                        },
                        "osm_id": "1405245956"
                    },
                    {
                        "name": {
                            "ja": "吉野家",
                            "en": "Yoshinoya",
                            "zh": "吉野家"
                        },
                        "osm_id": "1405246069"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 129,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "イトーヨーカドー",
                            "en": "Ito-Yokado",
                            "zh": "イトーヨーカドー"
                        },
                        "osm_id": "1405245954"
                    },
                    {
                        "name": {
                            "ja": "サンメリー 赤羽店",
                            "en": "サンメリー 赤羽店",
                            "zh": "サンメリー 赤羽店"
                        },
                        "osm_id": "1405245955"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "1405245957"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 16,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "スーパーホテル",
                            "en": "SuperHotel Akabane",
                            "zh": "スーパーホテル"
                        },
                        "osm_id": "1783452077"
                    },
                    {
                        "name": {
                            "ja": "ダイワロイネットホテル東京赤羽",
                            "en": "Daiwa Roynet Hotel Tokyo-Akabane",
                            "zh": "ダイワロイネットホテル東京赤羽"
                        },
                        "osm_id": "1784387926"
                    },
                    {
                        "name": {
                            "ja": "サンライズイン赤羽",
                            "en": "サンライズイン赤羽",
                            "zh": "サンライズイン赤羽"
                        },
                        "osm_id": "1784387930"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 5,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "北区立赤羽図書館",
                            "en": "北区立赤羽図書館",
                            "zh": "北区立赤羽図書館"
                        },
                        "osm_id": "1420767975"
                    },
                    {
                        "name": {
                            "ja": "赤羽会館",
                            "en": "Akabane Kaikan",
                            "zh": "赤羽会館"
                        },
                        "osm_id": "2521730888"
                    },
                    {
                        "name": {
                            "ja": "⚪︎△◻︎大拙考",
                            "en": "⚪︎△◻︎大拙考",
                            "zh": "⚪︎△◻︎大拙考"
                        },
                        "osm_id": "2558053466"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 2,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "赤羽公園",
                            "en": "Akabane Park",
                            "zh": "赤羽公園"
                        },
                        "osm_id": "157633618"
                    },
                    {
                        "name": {
                            "ja": "赤羽東公園",
                            "en": "赤羽東公園",
                            "zh": "赤羽東公園"
                        },
                        "osm_id": "247972410"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 20,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "大和証券",
                            "en": "Daiwa Securities",
                            "zh": "大和証券"
                        },
                        "osm_id": "2548143942"
                    },
                    {
                        "name": {
                            "ja": "ほけんの窓口",
                            "en": "ほけんの窓口",
                            "zh": "ほけんの窓口"
                        },
                        "osm_id": "2558149514"
                    },
                    {
                        "name": {
                            "ja": "三愛ハウス株式会社",
                            "en": "三愛ハウス株式会社",
                            "zh": "三愛ハウス株式会社"
                        },
                        "osm_id": "2558151834"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Chuo.Yotsuya": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 71,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "タリーズコーヒー",
                            "en": "Tully's Coffee",
                            "zh": "タリーズコーヒー"
                        },
                        "osm_id": "1482079801"
                    },
                    {
                        "name": {
                            "ja": "エクセルシオール カフェ",
                            "en": "EXCELSIOR CAFE",
                            "zh": "エクセルシオール カフェ"
                        },
                        "osm_id": "1746027104"
                    },
                    {
                        "name": {
                            "ja": "カフェ・ド・クリエ",
                            "en": "CAFE de CRIE",
                            "zh": "カフェ・ド・クリエ"
                        },
                        "osm_id": "1916857683"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 34,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "肉のハナマサ",
                            "en": "肉のハナマサ",
                            "zh": "肉のハナマサ"
                        },
                        "osm_id": "1463983621"
                    },
                    {
                        "name": {
                            "ja": "サンクス",
                            "en": "Sunkus",
                            "zh": "サンクス"
                        },
                        "osm_id": "1746027106"
                    },
                    {
                        "name": {
                            "ja": "ポプラ",
                            "en": "Poplar",
                            "zh": "ポプラ"
                        },
                        "osm_id": "1911190931"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 3,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Mikuni",
                            "en": "Mikuni",
                            "zh": "Mikuni"
                        },
                        "osm_id": "4546326389"
                    },
                    {
                        "name": {
                            "ja": "Tokyu Stay Yotsuya",
                            "en": "Tokyu Stay Yotsuya",
                            "zh": "Tokyu Stay Yotsuya"
                        },
                        "osm_id": "5808307253"
                    },
                    {
                        "name": {
                            "ja": "Hotel Keihan",
                            "en": "Hotel Keihan",
                            "zh": "Hotel Keihan"
                        },
                        "osm_id": "11060928475"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 2,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "永遠なる少女",
                            "en": "永遠なる少女",
                            "zh": "永遠なる少女"
                        },
                        "osm_id": "3949450136"
                    },
                    {
                        "name": {
                            "ja": "国際交流基金ライブラリー",
                            "en": "国際交流基金ライブラリー",
                            "zh": "国際交流基金ライブラリー"
                        },
                        "osm_id": "8068971329"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 2,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "仲良し公園",
                            "en": "仲良し公園",
                            "zh": "仲良し公園"
                        },
                        "osm_id": "134871003"
                    },
                    {
                        "name": {
                            "ja": "四谷見附公園",
                            "en": "Yotsuya Mitsuke Park",
                            "zh": "四谷見附公園"
                        },
                        "osm_id": "556414550"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 14,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Nekomado",
                            "en": "Nekomado",
                            "zh": "Nekomado"
                        },
                        "osm_id": "5203525122"
                    },
                    {
                        "name": {
                            "ja": "７＆ｉ本社",
                            "en": "７＆ｉ本社",
                            "zh": "７＆ｉ本社"
                        },
                        "osm_id": "6058914485"
                    },
                    {
                        "name": {
                            "ja": "トイボックス",
                            "en": "ToyBox Inc.",
                            "zh": "トイボックス"
                        },
                        "osm_id": "8151037310"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Chuo.Ogikubo": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 200,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "マクドナルド",
                            "en": "McDonald's",
                            "zh": "マクドナルド"
                        },
                        "osm_id": "849435873"
                    },
                    {
                        "name": {
                            "ja": "Chant Chant",
                            "en": "Chant Chant",
                            "zh": "Chant Chant"
                        },
                        "osm_id": "942520328"
                    },
                    {
                        "name": {
                            "ja": "あみ八",
                            "en": "あみ八",
                            "zh": "あみ八"
                        },
                        "osm_id": "988962166"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 214,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "メガネスーパー",
                            "en": "Meganesuper",
                            "zh": "メガネスーパー"
                        },
                        "osm_id": "942491840"
                    },
                    {
                        "name": {
                            "ja": "big pink",
                            "en": "big pink",
                            "zh": "big pink"
                        },
                        "osm_id": "988947615"
                    },
                    {
                        "name": {
                            "ja": "Ma Belle",
                            "en": "Ma Belle",
                            "zh": "Ma Belle"
                        },
                        "osm_id": "988957033"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 2,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "安心お宿",
                            "en": "Anshin Oyado",
                            "zh": "安心お宿"
                        },
                        "osm_id": "6300856363"
                    },
                    {
                        "name": {
                            "ja": "メルディア荻窪",
                            "en": "メルディア荻窪",
                            "zh": "メルディア荻窪"
                        },
                        "osm_id": "13076149065"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 4,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "だるま座",
                            "en": "だるま座",
                            "zh": "だるま座"
                        },
                        "osm_id": "2106934625"
                    },
                    {
                        "name": {
                            "ja": "郷土博物館分館",
                            "en": "郷土博物館分館",
                            "zh": "郷土博物館分館"
                        },
                        "osm_id": "4861418134"
                    },
                    {
                        "name": {
                            "ja": "たもん",
                            "en": "たもん",
                            "zh": "たもん"
                        },
                        "osm_id": "6424427125"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 5,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "杉並区立おしかわ公園",
                            "en": "杉並区立おしかわ公園",
                            "zh": "杉並区立おしかわ公園"
                        },
                        "osm_id": "88374053"
                    },
                    {
                        "name": {
                            "ja": "大田黒公園",
                            "en": "Ōtaguro Park",
                            "zh": "大田黒公園"
                        },
                        "osm_id": "100013319"
                    },
                    {
                        "name": {
                            "ja": "天沼もえぎ公園",
                            "en": "Amanuma Moegi Park",
                            "zh": "天沼もえぎ公園"
                        },
                        "osm_id": "130920749"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 75,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "杉並保健所",
                            "en": "杉並保健所",
                            "zh": "杉並保健所"
                        },
                        "osm_id": "849388031"
                    },
                    {
                        "name": {
                            "ja": "東京国税局荻窪税務署",
                            "en": "東京国税局荻窪税務署",
                            "zh": "東京国税局荻窪税務署"
                        },
                        "osm_id": "1420783147"
                    },
                    {
                        "name": {
                            "ja": "フジミネットワーク",
                            "en": "フジミネットワーク",
                            "zh": "フジミネットワーク"
                        },
                        "osm_id": "1573320013"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "ramen",
                "label": {
                    "en": "Ramen Battleground",
                    "ja": "ラーメン激戦区",
                    "zh": "拉麵激戰區"
                },
                "score": 4
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "business",
                "label": {
                    "en": "Business District",
                    "ja": "ビジネス街",
                    "zh": "商業區"
                },
                "score": 4
            },
            {
                "id": "sakura",
                "label": {
                    "en": "Sakura Spot",
                    "ja": "桜の名所",
                    "zh": "賞櫻勝地"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Sobu.Asakusabashi": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 210,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "麺やまるとも",
                            "en": "麺やまるとも",
                            "zh": "麺やまるとも"
                        },
                        "osm_id": "1138559735"
                    },
                    {
                        "name": {
                            "ja": "IL Mercato",
                            "en": "IL Mercato",
                            "zh": "IL Mercato"
                        },
                        "osm_id": "1590215989"
                    },
                    {
                        "name": {
                            "ja": "アカス",
                            "en": "Aakash",
                            "zh": "アカス"
                        },
                        "osm_id": "1590215999"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 177,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ミニストップ",
                            "en": "Ministop",
                            "zh": "ミニストップ"
                        },
                        "osm_id": "1590215994"
                    },
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "1590216015"
                    },
                    {
                        "name": {
                            "ja": "浅草橋眼鏡店",
                            "en": "浅草橋眼鏡店",
                            "zh": "浅草橋眼鏡店"
                        },
                        "osm_id": "1590216019"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 22,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "東京隅田川ユースホステル",
                            "en": "Tokyo Sumidagawa Youth Hostel",
                            "zh": "東京隅田川ユースホステル"
                        },
                        "osm_id": "401830569"
                    },
                    {
                        "name": {
                            "ja": "コンフォートホテル東京東日本橋",
                            "en": "Comfort Hotel Tokyo Higashi Nihombashi",
                            "zh": "コンフォートホテル東京東日本橋"
                        },
                        "osm_id": "2012214872"
                    },
                    {
                        "name": {
                            "ja": "R&B",
                            "en": "R&B",
                            "zh": "R&B"
                        },
                        "osm_id": "2283943990"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 3,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "台東区立中央図書館浅草橋分室",
                            "en": "Taito Central Library Asakusabashi Branch",
                            "zh": "台東区立中央図書館浅草橋分室"
                        },
                        "osm_id": "1420771101"
                    },
                    {
                        "name": {
                            "ja": "parabolica-bis",
                            "en": "parabolica-bis",
                            "zh": "parabolica-bis"
                        },
                        "osm_id": "3677117862"
                    },
                    {
                        "name": {
                            "ja": "Japan Stationary Museum",
                            "en": "Japan Stationary Museum",
                            "zh": "Japan Stationary Museum"
                        },
                        "osm_id": "6650881085"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 3,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "柳北公園",
                            "en": "Ryuhoku Park",
                            "zh": "柳北公園"
                        },
                        "osm_id": "217378910"
                    },
                    {
                        "name": {
                            "ja": "御蔵前公園",
                            "en": "Mikuramae Park",
                            "zh": "御蔵前公園"
                        },
                        "osm_id": "367535088"
                    },
                    {
                        "name": {
                            "ja": "隅田川テラス",
                            "en": "隅田川テラス",
                            "zh": "隅田川テラス"
                        },
                        "osm_id": "1052058971"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 175,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ライオン株式会社",
                            "en": "Lion Corporation",
                            "zh": "ライオン株式会社"
                        },
                        "osm_id": "3174709238"
                    },
                    {
                        "name": {
                            "ja": "中村不動産",
                            "en": "中村不動産",
                            "zh": "中村不動産"
                        },
                        "osm_id": "4950866707"
                    },
                    {
                        "name": {
                            "ja": "不動産の百番館",
                            "en": "不動産の百番館",
                            "zh": "不動産の百番館"
                        },
                        "osm_id": "4956843761"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "market",
                "label": {
                    "en": "Local Market",
                    "ja": "商店街・市場",
                    "zh": "市場商圈"
                },
                "score": 4
            },
            {
                "id": "wholesale",
                "label": {
                    "en": "Wholesale District",
                    "ja": "問屋街",
                    "zh": "批發街"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            },
            {
                "id": "business",
                "label": {
                    "en": "Business District",
                    "ja": "ビジネス街",
                    "zh": "商業區"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Sobu.Suidobashi": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 122,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Taco Bell",
                            "en": "Taco Bell",
                            "zh": "Taco Bell"
                        },
                        "osm_id": "585670801"
                    },
                    {
                        "name": {
                            "ja": "スターバックス",
                            "en": "Starbucks",
                            "zh": "スターバックス"
                        },
                        "osm_id": "1969374619"
                    },
                    {
                        "name": {
                            "ja": "ギークカフェ水道橋",
                            "en": "Geek Cafe",
                            "zh": "ギークカフェ水道橋"
                        },
                        "osm_id": "2149681741"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 64,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "洋服の青山",
                            "en": "Aoyama Tailor",
                            "zh": "洋服の青山"
                        },
                        "osm_id": "599543584"
                    },
                    {
                        "name": {
                            "ja": "メガネスーパー",
                            "en": "Meganesuper",
                            "zh": "メガネスーパー"
                        },
                        "osm_id": "599544109"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "1969374618"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 13,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "Hotel Wing International Korakuen",
                            "en": "Hotel Wing International Korakuen",
                            "zh": "Hotel Wing International Korakuen"
                        },
                        "osm_id": "943719809"
                    },
                    {
                        "name": {
                            "ja": "庭のホテル 東京",
                            "en": "Hotel Niwa Tokyo",
                            "zh": "庭のホテル 東京"
                        },
                        "osm_id": "3868455500"
                    },
                    {
                        "name": {
                            "ja": "東京グリーンホテル後楽園",
                            "en": "東京グリーンホテル後楽園",
                            "zh": "東京グリーンホテル後楽園"
                        },
                        "osm_id": "5146218843"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 6,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "野球殿堂博物館",
                            "en": "The Baseball Hall of Fame And Museum",
                            "zh": "野球殿堂博物館"
                        },
                        "osm_id": "1420799336"
                    },
                    {
                        "name": {
                            "ja": "シアターGロッソ",
                            "en": "Theatre G Rosso",
                            "zh": "シアターGロッソ"
                        },
                        "osm_id": "1886245081"
                    },
                    {
                        "name": {
                            "ja": "日本大学経済学部図書館",
                            "en": "日本大学経済学部図書館",
                            "zh": "日本大学経済学部図書館"
                        },
                        "osm_id": "3606732125"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 3,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "小石川後楽園",
                            "en": "Koishikawa Kōrakuen Gardens",
                            "zh": "小石川後楽園"
                        },
                        "osm_id": "20028327"
                    },
                    {
                        "name": {
                            "ja": "西神田公園",
                            "en": "Nishi-Kanda Park",
                            "zh": "西神田公園"
                        },
                        "osm_id": "175994185"
                    },
                    {
                        "name": {
                            "ja": "元町公園",
                            "en": "Motomachi Park",
                            "zh": "元町公園"
                        },
                        "osm_id": "175996472"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 33,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "株式会社ゼンリン 東京オフィス",
                            "en": "株式会社ゼンリン 東京オフィス",
                            "zh": "株式会社ゼンリン 東京オフィス"
                        },
                        "osm_id": "1362252591"
                    },
                    {
                        "name": {
                            "ja": "日本貿易保険",
                            "en": "Nippon Export and Investment Insurance",
                            "zh": "日本貿易保険"
                        },
                        "osm_id": "1420781116"
                    },
                    {
                        "name": {
                            "ja": "東京都産業労働局労働相談情報センター",
                            "en": "東京都産業労働局労働相談情報センター",
                            "zh": "東京都産業労働局労働相談情報センター"
                        },
                        "osm_id": "1420785407"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "book_town",
                "label": {
                    "en": "Book Town",
                    "ja": "本の街",
                    "zh": "書街"
                },
                "score": 5
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            },
            {
                "id": "shopping_heaven",
                "label": {
                    "en": "Shoppers Heaven",
                    "ja": "買い物天国",
                    "zh": "購物天堂"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Keiyo.ShinKiba": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 19,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "日本小型船舶検査機構",
                            "en": "日本小型船舶検査機構",
                            "zh": "日本小型船舶検査機構"
                        },
                        "osm_id": "1420781060"
                    },
                    {
                        "name": {
                            "ja": "C&C",
                            "en": "C&C",
                            "zh": "C&C"
                        },
                        "osm_id": "1426116706"
                    },
                    {
                        "name": {
                            "ja": "どさん子",
                            "en": "Dosanko",
                            "zh": "どさん子"
                        },
                        "osm_id": "1426116717"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 4,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ファミリーマート",
                            "en": "FamilyMart",
                            "zh": "ファミリーマート"
                        },
                        "osm_id": "1426116710"
                    },
                    {
                        "name": {
                            "ja": "オクヤマ",
                            "en": "オクヤマ",
                            "zh": "オクヤマ"
                        },
                        "osm_id": "1426116719"
                    },
                    {
                        "name": {
                            "ja": "Wood Shop もくもく",
                            "en": "Wood Shop もくもく",
                            "zh": "Wood Shop もくもく"
                        },
                        "osm_id": "5419405592"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 1,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "JR東日本ホテルメッツ東京ベイ新木場",
                            "en": "JR東日本ホテルメッツ東京ベイ新木場",
                            "zh": "JR東日本ホテルメッツ東京ベイ新木場"
                        },
                        "osm_id": "779119284"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 1,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "木材・合板博物館",
                            "en": "Wood and plywood museum",
                            "zh": "木材・合板博物館"
                        },
                        "osm_id": "6013142728"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 3,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "都立夢の島公園",
                            "en": "Yumenoshima Park",
                            "zh": "梦之岛公园"
                        },
                        "osm_id": "155164275"
                    },
                    {
                        "name": {
                            "ja": "夢の島緑道公園",
                            "en": "Yumenoshima Greenway",
                            "zh": "夢の島緑道公園"
                        },
                        "osm_id": "776885969"
                    },
                    {
                        "name": {
                            "ja": "夢の島緑道公園",
                            "en": "Yumenoshima Greenway",
                            "zh": "夢の島緑道公園"
                        },
                        "osm_id": "1117192942"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "family_friendly",
                "label": {
                    "en": "Family Friendly",
                    "ja": "家族向け",
                    "zh": "親子友善"
                },
                "score": 4
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Sobu.Kameido": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 29,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "軍鶏農場",
                            "en": "Shamonojo",
                            "zh": "軍鶏農場"
                        },
                        "osm_id": "3174724309"
                    },
                    {
                        "name": {
                            "ja": "浜焼太郎",
                            "en": "Hamayakitaro",
                            "zh": "浜焼太郎"
                        },
                        "osm_id": "3382328410"
                    },
                    {
                        "name": {
                            "ja": "mr.kanso",
                            "en": "mr.kanso",
                            "zh": "mr.kanso"
                        },
                        "osm_id": "3382330786"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 49,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "青山フラワーマーケット",
                            "en": "Aoyama Flower Market",
                            "zh": "青山フラワーマーケット"
                        },
                        "osm_id": "1951133122"
                    },
                    {
                        "name": {
                            "ja": "ローソン",
                            "en": "Lawson",
                            "zh": "ローソン"
                        },
                        "osm_id": "2284146576"
                    },
                    {
                        "name": {
                            "ja": "ローソン",
                            "en": "Lawson",
                            "zh": "ローソン"
                        },
                        "osm_id": "2284147438"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 9,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "亀戸南公園",
                            "en": "亀戸南公園",
                            "zh": "亀戸南公園"
                        },
                        "osm_id": "99702626"
                    },
                    {
                        "name": {
                            "ja": "かめ・うさぎ児童遊園",
                            "en": "かめ・うさぎ児童遊園",
                            "zh": "かめ・うさぎ児童遊園"
                        },
                        "osm_id": "154824106"
                    },
                    {
                        "name": {
                            "ja": "亀戸西公園",
                            "en": "亀戸西公園",
                            "zh": "亀戸西公園"
                        },
                        "osm_id": "172655323"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 5,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "東京労働局亀戸労働基準監督署",
                            "en": "東京労働局亀戸労働基準監督署",
                            "zh": "東京労働局亀戸労働基準監督署"
                        },
                        "osm_id": "1420782747"
                    },
                    {
                        "name": {
                            "ja": "東京都産業労働局労働相談情報センター亀戸事務所",
                            "en": "東京都産業労働局労働相談情報センター亀戸事務所",
                            "zh": "東京都産業労働局労働相談情報センター亀戸事務所"
                        },
                        "osm_id": "1420785408"
                    },
                    {
                        "name": {
                            "ja": "江東社会保険事務所",
                            "en": "Koto Social Insurance Office",
                            "zh": "江東社会保険事務所"
                        },
                        "osm_id": "1420787738"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "otaku",
                "label": {
                    "en": "Otaku Culture",
                    "ja": "オタク文化",
                    "zh": "御宅文化"
                },
                "score": 5
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "nature",
                "label": {
                    "en": "Nature & Parks",
                    "ja": "自然・公園",
                    "zh": "自然公園"
                },
                "score": 3
            },
            {
                "id": "family_friendly",
                "label": {
                    "en": "Family Friendly",
                    "ja": "家族向け",
                    "zh": "親子友善"
                },
                "score": 4
            },
            {
                "id": "sakura",
                "label": {
                    "en": "Sakura Spot",
                    "ja": "桜の名所",
                    "zh": "賞櫻勝地"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    },
    "odpt.Station:JR-East.Chuo.Ichigaya": {
        "categories": {
            "dining": {
                "id": "dining",
                "count": 67,
                "label": {
                    "ja": "食事",
                    "en": "Dining",
                    "zh": "美食"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "カフェ・ド・クリエ",
                            "en": "CAFE de CRIE",
                            "zh": "カフェ・ド・クリエ"
                        },
                        "osm_id": "1916601594"
                    },
                    {
                        "name": {
                            "ja": "カフェ・ド・クリエ",
                            "en": "CAFE de CRIE",
                            "zh": "カフェ・ド・クリエ"
                        },
                        "osm_id": "1916746121"
                    },
                    {
                        "name": {
                            "ja": "カフェ・ド・クリエ",
                            "en": "CAFE de CRIE",
                            "zh": "カフェ・ド・クリエ"
                        },
                        "osm_id": "1918944961"
                    }
                ]
            },
            "shopping": {
                "id": "shopping",
                "count": 35,
                "label": {
                    "ja": "買い物",
                    "en": "Shopping",
                    "zh": "購物"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "1121195331"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "1928489012"
                    },
                    {
                        "name": {
                            "ja": "セブン-イレブン",
                            "en": "7-Eleven",
                            "zh": "セブン-イレブン"
                        },
                        "osm_id": "1928500209"
                    }
                ]
            },
            "accommodation": {
                "id": "accommodation",
                "count": 4,
                "label": {
                    "ja": "宿泊",
                    "en": "Accommodation",
                    "zh": "住宿"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "ファーストキャビン市ヶ谷",
                            "en": "First Cabin Ichigaya",
                            "zh": "ファーストキャビン市ヶ谷"
                        },
                        "osm_id": "10270014197"
                    },
                    {
                        "name": {
                            "ja": "ホテルグランドヒル市ヶ谷",
                            "en": "ホテルグランドヒル市ヶ谷",
                            "zh": "ホテルグランドヒル市ヶ谷"
                        },
                        "osm_id": "12383941001"
                    },
                    {
                        "name": {
                            "ja": "ホテルグランドヒル市ヶ谷",
                            "en": "Hotel Grand Hill Ichigaya",
                            "zh": "ホテルグランドヒル市ヶ谷"
                        },
                        "osm_id": "12508918601"
                    }
                ]
            },
            "culture": {
                "id": "culture",
                "count": 3,
                "label": {
                    "ja": "文化・芸術",
                    "en": "Culture",
                    "zh": "文化藝術"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "千代田区立四番町図書館",
                            "en": "Yonbancho Library",
                            "zh": "千代田区立四番町図書館"
                        },
                        "osm_id": "1420770188"
                    },
                    {
                        "name": {
                            "ja": "千代田区立四番町図書館",
                            "en": "Yonbancho Library",
                            "zh": "千代田区立四番町図書館"
                        },
                        "osm_id": "1420770189"
                    },
                    {
                        "name": {
                            "ja": "江戸歴史散歩コーナー",
                            "en": "Edo History Walking Corner",
                            "zh": "江戸歴史散歩コーナー"
                        },
                        "osm_id": "6266973577"
                    }
                ]
            },
            "nature": {
                "id": "nature",
                "count": 2,
                "label": {
                    "ja": "自然・公園",
                    "en": "Nature",
                    "zh": "自然公園"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "東郷公園",
                            "en": "東郷公園",
                            "zh": "東郷公園"
                        },
                        "osm_id": "132794875"
                    },
                    {
                        "name": {
                            "ja": "市谷の杜",
                            "en": "市谷の杜",
                            "zh": "市谷の杜"
                        },
                        "osm_id": "1189530624"
                    }
                ]
            },
            "business": {
                "id": "business",
                "count": 14,
                "label": {
                    "ja": "ビジネス",
                    "en": "Business",
                    "zh": "商務"
                },
                "subcategories": {},
                "representative_spots": [
                    {
                        "name": {
                            "ja": "みどりの窓口",
                            "en": "Green Window",
                            "zh": "みどりの窓口"
                        },
                        "osm_id": "2456795666"
                    },
                    {
                        "name": {
                            "ja": "UE",
                            "en": "UE tokyo branch",
                            "zh": "UE"
                        },
                        "osm_id": "5358550821"
                    },
                    {
                        "name": {
                            "ja": "日本年金機構",
                            "en": "日本年金機構",
                            "zh": "日本年金機構"
                        },
                        "osm_id": "5818392494"
                    }
                ]
            }
        },
        "vibe_tags": [
            {
                "id": "book_town",
                "label": {
                    "en": "Book Town",
                    "ja": "本の街",
                    "zh": "書街"
                },
                "score": 5
            },
            {
                "id": "retro",
                "label": {
                    "en": "Retro Vibes",
                    "ja": "レトロな雰囲気",
                    "zh": "復古氛圍"
                },
                "score": 4
            },
            {
                "id": "shitamachi",
                "label": {
                    "en": "Old Tokyo Vibes",
                    "ja": "下町情緒",
                    "zh": "下町風情"
                },
                "score": 5
            },
            {
                "id": "gourmet",
                "label": {
                    "en": "Gourmet Battleground",
                    "ja": "グルメ激戦区",
                    "zh": "美食激戰區"
                },
                "score": 5
            }
        ],
        "last_updated": "2026-01-02T02:27:11.259Z"
    }
};