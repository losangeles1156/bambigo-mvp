import {
    ExpertKnowledge,
    KnowledgeTrigger,
    MatchedStrategyCard,
    UserPreferences,
    UserStateKey,
    EvaluationContext
} from '@/types/lutagu_l4';
import { KNOWLEDGE_BASE } from '@/data/stationWisdom';

export class L4DecisionEngine {

    /**
     * Evaluates the Knowledge Base against the user's context to find relevant advice.
     */
    public evaluate(context: EvaluationContext): MatchedStrategyCard[] {
        const { stationId, lineIds = [], userPreferences, currentDate = new Date(), locale } = context;
        const matches: MatchedStrategyCard[] = [];

        // Helper to get active user state keys
        const activeUserStates = this.extractActiveUserStates(userPreferences);

        for (const rule of KNOWLEDGE_BASE) {
            if (this.checkTrigger(rule.trigger, stationId, lineIds, activeUserStates, currentDate)) {

                // Calculate Relevance Score
                let score = rule.priority;

                // Boost score if the rule specifically matches a user state (High Relevance)
                if (rule.trigger.user_states && rule.trigger.user_states.length > 0) {
                    score += 20;
                }

                // Resolve Localization
                const title = rule.title[locale] || rule.title['en'] || '';
                const description = rule.content[locale] || rule.content['en'] || '';

                matches.push({
                    id: rule.id,
                    type: rule.type,
                    icon: rule.icon,
                    title,
                    description,
                    priority: score,
                    knowledgeId: rule.id,
                    _debug_reason: `Matched trigger: ${JSON.stringify(rule.trigger)}`
                });
            }
        }

        // Sort by priority (descending)
        return matches.sort((a, b) => b.priority - a.priority);
    }

    /**
     * Core Logic: Does this rule apply?
     */
    private checkTrigger(
        trigger: KnowledgeTrigger,
        stationId: string,
        lineIds: string[],
        activeUserStates: Set<UserStateKey>,
        currentDate: Date
    ): boolean {

        // 1. Station Match (If defined, MUST match)
        if (trigger.station_ids && trigger.station_ids.length > 0) {
            if (!trigger.station_ids.includes(stationId)) {
                return false;
            }
        }

        // 2. Line Match (If defined, MUST match one of the context lines)
        // Logic: If rule applies to Keiyo Line, and user is AT Tokyo Station (context), 
        // strictly speaking we need to know if the user IS USING Keiyo Line.
        // For MVP, if line_ids is empty in context, we might be lenient, but V3.0 implies strict context.
        // Let's assume if rule specifies lines, text context MUST include at least one.
        if (trigger.line_ids && trigger.line_ids.length > 0) {
            const hasMatchingLine = trigger.line_ids.some(id => lineIds.includes(id));
            if (!hasMatchingLine) {
                // If context has no line info, we might skip line-specific rules to be safe
                return false;
            }
        }

        // 3. User State Match (If defined, ALL listed states must be active)
        // e.g. Rule requires [Wheelchair, HeavyLuggage] -> User must have both.
        if (trigger.user_states && trigger.user_states.length > 0) {
            for (const requiredState of trigger.user_states) {
                if (!activeUserStates.has(requiredState)) {
                    return false;
                }
            }
        }

        // 4. Time Pattern Match (If defined, current time must match)
        if (trigger.time_patterns && trigger.time_patterns.length > 0) {
            const timeMatch = trigger.time_patterns.some(pattern => this.matchesTimePattern(pattern, currentDate));
            if (!timeMatch) {
                return false;
            }
        }

        return true;
    }

    /**
     * Helper: Matches ISO Date Range (YYYY-MM-DD/YYYY-MM-DD) or Time Range (HH:mm-HH:mm)
     */
    private matchesTimePattern(pattern: string, date: Date): boolean {
        // 1. Date Range: "2025-12-31/2026-01-01"
        if (pattern.includes('/')) {
            const [startStr, endStr] = pattern.split('/');
            const start = new Date(startStr);
            const end = new Date(endStr);
            // Adjust end date to end of day if needed, simple comparison for now
            end.setHours(23, 59, 59, 999);

            const check = date.getTime();
            return check >= start.getTime() && check <= end.getTime();
        }

        // 2. Time Range: "08:00-10:00" (TODO: Implement if needed for Rush Hour)
        // For MVP seed data (New Year), Date Range is sufficient.

        return false;
    }

    /**
     * Helper: Flatten UserPreferences into a Set of keys for easy lookup
     */
    private extractActiveUserStates(prefs: UserPreferences): Set<UserStateKey> {
        const states = new Set<UserStateKey>();

        if (prefs.accessibility.wheelchair) states.add('accessibility.wheelchair');
        if (prefs.accessibility.stroller) states.add('accessibility.stroller');
        if (prefs.accessibility.visual_impairment) states.add('accessibility.visual_impairment');
        if (prefs.accessibility.elderly) states.add('accessibility.elderly');

        if (prefs.luggage.large_luggage) states.add('luggage.large_luggage');
        if (prefs.luggage.multiple_bags) states.add('luggage.multiple_bags');

        if (prefs.travel_style.rushing) states.add('travel_style.rushing');
        if (prefs.travel_style.budget) states.add('travel_style.budget');
        if (prefs.travel_style.comfort) states.add('travel_style.comfort');
        if (prefs.travel_style.avoid_crowd) states.add('travel_style.avoid_crowd');
        if (prefs.travel_style.avoid_rain) states.add('travel_style.avoid_rain');

        if (prefs.companions.with_children) states.add('companions.with_children');
        if (prefs.companions.family_trip) states.add('companions.family_trip');

        return states;
    }
}

// Singleton Instance
export const decisionEngine = new L4DecisionEngine();
