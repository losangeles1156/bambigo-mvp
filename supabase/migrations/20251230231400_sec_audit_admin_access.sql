CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.member_profiles
    WHERE user_id = auth.uid()
      AND role = 'admin'
      AND deleted_at IS NULL
  );
$$ LANGUAGE sql SECURITY DEFINER;

DO $$
BEGIN
  IF to_regclass('public.user_activities') IS NOT NULL THEN
    ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admins can view all user activities" ON public.user_activities;
    CREATE POLICY "Admins can view all user activities" ON public.user_activities
      FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.audit_logs') IS NOT NULL THEN
    ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
    CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
      FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.security_events') IS NOT NULL THEN
    ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admins can view all security events" ON public.security_events;
    CREATE POLICY "Admins can view all security events" ON public.security_events
      FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;
