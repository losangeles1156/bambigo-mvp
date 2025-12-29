import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findIds() {
    const { data } = await supabase
        .from('nodes')
        .select('id')
        .or('id.ilike.%Hiroo%,id.ilike.%Akasaka%');

    data?.forEach(r => console.log(r.id));
}

findIds();
