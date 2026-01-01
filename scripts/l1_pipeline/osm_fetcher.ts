import { CONFIG } from './config';
import { StationProfile } from './hub_profiles';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

interface OsmElement {
    type: 'node' | 'way' | 'relation';
    id: number;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: Record<string, string>;
}

export interface L1Place {
    osm_id: number;
    name: string;
    category: string;
    location: { lat: number; lng: number };
    tags: any;
    is_seasonal?: boolean;
    seasonal_type?: string;
}

export interface CategoryStat {
    categoryId: string;
    totalCount: number; // 实际总数
    savedCount: number; // 存入数
    places: L1Place[];
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Build Overpass Query
function buildQuery(lat: number, lon: number, radius: number, category: string): string {
    const bbox = `(around:${radius},${lat},${lon})`;
    let filter = '';

    switch (category) {
        case 'dining':
            filter = `
                node["amenity"~"restaurant|cafe|fast_food|bar|pub|izakaya"]${bbox};
                way["amenity"~"restaurant|cafe|fast_food|bar|pub|izakaya"]${bbox};
            `;
            break;
        case 'shopping':
            filter = `
                node["shop"]${bbox};
                way["shop"]${bbox};
            `;
            break;
        case 'accommodation':
            filter = `
                node["tourism"~"hotel|hostel|guest_house"]${bbox};
                way["tourism"~"hotel|hostel|guest_house"]${bbox};
            `;
            break;
        case 'culture':
            filter = `
                node["tourism"~"museum|gallery|artwork"]${bbox};
                node["amenity"~"theatre|cinema|library"]${bbox};
                way["tourism"~"museum|gallery|artwork"]${bbox};
            `;
            break;
        case 'nature':
            filter = `
                node["leisure"="park"]${bbox};
                way["leisure"="park"]${bbox};
                node["natural"="tree"]["species"~"Prunus|Acer"]${bbox}; 
            `;
            // Note: Prunus (Sakura/Plum), Acer (Maple)
            break;
        case 'business':
             filter = `
                node["office"]${bbox};
                way["office"]${bbox};
            `;
            break;
        default:
            return '';
    }

    return `
        [out:json][timeout:25];
        (
            ${filter}
        );
        out center;
    `;
}

export async function fetchOsmData(
    lat: number, 
    lon: number, 
    seasonalFlags: string[],
    profile?: StationProfile
): Promise<CategoryStat[]> {
    const results: CategoryStat[] = [];
    const categories = ['dining', 'shopping', 'accommodation', 'culture', 'nature', 'business'];

    for (const cat of categories) {
        console.log(`   📡 Fetching OSM Category: ${cat}...`);
        
        const query = buildQuery(lat, lon, CONFIG.OSM.DEFAULT_RADIUS, cat);
        if (!query) continue;

        try {
            await sleep(1500); // Polite delay
            const res = await fetch(OVERPASS_URL, {
                method: 'POST',
                body: query
            });
            
            if (!res.ok) {
                console.error(`OSM Error ${res.status}: ${res.statusText}`);
                continue;
            }

            const data = await res.json();
            const elements: OsmElement[] = data.elements || [];

            // Filter: Must have name
            const validElements = elements.filter(el => el.tags && (el.tags.name || el.tags['name:en']));
            
            // Limit logic
            const isPremium = CONFIG.CATEGORIES.PREMIUM_IDS.includes(cat);
            let limit = isPremium ? CONFIG.LIMITS.PREMIUM : CONFIG.LIMITS.STANDARD;

            // Apply Profile Overrides
            if (profile && profile.priority_categories[cat]) {
                limit = profile.priority_categories[cat];
                console.log(`     ⭐ Priority Override for ${cat}: Limit raised to ${limit}`);
            }
            
            // Mapping
            let places: L1Place[] = validElements.map(el => {
                const lat = el.lat || el.center?.lat || 0;
                const lng = el.lon || el.center?.lon || 0;
                const name = el.tags?.['name:ja'] || el.tags?.name || el.tags?.['name:en'] || 'Unknown';
                
                let isSeasonal = false;
                let seasonalType = undefined;

                // Nature Seasonal Logic
                if (cat === 'nature') {
                    // Check tags for species
                    const species = el.tags?.species || '';
                    const nameLower = name.toLowerCase();

                    if (seasonalFlags.includes('Sakura') && (name.includes('桜') || species.includes('Prunus'))) {
                        isSeasonal = true;
                        seasonalType = 'Sakura';
                    }
                    if (seasonalFlags.includes('Autumn Leaves') && (name.includes('紅葉') || species.includes('Acer'))) {
                        isSeasonal = true;
                        seasonalType = 'Autumn Leaves';
                    }
                }

                return {
                    osm_id: el.id,
                    name,
                    category: cat,
                    location: { lat, lng },
                    tags: el.tags,
                    is_seasonal: isSeasonal,
                    seasonal_type: seasonalType
                };
            });

            // Sorting Strategy:
            // 1. Seasonal (if nature)
            // 2. Profile Landmarks (if profile exists)
            // 3. Has website/image (Richness)
            
            places.sort((a, b) => {
                let scoreA = 0;
                let scoreB = 0;

                // Seasonal Bonus
                if (a.is_seasonal) scoreA += 50;
                if (b.is_seasonal) scoreB += 50;

                // Profile Landmark Bonus
                if (profile && profile.mandatory_landmarks) {
                    const isLandmarkA = profile.mandatory_landmarks.some(lm => a.name.includes(lm));
                    const isLandmarkB = profile.mandatory_landmarks.some(lm => b.name.includes(lm));
                    if (isLandmarkA) scoreA += 100;
                    if (isLandmarkB) scoreB += 100;
                }

                return scoreB - scoreA;
            });

            // Apply Limit
            const savedPlaces = places.slice(0, limit);

            results.push({
                categoryId: cat,
                totalCount: validElements.length, // Total valid count
                savedCount: savedPlaces.length,
                places: savedPlaces
            });

            console.log(`     ✅ ${cat}: Found ${validElements.length}, Keeping ${savedPlaces.length}`);

        } catch (e) {
            console.error(`     ❌ Failed to fetch ${cat}`, e);
        }
    }

    return results;
}
