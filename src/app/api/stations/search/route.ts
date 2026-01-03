import { NextRequest, NextResponse } from 'next/server';
import { odptClient } from '@/lib/odpt/client';
import { SEED_NODES } from '@/lib/nodes/seedNodes';

interface StationSearchResult {
    id: string;
    name: { ja?: string; en?: string };
    operator: string;
    railway?: string;
}

// Build fallback station list from seed nodes
function buildFallbackStations(): StationSearchResult[] {
    return SEED_NODES
        .filter(node => node.type === 'station' && node.id.includes('Station:'))
        .map(node => {
            // Parse operator and railway from ID like "odpt:Station:TokyoMetro.Ginza.Ueno"
            const parts = node.id.split(':');
            const stationParts = parts[parts.length - 1].split('.');
            const operator = stationParts[0] || 'Unknown';
            const railway = stationParts.length > 2 ? stationParts[1] : undefined;

            return {
                id: node.id.replace('odpt:', 'odpt.'),
                name: { ja: node.name?.ja, en: node.name?.en },
                operator,
                railway,
            };
        });
}

// In-memory cache for stations (revalidated every 24 hours)
let stationCache: StationSearchResult[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getStationList(): Promise<StationSearchResult[]> {
    const now = Date.now();
    if (stationCache && stationCache.length > 0 && (now - cacheTimestamp) < CACHE_TTL) {
        return stationCache;
    }

    try {
        // Fetch stations from all major operators
        const operators = ['odpt.Operator:TokyoMetro', 'odpt.Operator:Toei'];
        const allStations: StationSearchResult[] = [];

        for (const op of operators) {
            try {
                const stations = await odptClient.getStations(op);
                for (const s of stations) {
                    allStations.push({
                        id: s['owl:sameAs'],
                        name: s['odpt:stationTitle'] || { ja: s['dc:title'] },
                        operator: s['odpt:operator'].replace('odpt.Operator:', ''),
                        railway: s['odpt:railway']?.replace('odpt.Railway:', ''),
                    });
                }
            } catch (opError) {
                console.warn(`Failed to fetch stations for ${op}:`, opError);
            }
        }

        if (allStations.length > 0) {
            stationCache = allStations;
            cacheTimestamp = now;
            return allStations;
        }
    } catch (e) {
        console.error('Failed to fetch stations from ODPT:', e);
    }

    // Fallback to seed nodes when ODPT API fails
    console.log('Using fallback seed stations');
    const fallback = buildFallbackStations();
    stationCache = fallback;
    cacheTimestamp = now;
    return fallback;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase().trim() || '';

    if (!query || query.length < 1) {
        return NextResponse.json({ stations: [] });
    }

    try {
        const allStations = await getStationList();

        // Filter stations by name match (ja or en)
        const matches = allStations.filter(s => {
            const jaName = (s.name.ja || '').toLowerCase();
            const enName = (s.name.en || '').toLowerCase();
            const railway = (s.railway || '').toLowerCase();

            return jaName.includes(query) ||
                enName.includes(query) ||
                railway.includes(query) ||
                s.id.toLowerCase().includes(query);
        });

        // Sort by relevance (exact match first, then by name length)
        matches.sort((a, b) => {
            const aJa = (a.name.ja || '').toLowerCase();
            const bJa = (b.name.ja || '').toLowerCase();
            const aEn = (a.name.en || '').toLowerCase();
            const bEn = (b.name.en || '').toLowerCase();

            // Exact matches first
            const aExact = aJa === query || aEn === query;
            const bExact = bJa === query || bEn === query;
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            // Starts-with matches next
            const aStarts = aJa.startsWith(query) || aEn.startsWith(query);
            const bStarts = bJa.startsWith(query) || bEn.startsWith(query);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            // Shorter names first (more specific)
            return (aJa.length + aEn.length) - (bJa.length + bEn.length);
        });

        // Return top 10
        const results = matches.slice(0, 10);

        return NextResponse.json({ stations: results }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
            }
        });

    } catch (error) {
        console.error('Station search error:', error);
        return NextResponse.json({ error: 'Search failed', stations: [] }, { status: 500 });
    }
}
