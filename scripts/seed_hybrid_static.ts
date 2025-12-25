
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedHybridStatic() {
    console.log('--- Seeding Hybrid Static Layer ---');

    // 1. Fetch existing nodes to migrate
    const { data: nodes, error: fetchError } = await supabase
        .from('nodes')
        .select('*');

    if (fetchError || !nodes) {
        console.error('Error fetching nodes:', fetchError);
        return;
    }

    console.log(`Found ${nodes.length} nodes to migrate.`);

    const staticEntries = nodes.map((node: any) => {
        // Transform Node data to StationStatic format
        // l1_identity_tag comes from vibe_tags or facility_profile (simplification for MVP)
        const mainVibe = node.vibe_tags?.['en']?.[0] || 'Generic';

        return {
            station_id: node.id,
            l1_identity_tag: {
                main: mainVibe,
                sub: node.node_type,
                child: 'Station'
            },
            l1_ai_personality_summary: node.persona_prompt || `A helpful station assistant for ${node.name?.en || node.id}.`,
            l3_services: {
                // Placeholder - normally would come from aggregating facilities table
                info: "Standard station facilities available."
            },
            updated_at: new Date().toISOString()
        };
    });

    // 2. Upsert into stations_static
    if (staticEntries.length > 0) {
        const { error: insertError } = await supabase
            .from('stations_static')
            .upsert(staticEntries);

        if (insertError) {
            console.error('Error seeding stations_static:', insertError);
        } else {
            console.log(`✅ Successfully seeded ${staticEntries.length} entries into stations_static.`);
        }
    } else {
        console.log('No nodes to seed.');
    }
}

seedHybridStatic();
