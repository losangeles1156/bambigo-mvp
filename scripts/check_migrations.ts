/**
 * Check applied migrations
 * Run: npx tsx scripts/check_migrations.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function main() {
    if (!supabaseUrl || !supabaseKey) {
        console.log('❌ Missing Supabase credentials');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check applied migrations
    const { data: migrations, error } = await supabase
        .from('supabase_migrations.schema_migrations')
        .select('version, statement')
        .order('version');

    if (error) {
        console.log('Error fetching migrations:', error.message);
        return;
    }

    console.log('Applied migrations:');
    console.log('-'.repeat(40));
    migrations?.forEach((m: any) => {
        console.log(`  ${m.version}`);
    });

    // Check if nearby_nodes_v2 exists in information_schema
    console.log('\nChecking for nearby_nodes_v2 function...');
    const { data: funcCheck } = await supabase
        .from('information_schema.routines')
        .select('routine_name')
        .eq('routine_schema', 'public')
        .ilike('routine_name', '%nearby%');

    console.log('\nNearby functions found:', funcCheck?.length || 0);
    funcCheck?.forEach((f: any) => {
        console.log(`  - ${f.routine_name}`);
    });
}

main().catch(console.error);
