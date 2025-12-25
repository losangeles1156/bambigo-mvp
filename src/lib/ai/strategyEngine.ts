import { supabaseAdmin } from '../supabase';
import { Translator } from '../utils/translator';

import { STATION_WISDOM, StationWisdomData } from '@/data/stationWisdom';

export interface CommercialRule {
    id: string;
    trigger: {
        condition: 'delay' | 'crowd' | 'weather';
        threshold: number;
    };
    action: {
        type: 'taxi' | 'dining' | 'locker' | 'message';
        provider?: string;
        label: string;
        url?: string;
        priority: number;
    };
}

export interface StrategyContext {
    nodeId: string;
    nodeName: string;
    personaPrompt?: string;
    l2Status: any;
    commercialActions: any[];
    wisdomSummary?: string;
    wisdom?: StationWisdomData;
}

/**
 * BambiGO v3.0 Strategy Engine (L4)
 * Orchestrates L1 (DNA), L2 (Live), and Commercial Reality
 */
export const StrategyEngine = {
    /**
     * Synthesizes a strategy context for a given location
     */
    async getSynthesis(lat: number, lon: number, locale: string = 'zh-TW'): Promise<StrategyContext | null> {
        // 1. Find nearest Hub node (v3.0 priority)
        const { data: nodes, error: nodeError } = await supabaseAdmin
            .rpc('nearby_nodes', {
                center_lat: lat,
                center_lon: lon,
                radius_meters: 500 // Hub proximity range
            });

        if (nodeError || !nodes || nodes.length === 0) return null;

        const nearestNode = nodes[0];

        // 2. Fetch L2 Status (In a real app, this would check Redis/L2_Cache)
        // For MVP, we'll try to get it from the l2_cache table or fallback
        const { data: l2Cache } = await supabaseAdmin
            .from('l2_cache')
            .select('*')
            .eq('key', `l2:${nearestNode.id}`)
            .maybeSingle();

        const l2Status = l2Cache?.value || { delay: 0, congestion: 1 };

        // 3. Process Commercial Rules
        const commercialActions: any[] = [];
        const rules: CommercialRule[] = nearestNode.commercial_rules || [];

        for (const rule of rules) {
            let triggered = false;

            if (rule.trigger.condition === 'delay' && l2Status.delay >= rule.trigger.threshold) {
                triggered = true;
            }
            // More triggers (crowd, weather) can be added here

            if (triggered) {
                commercialActions.push({
                    type: rule.action.type,
                    label: rule.action.label,
                    provider: rule.action.provider,
                    url: rule.action.url,
                    priority: rule.action.priority
                });
            }
        }

        // 4. Fetch Expert Wisdom (L4)
        const wisdom = STATION_WISDOM[nearestNode.id];
        let wisdomSummary = '';

        if (wisdom) {
            const criticalTrap = wisdom.traps?.find(t => t.severity === 'critical');
            const highTrap = wisdom.traps?.find(t => t.severity === 'high');
            const hack = wisdom.hacks?.[0];

            if (criticalTrap) wisdomSummary += `[CRITICAL WARNING] ${criticalTrap.content} Advice: ${criticalTrap.advice}\n`;
            if (highTrap) wisdomSummary += `[WARNING] ${highTrap.content}\n`;
            if (hack) wisdomSummary += `[LOCAL TRICK] ${hack}\n`;
        }

        return {
            nodeId: nearestNode.id,
            nodeName: nearestNode.name[locale] || nearestNode.name['zh-TW'],
            personaPrompt: nearestNode.persona_prompt,
            l2Status,
            commercialActions: commercialActions.sort((a, b) => b.priority - a.priority),
            wisdomSummary,
            wisdom
        };
    }
};
