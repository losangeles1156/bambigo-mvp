
export interface LocaleString {
    ja: string;
    en: string;
    zh: string;
}

export interface StationLineDef {
    name: LocaleString;
    operator: 'Metro' | 'Toei' | 'JR' | 'Private' | 'Other';
    color: string;
}

// Line Metadata Registry (Single Source of Truth)
const LINES = {
    // Metro
    Ginza: { name: { ja: '銀座線', en: 'Ginza Line', zh: '銀座線' }, operator: 'Metro', color: '#FF9500' } as StationLineDef,
    Marunouchi: { name: { ja: '丸ノ内線', en: 'Marunouchi Line', zh: '丸之內線' }, operator: 'Metro', color: '#F62E36' } as StationLineDef,
    Hibiya: { name: { ja: '日比谷線', en: 'Hibiya Line', zh: '日比谷線' }, operator: 'Metro', color: '#B5B5AC' } as StationLineDef,
    Tozai: { name: { ja: '東西線', en: 'Tozai Line', zh: '東西線' }, operator: 'Metro', color: '#00D7CF' } as StationLineDef,
    Chiyoda: { name: { ja: '千代田線', en: 'Chiyoda Line', zh: '千代田線' }, operator: 'Metro', color: '#00BB85' } as StationLineDef,
    Yurakucho: { name: { ja: '有楽町線', en: 'Yurakucho Line', zh: '有樂町線' }, operator: 'Metro', color: '#C1A47B' } as StationLineDef,
    Hanzomon: { name: { ja: '半蔵門線', en: 'Hanzomon Line', zh: '半藏門線' }, operator: 'Metro', color: '#8F76D6' } as StationLineDef,
    Namboku: { name: { ja: '南北線', en: 'Namboku Line', zh: '南北線' }, operator: 'Metro', color: '#00AC9B' } as StationLineDef,
    Fukutoshin: { name: { ja: '副都心線', en: 'Fukutoshin Line', zh: '副都心線' }, operator: 'Metro', color: '#9C5E31' } as StationLineDef,

    // Toei
    Asakusa: { name: { ja: '淺草線', en: 'Asakusa Line', zh: '淺草線' }, operator: 'Toei', color: '#E85298' } as StationLineDef,
    Mita: { name: { ja: '三田線', en: 'Mita Line', zh: '三田線' }, operator: 'Toei', color: '#0070C0' } as StationLineDef,
    Shinjuku: { name: { ja: '新宿線', en: 'Shinjuku Line', zh: '新宿線' }, operator: 'Toei', color: '#6CBB5A' } as StationLineDef,
    Oedo: { name: { ja: '大江戸線', en: 'Oedo Line', zh: '大江戶線' }, operator: 'Toei', color: '#CE045B' } as StationLineDef,

    // JR East
    Yamanote: { name: { ja: '山手線', en: 'Yamanote Line', zh: '山手線' }, operator: 'JR', color: '#9ACD32' } as StationLineDef,
    KeihinTohoku: { name: { ja: '京浜東北線', en: 'Keihin-Tohoku Line', zh: '京濱東北線' }, operator: 'JR', color: '#00BFFF' } as StationLineDef,
    Chuo: { name: { ja: '中央線', en: 'Chuo Line', zh: '中央線' }, operator: 'JR', color: '#FF4500' } as StationLineDef,
    Sobu: { name: { ja: '総武線', en: 'Sobu Line', zh: '總武線' }, operator: 'JR', color: '#FFD700' } as StationLineDef,
    SobuRapid: { name: { ja: '総武快速線', en: 'Sobu Rapid Line', zh: '總武快速線' }, operator: 'JR', color: '#0072BC' } as StationLineDef, // Blue? Or Navy.
    Joban: { name: { ja: '常磐線', en: 'Joban Line', zh: '常磐線' }, operator: 'JR', color: '#00B261' } as StationLineDef,
    Keiyo: { name: { ja: '京葉線', en: 'Keiyo Line', zh: '京葉線' }, operator: 'JR', color: '#C9242F' } as StationLineDef,
    Tokaido: { name: { ja: '東海道線', en: 'Tokaido Line', zh: '東海道線' }, operator: 'JR', color: '#F68B1E' } as StationLineDef,
    Yokosuka: { name: { ja: '横須賀線', en: 'Yokosuka Line', zh: '橫須賀線' }, operator: 'JR', color: '#006599' } as StationLineDef,
    UenoTokyo: { name: { ja: '上野東京ライン', en: 'Ueno-Tokyo Line', zh: '上野東京線' }, operator: 'JR', color: '#800080' } as StationLineDef, // Purple
    Saikyo: { name: { ja: '埼京線', en: 'Saikyo Line', zh: '埼京線' }, operator: 'JR', color: '#00AC9B' } as StationLineDef, // Greenish
    ShonanShinjuku: { name: { ja: '湘南新宿ライン', en: 'Shonan-Shinjuku Line', zh: '湘南新宿線' }, operator: 'JR', color: '#E21F26' } as StationLineDef, // Red
};

