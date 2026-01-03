
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

async function main() {
    console.log("--- Inspecting Station Tables ---");

    const { data: ssData, error: ssError } = await supabase.from('stations_static').select('*').limit(1);
    if (ssError) console.error("stations_static error:", ssError.message);
    else console.log("stations_static keys:", Object.keys(ssData?.[0] || {}));

    const { data: l3Data, error: l3Error } = await supabase.from('l3_facilities').select('*').limit(1);
    if (l3Error) console.error("l3_facilities error:", l3Error.message);
    else console.log("l3_facilities keys:", Object.keys(l3Data?.[0] || {}));
}

main();
