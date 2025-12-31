
import { ITool, IToolContext } from './types';
import { AgentLevel } from '../core/types';
import { supabase } from '@/lib/supabase';

// L2 Tool: Fare Calculator
export class FareTool implements ITool {
    id = 'fare_calculator';
    name = 'Fare Calculator';
    description = 'Calculates fare between two stations';
    requiredLevel = AgentLevel.L2_LIVE;

    async execute(params: { from: string; to: string }, context: IToolContext): Promise<any> {
        // Reuse the logic we built in the API route, or call DB directly
        const { data, error } = await supabase
            .from('fares')
            .select('*')
            .eq('from_station_id', params.from)
            .eq('to_station_id', params.to)
            .single();

        if (error || !data) return { error: 'Fare not found' };
        
        return {
            ticket: data.ticket_fare,
            ic: data.ic_card_fare
        };
    }
}

// L3 Tool: Facility Search
export class FacilityTool implements ITool {
    id = 'facility_search';
    name = 'Facility Search';
    description = 'Finds specific facilities (lockers, toilets) in a station';
    requiredLevel = AgentLevel.L3_FACILITY;

    async execute(params: { category: string }, context: IToolContext): Promise<any> {
        // Mock implementation for now, replacing with real DB call later
        // In real implementation, we would query `l3_facilities` table
        return {
            station: context.nodeId,
            found: true,
            details: { type: params.category, location: 'Near North Exit' }
        };
    }
}
