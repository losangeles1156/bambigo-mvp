create table if not exists users (
  id uuid references auth.users not null primary key,
  line_user_id text unique,
  display_name text,
  preferences jsonb,
  created_at timestamptz default now(),
  last_seen_at timestamptz default now()
);

alter table users enable row level security;

drop policy if exists "Users can view own data" on users;
create policy "Users can view own data" on users
  for select using (auth.uid() = id);

drop policy if exists "Users can update own data" on users;
create policy "Users can update own data" on users
  for update using (auth.uid() = id);
