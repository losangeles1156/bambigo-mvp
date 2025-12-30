create extension if not exists pgcrypto;

create table if not exists public.user_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  activity_type text not null,
  query_content text,
  device_info jsonb default '{}'::jsonb,
  metadata jsonb default '{}'::jsonb,
  timestamp timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_user_activities_timestamp on public.user_activities(timestamp desc);
create index if not exists idx_user_activities_user_id on public.user_activities(user_id);
create index if not exists idx_user_activities_activity_type on public.user_activities(activity_type);

alter table public.user_activities enable row level security;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_activities'
      AND policyname = 'Service role write user_activities'
  ) THEN
    CREATE POLICY "Service role write user_activities" ON public.user_activities
      FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;


create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  actor_visitor_id text,
  actor_ip_hash text,
  actor_user_agent_hash text,
  action text not null check (action in ('create', 'read', 'update', 'delete')),
  resource_type text not null,
  resource_id text not null,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index if not exists idx_audit_logs_actor_user_id on public.audit_logs(actor_user_id);
create index if not exists idx_audit_logs_actor_visitor_id on public.audit_logs(actor_visitor_id);
create index if not exists idx_audit_logs_resource_type on public.audit_logs(resource_type);
create index if not exists idx_audit_logs_action on public.audit_logs(action);

alter table public.audit_logs enable row level security;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'audit_logs'
      AND policyname = 'Service role write audit_logs'
  ) THEN
    CREATE POLICY "Service role write audit_logs" ON public.audit_logs
      FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;


create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  actor_user_id uuid,
  actor_visitor_id text,
  actor_ip_hash text,
  actor_user_agent_hash text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_security_events_created_at on public.security_events(created_at desc);
create index if not exists idx_security_events_severity on public.security_events(severity);
create index if not exists idx_security_events_type on public.security_events(type);
create index if not exists idx_security_events_actor_user_id on public.security_events(actor_user_id);
create index if not exists idx_security_events_actor_visitor_id on public.security_events(actor_visitor_id);
create index if not exists idx_security_events_high on public.security_events(created_at desc)
  where severity in ('high', 'critical');

alter table public.security_events enable row level security;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'security_events'
      AND policyname = 'Service role write security_events'
  ) THEN
    CREATE POLICY "Service role write security_events" ON public.security_events
      FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;
