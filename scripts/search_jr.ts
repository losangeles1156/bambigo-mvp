
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function searchJRStations() {
    const { data, error } = await supabase
        .from('nodes')
        .select('id, name');

    if (error || !data) {
        console.error('Query Error:', error);
        return;
    }

    console.log('=== Searching for JR Station Names ===\n');

    // Search for known JR station names
    const jrNames = ['Tokyo', 'Ueno', 'Kanda', 'Akihabara', 'Okachimachi', 'Nippori', 'Shinagawa'];

    jrNames.forEach(name => {
        const matches = data.filter((n: any) => {
            const nameStr = JSON.stringify(n.name).toLowerCase();
            return nameStr.includes(name.toLowerCase());
        });

        console.log(`--- "${name}" ---`);
        if (matches.length === 0) {
            console.log('  NOT FOUND');
        } else {
            matches.forEach((m: any) => {
                console.log(`  ID: ${m.id}`);
                console.log(`  Name: ${JSON.stringify(m.name)}\n`);
            });
        }
    });

    // Also show all unique ID prefixes
    console.log('\n=== All Unique ID Prefixes ===');
    const prefixes = new Set<string>();
    data.forEach((n: any) => {
        const parts = n.id.split('.');
        if (parts.length >= 2) {
            prefixes.add(`${parts[0]}.${parts[1]}`);
        } else {
            prefixes.add(n.id.split(':')[0]);
        }
    });
    console.log([...prefixes].sort().join('\n'));
}

searchJRStations();
