DO $$
BEGIN
  IF to_regclass('public.pedestrian_links') IS NOT NULL THEN
    ALTER TABLE public.pedestrian_links ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow public read on pedestrian_links" ON public.pedestrian_links;
    CREATE POLICY "Allow public read on pedestrian_links" ON public.pedestrian_links
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.pedestrian_nodes') IS NOT NULL THEN
    ALTER TABLE public.pedestrian_nodes ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow public read on pedestrian_nodes" ON public.pedestrian_nodes;
    CREATE POLICY "Allow public read on pedestrian_nodes" ON public.pedestrian_nodes
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.stations_static') IS NOT NULL THEN
    ALTER TABLE public.stations_static ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow public read on stations_static" ON public.stations_static;
    CREATE POLICY "Allow public read on stations_static" ON public.stations_static
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.transit_dynamic_snapshot') IS NOT NULL THEN
    ALTER TABLE public.transit_dynamic_snapshot ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow public read on transit_dynamic_snapshot" ON public.transit_dynamic_snapshot;
    CREATE POLICY "Allow public read on transit_dynamic_snapshot" ON public.transit_dynamic_snapshot
      FOR SELECT USING (true);
  END IF;
END $$;
