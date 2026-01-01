-- Fix: Ambiguous column reference in get_nearby_accessibility_graph
-- Previous version had conflict between function arguments (lat, lon) and table columns (lat, lon).
-- This script replaces the function with unambiguous argument names.

-- 1. DROP the existing function first (Required when changing parameter names)
DROP FUNCTION IF EXISTS get_nearby_accessibility_graph(double precision, double precision, double precision);

-- 2. Create the new function with distinct parameter names (query_lat, query_lon)
CREATE OR REPLACE FUNCTION get_nearby_accessibility_graph(
    query_lat double precision,
    query_lon double precision,
    radius_meters double precision DEFAULT 100
)
RETURNS TABLE (
    id text,
    type text, -- 'node' or 'link'
    description text,
    distance_from_query double precision,
    coordinates json
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Return Nodes
    RETURN QUERY
    SELECT
        n.node_id as id,
        'node' as type,
        CONCAT(
            'Node ID: ', n.node_id, '. ',
            'Floor: ', COALESCE(n.floor_level::text, 'G'), '. ',
            CASE WHEN n.is_indoor THEN 'Indoor. ' ELSE 'Outdoor. ' END,
            'Connected to station: ', COALESCE(n.station_id, 'None')
        ) as description,
        ST_Distance(n.coordinates, ST_SetSRID(ST_MakePoint(query_lon, query_lat), 4326)::geography) as distance_from_query,
        ST_AsGeoJSON(n.coordinates)::json as coordinates
    FROM pedestrian_nodes n
    WHERE ST_DWithin(n.coordinates, ST_SetSRID(ST_MakePoint(query_lon, query_lat), 4326)::geography, radius_meters)
    ORDER BY distance_from_query ASC
    LIMIT 30;

    -- Return Links
    RETURN QUERY
    SELECT
        l.link_id as id,
        'link' as type,
        v.llm_description as description,
        ST_Distance(l.geometry, ST_SetSRID(ST_MakePoint(query_lon, query_lat), 4326)::geography) as distance_from_query,
        ST_AsGeoJSON(l.geometry)::json as coordinates
    FROM pedestrian_links l
    JOIN ai_pedestrian_graph_view v ON l.link_id = v.link_id
    WHERE ST_DWithin(l.geometry, ST_SetSRID(ST_MakePoint(query_lon, query_lat), 4326)::geography, radius_meters)
    ORDER BY distance_from_query ASC
    LIMIT 30;
END;
$$;
