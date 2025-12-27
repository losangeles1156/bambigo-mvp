import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUenoCategories() {
    const { data, error } = await supabase
        .from('l1_places')
        .select('category, count(*)')
        .eq('station_id', 'tokyo.jr.ueno') // Hardcoded for Ueno check
        // .or group by is not directly supported in simple client select for count
        // so we just fetch all categories and aggregate in JS
        .select('category');

    if (error) {
        console.error('Error:', error);
        return;
    }

    const counts: Record<string, number> = {};
    data.forEach((row: any) => {
        counts[row.category] = (counts[row.category] || 0) + 1;
    });

    console.log('=== Ueno Category Counts ===');
    console.table(counts);
}

checkUenoCategories();
