
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

async function main() {
    const { data, error } = await supabase
        .from('transit_dynamic_snapshot')
        .select('*')
        .limit(10);

    if (error) {
        console.error(error);
        return;
    }

    console.log('--- transit_dynamic_snapshot sample ---');
    console.log(JSON.stringify(data, null, 2));
}

main();
