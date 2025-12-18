import { supabase } from '../supabase';

// Types aligning with DB schema
export interface NodeDatum {
    id: string;
    city_id: string;
    name: any;
    type: string;
    location: any; // PostGIS Point or GeoJSON
    geohash: string;
    vibe: string | null;
    is_hub: boolean;
    parent_hub_id: string | null;
    zone: string;
}

// L1: Location DNA
export interface CategoryCounts {
    medical: number;
    shopping: number;
    dining: number;
    leisure: number;
    education: number;
    finance: number;
}

// L2: Live Status
export interface LiveStatus {
    congestion: number; // 1-5
    line_status: {
        line: string;
        status: 'normal' | 'delay' | 'suspended';
        message?: string;
    }[];
    weather: {
        temp: number;
        condition: string;
    };
}

// L3: Service Facilities
export interface ServiceFacility {
    id: string;
    category: 'toilet' | 'charging' | 'locker' | 'wifi' | 'accessibility';
    subCategory: string;
    location: string; // e.g., "B1 North Exit"
    attributes: Record<string, any>;
}

// L4: Mobility Strategy
export interface ActionNudge {
    type: 'primary' | 'secondary';
    title: string;
    content: string;
    advice: string;
}

export interface NodeProfile {
    node_id: string;
    category_counts: CategoryCounts;
    vibe_tags: string[];
    l2_status?: LiveStatus;
    l3_facilities?: ServiceFacility[];
    l4_nudges?: ActionNudge[];
}

// Fetch nearby nodes
export async function fetchNearbyNodes(lat: number, lon: number, radiusMeters: number = 2000) {
    const { data, error } = await supabase
        .rpc('nearby_nodes', {
            user_lat: lat,
            user_lon: lon,
            radius_meters: radiusMeters
        });

    if (error) {
        console.error('Error fetching nearby nodes:', error);
        // Fallback to core stations if RPC fails
        return CORE_STATIONS_FALLBACK.filter(node => {
            const nodeLat = node.location.coordinates[1];
            const nodeLon = node.location.coordinates[0];
            // Simple rough distance check for fallback (approx 0.01 deg ~= 1km)
            return Math.abs(nodeLat - lat) < 0.05 && Math.abs(nodeLon - lon) < 0.05;
        });
    }

    return data as NodeDatum[];
}

const CORE_STATIONS_FALLBACK = [
    {
        id: 'odpt:Station:TokyoMetro.Ueno',
        city_id: 'tokyo_core',
        name: { 'zh-TW': '上野', 'en': 'Ueno', 'ja': '上野' },
        type: 'station',
        location: { coordinates: [139.7773, 35.7138] },
        vibe: 'culture',
        is_hub: true
    },
    {
        id: 'odpt:Station:TokyoMetro.Asakusa',
        city_id: 'tokyo_core',
        name: { 'zh-TW': '淺草', 'en': 'Asakusa', 'ja': '淺草' },
        type: 'station',
        location: { coordinates: [139.7976, 35.7119] },
        vibe: 'tourism',
        is_hub: true
    },
    {
        id: 'odpt:Station:JR-East.Tokyo',
        city_id: 'tokyo_core',
        name: { 'zh-TW': '東京', 'en': 'Tokyo', 'ja': '東京' },
        type: 'station',
        location: { coordinates: [139.7671, 35.6812] },
        vibe: 'transit',
        is_hub: true
    },
    {
        id: 'odpt:Station:JR-East.Akihabara',
        city_id: 'tokyo_core',
        name: { 'zh-TW': '秋葉原', 'en': 'Akihabara', 'ja': '秋葉原' },
        type: 'station',
        location: { coordinates: [139.7753, 35.6984] },
        vibe: 'geek',
        is_hub: true
    },
    {
        id: 'odpt:Station:TokyoMetro.Ginza',
        city_id: 'tokyo_core',
        name: { 'zh-TW': '銀座', 'en': 'Ginza', 'ja': '銀座' },
        type: 'station',
        location: { coordinates: [139.7619, 35.6719] },
        vibe: 'luxury',
        is_hub: true
    }
];

