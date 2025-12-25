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

async function check() {
    console.log('--- Checking Chiyoda Data in l3_snapshots ---');
    const idsToCheck = [
        'odpt:Station:TokyoMetro.Tokyo',
        'odpt:Station:JR-East.Tokyo',
        'odpt:Station:TokyoMetro.Otemachi',
        'odpt:Station:TokyoMetro.Akihabara',
        'odpt:Station:TokyoMetro.Hibiya'
    ];

    for (const id of idsToCheck) {
        const { data } = await supabase
            .from('l3_snapshots')
            .select('station_id, hash, updated_at, created_at')
            .eq('station_id', id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (data) {
            console.log(`[PASS] Found ${id} (Hash: ${data.hash?.substring(0, 6)})`);
        } else {
            console.log(`[FAIL] Missing ${id}`);
        }
    }
}

check();
