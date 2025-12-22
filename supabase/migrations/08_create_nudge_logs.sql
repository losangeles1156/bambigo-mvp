create table nudge_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) not null,
  node_id text references nodes(id),        -- Where the nudge happened
  partner_id text,                          -- ID of the commercial partner
  nudge_type text not null,                 -- 'delay_taxi', 'crowd_gourmet', etc.
  content jsonb,                            -- Snapshot of the message sent
  delivered_via text default 'line',
  created_at timestamp with time zone default now()
);

-- Index for analytics
create index idx_nudge_logs_user on nudge_logs(user_id);
create index idx_nudge_logs_node on nudge_logs(node_id);
create index idx_nudge_logs_partner on nudge_logs(partner_id);
