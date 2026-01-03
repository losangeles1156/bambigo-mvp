
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('📊 L3 Facilities Status Check');
    console.log('=============================');

    const { data, error } = await supabase
        .from('l3_facilities')
        .select('type');

    if (error) {
        console.error('Error fetching L3 data:', error.message);
        return;
    }

    const counts: Record<string, number> = {};
    data.forEach(item => {
        counts[item.type] = (counts[item.type] || 0) + 1;
    });

    if (Object.keys(counts).length === 0) {
        console.log('❌ No L3 facilities found in database.');
    } else {
        console.log('✅ Current Facility Counts:');
        Object.entries(counts).forEach(([type, count]) => {
            console.log(`   - ${type}: ${count}`);
        });
    }
}

main().catch(console.error);
