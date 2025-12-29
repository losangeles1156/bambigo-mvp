import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/stores/appStore';
import { useLocale } from 'next-intl';
import { getLocaleString } from '@/lib/utils/localeUtils';

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

        async function fetchPlaces() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('l1_places')
                    .select('*')
                    .eq('station_id', currentNodeId)
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

                setPlaces(parsed);
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
