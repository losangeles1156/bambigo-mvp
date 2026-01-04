/**
 * Run database migration via Supabase REST API
 * Usage: npx tsx scripts/run_migration_rest.ts
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

async function runMigration() {
    console.log('=== Running Hub Metadata Migration via REST API ===\n');

    const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/20260103_create_hub_metadata.sql');
    
    if (!fs.existsSync(migrationPath)) {
        console.error('❌ Migration file not found:', migrationPath);
        process.exit(1);
    }

    const sql = fs.readFileSync(migrationPath, 'utf-8');
    console.log('📄 Loaded migration file\n');

    try {
        // Execute SQL directly
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SERVICE_KEY}`,
                'Content-Type': 'application/json',
                'apikey': SERVICE_KEY
            },
            body: JSON.stringify({ sql_query: sql })
        });

        if (response.ok) {
            console.log('✅ Migration executed successfully!');
        } else {
            const error = await response.text();
            console.log('⚠️  Response:', response.status, error.substring(0, 200));
        }

        console.log('\n📋 Migration Summary:');
        console.log('   - hub_metadata table');
        console.log('   - hub_members table');
        console.log('   - Indexes');
        console.log('   - Helper functions: get_hub_members, get_hub_info_by_member');
        console.log('   - Sample data for Tokyo hubs (Ueno, Tokyo, Shinjuku, Ikebukuro)');
        
    } catch (err: any) {
        console.error('❌ Migration failed:', err.message);
        console.log('\n💡 Note: The SQL migration file is ready at:');
        console.log('   supabase/migrations/20260103_create_hub_metadata.sql');
        console.log('\n   You can run this manually in Supabase Dashboard SQL Editor.');
    }
}

runMigration();
