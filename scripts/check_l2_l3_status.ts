
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

async function main() {
    console.log('=== Data Status Report ===');

    // L2 Check
    const { count: l2Count, error: l2Error } = await supabase
        .from('transit_dynamic_snapshot')
        .select('*', { count: 'exact', head: true });

    if (l2Error) console.error('L2 Error:', l2Error.message);
    else console.log(`🚄 L2 Dynamic Records: ${l2Count}`);

    // L3 Check (Facilities overall)
    const { count: l3Count, error: l3Error } = await supabase
        .from('l3_facilities')
        .select('*', { count: 'exact', head: true });

    if (l3Error) console.error('L3 Error:', l3Error.message);
    else console.log(`🚻 L3 Facilities Records: ${l3Count}`);

    // L3 Check (Breakdown by source)
    const { data: osmData, error: osmError } = await supabase
        .from('l3_facilities')
        .select('id')
        .contains('attributes', { _source: 'OSM' });

    if (osmError) console.error('OSM Error:', osmError.message);
    else console.log(`   └─ OSM Ingested: ${osmData?.length || 0}`);

}

main();
