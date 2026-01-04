const { Pool } = require('pg');
const { readFileSync } = require('fs');
const { join } = require('path');

const pool = new Pool({
  host: 'evubeqeaafdjnuocyhmb.supabase.co',
  database: 'postgres',
  user: 'postgres',
  password: 'sb_secret_DM67oQWGbhFDbiU269BrWA_h-2oUfHj',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  console.log('=== Running Ward Boundaries Migration ===\n');

  const client = await pool.connect();
  try {
    const migrationPath = join(__dirname, '../supabase/migrations/20260104080000_add_ward_boundaries.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    // Execute the SQL
    await client.query(sql);
    console.log('Migration executed successfully!');

    // Verify wards now have boundaries
    const result = await client.query(`
      SELECT id, name_i18n->>'ja' as name,
             boundary IS NOT null as has_boundary,
             node_count
      FROM public.wards ORDER BY id
    `);

    console.log('\n=== Ward Status After Migration ===');
    for (const w of result.rows) {
      console.log(`  ${w.name}: boundary=${w.has_boundary}, nodes=${w.node_count}`);
    }
  } catch (error) {
    console.error('Error executing migration:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
