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
        // Production Mapping for Taito Ward
        const n = name.replace('駅', '').trim();

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
        if (n.includes('浅草') && !n.includes('橋')) { // Avoid Asakusabashi
            if (operator === 'Toei') return 'odpt:Station:Toei.Asakusa';
            if (operator === 'Metro') return 'odpt:Station:TokyoMetro.Asakusa';
        }

        if (n.includes('浅草橋')) {
            if (operator === 'Toei') return 'odpt:Station:Toei.Asakusabashi';
            if (operator === 'JR') return 'odpt:Station:JR-East.Asakusabashi';
        }

        // Others
        if (n.includes('稲荷町')) return 'odpt:Station:TokyoMetro.Inaricho';
        if (n.includes('田原町')) return 'odpt:Station:TokyoMetro.Tawaramachi';
        if (n.includes('蔵前')) return 'odpt:Station:Toei.Kuramae';
        if (n.includes('入谷')) return 'odpt:Station:TokyoMetro.Iriya';
        if (n.includes('三ノ輪')) return 'odpt:Station:TokyoMetro.Minowa';
        if (n.includes('鶯谷')) return 'odpt:Station:JR-East.Uguisudani';

        // Fallback for previous manual tests
        if (n.includes('日本橋')) return 'odpt:Station:TokyoMetro.Nihombashi';

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
