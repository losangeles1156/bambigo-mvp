
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// V24 Filter Logic (copy from workflow)
const TARGET_OPERATORS = ['JR-East', 'TokyoMetro', 'Toei', 'Keisei', 'TsukubaExpress', 'jr'];

async function simulateV24Filter() {
    // Direct table query (simpler, works without RPC)
    const { data, error } = await supabase
        .from('nodes')
        .select('id, name');

    if (error || !data) {
        console.error('Query Error:', error);
        return;
    }

    console.log(`Database Contains: ${data.length} nodes`);

    // Group by operator pattern
    const matched: string[] = [];
    const unmatched: string[] = [];
    const operatorCounts: Record<string, number> = {};

    data.forEach((node: any) => {
        const id = node.id.toLowerCase();

        // Extract operator from ID
        // Pattern: "odpt.Station:TokyoMetro.Hibiya.Ueno" or "tokyo.jr.ueno"
        let operator = 'unknown';
        if (id.includes('tokyometro')) operator = 'tokyometro';
        else if (id.includes('toei.')) operator = 'toei';
        else if (id.includes('tsukuba')) operator = 'tsukuba';
        else if (id.includes('keisei')) operator = 'keisei';
        else if (id.includes('.jr.') || id.includes('jr-east')) operator = 'jr';
        else {
            // Fallback: extract from ID structure
            const parts = id.split(':');
            if (parts.length > 1) {
                const subParts = parts[1].split('.');
                operator = subParts[0] || 'unknown';
            }
        }

        operatorCounts[operator] = (operatorCounts[operator] || 0) + 1;

        const isMatch = TARGET_OPERATORS.some(op => id.includes(op.toLowerCase()));
        if (isMatch) {
            matched.push(node.id);
        } else {
            unmatched.push(node.id);
        }
    });

    console.log('\n=== Operator Distribution ===');
    console.table(operatorCounts);

    console.log(`\n=== V24 Filter Result ===`);
    console.log(`Matched: ${matched.length}`);
    console.log(`Unmatched: ${unmatched.length}`);

    if (unmatched.length > 0) {
        console.log('\n--- Unmatched Samples (first 15) ---');
        unmatched.slice(0, 15).forEach(id => console.log(`  - ${id}`));
    }

    if (matched.length > 0) {
        console.log('\n--- Matched Samples (first 15) ---');
        matched.slice(0, 15).forEach(id => console.log(`  + ${id}`));
    }

    // Total tasks that would be generated
    const CATEGORIES = 10;
    console.log(`\n=== Total Tasks V24 Would Generate ===`);
    console.log(`${matched.length} stations x ${CATEGORIES} categories = ${matched.length * CATEGORIES} tasks`);
    console.log(`Estimated Time (10s each): ${Math.round(matched.length * CATEGORIES * 10 / 60)} minutes`);
}

simulateV24Filter();
