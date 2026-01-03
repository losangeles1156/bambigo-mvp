
import { STATION_WISDOM, KNOWLEDGE_BASE } from '@/data/stationWisdom';
import { supabaseAdmin } from '@/lib/supabase';
import { WeatherTool, TrainStatusTool } from './tools/standardTools';

// Mistral Tool Schema Types
export interface MistralToolSchema {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: {
            type: 'object';
            properties: Record<string, any>;
            required?: string[];
        };
    };
}

export const AGENT_TOOLS: MistralToolSchema[] = [
    {
        type: 'function',
        function: {
            name: 'get_train_status',
            description: 'Get real-time train operation status, delays, congestion, and crowd levels for lines.',
            parameters: {
                type: 'object',
                properties: {
                    stationId: { type: 'string', description: 'The ID of the station (e.g., odpt.Station:TokyoMetro.Ginza.Ueno)' }
                },
                required: ['stationId']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_weather',
            description: 'Get current weather and temperature at a specific station.',
            parameters: {
                type: 'object',
                properties: {
                    stationId: { type: 'string', description: 'The ID of the station' }
                },
                required: ['stationId']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'retrieve_station_knowledge',
            description: 'Search expert wisdom for specific topics: "wheelchair access", "best entrance/exit", "navigation tips", "local tricks".',
            parameters: {
                type: 'object',
                properties: {
                    stationId: { type: 'string', description: 'The ID of the station' },
                    query: { type: 'string', description: 'Specific keywords: "accessibility", "wheelchair", "luggage", "exit", "transfer"' }
                },
                required: ['stationId']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_station_facilities',
            description: 'List confirmed facilities. Use this for "lockers", "toilets", "elevators", "baby rooms".',
            parameters: {
                type: 'object',
                properties: {
                    stationId: { type: 'string', description: 'The ID of the station' },
                    category: { type: 'string', description: 'Optional filter: "locker", "elevator", "toilet"' }
                },
                required: ['stationId']
            }
        }
    }
];

/**
 * Execution Handlers for the tools
 */
export const TOOL_HANDLERS = {
    get_train_status: async (params: { stationId: string }, context: any) => {
        const tool = new TrainStatusTool();
        return await tool.execute({}, { ...context, nodeId: params.stationId });
    },
    get_weather: async (params: { stationId: string }, context: any) => {
        const tool = new WeatherTool();
        return await tool.execute({}, { ...context, nodeId: params.stationId });
    },
    retrieve_station_knowledge: async (params: { stationId: string, query?: string }, context: any) => {
        let summary = '';
        const wisdom = (STATION_WISDOM as any)[params.stationId];
        if (wisdom) {
            if (wisdom.traps) {
                wisdom.traps.forEach((t: any) => {
                    summary += `[WARNING] ${t.content} Advice: ${t.advice}\n`;
                });
            }
            if (wisdom.hacks) {
                wisdom.hacks.forEach((h: any) => {
                    const text = typeof h === 'string' ? h : `${h.title}: ${h.content}`;
                    summary += `[LOCAL TRICK] ${text}\n`;
                });
            }
        }

        // Filter Knowledge Base
        const relevantKnowledge = KNOWLEDGE_BASE.filter(rule => {
            const stationMatch = !rule.trigger.station_ids || rule.trigger.station_ids.includes(params.stationId);
            if (!stationMatch) return false;

            if (params.query && rule.trigger.keywords) {
                const q = params.query.toLowerCase();
                return rule.trigger.keywords.some(k => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q));
            }
            return true;
        });

        relevantKnowledge.forEach(k => {
            summary += `- ${k.title['en'] || k.title['zh-TW']}: ${k.content['en'] || k.content['zh-TW']}\n`;
        });

        return summary || 'No specific knowledge found for this query.';
    },
    get_station_facilities: async (params: { stationId: string }, context: any) => {
        const { data: facilities } = await supabaseAdmin
            .from('l3_facilities')
            .select('*')
            .eq('station_id', params.stationId);

        if (!facilities || facilities.length === 0) return 'No facility data available for this station.';

        return facilities.map((f: any) => `- ${f.type}: ${f.location_coords?.['en'] || f.location_coords?.['zh-TW'] || 'Unknown location'}`).join('\n');
    }
};
