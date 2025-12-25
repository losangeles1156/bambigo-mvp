import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY || envConfig.SUPABASE_SERVICE_KEY);

async function inspect() {
    console.log('Fetching nodes IDs...');
    // Limit to 50
    const { data: nodes, error } = await supabase.from('nodes').select('id, name').limit(50);

    if (error) {
        console.error(error);
        return;
    }

    console.log('--- Nodes Table IDs ---');
    nodes.forEach(n => {
        // Handle name if json
        const name = typeof n.name === 'string' ? n.name : (n.name?.en || JSON.stringify(n.name));
        console.log(`${n.id} : ${name}`);
    });

    console.log('\n--- Checking for Ueno match ---');
    const ueno = nodes.find(n => n.id === 'odpt:Station:TokyoMetro.Ueno');
    if (ueno) console.log('✅ Found Exact Match for Ueno ID');
    else console.log('❌ Ueno ID NOT found exactly as odpt:Station:TokyoMetro.Ueno');
}

inspect();
