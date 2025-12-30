-- P2 Security Final Enhancements
-- 1. Secure all public functions by setting search_path
DO $$
DECLARE
    func_record record;
BEGIN
    FOR func_record IN
        SELECT
            n.nspname as schema_name,
            p.proname as function_name,
            pg_get_function_identity_arguments(p.oid) as args,
            pg_get_userbyid(p.proowner) as owner_name
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
    LOOP
        IF func_record.owner_name = current_user THEN
          EXECUTE format('ALTER FUNCTION %I.%I(%s) SET search_path = public, extensions, pg_temp;',
              func_record.schema_name, func_record.function_name, func_record.args);
        END IF;
    END LOOP;
END $$;

-- 2. Security Events Table (Ensure structure)
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES auth.users(id),
    client_ip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Trigger for monitoring sensitive table changes (Audit Trail)
CREATE OR REPLACE FUNCTION public.log_security_event()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.security_events (event_type, severity, description, metadata, user_id)
    VALUES (
        'TABLE_MODIFICATION',
        'medium',
        format('Table %s was modified by %s', TG_TABLE_NAME, auth.uid()),
        jsonb_build_object(
            'table', TG_TABLE_NAME,
            'operation', TG_OP,
            'old_data', CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
            'new_data', CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
        ),
        auth.uid()
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF to_regclass('public.member_profiles') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS tr_monitor_member_profiles ON public.member_profiles;
    CREATE TRIGGER tr_monitor_member_profiles
    AFTER UPDATE ON public.member_profiles
    FOR EACH ROW
    WHEN (OLD.role IS DISTINCT FROM NEW.role)
    EXECUTE FUNCTION public.log_security_event();
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.fares') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS tr_monitor_fares ON public.fares;
    CREATE TRIGGER tr_monitor_fares
    AFTER INSERT OR UPDATE OR DELETE ON public.fares
    FOR EACH ROW
    EXECUTE FUNCTION public.log_security_event();
  END IF;
END $$;

-- 4. Harden core routes RLS (Ensure no gaps)
ALTER TABLE IF EXISTS public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stations_static ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.l1_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.l2_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.l3_details ENABLE ROW LEVEL SECURITY;

-- 5. Performance Optimizations (Indexes)
DO $$
BEGIN
  IF to_regclass('public.transit_dynamic_snapshot') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_transit_dynamic_snapshot_station_id ON public.transit_dynamic_snapshot(station_id);
    CREATE INDEX IF NOT EXISTS idx_transit_dynamic_snapshot_updated_at ON public.transit_dynamic_snapshot(updated_at DESC);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.l2_disruption_history') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_l2_disruption_history_station_id ON public.l2_disruption_history(station_id);
    CREATE INDEX IF NOT EXISTS idx_l2_disruption_history_created_at ON public.l2_disruption_history(created_at DESC);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.security_events') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at DESC);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.audit_logs') IS NOT NULL THEN
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.cities') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Public read access" ON public.cities;
    CREATE POLICY "Public read access" ON public.cities FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.nodes') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Public read access" ON public.nodes;
    CREATE POLICY "Public read access" ON public.nodes FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.stations_static') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Public read access" ON public.stations_static;
    CREATE POLICY "Public read access" ON public.stations_static FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.l1_places') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Public read access" ON public.l1_places;
    CREATE POLICY "Public read access" ON public.l1_places FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.l2_status') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Public read access" ON public.l2_status;
    CREATE POLICY "Public read access" ON public.l2_status FOR SELECT USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.l3_details') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Public read access" ON public.l3_details;
    CREATE POLICY "Public read access" ON public.l3_details FOR SELECT USING (true);
  END IF;
END $$;
