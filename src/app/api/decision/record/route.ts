import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DecisionRecordRequest, DecisionRecordResponse } from '@/lib/types/userLearning';

// Initialize Supabase client - Use server-side environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

// Get Supabase client instance
const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Decision Record API] Supabase credentials not configured');
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
};

import { getJSTTime } from '@/lib/utils/timeUtils';

// Helper: Get time context based on current time (JST)
function getTimeContext(): string {
  const { hour } = getJSTTime();
  if (hour >= 6 && hour < 12) return 'weekday-morning';
  if (hour >= 12 && hour < 17) return 'weekday-afternoon';
  if (hour >= 17 && hour < 21) return 'weekday-evening';
  return 'night';
}

// Helper: Get day of week (JST)
function getDayOfWeek(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[getJSTTime().date.getDay()];
}

// Helper: Extract facility type from node ID
function extractFacilityType(nodeId: string): string | null {
  if (nodeId.includes('convenience')) return 'convenience';
  if (nodeId.includes('cafe')) return 'cafe';
  if (nodeId.includes('restaurant')) return 'restaurant';
  if (nodeId.includes('station')) return 'station';
  return 'general';
}

// POST /api/decision/record - Record a single decision
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    const body: DecisionRecordRequest = await request.json();
    const {
      user_id,
      query_geo_bounds,
      query_center,
      query_radius_meters,
      query_facility_types,
      result_node_ids,
      selected_node_ids,
      decision_duration_ms,
      scroll_depth,
      filter_changes,
      map_zoom,
      weather_condition,
      time_of_day,
      day_of_week
    } = body;

    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: 'user_id is required'
      }, { status: 400 });
    }

    if (!query_geo_bounds || !result_node_ids) {
      return NextResponse.json({
        success: false,
        error: 'query_geo_bounds and result_node_ids are required'
      }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      const demoDecisionId = 'demo-decision-' + Date.now();
      const duration = Date.now() - startTime;
      console.log(`[Decision Record API] Demo: ${duration}ms - User ${user_id} decision ${demoDecisionId}`);

      return NextResponse.json({
        success: true,
        decision_id: demoDecisionId,
        mode: 'demo',
        response_time_ms: duration
      } as DecisionRecordResponse & { response_time_ms: number });
    }

    const now = new Date().toISOString();
    const timeContext = time_of_day || getTimeContext();

    const { data: decision, error } = await supabase
      .from('decision_logs')
      .insert({
        user_id,
        query_geo_bounds,
        query_center,
        query_radius_meters,
        query_facility_types,
        query_time_context: timeContext,
        result_node_ids,
        result_count: result_node_ids.length,
        selected_node_ids: selected_node_ids || [],
        decision_duration_ms,
        scroll_depth,
        filter_changes: filter_changes || [],
        map_zoom,
        weather_condition,
        time_of_day,
        day_of_week: day_of_week || getDayOfWeek(),
        version: 1,
        created_at: now
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Decision Record API] Insert error:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    if (selected_node_ids && selected_node_ids.length > 0) {
      await updatePreferenceWeights(supabase, user_id, selected_node_ids);
    }

    const duration = Date.now() - startTime;
    console.log(`[Decision Record API] ${duration}ms - User ${user_id} decision ${decision.id}`);

    return NextResponse.json({
      success: true,
      decision_id: decision.id,
      response_time_ms: duration
    } as DecisionRecordResponse & { response_time_ms: number });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Decision Record API] Error (${duration}ms):`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to record decision',
      response_time_ms: duration
    }, { status: 500 });
  }
}

// GET /api/decision/record - Get decision history
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'user_id is required'
      }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      const duration = Date.now() - startTime;
      return NextResponse.json({
        success: true,
        decisions: [],
        total: 0,
        limit,
        offset,
        mode: 'demo',
        response_time_ms: duration
      });
    }

    const { data, error, count } = await supabase
      .from('decision_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const duration = Date.now() - startTime;
    return NextResponse.json({
      success: true,
      decisions: data || [],
      total: count || 0,
      limit,
      offset,
      response_time_ms: duration
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Decision Record API] Fetch error (${duration}ms):`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch decisions',
      response_time_ms: duration
    }, { status: 500 });
  }
}

async function updatePreferenceWeights(supabase: any, userId: string, selectedNodeIds: string[]) {
  try {
    for (const nodeId of selectedNodeIds) {
      const facilityType = extractFacilityType(nodeId);
      if (facilityType) {
        const { data: existing } = await supabase
          .from('facility_preference_weights')
          .select('*')
          .eq('user_id', userId)
          .eq('facility_type', facilityType)
          .single();

        if (existing) {
          const newFreqScore = Math.min((existing.selection_count + 1) / 100, 1.0);
          await supabase
            .from('facility_preference_weights')
            .update({
              frequency_score: newFreqScore,
              recency_score: 1.0,
              last_selected_at: new Date().toISOString(),
              selection_count: existing.selection_count + 1,
              combined_score: newFreqScore * 0.3 + 1.0 * 0.3 + existing.positive_feedback_score * 0.25 + (1 - existing.negative_feedback_score) * 0.15,
              version: existing.version + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('facility_preference_weights')
            .insert({
              user_id: userId,
              facility_type: facilityType,
              frequency_score: 0.01,
              recency_score: 1.0,
              positive_feedback_score: 0,
              negative_feedback_score: 0,
              combined_score: 0.01 * 0.3 + 1.0 * 0.3,
              selection_count: 1,
              last_selected_at: new Date().toISOString(),
              version: 1,
              updated_at: new Date().toISOString()
            });
        }
      }
    }
  } catch (error) {
    console.error('[Decision Record API] Weight update error:', error);
  }
}
