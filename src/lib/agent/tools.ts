/**
 * Agent Tools Layer
 * 
 * Provides structured tool definitions for the Bambi Agent.
 * Each tool has a description, input schema, and execute function.
 * 
 * Tools are designed for tag/node-based retrieval, not full-text search.
 */

import { supabaseAdmin } from '@/lib/supabase';
import { TagEngine, TagContext, Tag } from '@/lib/tagging/TagEngine';
import { get_navigation_graph } from './tools/navigationTool';

// =============================================================================
// Type Definitions
// =============================================================================

export type SupportedLocale = 'zh-TW' | 'en' | 'ja';

export interface ToolResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface WeatherData {
    temp: number;
    condition: 'clear' | 'cloudy' | 'rain' | 'snow' | 'unknown';
    humidity?: number;
    alert?: string;
}

export interface TrainStatus {
    line: string;
    status: 'normal' | 'delayed' | 'suspended';
    delayMinutes: number;
    message?: string;
}

export interface AccessibilityFacility {
    id: string;
    type: 'elevator' | 'slope' | 'escalator' | 'wheelchair_ramp';
    name: string;
    location: string;
    floor?: string;
}

export interface StationFacility {
    id: string;
    type: string;
    name: string;
    location: string;
    attributes?: Record<string, any>;
}

export interface KnowledgeEntry {
    id: string;
    title: string;
    content: string;
    tags: string[];
    severity?: 'critical' | 'high' | 'medium' | 'low';
    score?: number; // Dynamic relevance score
}

// =============================================================================
// Tool Definitions
// =============================================================================

import { getJSTTime } from '@/lib/utils/timeUtils';

