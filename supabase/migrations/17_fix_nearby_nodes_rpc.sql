create or replace function public.nearby_nodes(
  center_lat float,
  center_lon float,
  radius_meters int
)
returns setof public.nodes as $$
declare
  center_point geometry;
begin
  center_point := ST_SetSRID(ST_MakePoint(center_lon, center_lat), 4326);

  return query
  select n.*
  from public.nodes n
  where ST_DWithin(n.coordinates::geography, center_point::geography, radius_meters)
  order by n.coordinates <-> center_point
  limit 10;
end;
$$ language plpgsql;

alter function public.nearby_nodes(float, float, int) set search_path = public, extensions, pg_temp;
