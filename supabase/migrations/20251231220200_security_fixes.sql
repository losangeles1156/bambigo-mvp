ALTER TABLE IF EXISTS public.node_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.node_facility_profiles ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE
  table_owner text;
BEGIN
  IF to_regclass('public.spatial_ref_sys') IS NOT NULL THEN
    SELECT pg_get_userbyid(c.relowner)
      INTO table_owner
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'spatial_ref_sys';

    IF table_owner = current_user THEN
      ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

      IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'spatial_ref_sys' AND policyname = 'Allow public read access on spatial_ref_sys'
      ) THEN
          CREATE POLICY "Allow public read access on spatial_ref_sys"
          ON public.spatial_ref_sys
          FOR SELECT
          TO public
          USING (true);
      END IF;
    END IF;
  END IF;
END $$;
