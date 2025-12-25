import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySubscriptions() {
    console.log('🔍 Checking Trip Guard Subscriptions...');

    const { data, error } = await supabase
        .from('trip_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Error fetching subscriptions:', error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log('⚠️ No subscriptions found. Go to the app and click "Activate Trip Guard" first.');
    } else {
        console.log(`✅ Found ${data.length} subscriptions:\n`);
        data.forEach((sub, i) => {
            console.log(`[${i + 1}] User: ${sub.user_id} | Route: ${sub.route_ids} | Method: ${sub.notification_method}`);
            console.log(`    Active: ${sub.is_active} | Time: ${sub.active_start_time} - ${sub.active_end_time}`);
            console.log('---------------------------------------------------');
        });
    }
}

verifySubscriptions();
