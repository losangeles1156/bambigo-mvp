
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Fallback to the one seen in debug script if env var is missing
const connectionString = process.env.DATABASE_URL || "postgresql://postgres.evubeqeaafdjnuocyhmb:K521128lalK@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres";

async function applyMigration() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('🔌 Connected to database.');

        const sqlPath = path.join(process.cwd(), 'supabase/migrations/20260101_optimize_pedestrian_for_ai.sql');
        if (!fs.existsSync(sqlPath)) {
             console.error(`❌ Migration file not found: ${sqlPath}`);
             process.exit(1);
        }
        
        const sql = fs.readFileSync(sqlPath, 'utf-8');

        console.log(`📄 Applying migration: ${path.basename(sqlPath)}...`);
        await client.query(sql);
        
        console.log('✅ Migration applied successfully!');
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await client.end();
    }
}

applyMigration();
