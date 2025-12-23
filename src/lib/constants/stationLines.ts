export const STATION_LINES: Record<string, string[]> = {
    // Tokyo Metro - Ginza Line
    'odpt:Station:TokyoMetro.Ueno': ['銀座線', '日比谷線'],
    'odpt:Station:TokyoMetro.Asakusa': ['銀座線', '淺草線'],
    'odpt:Station:TokyoMetro.Ginza': ['銀座線', '丸ノ内線', '日比谷線'],
    'odpt:Station:TokyoMetro.Tawaramachi': ['銀座線'],
    'odpt:Station:TokyoMetro.Inaricho': ['銀座線'],
    'odpt:Station:TokyoMetro.Mitsukoshimae': ['銀座線', '半蔵門線'],
    'odpt:Station:TokyoMetro.Kanda': ['銀座線'], // Note: JR Kanda is separate
    'odpt:Station:TokyoMetro.Kyobashi': ['銀座線'],
    'odpt:Station:TokyoMetro.Nihombashi': ['銀座線', '東西線', '淺草線'], // Merged view often desirable but IDs might differ
    'odpt:Station:TokyoMetro.Shimbashi': ['銀座線'],
    'odpt:Station:TokyoMetro.Toranomon': ['銀座線'],
    'odpt:Station:TokyoMetro.AoyamaItchome': ['銀座線', '半蔵門線', '大江戸線'],
    'odpt:Station:TokyoMetro.Omotesando': ['銀座線', '千代田線', '半蔵門線'],
    'odpt:Station:TokyoMetro.Shibuya': ['銀座線', '半蔵門線', '副都心線'],

    // Tokyo Metro - Hibiya Line
    'odpt:Station:TokyoMetro.Iriya': ['日比谷線'],
    'odpt:Station:TokyoMetro.Minowa': ['日比谷線'],
    'odpt:Station:TokyoMetro.Kayabacho': ['日比谷線', '東西線'],
    'odpt:Station:TokyoMetro.Hatchobori': ['日比谷線'], // JR Keiyo is separate
    'odpt:Station:TokyoMetro.Tsukiji': ['日比谷線'],
    'odpt:Station:TokyoMetro.HigashiGinza': ['日比谷線', '淺草線'],
    'odpt:Station:TokyoMetro.Hibiya': ['日比谷線', '千代田線', '三田線'],
    'odpt:Station:TokyoMetro.Kasumigaseki': ['日比谷線', '丸ノ内線', '千代田線'],
    'odpt:Station:TokyoMetro.Kamiyacho': ['日比谷線'],
    'odpt:Station:TokyoMetro.Roppongi': ['日比谷線', '大江戸線'],
    'odpt:Station:TokyoMetro.Hiroo': ['日比谷線'],
    'odpt:Station:TokyoMetro.NakaMeguro': ['日比谷線'],

    // JR East (Core)
    'odpt:Station:JR-East.Akihabara': ['山手線', '京浜東北線', '総武線'],
    'odpt:Station:JR-East.Tokyo': ['山手線', '中央線', '京葉線', '京浜東北線', '東海道線', '総武快速線'],
    'odpt:Station:JR-East.Ueno': ['山手線', '京浜東北線', '常磐線', '上野東京ライン'],
    'odpt:Station:JR-East.Okachimachi': ['山手線', '京浜東北線'],
    'odpt:Station:JR-East.Kanda': ['山手線', '京浜東北線', '中央線'],
    'odpt:Station:JR-East.Yurakucho': ['山手線', '京浜東北線'],
    'odpt:Station:JR-East.Shimbashi': ['山手線', '京浜東北線', '東海道線', '横須賀線'],
    'odpt:Station:JR-East.Hamamatsucho': ['山手線', '京浜東北線'],
    'odpt:Station:JR-East.Uguisudani': ['山手線', '京浜東北線'],

    // Toei Subway
    'odpt:Station:Toei.Asakusa': ['淺草線'],
    'odpt:Station:Toei.Kuramae': ['淺草線', '大江戸線'],
    'odpt:Station:Toei.Asakusabashi': ['淺草線'],
    'odpt:Station:Toei.HigashiNihombashi': ['淺草線', '新宿線'], // Merged with Bakuro-yokoyama
    'odpt:Station:Toei.Nihombashi': ['淺草線'],
    'odpt:Station:Toei.Takaracho': ['淺草線'],
    'odpt:Station:Toei.HigashiGinza': ['淺草線'],
    'odpt:Station:Toei.Shimbashi': ['淺草線'],
    'odpt:Station:Toei.Daimon': ['淺草線', '大江戸線'],

    // Toei Oedo
    'odpt:Station:Toei.UenoOkachimachi': ['大江戸線'],
    'odpt:Station:Toei.ShinOkachimachi': ['大江戸線', 'つくばエクスプレス'],
    'odpt:Station:Toei.Kachidoki': ['大江戸線'],
    'odpt:Station:Toei.Tsukishima': ['大江戸線', '有楽町線'],
    'odpt:Station:Toei.Tsukijishijo': ['大江戸線'],

    // Others
    'odpt:Station:TokyoMetro.Ochanomizu': ['丸ノ内線'],
    'odpt:Station:TokyoMetro.Otemachi': ['丸ノ内線', '東西線', '千代田線', '半蔵門線', '三田線'],
    'odpt:Station:TokyoMetro.Iidabashi': ['東西線', '有楽町線', '南北線', '大江戸線'],
    'odpt:Station:TokyoMetro.Kudanshita': ['東西線', '半蔵門線', '新宿線'],
    'odpt:Station:TokyoMetro.Yushima': ['千代田線'],
};
