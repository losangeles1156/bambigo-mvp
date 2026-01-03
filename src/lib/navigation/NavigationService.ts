
import { supabaseAdmin } from '@/lib/supabase';

export interface GraphNode {
    id: string;
    type: string;
    description: string;
    distance_from_query: number;
    coordinates: any;
}

export interface GraphLink {
    id: string;
    link_id: string;
    start_node_id: string;
    end_node_id: string;
    has_elevator_access: boolean;
    accessibility_rank: string;
    distance_meters: number;
    geometry?: any;
}

export interface NavigationGraphResult {
    nodes: GraphNode[];
    edges: GraphLink[];
    meta: {
        center: { lat: number; lon: number };
        radius: number;
        userProfile: string;
        weather: string;
        timestamp: string;
    };
    reasoning?: string[];
}

/**
 * NavigationService
 * 
 * Centralized service for pedestrian navigation and accessibility graph retrieval.
 * Used by both the Navigation API and AI Agent Tools.
 */
export class NavigationService {
    
    /**
     * Retrieves a pedestrian navigation graph for a specific area.
     */
    static async getPedestrianGraph(
        lat: number,
        lon: number,
        radius: number = 500,
        userProfile: string = 'general',
        weather: string = 'clear'
    ): Promise<NavigationGraphResult> {
        
        // 1. Get Nodes via Optimized RPC
        const { data: mixedResults, error: rpcError } = await supabaseAdmin.rpc('get_nearby_accessibility_graph', {
            query_lat: lat,
            query_lon: lon,
            radius_meters: radius
        });

        if (rpcError) {
            console.error('[NavigationService] RPC Error (get_nearby_accessibility_graph):', rpcError);
            throw new Error(`Accessibility Search Failed: ${rpcError.message}`);
        }

        // Filter nodes from mixed results
        const nodes: GraphNode[] = (mixedResults || [])
            .filter((item: any) => item.type === 'node')
            .map((n: any) => ({
                id: n.id,
                type: n.type,
                description: n.description,
                distance_from_query: n.distance_from_query,
                coordinates: n.coordinates
            }));

        const nodeIds = nodes.map(n => n.id);
        let links: GraphLink[] = [];

        // 2. Get Links connecting these nodes
        if (nodeIds.length > 0) {
            const { data: linkResults, error: linkError } = await supabaseAdmin.rpc('get_pedestrian_links_geojson', {
                target_node_ids: nodeIds
            });

            if (linkError) {
                console.warn('[NavigationService] RPC Error (get_pedestrian_links_geojson), falling back:', linkError);
                
                // Fallback to standard query if RPC fails
                const { data: fallbackLinks, error: fallbackError } = await supabaseAdmin
                    .from('pedestrian_links')
                    .select('*')
                    .or(`start_node_id.in.(${nodeIds.map(id => `"${id}"`).join(',')}),end_node_id.in.(${nodeIds.map(id => `"${id}"`).join(',')})`);

                if (fallbackError) {
                    console.error('[NavigationService] Fallback link query failed:', fallbackError);
                } else {
                    links = (fallbackLinks || []).map(l => ({
                        id: l.id,
                        link_id: l.link_id,
                        start_node_id: l.start_node_id,
                        end_node_id: l.end_node_id,
                        has_elevator_access: l.has_elevator_access,
                        accessibility_rank: l.accessibility_rank,
                        distance_meters: Number(l.distance_meters),
                        geometry: l.geometry // Will be WKB hex string in fallback
                    }));
                }
            } else {
                links = (linkResults || []).map((l: any) => ({
                    id: l.id,
                    link_id: l.link_id,
                    start_node_id: l.start_node_id,
                    end_node_id: l.end_node_id,
                    has_elevator_access: l.has_elevator_access,
                    accessibility_rank: l.accessibility_rank,
                    distance_meters: Number(l.distance_meters),
                    geometry: l.geometry // GeoJSON from RPC
                }));
            }
        }

        // 3. Apply Filtering Logic based on User Profile
        let filteredLinks = links;
        const reasoning: string[] = [];

        if (userProfile === 'wheelchair' || userProfile === 'stroller') {
            const beforeCount = filteredLinks.length;
            filteredLinks = filteredLinks.filter(l => l.has_elevator_access);
            const removedCount = beforeCount - filteredLinks.length;
            if (removedCount > 0) {
                reasoning.push(`Filtered out ${removedCount} non-accessible path segments for ${userProfile} profile.`);
            }
        }

        if (weather === 'rain' || weather === 'snow') {
            reasoning.push(`Weather is ${weather}. Recommend using underground passages and elevators where available.`);
        }

        return {
            nodes,
            edges: filteredLinks,
            meta: {
                center: { lat, lon },
                radius,
                userProfile,
                weather,
                timestamp: new Date().toISOString()
            },
            reasoning: reasoning.length > 0 ? reasoning : undefined
        };
    }
}
