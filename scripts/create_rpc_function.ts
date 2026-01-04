/**
 * Script to create nearby_nodes_v2 RPC function
 * Run: npx tsx scripts/create_rpc_function.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function main() {
    if (!supabaseUrl || !supabaseKey) {
        console.log('❌ Missing Supabase credentials');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Creating nearby_nodes_v2 RPC function...');

    const sql = `
create or replace function public.nearby_nodes_v2(
  center_lat float,
  center_lon float,
  radius_meters int,
  max_results int default 5000
)
returns table (
  id text,
  parent_hub_id text,
  city_id text,
  name jsonb,
  type text,
  location jsonb,
  is_hub boolean,
  geohash text,
  vibe text,
  zone text
) as $$
declare
  center_point geometry;
begin
  center_point := ST_SetSRID(ST_MakePoint(center_lon, center_lat), 4326);

  return query
  select
    n.id,
    n.parent_hub_id,
    n.city_id,
    n.name,
    n.node_type as type,
    jsonb_build_object(
      'type', 'Point',
      'coordinates', jsonb_build_array(ST_X(n.coordinates), ST_Y(n.coordinates))
    ) as location,
    (n.parent_hub_id is null) as is_hub,
    null::text as geohash,
    null::text as vibe,
    'core'::text as zone
  from public.nodes n
  where ST_DWithin(n.coordinates::geography, center_point::geography, radius_meters)
    and not (ST_X(n.coordinates) = 0 and ST_Y(n.coordinates) = 0)
  order by n.coordinates <-> center_point
  limit greatest(1, least(max_results, 20000));
end;
$$ language plpgsql;

-- Grant permissions
grant execute on function public.nearby_nodes_v2(float, float, int, int) to anon;
grant execute on function public.nearby_nodes_v2(float, float, int, int) to authenticated;
`;

    const { error } = await supabase.rpc('exec_sql', { sql });

    // Since exec_sql might not exist, try direct query
    if (error) {
        console.log('exec_sql RPC not available, trying direct query...');

        // Use raw query via text()
        const { error: queryError } = await supabase
            .from('information_schema.routines')
            .select('routine_name')
            .eq('routine_name', 'nearby_nodes_v2');

        if (queryError) {
            console.log('Direct query approach needed');
        }
    } else {
        console.log('✓ RPC function created successfully');
    }

    // Verify
    const { data, error: verifyError } = await supabase
        .rpc('nearby_nodes_v2', {
            center_lat: 35.7138,
            center_lon: 139.7773,
            radius_meters: 5000,
            max_results: 10
        });

    if (verifyError) {
        console.log('❌ Verification failed:', verifyError.message);
    } else {
        console.log('✓ RPC function verified! Returned', (data || []).length, 'nodes');
    }
}

main().catch(console.error);
