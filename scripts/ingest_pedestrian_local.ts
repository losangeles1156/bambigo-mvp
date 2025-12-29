import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

// Local ODPT datasets
const DATASETS = [
    {
        name: 'Toei Ueno-Okachimachi',
        station_id: 'odpt:Station:Toei.Oedo.UenoOkachimachi',
        source: 'odpt_oedo_ueno',
        link_path: 'nwd_oedo_ueno-okachimachi_geojson/link.geojson',
        node_path: 'nwd_oedo_ueno-okachimachi_geojson/node.geojson'
    },
    {
        name: 'Toei Daimon',
        station_id: 'odpt:Station:Toei.Oedo.Daimon',
        source: 'odpt_oedo_daimon',
        link_path: 'nwd_oedo_daimon_geojson/link.geojson',
        node_path: 'nwd_oedo_daimon_geojson/node.geojson'
    }
];

interface LinkFeature {
    type: string;
    geometry: { type: string; coordinates: number[][] };
    properties: {
        link_id: string;
        start_id: string;
        end_id: string;
        distance: number;
        rank?: string;
        rt_struct?: number;
        width?: number;
        vtcl_slope?: number;
        lev_diff?: number;
        brail_tile?: number;
        elevator?: number;
        roof?: number;
    };
}

interface NodeFeature {
    type: string;
    geometry: { type: string; coordinates: number[] };
    properties: {
        node_id: string;
        lat: number;
        lon: number;
        floor?: number;
        in_out?: number;
        link1_id?: string;
        link2_id?: string;
        link3_id?: string;
    };
}

async function ingestLinks(features: LinkFeature[], stationId: string, source: string) {
    const rows = features.map(f => ({
        link_id: f.properties.link_id,
        station_id: stationId,
        start_node_id: f.properties.start_id,
        end_node_id: f.properties.end_id,
        geometry: `LINESTRING(${f.geometry.coordinates.map(c => `${c[0]} ${c[1]}`).join(', ')})`,
        distance_meters: f.properties.distance,
        accessibility_rank: f.properties.rank || null,
        route_structure: f.properties.rt_struct || null,
        width_class: f.properties.width || null,
        vertical_slope: f.properties.vtcl_slope || null,
        level_difference: f.properties.lev_diff || null,
        has_braille_tiles: f.properties.brail_tile === 1,
        has_elevator_access: f.properties.elevator === 1,
        has_roof: f.properties.roof === 1,
        source_dataset: source,
        updated_at: new Date().toISOString()
    }));

    const { error } = await supabase.from('pedestrian_links').upsert(rows, { onConflict: 'link_id' });
    if (error) console.error('  Link upsert error:', error.message);
    else console.log(`  ✅ Ingested ${rows.length} links`);
}

async function ingestNodes(features: NodeFeature[], stationId: string, source: string) {
    const rows = features.map(f => {
        const links = [f.properties.link1_id, f.properties.link2_id, f.properties.link3_id].filter(Boolean);
        return {
            node_id: f.properties.node_id,
            station_id: stationId,
            coordinates: `POINT(${f.geometry.coordinates[0]} ${f.geometry.coordinates[1]})`,
            lat: f.properties.lat,
            lon: f.properties.lon,
            floor_level: f.properties.floor || 0,
            is_indoor: f.properties.in_out === 1,
            connected_links: links,
            source_dataset: source,
            updated_at: new Date().toISOString()
        };
    });

    const { error } = await supabase.from('pedestrian_nodes').upsert(rows, { onConflict: 'node_id' });
    if (error) console.error('  Node upsert error:', error.message);
    else console.log(`  ✅ Ingested ${rows.length} nodes`);
}

async function main() {
    console.log('=== ODPT Toei Local Data Ingestion ===\n');

    for (const ds of DATASETS) {
        console.log(`📍 Processing: ${ds.name}`);

        // Read Links
        const linkPath = path.resolve(process.cwd(), ds.link_path);
        if (fs.existsSync(linkPath)) {
            const linkData = JSON.parse(fs.readFileSync(linkPath, 'utf-8'));
            if (linkData?.features) {
                await ingestLinks(linkData.features, ds.station_id, ds.source);
            }
        } else {
            console.log(`  ⚠️ Link file not found: ${ds.link_path}`);
        }

        // Read Nodes
        const nodePath = path.resolve(process.cwd(), ds.node_path);
        if (fs.existsSync(nodePath)) {
            const nodeData = JSON.parse(fs.readFileSync(nodePath, 'utf-8'));
            if (nodeData?.features) {
                await ingestNodes(nodeData.features, ds.station_id, ds.source);
            }
        } else {
            console.log(`  ⚠️ Node file not found: ${ds.node_path}`);
        }
    }

    console.log('\n=== Ingestion Complete ===');

    // Verify totals
    const { count: linkCount } = await supabase.from('pedestrian_links').select('*', { count: 'exact', head: true });
    const { count: nodeCount } = await supabase.from('pedestrian_nodes').select('*', { count: 'exact', head: true });
    console.log(`Total Links: ${linkCount}, Total Nodes: ${nodeCount}`);
}

main().catch(console.error);
