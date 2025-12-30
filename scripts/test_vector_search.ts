
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// --- Configuration ---
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY!;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GOOGLE_API_KEY) {
    console.error('❌ Missing credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "embedding-001" });

async function main() {
    const query = process.argv[2] || "有復古咖啡廳且安靜的車站";
    console.log(`🔎 Searching for: "${query}"`);

    // 1. Generate Query Embedding
    const result = await model.embedContent(query);
    const embedding = result.embedding.values;

    // 2. Call Supabase RPC
    const { data, error } = await supabase.rpc('match_stations', {
        query_embedding: embedding,
        match_threshold: 0.5, // Adjust threshold as needed
        match_count: 5
    });

    if (error) {
        console.error('❌ Search failed:', error.message);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No matches found.');
        return;
    }

    // 3. Display Results
    console.log('\n=== Search Results ===');
    data.forEach((station: any, index: number) => {
        const name = station.name?.en || station.name?.ja || station.id;
        console.log(`${index + 1}. ${name} (Similarity: ${station.similarity.toFixed(4)})`);
        // console.log(`   Tags: ${JSON.stringify(station.tags)}`);
    });
}

main().catch(console.error);