export const STATION_LINES: Record<string, StationLineDef[]> = {
    // Tokyo Metro - Ginza Line
    'odpt:Station:TokyoMetro.Ueno': [LINES.Ginza, LINES.Hibiya],
    'odpt:Station:TokyoMetro.Asakusa': [LINES.Ginza, LINES.Asakusa],
    'odpt:Station:TokyoMetro.Ginza': [LINES.Ginza, LINES.Marunouchi, LINES.Hibiya],
    'odpt:Station:TokyoMetro.Tawaramachi': [LINES.Ginza],
    'odpt:Station:TokyoMetro.Inaricho': [LINES.Ginza],
    'odpt:Station:TokyoMetro.Mitsukoshimae': [LINES.Ginza, LINES.Hanzomon],
    'odpt:Station:TokyoMetro.Kanda': [LINES.Ginza],
    'odpt:Station:TokyoMetro.Kyobashi': [LINES.Ginza],
    'odpt:Station:TokyoMetro.Nihombashi': [LINES.Ginza, LINES.Tozai, LINES.Asakusa],
    'odpt:Station:TokyoMetro.Shimbashi': [LINES.Ginza],
    'odpt:Station:TokyoMetro.Toranomon': [LINES.Ginza],
    'odpt:Station:TokyoMetro.AoyamaItchome': [LINES.Ginza, LINES.Hanzomon, LINES.Oedo],
    'odpt:Station:TokyoMetro.Omotesando': [LINES.Ginza, LINES.Chiyoda, LINES.Hanzomon],
    'odpt:Station:TokyoMetro.Shibuya': [LINES.Ginza, LINES.Hanzomon, LINES.Fukutoshin], // JR Shibuya is separate key

    // Tokyo Metro - Hibiya Line
    'odpt:Station:TokyoMetro.Iriya': [LINES.Hibiya],
    'odpt:Station:TokyoMetro.Minowa': [LINES.Hibiya],
    'odpt:Station:TokyoMetro.Kayabacho': [LINES.Hibiya, LINES.Tozai],
    'odpt:Station:TokyoMetro.Hatchobori': [LINES.Hibiya], // JR Keiyo separate
    'odpt:Station:TokyoMetro.Tsukiji': [LINES.Hibiya],
    'odpt:Station:TokyoMetro.HigashiGinza': [LINES.Hibiya, LINES.Asakusa],
    'odpt:Station:TokyoMetro.Hibiya': [LINES.Hibiya, LINES.Chiyoda, LINES.Mita],
    'odpt:Station:TokyoMetro.Kasumigaseki': [LINES.Hibiya, LINES.Marunouchi, LINES.Chiyoda],
    'odpt:Station:TokyoMetro.Kamiyacho': [LINES.Hibiya],
    'odpt:Station:TokyoMetro.Roppongi': [LINES.Hibiya, LINES.Oedo],
    'odpt:Station:TokyoMetro.Hiroo': [LINES.Hibiya],
    'odpt:Station:TokyoMetro.NakaMeguro': [LINES.Hibiya], // Tokyu Toyoko separate?

    // JR East (Core) - STRICTLY VERIFIED
    'odpt:Station:JR-East.Akihabara': [LINES.Yamanote, LINES.KeihinTohoku, LINES.Sobu],
    'odpt:Station:JR-East.Tokyo': [LINES.Yamanote, LINES.Chuo, LINES.Keiyo, LINES.KeihinTohoku, LINES.Tokaido, LINES.SobuRapid], // NO Shinkansen
    'odpt:Station:JR-East.Ueno': [LINES.Yamanote, LINES.KeihinTohoku, LINES.Joban, LINES.UenoTokyo], // NO Shinkansen
    'odpt:Station:JR-East.Okachimachi': [LINES.Yamanote, LINES.KeihinTohoku],
    'odpt:Station:JR-East.Kanda': [LINES.Yamanote, LINES.KeihinTohoku, LINES.Chuo],
    'odpt:Station:JR-East.Yurakucho': [LINES.Yamanote, LINES.KeihinTohoku],
    'odpt:Station:JR-East.Shimbashi': [LINES.Yamanote, LINES.KeihinTohoku, LINES.Tokaido, LINES.Yokosuka], // NO Yurikamome (Private)
    'odpt:Station:JR-East.Hamamatsucho': [LINES.Yamanote, LINES.KeihinTohoku], // NO Monorail (Private)
    'odpt:Station:JR-East.Uguisudani': [LINES.Yamanote, LINES.KeihinTohoku],

    // Toei Subway
    'odpt:Station:Toei.Asakusa': [LINES.Asakusa],
    'odpt:Station:Toei.Kuramae': [LINES.Asakusa, LINES.Oedo],
    'odpt:Station:Toei.Asakusabashi': [LINES.Asakusa], // JR separate
    'odpt:Station:Toei.HigashiNihombashi': [LINES.Asakusa, LINES.Shinjuku],
    'odpt:Station:Toei.Nihombashi': [LINES.Asakusa],
    'odpt:Station:Toei.Takaracho': [LINES.Asakusa],
    'odpt:Station:Toei.HigashiGinza': [LINES.Asakusa],
    'odpt:Station:Toei.Shimbashi': [LINES.Asakusa],
    'odpt:Station:Toei.Daimon': [LINES.Asakusa, LINES.Oedo],

    // Toei Oedo
    'odpt:Station:Toei.UenoOkachimachi': [LINES.Oedo],
    'odpt:Station:Toei.ShinOkachimachi': [LINES.Oedo], // REMOVED Tsukuba Express (Private)
    'odpt:Station:Toei.Kachidoki': [LINES.Oedo],
    'odpt:Station:Toei.Tsukishima': [LINES.Oedo, LINES.Yurakucho],
    'odpt:Station:Toei.Tsukijishijo': [LINES.Oedo],

    // Others
    'odpt:Station:TokyoMetro.Ochanomizu': [LINES.Marunouchi], // JR separate
    'odpt:Station:TokyoMetro.Otemachi': [LINES.Marunouchi, LINES.Tozai, LINES.Chiyoda, LINES.Hanzomon, LINES.Mita],
    'odpt:Station:TokyoMetro.Iidabashi': [LINES.Tozai, LINES.Yurakucho, LINES.Namboku, LINES.Oedo],
    'odpt:Station:TokyoMetro.Kudanshita': [LINES.Tozai, LINES.Hanzomon, LINES.Shinjuku],
    'odpt:Station:TokyoMetro.Yushima': [LINES.Chiyoda],
};
