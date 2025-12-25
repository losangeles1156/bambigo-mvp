import { supabaseAdmin } from '../../src/lib/supabase';
import { ScraperResult, StationFacility } from './types';
import crypto from 'crypto';

export class DataProcessor {

    // Normalize and Clean Data
    async process(results: ScraperResult[]) {
        for (const result of results) {
            console.log(`Processing data for ${result.stationName} (${result.operator})...`);

            // 1. Basic Validation / Normalization
            const validFacilities = result.facilities.filter(f => f.type && f.location);

            if (validFacilities.length === 0) {
                console.warn(`No valid facilities found for ${result.stationName}. Skipping save.`);
                continue;
            }

            // 2. Generate Hash for Change Detection
            const dataString = JSON.stringify(validFacilities);
            const hash = crypto.createHash('md5').update(dataString).digest('hex');

            // 3. Map to Station ID
            const stationId = this.mapToStationId(result.stationName, result.operator);

            if (!stationId) {
                console.error(`Could not map station ${result.stationName} to internal ID.`);
                continue;
            }

            // 4. Save to Supabase
            await this.saveSnapshot(stationId, result.operator, validFacilities, hash);
        }
    }

    private mapToStationId(name: string, operator: string): string | null {
        // Production Mapping
        const n = name.replace('駅', '').trim();

        // --- TAITO WARD ---
        // Ueno
        if (n.includes('上野') && !n.includes('広小路') && !n.includes('御徒町')) {
            if (operator === 'Metro') return 'odpt:Station:TokyoMetro.Ueno';
            if (operator === 'JR') return 'odpt:Station:JR-East.Ueno';
        }
        // Ueno-hirokoji / Ueno-okachimachi
        if (n.includes('上野広小路')) return 'odpt:Station:TokyoMetro.UenoHirokoji';
        if (n.includes('上野御徒町')) return 'odpt:Station:Toei.UenoOkachimachi';

        // Okachimachi
        if (n.includes('御徒町') && operator === 'JR' && !n.includes('上野')) return 'odpt:Station:JR-East.Okachimachi';
        if (n.includes('仲御徒町')) return 'odpt:Station:TokyoMetro.NakaOkachimachi';
        if (n.includes('新御徒町')) return 'odpt:Station:Toei.ShinOkachimachi';

        // Asakusa
        if (n.includes('浅草') && !n.includes('橋')) {
            if (operator === 'Toei') return 'odpt:Station:Toei.Asakusa';
            if (operator === 'Metro') return 'odpt:Station:TokyoMetro.Asakusa';
        }
        if (n.includes('浅草橋')) {
            if (operator === 'Toei') return 'odpt:Station:Toei.Asakusabashi';
            if (operator === 'JR') return 'odpt:Station:JR-East.Asakusabashi';
        }

        // Taito Others
        if (n.includes('稲荷町')) return 'odpt:Station:TokyoMetro.Inaricho';
        if (n.includes('田原町')) return 'odpt:Station:TokyoMetro.Tawaramachi';
        if (n.includes('蔵前')) return 'odpt:Station:Toei.Kuramae';
        if (n.includes('入谷')) return 'odpt:Station:TokyoMetro.Iriya';
        if (n.includes('三ノ輪')) return 'odpt:Station:TokyoMetro.Minowa';
        if (n.includes('鶯谷')) return 'odpt:Station:JR-East.Uguisudani';


        // --- CHIYODA WARD ---
        // Tokyo
        if (n === '東京' || n.includes('東京駅')) {
            if (operator === 'Metro') return 'odpt:Station:TokyoMetro.Tokyo'; // Marunouchi
            if (operator === 'JR') return 'odpt:Station:JR-East.Tokyo';
        }

        // Otemachi
        if (n.includes('大手町')) {
            if (operator === 'Metro') return 'odpt:Station:TokyoMetro.Otemachi';
            if (operator === 'Toei') return 'odpt:Station:Toei.Otemachi';
        }

        // Akihabara
        if (n.includes('秋葉原')) {
            if (operator === 'Metro') return 'odpt:Station:TokyoMetro.Akihabara'; // Hibiya
            if (operator === 'JR') return 'odpt:Station:JR-East.Akihabara';
            if (operator === 'Toei') return 'odpt:Station:Toei.Iwamotocho'; // Close enough/Fallback? No, let's keep strict.
        }

        // Hibiya / Yurakucho
        if (n.includes('日比谷')) {
            if (operator === 'Metro') return 'odpt:Station:TokyoMetro.Hibiya';
            if (operator === 'Toei') return 'odpt:Station:Toei.Hibiya';
        }
        if (n.includes('有楽町')) {
            if (operator === 'Metro') return 'odpt:Station:TokyoMetro.Yurakucho';
            if (operator === 'JR') return 'odpt:Station:JR-East.Yurakucho';
        }

        // Kanda
        if (n.includes('神田')) {
            if (operator === 'Metro') return 'odpt:Station:TokyoMetro.Kanda'; // Ginza
            if (operator === 'JR') return 'odpt:Station:JR-East.Kanda';
        }

        // --- CHUO WARD ---
        if (n.includes('銀座') && !n.includes('一丁目') && !n.includes('東')) return 'odpt:Station:TokyoMetro.Ginza';
        if (n.includes('東銀座')) {
            if (operator === 'Metro') return 'odpt:Station:TokyoMetro.HigashiGinza';
            if (operator === 'Toei') return 'odpt:Station:Toei.HigashiGinza';
        }
        if (n.includes('京橋')) return 'odpt:Station:TokyoMetro.Kyobashi';
        if (n.includes('日本橋')) {
            if (operator === 'Toei') return 'odpt:Station:Toei.Nihombashi';
            if (operator === 'Metro') return 'odpt:Station:TokyoMetro.Nihombashi';
        }
        if (n.includes('三越前')) return 'odpt:Station:TokyoMetro.Mitsukoshimae';
        if (n.includes('茅場町')) return 'odpt:Station:TokyoMetro.Kayabacho';
        if (n.includes('八丁堀')) {
            if (operator === 'JR') return 'odpt:Station:JR-East.Hatchobori';
            if (operator === 'Metro') return 'odpt:Station:TokyoMetro.Hatchobori';
        }
        if (n.includes('築地') && !n.includes('市場')) return 'odpt:Station:TokyoMetro.Tsukiji';
        if (n.includes('築地市場')) return 'odpt:Station:Toei.Tsukijishijo';
        if (n.includes('銀座一丁目')) return 'odpt:Station:TokyoMetro.GinzaItchome';

        // Others
        if (n.includes('二重橋前')) return 'odpt:Station:TokyoMetro.Nijubashimae';

        return null; // Mapping failed
    }

    private async saveSnapshot(stationId: string, operator: string, data: StationFacility[], hash: string) {
        try {
            // Check if latest snapshot is identical
            const { data: latest } = await supabaseAdmin
                .from('l3_snapshots')
                .select('hash')
                .eq('station_id', stationId)
                .eq('operator', operator)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (latest && latest.hash === hash) {
                console.log(`Data for ${stationId} is unchanged. Skipping insert.`);
                return;
            }

            // Insert new snapshot
            const { error } = await supabaseAdmin
                .from('l3_snapshots')
                .insert({
                    station_id: stationId,
                    operator: operator,
                    data: data,
                    hash: hash,
                    status: 'success'
                });

            if (error) throw error;
            console.log(`Saved snapshot for ${stationId}`);

        } catch (error) {
            console.error('Failed to save snapshot:', error);
        }
    }
}
