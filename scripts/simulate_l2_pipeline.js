
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper for simple GET request
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function simulate() {
    console.log('--- Simulating L2 Data Pipeline ---');

    // 1. Fetch Weather (Real)
    console.log('1. Fetching Weather...');
    const weatherData = await fetchJson('https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current=temperature_2m,relative_humidity_2m');
    const temp = weatherData.current.temperature_2m;
    console.log(`   Temp: ${temp}°C`);

    // 2. Fetch ODPT (Mocked due to missing key)
    console.log('2. Fetching ODPT Train Info (Mocked)...');
    const mockTrainInfo = {
        "odpt:trainInformationText": {
            "ja": "有人身事故影響，目前班次大幅延遲。",
            "en": "Delays due to passenger injury."
        }
    };
    console.log(`   Status: ${mockTrainInfo['odpt:trainInformationText'].ja}`);

    // 3. Logic Check
    console.log('3. Checking for Delays...');
    const isDelayed = !mockTrainInfo['odpt:trainInformationText'].ja.includes('平常運行');
    if (isDelayed) {
        console.log('   Create Alert: YES (Delay detected)');

        // 4. Mock Yahoo Scraper & Translation
        console.log('4. Scraping & Translating (Mocked)...');
        const troubleText = mockTrainInfo['odpt:trainInformationText'].ja;
        const translatedText = "Due to a passenger injury accident, there are significant delays in the current schedule."; // Mocked translation

        // 5. Update DB
        console.log('5. Updating Supabase l2_cache...');

        const payload = {
            key: 'transit:delay_report',
            value: {
                ja: troubleText,
                zh_tw: "因有人身事故影響，目前班次大幅延遲。", // Mocked
                en: translatedText,
                temp: temp,
                update_time: new Date().toISOString()
            },
            expires_at: new Date(Date.now() + 15 * 60000).toISOString() // 15 mins expiry
        };

        const { data, error } = await supabase
            .from('l2_cache')
            .upsert(payload)
            .select();

        if (error) {
            console.error('   Error updating DB:', error);
        } else {
            console.log('   ✅ Success! DB Updated:', JSON.stringify(data?.[0]?.value, null, 2));
        }

    } else {
        console.log('   Create Alert: NO (Normal Operation)');
    }
}

simulate();
