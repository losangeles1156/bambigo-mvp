
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { count, error } = await supabase
        .from('nodes')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching nodes:', error);
    } else {
        console.log(`Total nodes in DB: ${count}`);
    }

    const { data: sample } = await supabase.from('nodes').select('*').limit(1);
    if (sample && sample.length > 0) {
        console.log('Sample node keys:', Object.keys(sample[0]));
    }
}

check();
