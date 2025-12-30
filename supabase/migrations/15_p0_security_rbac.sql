DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'member_profiles'
  ) THEN
    CREATE TABLE public.member_profiles (
      user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      display_name text,
      role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'support', 'admin')),
      pii_ciphertext text,
      pii_iv text,
      pii_version integer,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      deleted_at timestamptz
    );

    CREATE INDEX idx_member_profiles_role ON public.member_profiles(role);
    CREATE INDEX idx_member_profiles_created_at ON public.member_profiles(created_at DESC);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'member_profiles_updated_at'
  ) THEN
    CREATE TRIGGER member_profiles_updated_at
    BEFORE UPDATE ON public.member_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
  END IF;
END $$;

ALTER TABLE public.member_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own member profile" ON public.member_profiles;
DROP POLICY IF EXISTS "Users can insert own member profile" ON public.member_profiles;
DROP POLICY IF EXISTS "Service role full access on member_profiles" ON public.member_profiles;

CREATE POLICY "Users can view own member profile" ON public.member_profiles
  FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own member profile" ON public.member_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on member_profiles" ON public.member_profiles
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


ALTER TABLE public.l1_places ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service_role full access" ON public.l1_places;
CREATE POLICY "Allow service_role full access" ON public.l1_places
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


ALTER TABLE public.l3_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service role full access" ON public.l3_snapshots;
CREATE POLICY "Allow service role full access" ON public.l3_snapshots
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


ALTER TABLE public.l3_facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert/update for service role only" ON public.l3_facilities;
CREATE POLICY "Enable insert/update for service role only" ON public.l3_facilities
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


ALTER TABLE public.trip_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own trip_subscriptions" ON public.trip_subscriptions;
DROP POLICY IF EXISTS "Service role full access on trip_subscriptions" ON public.trip_subscriptions;

CREATE POLICY "Users manage own trip_subscriptions" ON public.trip_subscriptions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on trip_subscriptions" ON public.trip_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


ALTER TABLE public.nudge_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own nudge_logs" ON public.nudge_logs;
DROP POLICY IF EXISTS "Service role full access on nudge_logs" ON public.nudge_logs;

CREATE POLICY "Users manage own nudge_logs" ON public.nudge_logs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on nudge_logs" ON public.nudge_logs
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


ALTER TABLE public.l2_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only on l2_cache" ON public.l2_cache;
CREATE POLICY "Service role only on l2_cache" ON public.l2_cache
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');


ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to cities" ON public.cities;
CREATE POLICY "Allow public read access to cities" ON public.cities
  FOR SELECT
  USING (true);

ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to nodes" ON public.nodes;
DROP POLICY IF EXISTS "Service role full access on nodes" ON public.nodes;
CREATE POLICY "Allow public read access to nodes" ON public.nodes
  FOR SELECT
  USING (true);
CREATE POLICY "Service role full access on nodes" ON public.nodes
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to facilities" ON public.facilities;
CREATE POLICY "Allow public read access to facilities" ON public.facilities
  FOR SELECT
  USING (true);

ALTER TABLE public.pois ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to pois" ON public.pois;
CREATE POLICY "Allow public read access to pois" ON public.pois
  FOR SELECT
  USING (true);

ALTER TABLE public.shared_mobility_stations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to shared_mobility_stations" ON public.shared_mobility_stations;
CREATE POLICY "Allow public read access to shared_mobility_stations" ON public.shared_mobility_stations
  FOR SELECT
  USING (true);

ALTER TABLE public.suitability ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to suitability" ON public.suitability;
CREATE POLICY "Allow public read access to suitability" ON public.suitability
  FOR SELECT
  USING (true);

ALTER TABLE public.facility_suitability ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to facility_suitability" ON public.facility_suitability;
CREATE POLICY "Allow public read access to facility_suitability" ON public.facility_suitability
  FOR SELECT
  USING (true);
