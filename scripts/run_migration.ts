import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('=== Running Ward Boundaries Migration ===\n');

  const migrationPath = join(__dirname, '../supabase/migrations/20260104080000_add_ward_boundaries.sql');
  const sql = readFileSync(migrationPath, 'utf-8');

  // Execute the SQL
  const { data, error } = await supabase.rpc('exec_sql', { sql });

  if (error) {
    console.error('Error executing migration:', error);
    return;
  }

  console.log('Migration executed successfully!');

  // Verify wards now have boundaries
  const { data: wards } = await supabase
    .from('wards')
    .select('id, name_i18n, boundary IS NOT null as has_boundary, node_count')
    .order('id');

  console.log('\n=== Ward Status After Migration ===');
  if (wards) {
    for (const w of wards) {
      console.log(`  ${w.name_i18n?.ja || w.id}: boundary=${w.has_boundary}, nodes=${w.node_count}`);
    }
  }
}

runMigration().catch(console.error);
