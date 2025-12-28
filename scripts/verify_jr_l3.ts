
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Setup Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const targetId = 'odpt:Station:JR-East.Akihabara';
    console.log(`Verifying L3 data for ${targetId}...`);

    const { data, error } = await supabase
        .from('stations_static')
        .select('*') // Select all to see columns
        .eq('station_id', targetId)
        .single();

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    if (data) {
        console.log('✅ Record found.');
        console.log('Keys:', Object.keys(data).join(', '));
        if (data.l3_services) {
            console.log(`✅ L3 Services found: ${data.l3_services.length} items.`);
            console.log('Sample:', JSON.stringify(data.l3_services[0], null, 2));
        } else {
            console.log('❌ l3_services is empty/null.');
        }
    } else {
        console.log('❌ Record not found.');
    }
}

main().catch(console.error);
