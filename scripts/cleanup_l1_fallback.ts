import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupFallback() {
    const fallbackIds = ['tokyo.jr.ueno', 'tokyo.jr.tokyo', 'tokyo.jr.akihabara', 'tokyo.metro.asakusa'];

    console.log(`Cleaning up legacy fallback IDs: ${fallbackIds.join(', ')}`);

    const { error, count } = await supabase
        .from('l1_places')
        .delete({ count: 'exact' })
        .in('station_id', fallbackIds);

    if (error) {
        console.error('Error deleting:', error);
    } else {
        console.log(`Deleted ${count} invalid rows.`);
    }
}

cleanupFallback();
