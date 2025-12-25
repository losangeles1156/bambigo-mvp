import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY || envConfig.SUPABASE_SERVICE_KEY);

async function inspectL3() {
    console.log('Inspecting potential L3 data columns...');

    // 1. Check stations_static.l3_services for ARRAY data
    const { data: staticData, error: sError } = await supabase
        .from('stations_static')
        .select('station_id, l3_services')
        .not('l3_services', 'is', null);

    if (sError) console.error('Error fetching stations_static:', sError.message);

    if (staticData && staticData.length > 0) {
        const validArrays = staticData.filter(d => Array.isArray(d.l3_services));
        console.log(`\n=== Found ${validArrays.length} records in stations_static with VALID ARRAY l3_services (out of ${staticData.length} non-nulls) ===`);

        if (validArrays.length > 0) {
            console.log('Sample Valid L3:', JSON.stringify(validArrays[0].l3_services, null, 2));
        } else {
            console.log('Sample Invalid L3 (Placeholder):', JSON.stringify(staticData[0].l3_services, null, 2));
        }
    } else {
        console.log('\n=== No data found in stations_static.l3_services ===');
    }

    // 2. Check nodes.facility_profile
    const { data: nodesData, error: nError } = await supabase
        .from('nodes')
        .select('id, facility_profile')
        .not('facility_profile', 'is', null)
        .limit(5);

    if (nError) console.error('Error fetching nodes:', nError.message);

    if (nodesData && nodesData.length > 0) {
        console.log(`\n=== Found ${nodesData.length} records in nodes with facility_profile ===`);
        console.log('Sample facility_profile:', JSON.stringify(nodesData[0].facility_profile, null, 2));
    } else {
        console.log('\n=== No data found in nodes.facility_profile ===');
    }
}

inspectL3();
