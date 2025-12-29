import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAkihabaraNature() {
    const { data } = await supabase
        .from('l1_places')
        .select('name')
        .eq('station_id', 'odpt:Station:JR-East.Akihabara')
        .eq('category', 'nature');

    console.log(`Akihabara Nature Count: ${data?.length}`);
    data?.forEach(p => console.log(`- ${p.name}`));
}

checkAkihabaraNature();
