import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { SEED_NODES } from '../src/lib/nodes/seedNodes';
import { Translator } from '../src/lib/utils/translator';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedMinato() {
    console.log('=== Seeding Minato Nodes ===');

    const targets = [
        'Shimbashi', 'Hamamatsucho', 'Roppongi', 'Hiroo', 'Tsukishima', 'Kachidoki', 'Akasaka'
    ];

    const toSeed = SEED_NODES.filter(node =>
        targets.some(t => node.name.en.includes(t))
    );

    console.log(`Found ${toSeed.length} nodes to seeds:`);
    toSeed.forEach(n => console.log(` - ${n.name.en} (${n.id})`));

    for (const rawNode of toSeed) {
        // Transform legacy data to v3.0 schema (Copied logic from seedNodes.ts)
        const node: any = {
            id: rawNode.id,
            city_id: rawNode.city_id,
            name: rawNode.name,
            node_type: rawNode.type,
            coordinates: rawNode.location,
            is_active: true,
            parent_hub_id: null,
            transit_lines: (rawNode as any).lines || [],
            updated_at: new Date().toISOString()
        };

        if ('vibe' in rawNode && rawNode.vibe) {
            const translated = Translator.vibe(rawNode.vibe);
            node.vibe_tags = {
                'zh-TW': [translated['zh-TW']],
                'ja': [translated.ja],
                'en': [translated.en]
            };
        }

        const { error } = await supabase
            .from('nodes')
            .upsert(node);

        if (error) {
            console.error(`Error seeding node ${node.id}:`, error);
        } else {
            console.log(`✅ Seeded ${node.id}`);
        }
    }
}

seedMinato();
