CREATE TABLE IF NOT EXISTS fares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    operator TEXT NOT NULL,
    from_station_id TEXT NOT NULL,
    to_station_id TEXT NOT NULL,
    ticket_fare INTEGER,
    ic_card_fare INTEGER,
    child_ticket_fare INTEGER,
    child_ic_card_fare INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(operator, from_station_id, to_station_id)
);

CREATE INDEX IF NOT EXISTS idx_fares_from_station ON fares(from_station_id);
CREATE INDEX IF NOT EXISTS idx_fares_to_station ON fares(to_station_id);
CREATE INDEX IF NOT EXISTS idx_fares_route ON fares(from_station_id, to_station_id);

ALTER TABLE fares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON fares;
CREATE POLICY "Allow public read access"
    ON fares FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow service_role full access" ON fares;
CREATE POLICY "Allow service_role full access"
    ON fares FOR ALL
    USING (true)
    WITH CHECK (true);
