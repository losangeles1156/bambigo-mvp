import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || envConfig.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials in .env.local');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const stations = [
        'odpt:Station:TokyoMetro.Ueno',
        'odpt:Station:TokyoMetro.Asakusa',
        'odpt:Station:JR-East.Akihabara',
        'odpt:Station:JR-East.Tokyo',
        'odpt:Station:TokyoMetro.Ginza',
        'odpt:Station:Toei.Kuramae',
        'odpt:Station:Toei.ShinOkachimachi',
        'odpt:Station:Toei.Ningyocho',
        'odpt:Station:JR-East.Kanda',
        'odpt:Station:Toei.Nihombashi',
        'odpt:Station:TokyoMetro.Mitsukoshimae',
        'odpt:Station:Toei.HigashiGinza',
        'odpt:Station:TokyoMetro.Tawaramachi',
        'odpt:Station:TokyoMetro.Iriya',
        'odpt:Station:JR-East.Uguisudani',
        'odpt:Station:Toei.Asakusabashi',
        'odpt:Station:TokyoMetro.Kayabacho',
        'odpt:Station:TokyoMetro.Kasumigaseki',
        'odpt:Station:TokyoMetro.Iidabashi',
        'odpt:Station:TokyoMetro.Ochanomizu',
        'odpt:Station:TokyoMetro.Minowa',
        'odpt:Station:TokyoMetro.Kyobashi',
        'odpt:Station:TokyoMetro.Otemachi',
        'odpt:Station:JR-East.Okachimachi',
        'odpt:Station:Toei.HigashiNihombashi'
    ];

    async function run() {
        console.log('Fetching Tokyo Weather...');
        const weatherRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current=temperature_2m,weather_code,wind_speed_10m");
        const weatherData = await weatherRes.json();
        const w = weatherData.current;

        console.log(`Weather: ${w.temperature_2m}°C, Wind: ${w.wind_speed_10m} km/h (Meteo unit)`);

        const updates = stations.map(id => ({
            station_id: id,
            status_code: 'NORMAL',
            reason_ja: null,
            weather_info: {
                temp: w.temperature_2m,
                condition: w.weather_code <= 3 ? 'Clear' : (w.weather_code <= 60 ? 'Cloudy' : 'Rain'),
                wind: w.wind_speed_10m,
                update_time: new Date().toISOString()
            },
            updated_at: new Date().toISOString()
        }));

        console.log(`Cleaning old data for ${stations.length} stations...`);
        await supabase.from('transit_dynamic_snapshot').delete().in('station_id', stations);

        console.log(`Inserting ${updates.length} stations...`);
        const { error } = await supabase.from('transit_dynamic_snapshot').insert(updates);

        if (error) {
            console.error('Supabase Error:', error);
        } else {
            console.log('✅ Bulk Update Success! Check the map.');
        }
    }

    run();
} catch (e) {
    console.error('Script Error:', e);
}
