-- 13_create_l2_disruption_history.sql

ALTER TABLE transit_dynamic_snapshot
ADD COLUMN IF NOT EXISTS disruption_data JSONB;

WITH ranked AS (
    SELECT
        snapshot_id,
        station_id,
        ROW_NUMBER() OVER (PARTITION BY station_id ORDER BY updated_at DESC, snapshot_id DESC) AS rn
    FROM transit_dynamic_snapshot
    WHERE station_id IS NOT NULL
)
DELETE FROM transit_dynamic_snapshot t
USING ranked r
WHERE t.snapshot_id = r.snapshot_id
  AND r.rn > 1;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uniq_transit_dynamic_snapshot_station_id'
    ) THEN
        ALTER TABLE transit_dynamic_snapshot
        ADD CONSTRAINT uniq_transit_dynamic_snapshot_station_id UNIQUE (station_id);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS l2_disruption_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id TEXT NOT NULL REFERENCES stations_static(station_id) ON DELETE CASCADE,
    severity TEXT NOT NULL,
    has_issues BOOLEAN NOT NULL,
    affected_lines TEXT[],
    disruption_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_l2_disruption_history_station_time
ON l2_disruption_history(station_id, created_at DESC);

ALTER TABLE l2_disruption_history ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'l2_disruption_history'
          AND policyname = 'Allow public read access to l2_disruption_history'
    ) THEN
        CREATE POLICY "Allow public read access to l2_disruption_history"
        ON l2_disruption_history FOR SELECT
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'l2_disruption_history'
          AND policyname = 'Allow service role write access to l2_disruption_history'
    ) THEN
        CREATE POLICY "Allow service role write access to l2_disruption_history"
        ON l2_disruption_history FOR ALL
        USING (auth.role() = 'service_role')
        WITH CHECK (auth.role() = 'service_role');
    END IF;
END $$;
