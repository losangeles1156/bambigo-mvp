-- Create a table to store L3 Facility Snapshots
create table if not exists l3_snapshots (
  id uuid default gen_random_uuid() primary key,
  station_id text not null, -- e.g., 'odpt:Station:TokyoMetro.Ueno'
  operator text not null,   -- e.g., 'Metro'
  data jsonb not null,      -- Array of StationFacility objects
  created_at timestamptz default now(),
  hash text,                -- For deduplication/change detection
  status text check (status in ('success', 'partial', 'failed')) default 'success',
  log text
);

-- Index for fast lookup by station
create index if not exists idx_l3_snapshots_station_id on l3_snapshots(station_id);
create index if not exists idx_l3_snapshots_created_at on l3_snapshots(created_at desc);

-- RLS Policies (Optional but good practice)
alter table l3_snapshots enable row level security;

-- Allow public read access (for API)
create policy "Allow public read access"
  on l3_snapshots for select
  using (true);

-- Allow service role full access (for Scraper)
create policy "Allow service role full access"
  on l3_snapshots for all
  using (true)
  with check (true);
