import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY || envConfig.SUPABASE_SERVICE_KEY);

async function inspect() {
    console.log('Fetching all snapshots...');
    const { data, error } = await supabase.from('transit_dynamic_snapshot').select('*');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${data.length} rows.`);

    // Check Ueno
    const ueno = data.find(r => r.station_id.includes('Ueno'));
    console.log('--- Ueno Data ---');
    console.log(JSON.stringify(ueno, null, 2));

    // Check Another (Asakusa)
    const asakusa = data.find(r => r.station_id.includes('Asakusa'));
    console.log('--- Asakusa Data ---');
    console.log(JSON.stringify(asakusa, null, 2));

    // Check Wind in all
    const withWind = data.filter(r => r.weather_info && r.weather_info.wind !== undefined);
    console.log(`Rows with wind data: ${withWind.length} / ${data.length}`);
}

inspect();
