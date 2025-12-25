import { fetchNodeConfig } from '../src/lib/api/nodes';

// Mock Supabase env vars (won't actually hit DB if we rely on static fallback, but good to have)
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.com';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'dummy';

async function testTokyoData() {
    console.log('--- Testing JR-East.Tokyo ---');
    const resultJR = await fetchNodeConfig('odpt:Station:JR-East.Tokyo');
    console.log('L3 Facilities count (JR):', resultJR.profile?.l3_facilities?.length || 0);

    console.log('\n--- Testing TokyoMetro.Tokyo ---');
    const resultMetro = await fetchNodeConfig('odpt:Station:TokyoMetro.Tokyo');
    console.log('L3 Facilities count (Metro):', resultMetro.profile?.l3_facilities?.length || 0);
}

testTokyoData();
