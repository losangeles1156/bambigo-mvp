import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load Env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');
const localConfig = fs.existsSync(envLocalPath) ? dotenv.parse(fs.readFileSync(envLocalPath)) : {};
const mainConfig = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath)) : {};

const env = { ...mainConfig, ...localConfig };
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY);

async function inspect() {
    // We search by name to find ALL line-specific nodes for these hubs
    const targetNames = ['銀座', '日本橋', '三越前', '茅場町', '八丁堀', '築地', '東銀座'];

    console.log('--- Inspecting Chuo Ward Station/Line Coverage (by Name Match) ---');

    console.log('Fetching all nodes with transit_lines...');
    const { data: nodes, error } = await supabase
        .from('nodes')
        .select('id, name, transit_lines')
        .not('transit_lines', 'is', null);

    if (error) {
        console.error('Error fetching nodes:', error);
        return;
    }

    const relevantNodes = nodes.filter(n => {
        const ja = (n.name as any)?.ja || '';
        const en = (n.name as any)?.en || '';
        return targetNames.some(t => ja.includes(t) || en.includes(t));
    });

    // Group by Station Name (JA)
    const grouped: Record<string, string[]> = {};

    relevantNodes.forEach(n => {
        const ja = (n.name as any)?.ja;
        // Skip some noise if needed (e.g. Ginza-itchome if we only want Ginza)
        // actually Ginza-itchome is Chuo ward too, so keep it.
        const lines = n.transit_lines || [];
        if (!grouped[ja]) grouped[ja] = [];
        grouped[ja].push(...lines);
    });

    Object.entries(grouped).forEach(([station, lines]) => {
        const uniqueLines = Array.from(new Set(lines)).sort();
        console.log(`\nSTATION: ${station}`);
        console.log(`  Lines: ${uniqueLines.join(', ')}`);
    });
}

inspect();
