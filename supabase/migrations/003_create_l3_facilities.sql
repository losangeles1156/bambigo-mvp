
-- Create L3 Facilities table
CREATE TABLE IF NOT EXISTS public.l3_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id TEXT NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'toilet', 'elevator', 'locker', 'atm', etc.
    name_i18n JSONB DEFAULT '{}'::jsonb, -- Localized name/location description
    location_coords GEOGRAPHY(POINT), -- Precision location if available
    attributes JSONB DEFAULT '{}'::jsonb, -- Flexible metadata (payment, hours, gender, accessible)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by station
CREATE INDEX IF NOT EXISTS idx_l3_station_id ON public.l3_facilities(station_id);

-- Add RLS policies
ALTER TABLE public.l3_facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.l3_facilities
    FOR SELECT USING (true);

CREATE POLICY "Enable insert/update for service role only" ON public.l3_facilities
    FOR ALL USING (auth.role() = 'service_role');
