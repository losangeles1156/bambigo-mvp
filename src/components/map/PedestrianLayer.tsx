
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useMap, Polyline, CircleMarker, Popup } from 'react-leaflet';
import { useAppStore } from '@/stores/appStore';
import L from 'leaflet';

interface GraphNode {
    id: string;
    coordinates: { type: 'Point', coordinates: [number, number] };
    description: string;
    distance_from_query: number;
}

interface GraphLink {
    id: string;
    link_id: string;
    start_node_id: string;
    end_node_id: string;
    geometry: any; 
    accessibility_rank: string;
    has_elevator_access: boolean;
    distance_meters: number;
}

export function PedestrianLayer() {
    const map = useMap();
    const { userProfile } = useAppStore();
    const [nodes, setNodes] = useState<GraphNode[]>([]);
    const [links, setLinks] = useState<GraphLink[]>([]);
    const [loading, setLoading] = useState(false);
    
    const abortControllerRef = useRef<AbortController | null>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const fetchData = useCallback(async () => {
        // Cancel previous pending request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        const center = map.getCenter();
        const radius = 500; 

        try {
            const profile = userProfile || 'general';
            const res = await fetch(`/api/navigation/graph?lat=${center.lat}&lon=${center.lng}&radius=${radius}&user_profile=${profile}`, {
                signal: controller.signal
            });
            
            if (!res.ok) {
                // If 4xx or 5xx, throw to catch block
                throw new Error(`API Error: ${res.status}`);
            }

            const json = await res.json();
            
            if (json.nodes) setNodes(json.nodes);
            if (json.edges) setLinks(json.edges);
        } catch (e: any) {
            if (e.name === 'AbortError') {
                // Ignore intentional aborts
                return;
            }
            console.error("Failed to fetch graph", e);
        } finally {
            if (abortControllerRef.current === controller) {
                setLoading(false);
                abortControllerRef.current = null;
            }
        }
    }, [map, userProfile]);

    useEffect(() => {
        const onMoveEnd = () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = setTimeout(() => {
                fetchData();
            }, 300);
        };

        // Initial fetch
        fetchData();
        
        map.on('moveend', onMoveEnd);
        return () => {
            map.off('moveend', onMoveEnd);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [map, fetchData]);

    return (
        <>
            {/* Render Links */}
            {links.map(link => {
                let positions: [number, number][] = [];

                // Case 1: GeoJSON Geometry (from RPC)
                if (link.geometry && typeof link.geometry === 'object' && link.geometry.type === 'LineString') {
                     positions = link.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
                } 
                // Case 2: Fallback (WKB or missing geometry) - Use Node Coordinates
                else if (link.start_node_id && link.end_node_id) {
                    const startNode = nodes.find(n => n.id === link.start_node_id);
                    const endNode = nodes.find(n => n.id === link.end_node_id);

                    if (startNode && endNode && startNode.coordinates && endNode.coordinates) {
                         // Swap [lon, lat] to [lat, lon] for Leaflet
                         const startPos = [startNode.coordinates.coordinates[1], startNode.coordinates.coordinates[0]] as [number, number];
                         const endPos = [endNode.coordinates.coordinates[1], endNode.coordinates.coordinates[0]] as [number, number];
                         positions = [startPos, endPos];
                    }
                }

                if (positions.length === 0) return null;
                
                const color = link.has_elevator_access ? '#10b981' : '#f59e0b'; // Green vs Amber
                
                return (
                    <Polyline 
                        key={link.id} 
                        positions={positions} 
                        pathOptions={{ color, weight: 4, opacity: 0.7 }} 
                    >
                         <Popup>
                            <div className="text-sm">
                                <p><strong>Rank:</strong> {link.accessibility_rank}</p>
                                <p><strong>Elevator:</strong> {link.has_elevator_access ? 'Yes' : 'No'}</p>
                                <p><strong>Distance:</strong> {link.distance_meters}m</p>
                            </div>
                        </Popup>
                    </Polyline>
                );
            })}

            {/* Render Nodes */}
            {nodes.map(node => {
                 const [lon, lat] = node.coordinates.coordinates;
                 return (
                     <CircleMarker 
                        key={node.id} 
                        center={[lat, lon]} 
                        radius={3} 
                        pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 1 }}
                    >
                        <Popup>{node.description}</Popup>
                    </CircleMarker>
                 );
            })}
        </>
    );
}
