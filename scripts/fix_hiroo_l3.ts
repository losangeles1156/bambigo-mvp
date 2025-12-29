
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { Mistral } from '@mistralai/mistralai';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);
const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

async function fixHiroo() {
    console.log('Fixing Hiroo L3...');
    const url = 'https://www.tokyometro.jp/station/hiro-o/accessibility/index.html';
    const res = await fetch(url);
    if (!res.ok) { console.error('Still 404'); return; }
    const text = await res.text();

    // Extract
    const prompt = `Extract facilities from Tokyo Metro Hiro-o page. JSON array of items {type, name_ja, name_en, location_desc, attributes}. Text: ${text.slice(0, 10000)}`;

    const llm = await mistral.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: prompt }],
        responseFormat: { type: 'json_object' }
    });

    const content = (llm.choices[0].message.content as string).replace(/```json|```/g, '');
    const data = JSON.parse(content);
    const facilities = data.facilities || data.items || [];

    console.log(`Found ${facilities.length} items`);

    if (facilities.length > 0) {
        const rows = facilities.map((f: any) => ({
            station_id: 'odpt:Station:TokyoMetro.Hiroo',
            type: f.type,
            name_i18n: { ja: f.name_ja, en: f.name_en },
            attributes: { ...f.attributes, location_description: f.location_desc },
            updated_at: new Date().toISOString()
        }));
        await supabase.from('l3_facilities').upsert(rows);
        console.log('✅ Hiroo Saved');
    }
}
fixHiroo();
