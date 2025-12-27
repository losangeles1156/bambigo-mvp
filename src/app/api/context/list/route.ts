import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('[API] Fetching all active nodes for L1 Workflow context...');

        // Initialize Supabase with Service Role Key to ensure we can read all nodes if RLS blocks listing
        // Or standard client if public. Using Service Key is safer for backend processes.
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
            .from('nodes')
            .select('*');

        if (error) {
            console.error('[API] Supabase Error:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            console.warn('[API] No nodes found in DB.');
            return NextResponse.json({ count: 0, nodes: [] });
        }

        // Transform results
        const nodes = data.map((n: any) => {
            let lat = 35.6812; // Default Tokyo
            let lng = 139.7671;

            // Parse coordinates column (GeoJSON-like structure from Supabase/PostGIS)
            // { type: 'Point', coordinates: [lon, lat] }
            if (n.coordinates && Array.isArray(n.coordinates.coordinates)) {
                lng = n.coordinates.coordinates[0];
                lat = n.coordinates.coordinates[1];
            } else if (typeof n.coordinates === 'string' && n.coordinates.startsWith('POINT')) {
                // Handling older WKT format if present
                const match = n.coordinates.match(/POINT\(([-0-9\.]+) ([-0-9\.]+)\)/);
                if (match) {
                    lng = parseFloat(match[1]);
                    lat = parseFloat(match[2]);
                }
            }

            return {
                id: n.id,
                name: n.name.en ? n.name : { ja: n.name }, // Handle if name is already object or string
                location: { lat, lng }
            };
        });

        console.log(`[API] Returning ${nodes.length} stations.`);

        return NextResponse.json({
            count: nodes.length,
            nodes
        });

    } catch (error: any) {
        console.error('List Context API Error:', error);
        return NextResponse.json({
            count: 0,
            nodes: [],
            error: error.message
        }, { status: 500 });
    }
}
