import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupLegacy() {
    console.log('=== L1 Legacy Cleanup ===');

    // 1. Get All Valid Node IDs
    const { data: nodes, error: nodesError } = await supabase
        .from('nodes')
        .select('id');

    if (nodesError) {
        console.error('Error fetching nodes:', nodesError);
        return;
    }

    const validIds = new Set(nodes.map(n => n.id));
    console.log(`Found ${validIds.size} valid node IDs.`);

    // 2. Get All Unique Station IDs in l1_places
    // We do this by fetching the column (might be heavy)
    const { data: l1Data, error: l1Error } = await supabase
        .from('l1_places')
        .select('station_id');

    if (l1Error) {
        console.error('Error fetching l1_places:', l1Error);
        return;
    }

    const existingStationIds = new Set(l1Data.map(p => p.station_id));
    const legacyIds = Array.from(existingStationIds).filter(id => !validIds.has(id));

    if (legacyIds.length === 0) {
        console.log('✅ No legacy data found.');
        return;
    }

    console.log(`⚠️  Found ${legacyIds.length} legacy station IDs in l1_places:`);
    legacyIds.forEach(id => console.log(`  - ${id}`));

    // 3. Delete
    console.log(`Deleting data for ${legacyIds.length} stations...`);
    const { error: deleteError } = await supabase
        .from('l1_places')
        .delete()
        .in('station_id', legacyIds);

    if (deleteError) {
        console.error('Error during deletion:', deleteError);
    } else {
        console.log('✅ Legacy data cleaned up successfully.');
    }
}

cleanupLegacy();