export const AGENT_TOOLS = {
    /**
     * Get current time in Japan (Asia/Tokyo)
     * Essential for: Last train checks, Seasonal events, Opening hours
     */
    get_current_time: {
        name: 'get_current_time',
        description: '取得目前日本 (Asia/Tokyo) 時間。用於判斷季節性活動 (如初詣)、末班車或店家營業時間。',
        inputSchema: { type: 'object', properties: {}, required: [] },
        execute: async (): Promise<ToolResult<{ iso: string; local: string; year: number; month: number; day: number; hour: number; isHoliday: boolean; holidayName?: string }>> => {
            try {
                const jst = getJSTTime();
                const jstDate = jst.date;

                return {
                    success: true,
                    data: {
                        iso: jstDate.toISOString(),
                        local: jstDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
                        year: jstDate.getFullYear(),
                        month: jstDate.getMonth() + 1,
                        day: jstDate.getDate(),
                        hour: jst.hour,
                        isHoliday: jst.isHoliday,
                        holidayName: jst.holidayName || (jst.isHoliday ? (jstDate.getDay() === 0 ? 'Sunday' : 'Saturday') : undefined)
                    }
                };
            } catch (e) {
                return { success: false, error: String(e) };
            }
        }
    },

    /**
     * Get current weather for a station
     */
    get_weather: {
        name: 'get_weather',
        description: '取得車站當前天氣與體感溫度。用於判斷是否需要建議室內路徑。',
        inputSchema: {
            type: 'object',
            properties: {
                stationId: { type: 'string', description: 'ODPT Station ID' }
            },
            required: ['stationId']
        },
        execute: async (params: { stationId: string }): Promise<ToolResult<WeatherData>> => {
            try {
                // Query weather cache from Supabase
                const { data: cache } = await supabaseAdmin
                    .from('weather_cache')
                    .select('value')
                    .eq('station_id', params.stationId)
                    .maybeSingle();

                if (cache?.value) {
                    const val = cache.value as any;
                    return {
                        success: true,
                        data: {
                            temp: val.temp ?? 20,
                            condition: val.condition ?? 'unknown',
                            humidity: val.humidity,
                            alert: val.alert
                        }
                    };
                }

                // Default: no weather data
                return {
                    success: true,
                    data: { temp: 20, condition: 'unknown' }
                };
            } catch (e) {
                return { success: false, error: String(e) };
            }
        }
    },

    /**
     * Get train delay status for lines serving a station
     */
    get_train_status: {
        name: 'get_train_status',
        description: '取得路線延誤狀態。用於判斷是否需要啟動「避難模式」建議替代路線。',
        inputSchema: {
            type: 'object',
            properties: {
                stationId: { type: 'string', description: 'ODPT Station ID' }
            },
            required: ['stationId']
        },
        execute: async (params: { stationId: string }): Promise<ToolResult<TrainStatus[]>> => {
            try {
                const cacheKey = `l2:${params.stationId}`;
                const { data: cache } = await supabaseAdmin
                    .from('l2_cache')
                    .select('value')
                    .eq('key', cacheKey)
                    .maybeSingle();

                if (cache?.value) {
                    const val = cache.value as any;
                    const statuses: TrainStatus[] = [];

                    // Parse line_status array if present
                    if (Array.isArray(val.line_status)) {
                        val.line_status.forEach((ls: any) => {
                            statuses.push({
                                line: ls.line || ls.name?.en || 'Unknown',
                                status: ls.status || 'normal',
                                delayMinutes: ls.delay || 0,
                                message: ls.message
                            });
                        });
                    }

                    // Add general delay if present
                    if (typeof val.delay === 'number' && val.delay > 0) {
                        statuses.push({
                            line: 'General',
                            status: 'delayed',
                            delayMinutes: val.delay
                        });
                    }

                    return { success: true, data: statuses };
                }

                return { success: true, data: [] };
            } catch (e) {
                return { success: false, error: String(e) };
            }
        }
    },

    /**
     * Get accessibility facilities (elevators, slopes, ramps)
     * CRITICAL for wheelchair/stroller users
     */
    get_accessibility: {
        name: 'get_accessibility',
        description: '取得無障礙設施 (電梯/坡道/輪椅坡道) 資訊。對於 wheelchair/stroller 使用者為必要調用。',
        inputSchema: {
            type: 'object',
            properties: {
                stationId: { type: 'string', description: 'ODPT Station ID' }
            },
            required: ['stationId']
        },
        execute: async (params: { stationId: string }): Promise<ToolResult<AccessibilityFacility[]>> => {
            try {
                const accessibilityTypes = ['elevator', 'slope', 'wheelchair_ramp', 'barrier_free_entrance'];

                const { data: facilities } = await supabaseAdmin
                    .from('l3_facilities')
                    .select('*')
                    .eq('station_id', params.stationId)
                    .in('type', accessibilityTypes);

                if (!facilities || facilities.length === 0) {
                    return { success: true, data: [] };
                }

                const mapped: AccessibilityFacility[] = facilities.map((f: any) => ({
                    id: f.id,
                    type: f.type as AccessibilityFacility['type'],
                    name: f.name_i18n?.zh || f.name_i18n?.ja || f.name_i18n?.en || f.type,
                    location: f.location_i18n?.zh || f.location_i18n?.ja || f.attributes?.location_description || '',
                    floor: f.attributes?.floor
                }));

                return { success: true, data: mapped };
            } catch (e) {
                return { success: false, error: String(e) };
            }
        }
    },

    /**
     * Get station facilities by type
     */
    get_station_facilities: {
        name: 'get_station_facilities',
        description: '取得車站設施 (廁所/置物櫃/ATM 等) 資訊。可指定設施類型。',
        inputSchema: {
            type: 'object',
            properties: {
                stationId: { type: 'string', description: 'ODPT Station ID' },
                facilityType: { type: 'string', description: 'Optional: toilet, locker, atm, wifi, etc.' }
            },
            required: ['stationId']
        },
        execute: async (params: { stationId: string; facilityType?: string }): Promise<ToolResult<StationFacility[]>> => {
            try {
                let query = supabaseAdmin
                    .from('l3_facilities')
                    .select('*')
                    .eq('station_id', params.stationId);

                if (params.facilityType) {
                    query = query.eq('type', params.facilityType);
                }

                const { data: facilities } = await query.limit(20);

                if (!facilities || facilities.length === 0) {
                    return { success: true, data: [] };
                }

                const mapped: StationFacility[] = facilities.map((f: any) => ({
                    id: f.id,
                    type: f.type,
                    name: f.name_i18n?.zh || f.name_i18n?.ja || f.name_i18n?.en || f.type,
                    location: f.location_i18n?.zh || f.location_i18n?.ja || '',
                    attributes: f.attributes
                }));

                return { success: true, data: mapped };
            } catch (e) {
                return { success: false, error: String(e) };
            }
        }
    },

    /**
     * Search knowledge base by tags (NOT full-text search)
     * Uses tag-based retrieval for faster, more precise results
     */
    search_knowledge: {
        name: 'search_knowledge',
        description: '根據標籤搜尋專家知識庫。支援自然語言查詢與多維度標籤解析。',
        inputSchema: {
            type: 'object',
            properties: {
                stationId: { type: 'string', description: 'ODPT Station ID' },
                tags: { type: 'array', items: { type: 'string' }, description: 'Tags to search: transfer, accessibility, locker, crowd, etc.' },
                query: { type: 'string', description: 'Natural language query (e.g., "Find a quiet cafe")' },
                context: {
                    type: 'object',
                    properties: {
                        userProfile: { type: 'string', enum: ['general', 'wheelchair', 'stroller'] },
                        weather: { type: 'string', enum: ['clear', 'rain', 'snow', 'cloudy'] },
                        timeOfDay: { type: 'string', enum: ['morning', 'day', 'evening', 'night'] },
                        dateISO: { type: 'string', description: 'Current date in ISO format for seasonal checks' }
                    },
                    description: 'Context for dynamic weighting'
                }
            },
            required: ['stationId']
        },
        execute: async (params: { stationId: string; tags?: string[]; query?: string; context?: TagContext }): Promise<ToolResult<KnowledgeEntry[]>> => {
            try {
                // Import KNOWLEDGE_BASE dynamically to avoid circular deps
                const { KNOWLEDGE_BASE, STATION_WISDOM } = await import('@/data/stationWisdom');

                const entries: KnowledgeEntry[] = [];

                // Helper: Check time pattern
                const checkTimePattern = (pattern: string, dateStr?: string): boolean => {
                    if (!dateStr) return false;
                    try {
                        const date = new Date(dateStr);
                        const [start, end] = pattern.split('-'); // "12/31-01/01"
                        const [sMonth, sDay] = start.split('/').map(Number);
                        const [eMonth, eDay] = end.split('/').map(Number);
                        
                        const currentMonth = date.getMonth() + 1;
                        const currentDay = date.getDate();

                        // Simple logic for same-year ranges (MVP)
                        // Does not handle year wrapping well unless split (e.g. 12/31 is separate from 01/01)
                        // For MVP "12/31-01/01" is tricky. Let's assume single dates or range within year.
                        // Or we just check if current date matches either start or end for now.
                        // Actually, let's just check if it matches specific dates in list.
                        // "12/31", "01/01", "01/02", "01/03"
                        
                        // Revised Logic: Check if current MM/DD is in the pattern range
                        // Handle crossing year boundary? 
                        // Let's implement simpler logic: Pattern "MM/DD-MM/DD"
                        
                        if (sMonth > eMonth) { // Cross year: 12/31 - 01/03
                             if ((currentMonth === sMonth && currentDay >= sDay) || 
                                 (currentMonth === eMonth && currentDay <= eDay)) {
                                 return true;
                             }
                        } else {
                            if (currentMonth >= sMonth && currentMonth <= eMonth) {
                                if (currentMonth === sMonth && currentDay < sDay) return false;
                                if (currentMonth === eMonth && currentDay > eDay) return false;
                                return true;
                            }
                        }
                        return false;
                    } catch (e) {
                        return false;
                    }
                };

                // 1. Resolve Tags (Multi-dimensional Parsing)
                let searchTags: Tag[] = [];

                // From Query
                if (params.query) {
                    searchTags = [...searchTags, ...TagEngine.parseQuery(params.query)];
                }

                // From explicit tags
                if (params.tags) {
                    params.tags.forEach(tName => {
                        const parsed = TagEngine.parseQuery(tName);
                        if (parsed.length > 0) {
                            searchTags = [...searchTags, ...parsed];
                        } else {
                            searchTags.push({ id: `temp-${tName}`, name: tName, category: 'general', baseWeight: 0.5 });
                        }
                    });
                }

                // Dedup tags
                const uniqueTags = Array.from(new Map(searchTags.map(t => [t.name, t])).values());

                // 2. Search KNOWLEDGE_BASE by station_id and tags
                KNOWLEDGE_BASE.forEach((rule: any) => {
                    // Station match
                    const stationMatch = !rule.trigger?.station_ids ||
                        rule.trigger.station_ids.length === 0 ||
                        rule.trigger.station_ids.includes(params.stationId);

                    if (!stationMatch) return;

                    // Tag match with Dynamic Weighting
                    const ruleKeywords = rule.trigger?.keywords || [];
                    const ruleUserStates = rule.trigger?.user_states || [];
                    const ruleTimePatterns = rule.trigger?.time_patterns || [];
                    let matchScore = 0;

                    // 0. Time Pattern Match (Seasonal)
                    if (ruleTimePatterns.length > 0 && params.context?.dateISO) {
                        const isSeasonalMatch = ruleTimePatterns.some((p: string) => checkTimePattern(p, params.context?.dateISO));
                        
                        if (isSeasonalMatch) {
                            matchScore += 3.0; // Huge boost for seasonal relevance
                        } else {
                            // If seasonal rule BUT not in season, skip it entirely?
                            // Or give negative score?
                            // Let's skip it to avoid cluttering results with "New Year" info in July.
                            return; 
                        }
                    }

                    // 1. Context Match (User Profile)
                    if (params.context) {
                        const { userProfile } = params.context;
                        if (userProfile === 'wheelchair' && ruleUserStates.includes('accessibility.wheelchair')) {
                            matchScore += 2.0; // High priority for accessibility
                        }
                        if (userProfile === 'stroller' && ruleUserStates.includes('accessibility.stroller')) {
                            matchScore += 1.5;
                        }
                    }

                    // 2. Tag Match
                    if (uniqueTags.length === 0) {
                          // If no tags provided but station matches, include with low score
                          // unless context matched, which already boosted score.
                          if (matchScore === 0) matchScore = 0.1;
                    } else {
                        uniqueTags.forEach(uTag => {
                            if (ruleKeywords.some((kw: string) =>
                                kw.toLowerCase().includes(uTag.name.toLowerCase()) ||
                                uTag.name.toLowerCase().includes(kw.toLowerCase()) ||
                                (uTag.synonyms && uTag.synonyms.some(s => kw.toLowerCase().includes(s)))
                            )) {
                                // Calculate dynamic weight
                                const weight = params.context
                                    ? TagEngine.calculateContextualWeight(uTag, params.context)
                                    : (uTag.baseWeight || 0.5);
                                matchScore += weight;
                            }
                        });
                    }

                    if (matchScore > 0) {
                        entries.push({
                            id: rule.id || `kb-${entries.length}`,
                            title: rule.title?.['zh-TW'] || rule.title?.ja || rule.title?.en || 'Knowledge',
                            content: rule.content?.['zh-TW'] || rule.content?.ja || rule.content?.en || '',
                            tags: ruleKeywords,
                            severity: rule.severity,
                            score: parseFloat(matchScore.toFixed(2))
                        });
                    }
                });

                // 2. Search STATION_WISDOM for traps/hacks
                const wisdom = (STATION_WISDOM as any)[params.stationId];
                if (wisdom) {
                    // Add traps
                    if (Array.isArray(wisdom.traps)) {
                        wisdom.traps.forEach((trap: any, idx: number) => {
                            // Simple tag match for traps if tags are present
                            // Traps are usually important, so give them base score
                            entries.push({
                                id: `trap-${params.stationId}-${idx}`,
                                title: trap.title || '⚠️ 注意事項',
                                content: `${trap.content}\n\n建議：${trap.advice}`,
                                tags: ['trap', 'warning'],
                                severity: trap.severity || 'medium',
                                score: 0.8 // Default high score for traps
                            });
                        });
                    }

                    // Add hacks
                    if (Array.isArray(wisdom.hacks)) {
                        wisdom.hacks.forEach((hack: string, idx: number) => {
                             entries.push({
                                id: `hack-${params.stationId}-${idx}`,
                                title: '💡 小撇步',
                                content: hack,
                                tags: ['hack', 'tip'],
                                severity: 'low',
                                score: 0.5
                            });
                        });
                    }
                }

                // Sort by score descending
                entries.sort((a, b) => (b.score || 0) - (a.score || 0));

                return { success: true, data: entries };
            } catch (e) {
                return { success: false, error: String(e) };
            }
        }
    }
};

// =============================================================================
// Tool Executor
// =============================================================================

export type ToolName = keyof typeof AGENT_TOOLS;

export async function executeTool(
    toolName: ToolName,
    params: Record<string, any>
): Promise<ToolResult> {
    const tool = AGENT_TOOLS[toolName];
    if (!tool) {
        return { success: false, error: `Unknown tool: ${toolName}` };
    }
    return tool.execute(params as any);
}

/**
 * Get tool descriptions for LLM context injection
 */
export function getToolDescriptions(): string {
    return Object.entries(AGENT_TOOLS)
        .map(([name, tool]) => `- ${name}: ${tool.description}`)
        .join('\n');
}
