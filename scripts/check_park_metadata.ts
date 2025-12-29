import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkParkMetadata() {
    const { data, error } = await supabase
        .from('l1_places')
        .select('name, tags')
        .eq('category', 'nature')
        .or('name.ilike.%上野恩賜公園%,name.ilike.%皇居%,name.ilike.%新宿御苑%');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('=== Major Park Metadata Check ===');
    data.forEach((row: any) => {
        const tags = row.tags as any;
        console.log(`- ${row.name}: wikidata=${tags.wikidata}, wikipedia=${tags.wikipedia}`);
    });
}

checkParkMetadata();
