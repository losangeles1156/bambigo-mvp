import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import AdmZip from 'adm-zip';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

// Dataset configuration - ODPT Hokonavi ZIP URLs
const DATASETS = [
    {
        name: 'Toei Oedo Line Yoyogi Station',
        station_id: 'odpt:Station:Toei.Oedo.Yoyogi',
        source: 'odpt_hokonavi_yoyogi',
        zip_url: 'https://api-public.odpt.org/api/v4/files/hokonavi/data/nwd_oedo_yoyogi_geojson.zip'
    },
    {
        name: 'Toei Oedo Line Roppongi Station',
        station_id: 'odpt:Station:Toei.Oedo.Roppongi',
        source: 'odpt_hokonavi_roppongi',
        zip_url: 'https://api-public.odpt.org/api/v4/files/hokonavi/data/nwd_oedo_roppongi_geojson.zip'
    },
    {
        name: 'Toei Oedo Line Higashi-shinjuku Station',
        station_id: 'odpt:Station:Toei.Oedo.HigashiShinjuku',
        source: 'odpt_hokonavi_higashi_shinjuku',
        zip_url: 'https://api-public.odpt.org/api/v4/files/hokonavi/data/nwd_oedo_higashi-shinjuku_geojson.zip'
    },
    {
        name: 'Toei Oedo Line Azabu-juban Station',
        station_id: 'odpt:Station:Toei.Oedo.AzabuJuban',
        source: 'odpt_hokonavi_azabu_juban',
        zip_url: 'https://api-public.odpt.org/api/v4/files/hokonavi/data/nwd_oedo_azabu-juban_geojson.zip'
    },
    {
        name: 'Toei Oedo Line Aoyama-itchome Station',
        station_id: 'odpt:Station:Toei.Oedo.AoyamaItchome',
        source: 'odpt_hokonavi_aoyama_itchome',
        zip_url: 'https://api-public.odpt.org/api/v4/files/hokonavi/data/nwd_oedo_aoyama-itchome_geojson.zip'
    },
    {
        name: 'Toei Oedo Line Akabanebashi Station',
        station_id: 'odpt:Station:Toei.Oedo.Akabanebashi',
        source: 'odpt_hokonavi_akabanebashi',
        zip_url: 'https://api-public.odpt.org/api/v4/files/hokonavi/data/nwd_oedo_akabanebashi_geojson.zip'
    },
    {
        name: 'Toei Oedo Line Kokuritsu-kyogijo Station',
        station_id: 'odpt:Station:Toei.Oedo.KokuritsuKyogijo',
        source: 'odpt_hokonavi_kokuritsu_kyogijo',
        zip_url: 'https://api-public.odpt.org/api/v4/files/hokonavi/data/nwd_oedo_kokuritsu-kyogijo_geojson.zip'
    },
    {
        name: 'Toei Oedo Line Tochomae Station',
        station_id: 'odpt:Station:Toei.Oedo.Tochomae',
        source: 'odpt_hokonavi_tochomae',
        zip_url: 'https://api-public.odpt.org/api/v4/files/hokonavi/data/nwd_oedo_tochomae_geojson.zip'
    },
    {
        name: 'Toei Oedo Line Shinjuku-nishiguchi Station',
        station_id: 'odpt:Station:Toei.Oedo.ShinjukuNishiguchi',
        source: 'odpt_hokonavi_shinjuku_nishiguchi',
        zip_url: 'https://api-public.odpt.org/api/v4/files/hokonavi/data/nwd_oedo_shinjuku-nishiguchi_geojson.zip'
    },
    {
        name: 'Toei Oedo Line Shinjuku Station',
        station_id: 'odpt:Station:Toei.Oedo.Shinjuku',
        source: 'odpt_hokonavi_shinjuku',
        zip_url: 'https://api-public.odpt.org/api/v4/files/hokonavi/data/nwd_oedo_shinjuku_geojson.zip'
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

async function downloadAndExtractZip(url: string): Promise<{ links: LinkFeature[], nodes: NodeFeature[] } | null> {
    console.log(`  Downloading and extracting ZIP from ${url.substring(0, 60)}...`);
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const buffer = await res.arrayBuffer();
        const zip = new AdmZip(Buffer.from(buffer));
        const zipEntries = zip.getEntries();
        
        let linkData: any = null;
        let nodeData: any = null;

        for (const entry of zipEntries) {
            if (entry.entryName.toLowerCase().includes('link.geojson')) {
                linkData = JSON.parse(entry.getData().toString('utf8'));
            } else if (entry.entryName.toLowerCase().includes('node.geojson')) {
                nodeData = JSON.parse(entry.getData().toString('utf8'));
            }
        }

        return {
            links: linkData?.features || [],
            nodes: nodeData?.features || []
        };
    } catch (e) {
        console.error(`  ❌ Zip processing failed: ${(e as Error).message}`);
        return null;
    }
}

async function ingestLinks(features: LinkFeature[], stationId: string, source: string) {
    if (features.length === 0) return;
    
    // Chunk processing for large datasets
    const CHUNK_SIZE = 500;
    for (let i = 0; i < features.length; i += CHUNK_SIZE) {
        const chunk = features.slice(i, i + CHUNK_SIZE);
        const rows = chunk.map(f => ({
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
        if (error) {
            console.error(`  Link upsert error (chunk ${i}):`, error.message);
        }
    }
    console.log(`  ✅ Ingested ${features.length} links`);
}

async function ingestNodes(features: NodeFeature[], stationId: string, source: string) {
    if (features.length === 0) return;

    const CHUNK_SIZE = 500;
    for (let i = 0; i < features.length; i += CHUNK_SIZE) {
        const chunk = features.slice(i, i + CHUNK_SIZE);
        const rows = chunk.map(f => {
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
        if (error) {
            console.error(`  Node upsert error (chunk ${i}):`, error.message);
        }
    }
    console.log(`  ✅ Ingested ${features.length} nodes`);
}

async function main() {
    console.log('=== ODPT Pedestrian Network Data Ingestion ===\n');

    for (const ds of DATASETS) {
        console.log(`\n📍 Processing: ${ds.name}`);

        const data = await downloadAndExtractZip(ds.zip_url);
        if (data) {
            await ingestLinks(data.links, ds.station_id, ds.source);
            await ingestNodes(data.nodes, ds.station_id, ds.source);
        }

        // Rate limit
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log('\n=== Ingestion Complete ===');

    // Verify counts
    const { count: linkCount } = await supabase.from('pedestrian_links').select('*', { count: 'exact', head: true });
    const { count: nodeCount } = await supabase.from('pedestrian_nodes').select('*', { count: 'exact', head: true });
    console.log(`Total Links in DB: ${linkCount}, Total Nodes in DB: ${nodeCount}`);
}

main().catch(console.error);
