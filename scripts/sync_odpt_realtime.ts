import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const TOKEN_STANDARD = process.env.ODPT_API_TOKEN_STANDARD || process.env.ODPT_API_TOKEN!;
const TOKEN_CHALLENGE = process.env.ODPT_API_TOKEN_CHALLENGE || process.env.ODPT_API_TOKEN_BACKUP!;

const ENDPOINTS = {
    PROD: 'https://api.odpt.org/api/v4',
    PUB: 'https://api-public.odpt.org/api/v4',
    CHALLENGE: 'https://api-challenge.odpt.org/api/v4'
};

async function fetchOdpt(type: string, operator: string) {
    let baseUrl = ENDPOINTS.PROD;
    let token: string | undefined = TOKEN_STANDARD;

    if (operator.includes('Toei')) {
        baseUrl = ENDPOINTS.PUB;
        token = undefined;
    } else if (operator.includes('JR-East') || operator.includes('Tobu') || operator.includes('Keikyu') || operator.includes('Tokyu')) {
        baseUrl = ENDPOINTS.CHALLENGE;
        token = TOKEN_CHALLENGE;
    }

    const params = new URLSearchParams({ 'odpt:operator': operator });
    if (token) params.append('acl:consumerKey', token);

    const url = `${baseUrl}/${type}?${params.toString()}`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return await res.json();
    } catch (e: any) {
        console.error(`[Fetch Error] ${operator} (${type}): ${e.message}`);
        return [];
    }
}

async function syncAlerts() {
    console.log('🔄 Syncing Transit Alerts...');
    const operators = [
        'odpt.Operator:JR-East',
        'odpt.Operator:Toei',
        'odpt.Operator:TokyoMetro',
        'odpt.Operator:Tobu',
        'odpt.Operator:Keikyu',
        'odpt.Operator:Tokyu',
        'odpt.Operator:TWR'
    ];

    const allAlerts = [];

    for (const operator of operators) {
        process.stdout.write(`   Fetching ${operator}... `);
        const alerts = await fetchOdpt('odpt:TrainInformation', operator);
        console.log(`(${alerts.length})`);

        for (const a of alerts) {
            allAlerts.push({
                id: a['owl:sameAs'],
                operator: a['odpt:operator'],
                railway: a['odpt:railway'],
                status: a['odpt:trainInformationStatus']?.ja || a['odpt:trainInformationStatus'] || 'Unknown',
                text_ja: a['odpt:trainInformationText']?.ja || '',
                text_en: a['odpt:trainInformationText']?.en || '',
                occurred_at: a['dc:date'],
                updated_at: new Date().toISOString()
            });
        }
    }

    if (allAlerts.length > 0) {
        const { error } = await supabase.from('transit_alerts').upsert(allAlerts, { onConflict: 'id' });
        if (error) console.error(`❌ Upsert Error: ${error.message}`);
        else console.log(`✅ Successfully synced ${allAlerts.length} alerts.`);
    } else {
        console.log('ℹ️ No active alerts found.');
    }
}

syncAlerts().catch(console.error);
