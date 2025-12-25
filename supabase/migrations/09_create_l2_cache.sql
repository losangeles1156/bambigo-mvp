-- L2 Cache Table (Fallback for Redis when self-hosting or in dev)
create table l2_cache (
  key text primary key, -- 'l2:{node_id}' or 'transit:{line_id}'
  value jsonb not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

create index idx_l2_cache_expires on l2_cache(expires_at);

-- Function to clean expired cache
create or replace function cleanup_expired_cache()
returns void as $$
begin
  delete from l2_cache where expires_at < now();
end;
$$ language plpgsql;
