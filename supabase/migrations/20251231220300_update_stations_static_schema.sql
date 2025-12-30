DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'stations_static'
      AND column_name = 'station_id'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'stations_static'
      AND column_name = 'id'
  ) THEN
    ALTER TABLE stations_static RENAME COLUMN station_id TO id;
  END IF;
END $$;

ALTER TABLE stations_static ADD COLUMN IF NOT EXISTS city_id TEXT;
ALTER TABLE stations_static ADD COLUMN IF NOT EXISTS name JSONB;
ALTER TABLE stations_static ADD COLUMN IF NOT EXISTS location GEOMETRY(POINT, 4326);
ALTER TABLE stations_static ADD COLUMN IF NOT EXISTS is_hub BOOLEAN DEFAULT false;
ALTER TABLE stations_static ADD COLUMN IF NOT EXISTS zone TEXT DEFAULT 'core';
ALTER TABLE stations_static ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'station';
ALTER TABLE stations_static ADD COLUMN IF NOT EXISTS tags JSONB;
ALTER TABLE stations_static ADD COLUMN IF NOT EXISTS source_dataset TEXT;

CREATE INDEX IF NOT EXISTS idx_stations_static_city_id ON stations_static(city_id);
CREATE INDEX IF NOT EXISTS idx_stations_static_location ON stations_static USING GIST(location);
