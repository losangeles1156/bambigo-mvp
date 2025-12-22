
-- 11_create_hybrid_architecture.sql

-- 1. Table: stations_static
-- Stores persistent, static data for L1 and L3 layers.
CREATE TABLE stations_static (
    station_id TEXT PRIMARY KEY,
    l1_identity_tag JSONB, -- Nested tags: {"main": "...", "sub": "...", "child": "..."}
    l1_ai_personality_summary TEXT, -- One-liner summary of station personality
    l3_services JSONB, -- Textual descriptions of services location: {"toilets": "...", "lockers": "..."}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table: transit_dynamic_snapshot
-- Stores real-time snapshots written by external tools (e.g., n8n, L2 adapters).
-- This acts as a cache layer for dynamic statuses.
CREATE TABLE transit_dynamic_snapshot (
    snapshot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id TEXT REFERENCES stations_static(station_id) ON DELETE CASCADE,
    status_code TEXT NOT NULL, -- 'NORMAL', 'DELAY', 'SUSPENDED'
    reason_ja TEXT,
    reason_zh_tw TEXT,
    weather_info JSONB, -- {"temp": 12.5, "condition": "Rain"}
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_stations_static_id ON stations_static(station_id);
CREATE INDEX idx_transit_dynamic_snapshot_station_id ON transit_dynamic_snapshot(station_id);
CREATE INDEX idx_transit_dynamic_snapshot_updated_at ON transit_dynamic_snapshot(updated_at);

-- Grant permissions (adjust based on actual role requirements)
ALTER TABLE stations_static ENABLE ROW LEVEL SECURITY;
ALTER TABLE transit_dynamic_snapshot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to stations_static"
ON stations_static FOR SELECT USING (true);

CREATE POLICY "Allow public read access to transit_dynamic_snapshot"
ON transit_dynamic_snapshot FOR SELECT USING (true);

-- Allow service role (or authenticated users with specific roles) to insert/update
-- For MVP/Demo with n8n using service key/anon key, we might need broader write policies or rely on service_role bypass.
-- Assuming n8n uses a key that can bypass RLS or we add a policy for anon if strictly needed (not recommended for prod).
-- For now, keep it simple for read, write usually handled by admin client or service role in n8n.
