import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { STATION_WISDOM } from '@/data/stationWisdom';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const stationId = searchParams.get('stationId'); // e.g., 'odpt:Station:TokyoMetro.Ueno'

    if (!stationId) {
        return NextResponse.json({ error: 'Missing stationId' }, { status: 400 });
    }

    try {
        // 1. Get Static Wisdom (High Value Context)
        const wisdom = STATION_WISDOM[stationId] || null;

        // 2. Get Dynamic Node Data (Basic Info & Accessibility)
        const { data: nodeData, error } = await supabase
            .from('nodes')
            .select('name, type, vibe, accessibility, metadata')
            .eq('id', stationId)
            .single();

        if (error && error.code !== 'PGRST116') { // Ignore "Row not found" (PGRST116)
            console.warn('Supabase Error fetching node:', error.message);
        }

        // 3. Construct Context Object
        // This object is shaped to be easily consumable by an LLM
        const contextResponse = {
            stationId,
            name: nodeData?.name?.en || stationId,
            vibe: nodeData?.vibe || 'unknown',
            accessibility: nodeData?.accessibility || 'unknown',

            // Wisdom is the key "Secret Sauce" for our agent
            wisdom: wisdom ? {
                traps: wisdom.traps.map(t => ({ title: t.title, advice: t.advice, severity: t.severity })), // Simplify for token usage
                hacks: wisdom.hacks
            } : {
                message: "No specific local secrets found for this station."
            },

            // Optional: Include raw metadata if useful
            features: nodeData?.metadata?.features || []
        };

        return NextResponse.json(contextResponse);

    } catch (error) {
        console.error('Context API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
