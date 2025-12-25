
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyIntegration() {
    console.log('--- Verifying n8n Integration Capability ---');

    // 1. Simulate n8n Payload (As configured in the new JSON)
    // The new workflow sends 'ja' text, but 'zh_tw' is null.
    const mockN8nPayload = {
        key: 'transit:delay_report',
        value: {
            ja: "【模擬 n8n】人身事故による遅延が発生しています。", // Simulated Japanese Alert
            zh_tw: null, // n8n no longer translates
            temp: 12.5,
            update_time: new Date().toISOString()
        },
        expires_at: new Date(Date.now() + 15 * 60000).toISOString() // 15 mins expiry
    };

    console.log('1. Sending Simulated n8n Payload to Supabase...');
    const { error: upsertError } = await supabase
        .from('l2_cache')
        .upsert(mockN8nPayload);

    if (upsertError) {
        console.error('   ❌ Write Failed:', upsertError.message);
        return;
    }
    console.log('   ✅ Write Success');

    // 2. Simulate Frontend Fetch (API Capability Check)
    console.log('2. Verifying Data Retrieval...');
    const { data, error: fetchError } = await supabase
        .from('l2_cache')
        .select('value')
        .eq('key', 'transit:delay_report')
        .single();

    if (fetchError) {
        console.error('   ❌ Read Failed:', fetchError.message);
        return;
    }

    // 3. Verify Content and Fallback Logic
    const storedValue = data.value;
    console.log('   ✅ Read Success. Stored Value:', JSON.stringify(storedValue, null, 2));

    console.log('3. Validating Frontend Display Logic...');
    // Frontend logic: {l2Status.zh_tw || l2Status.ja}
    const displayMessage = storedValue.zh_tw || storedValue.ja;

    if (displayMessage === mockN8nPayload.value.ja) {
        console.log(`   ✅ Fallback Logic Working. Display Text: "${displayMessage}" (Japanese)`);
    } else {
        console.error(`   ❌ Fallback Logic Failed. Expected: "${mockN8nPayload.value.ja}", Got: "${displayMessage}"`);
    }
}

verifyIntegration();