// Fetch single node with profile
export async function fetchNodeConfig(nodeId: string) {
    const { data: node, error: nodeError } = await supabase
        .from('nodes')
        .select('*')
        .eq('id', nodeId)
        .single();

    let finalNode = node;
    let finalProfile = null;

    if (nodeError) {
        console.warn(`Node fetch failed for ${nodeId}, checking fallbacks...`);
        // Try to find in CORE_STATIONS_FALLBACK
        const fallbackNode = CORE_STATIONS_FALLBACK.find(n => n.id === nodeId || nodeId.includes(n.name.en));
        if (fallbackNode) {
            finalNode = {
                ...fallbackNode,
                location: { type: 'Point', coordinates: fallbackNode.location.coordinates }
            };
        }
    }

    const { data: profile, error: profileError } = await supabase
        .from('node_facility_profiles')
        .select('*')
        .eq('node_id', nodeId)
        .single();

    finalProfile = profile;

    // Profile might handle error gracefully (not all nodes have profiles)

    // Mock Enrichment for Demo Stations (L1-L4 compliant)
    const mockProfiles: Record<string, any> = {
        'Ueno': {
            category_counts: {
                medical: 8, shopping: 120, dining: 150, leisure: 45, education: 12, finance: 20,
                nature: 45, religion: 12, accommodation: 35, workspace: 50, housing: 10
            },
            vibe_tags: ['#阿美橫町', '#文化森林', '#美術館巡禮', '#下町風情', '#交通心臟'],
            l2_status: {
                congestion: 2,
                line_status: [{ line: '銀座線', status: 'delay', message: '信號確認中' }],
                weather: { temp: 24, condition: 'Cloudy' }
            },
            l3_facilities: [
                { id: 'u-t-1', category: 'toilet', subCategory: 'station_toilet', location: 'B1 不忍口改札內', attributes: { has_washlet: true, wheelchair_accessible: true } },
                { id: 'u-l-1', category: 'locker', subCategory: 'coin_locker', location: '1F 中央口旁', attributes: { sizes: ['S', 'M', 'L'], count: 150 } }
            ],
            l4_nudges: [
                { type: 'primary', title: '建議不忍口出站', content: '阿美橫町正在打折，且此出口人流較少。', advice: '往京成上野方向移動。' }
            ]
        },
        'Asakusa': {
            category_counts: { medical: 15, shopping: 200, dining: 180, leisure: 150, education: 5, finance: 10 },
            vibe_tags: ['#雷門', '#仲見世通', '#水上巴士', '#下町風情', '#傳統工藝'],
            l2_status: {
                congestion: 5,
                line_status: [],
                weather: { temp: 24, condition: 'Clear' }
            },
            l3_facilities: [
                { id: 'a-t-1', category: 'toilet', subCategory: 'public_toilet', location: '雷門對面觀光中心 8F', attributes: { is_free: true, has_view: true } },
                { id: 'a-l-1', category: 'locker', subCategory: 'coin_locker', location: '銀座線 1 號出口旁', attributes: { sizes: ['L', 'XL'], count: 80 } },
                { id: 'a-e-1', category: 'accessibility', subCategory: 'elevator', location: 'A2b 出口', attributes: { note: '唯一地面直達電梯' } }
            ],
            l4_nudges: [
                { type: 'primary', title: '避開雷門正面人潮', content: '仲見世通目前極度擁擠。', advice: '建議從傳法院通繞道，或走地下街直通新仲見世。' }
            ]
        },
        'Akihabara': {
            category_counts: {
                medical: 5, shopping: 250, dining: 120, leisure: 100, education: 2, finance: 10,
                workspace: 60, housing: 5, religion: 8, nature: 2, accommodation: 15
            },
            vibe_tags: ['#電氣街', '#御宅文化', '#IT產業', '#女僕喫茶', '#次文化聖地'],
            l2_status: {
                congestion: 4,
                line_status: [{ line: '山手線', status: 'normal' }, { line: '總武線', status: 'delay', message: '千葉方面延誤' }],
                weather: { temp: 25, condition: 'Sunny' }
            },
            l3_facilities: [
                { id: 'ak-l-1', category: 'locker', subCategory: 'coin_locker', location: '昭和通口改札外', attributes: { sizes: ['XL', 'XXL'], count: 200, note: '適合動漫戰利品' } },
                { id: 'ak-c-1', category: 'charging', subCategory: 'free_outlet', location: '電氣街口咖啡廳', attributes: { outlet_type: ['Type-A', 'Type-C'], is_free: true } }
            ],
            l4_nudges: [
                { type: 'primary', title: '週日步行者天國', content: '中央通目前禁止車輛通行。', advice: '這是在馬路中央拍照的絕佳機會，但請小心人群。' }
            ]
        },
        'Tokyo': {
            category_counts: {
                medical: 20, shopping: 150, dining: 200, leisure: 50, education: 5, finance: 80,
                workspace: 300, housing: 0, religion: 2, nature: 30, accommodation: 50
            },
            vibe_tags: ['#國家門戶', '#紅磚建築', '#商務中樞', '#丸之內', '#伴手禮戰區'],
            l2_status: { congestion: 4, line_status: [], weather: { temp: 24, condition: 'Cloudy' } },
            l3_facilities: [
                { id: 't-a-1', category: 'accommodation', subCategory: 'luxury_hotel', location: '丸之內南口直結', attributes: { name: '東京車站大飯店' } },
                { id: 't-e-1', category: 'accessibility', subCategory: 'elevator', location: '丸之內北口', attributes: { connects_floors: ['B1', '1F'] } }
            ],
            l4_nudges: [
                { type: 'primary', title: '京葉線轉乘警示', content: '前往迪士尼的京葉線月台距離極遠 (800m)。', advice: '請預留至少 20 分鐘步行時間，或使用電動步道。' }
            ]
        },
        'Ginza': {
            category_counts: {
                medical: 30, shopping: 300, dining: 250, leisure: 80, education: 5, finance: 40,
                workspace: 100, housing: 10, religion: 5, nature: 5, accommodation: 40
            },
            vibe_tags: ['#奢華購物', '#步行者天國', '#歌舞伎座', '#大人味', '#米其林'],
            l2_status: { congestion: 3, line_status: [], weather: { temp: 25, condition: 'Clear' } },
            l3_facilities: [
                { id: 'g-l-1', category: 'leisure', subCategory: 'theater', location: '4號出口', attributes: { name: '歌舞伎座' } },
                { id: 'g-w-1', category: 'wifi', subCategory: 'free_public_wifi', location: 'G-Six 前', attributes: { speed: 'Fast' } }
            ],
            l4_nudges: [
                { type: 'primary', title: '善用地下連通道', content: '今日天氣炎熱。', advice: '利用地下道可直通各大百貨，避開地面日曬。' }
            ]
        };

        // Find if current node ID matches any of our mock keys
        const mockKey = Object.keys(mockProfiles).find(key => nodeId.includes(key));
        if(mockKey) {
            // Only use mock if DB profile is missing, or merge them?
            // For demo, we prioritize mock but allow real profile attributes if they exist
            const enrichedProfile = {
                node_id: nodeId,
                ...mockProfiles[mockKey],
                ...(finalProfile || {}) // Real data overwrites mock if it exists
            };
            return { node: finalNode, profile: enrichedProfile, error: null };
        }

    return { node: finalNode, profile: finalProfile, error: null };
    }

    // Fetch logic for specific zones (e.g., get all Hubs in a city)
    export async function fetchCityHubs(cityId: string) {
        const { data, error } = await supabase
            .from('nodes')
            .select('*')
            .eq('city_id', cityId)
            .eq('is_hub', true);

        if (error) {
            console.error('Error fetching city hubs:', error);
            return [];
        }
        return data;
    }

    // Fetch ALL nodes for manual map exploration (Using large radius from Tokyo center)
    export async function fetchAllNodes() {
        // 35.6895, 139.6917 is Tokyo Station
        // 50000 meters = 50km radius covers all of Tokyo + suburbs
        const { data, error } = await supabase
            .rpc('nearby_nodes', {
                user_lat: 35.6895,
                user_lon: 139.6917,
                radius_meters: 50000
            });

        if (error) {
            console.error('Error fetching nodes from RPC, using hardcoded fallback:', error);
            return CORE_STATIONS_FALLBACK as any[];
        }
        return data as NodeDatum[];
    }
