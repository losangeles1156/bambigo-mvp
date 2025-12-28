import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBikeStatus() {
    console.log('🔍 Checking Bike Share Data Status...');

    const { data, count, error } = await supabase
        .from('l3_facilities')
        .select('id, station_id, attributes, created_at', { count: 'exact' })
        .eq('type', 'bikeshare');

    if (error) {
        console.error('❌ Error fetching bike data:', error.message);
        return;
    }

    console.log(`📊 Total Bike Share Stations Ingested: ${count}`);

    if (data && data.length > 0) {
        // Group by station to see coverage
        const stationCounts: Record<string, number> = {};
        let latestTime = data[0].created_at;

        data.forEach(item => {
            stationCounts[item.station_id] = (stationCounts[item.station_id] || 0) + 1;
            if (new Date(item.created_at) > new Date(latestTime)) {
                latestTime = item.created_at;
            }
        });

        const uniqueStations = Object.keys(stationCounts).length;
        console.log(`📍 Connected to ${uniqueStations} Metro/Toei Stations.`);
        console.log(`⏰ Last Update: ${latestTime}`);

        // Sample for provider check
        const providers = new Set();
        data.forEach(item => {
            if (item.attributes && (item.attributes as any).provider) {
                providers.add((item.attributes as any).provider);
            }
        });
        console.log(`🔌 Active Providers: ${Array.from(providers).join(', ')}`);
    } else {
        console.log('⚠️  No bike share data found yet. If the n8n workflow is running, it might take a few minutes to batch and POST.');
    }
}

checkBikeStatus();
