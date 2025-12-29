import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

async function runMigration() {
    console.log('=== Running Pedestrian Network Migration ===\n');

    // Read SQL file
    const sqlPath = path.resolve(process.cwd(), 'supabase/migrations/20251229_add_pedestrian_network.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Split into individual statements (remove comments and empty lines)
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute.\n`);

    let success = 0;
    let failed = 0;

    for (const stmt of statements) {
        const preview = stmt.substring(0, 60).replace(/\n/g, ' ') + '...';

        const { error } = await supabase.rpc('exec_sql', { sql_query: stmt + ';' });

        if (error) {
            // Try direct execution via REST if RPC not available
            // Fallback: just log, user may need to run in Supabase SQL Editor
            console.log(`⚠️  ${preview}`);
            console.log(`   Error: ${error.message}`);
            failed++;
        } else {
            console.log(`✅ ${preview}`);
            success++;
        }
    }

    console.log(`\n=== Migration Complete ===`);
    console.log(`Success: ${success}, Failed: ${failed}`);

    if (failed > 0) {
        console.log('\n📋 Please run the SQL manually in Supabase SQL Editor:');
        console.log('   supabase/migrations/20251229_add_pedestrian_network.sql');
    }
}

runMigration().catch(console.error);
