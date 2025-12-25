import * as dotenv from 'dotenv';
// Load from project root .env.local
dotenv.config({ path: '.env.local' });


async function seed() {
    // Dynamic import ensures env vars are loaded first
    const { supabaseAdmin } = await import('../lib/supabase');
    const { SEED_NODES } = await import('../lib/nodes/seedNodes');


    console.log('🚀 Start seeding stations_static...');

    if (!process.env.SUPABASE_SERVICE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn('⚠️  No Service Key found in env. RLS might block writes.');
    }

    const rows = SEED_NODES.map(node => ({
        station_id: node.id,
        // Optional: We can populate initial logic here if we want, but keeping it minimal for FK satisfaction
        l1_ai_personality_summary: `Station: ${node.name['en'] || node.name['ja']}`
    }));

    const { data, error } = await supabaseAdmin
        .from('stations_static')
        .upsert(rows, { onConflict: 'station_id' });

    if (error) {
        console.error('❌ Error seeding stations:', error);
        process.exit(1);
    } else {
        console.log(`✅ Successfully seeded ${rows.length} stations into stations_static.`);
    }
}

seed();
