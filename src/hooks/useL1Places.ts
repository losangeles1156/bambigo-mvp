import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/stores/appStore';
import { useLocale } from 'next-intl';
import { getLocaleString } from '@/lib/utils/localeUtils';
import { buildStationIdSearchCandidates } from '@/lib/api/nodes';
import { STATIC_L1_DATA } from '@/data/staticL1Data';

export interface L1Place {
    id: string;
    osm_id: number;
    name: string;
    name_i18n: Record<string, string>;
    category: string;
    subcategory?: string;
    distance_meters?: number;
    navigation_url?: string;
    location: {
        coordinates: [number, number]; // [lon, lat]
    };
    lat?: number;
    lng?: number;
    tags: Record<string, any>;
}

export function useL1Places() {
    const { currentNodeId } = useAppStore();
    const [places, setPlaces] = useState<L1Place[]>([]);
    const [loading, setLoading] = useState(false);
    const locale = useLocale();

    useEffect(() => {
        if (!currentNodeId) {
            setPlaces([]);
            return;
        }

        const nodeId = currentNodeId;

        async function fetchPlaces() {
            setLoading(true);
            try {
                // Check if supabase is available before using it
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
                
                if (!supabaseUrl || !supabaseKey) {
                    console.warn('[useL1Places] Supabase credentials missing, using local fallback');
                    
                    const stationIds = buildStationIdSearchCandidates(nodeId);
                    const fallbackPlaces: L1Place[] = [];
                    
                    for (const sId of stationIds) {
                        const staticData = STATIC_L1_DATA[sId];
                        if (staticData && staticData.categories) {
                            Object.entries(staticData.categories).forEach(([catId, cat]) => {
                                if (cat && Array.isArray(cat.representative_spots)) {
                                    cat.representative_spots.forEach((spot: any, idx: number) => {
                                        fallbackPlaces.push({
                                            id: `fallback-${sId}-${catId}-${idx}`,
                                            osm_id: typeof spot.osm_id === 'number' ? spot.osm_id : idx + 1000,
                                            name: getLocaleString(spot.name, locale),
                                            name_i18n: spot.name,
                                            category: catId,
                                            subcategory: spot.subcategory || '',
                                            distance_meters: spot.distance_meters || 100,
                                            location: { coordinates: [139.77, 35.71] }, // Dummy but safe
                                            tags: {}
                                        } as L1Place);
                                    });
                                }
                            });
                        }
                    }
                    
                    setPlaces(fallbackPlaces);
                    setLoading(false);
                    return;
                }

                const stationIds = buildStationIdSearchCandidates(nodeId);
                const { data, error } = await supabase
                    .from('l1_places')
                    .select('*')
                    .in('station_id', stationIds)
                    .order('distance_meters', { ascending: true }); // Prefer closer ones by default

                if (error) throw error;

                const parsed = (data || []).map((row: any) => {
                    let coords = [0, 0];
                    if (typeof row.location === 'string' && row.location.startsWith('POINT')) {
                        const match = row.location.match(/POINT\(([-0-9\.]+) ([-0-9\.]+)\)/);
                        if (match) {
                            coords = [parseFloat(match[1]), parseFloat(match[2])];
                        }
                    } else if (row.location?.coordinates) {
                        coords = row.location.coordinates;
                    }

                    return {
                        id: row.id,
                        osm_id: row.osm_id,
                        name: getLocaleString(row.name_i18n || { en: row.name }, locale),
                        name_i18n: row.name_i18n,
                        category: row.category,
                        subcategory: row.subcategory,
                        distance_meters: row.distance_meters,
                        navigation_url: row.navigation_url,
                        location: { coordinates: coords },
                        lat: row.lat,
                        lng: row.lng,
                        tags: row.tags
                    } as L1Place;
                });

                const dedupedByOsm = new Map<number, L1Place>();
                for (const p of parsed) {
                    const existing = dedupedByOsm.get(p.osm_id);
                    if (!existing) {
                        dedupedByOsm.set(p.osm_id, p);
                        continue;
                    }
                    const a = typeof existing.distance_meters === 'number' ? existing.distance_meters : Number.POSITIVE_INFINITY;
                    const b = typeof p.distance_meters === 'number' ? p.distance_meters : Number.POSITIVE_INFINITY;
                    if (b < a) dedupedByOsm.set(p.osm_id, p);
                }

                setPlaces(Array.from(dedupedByOsm.values()));
            } catch (err) {
                console.error('[useL1Places] Error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchPlaces();
    }, [currentNodeId, locale]);

    return { places, loading };
}
