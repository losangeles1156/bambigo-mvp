import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DecisionRecordRequest, DecisionRecordResponse } from '@/lib/types/userLearning';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// POST /api/decision/record - Record a single decision
export async function POST(request: NextRequest) {
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

    // Validate required fields
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

    const now = new Date().toISOString();

    // Determine time context
    const timeContext = time_of_day || getTimeContext();

    // Insert decision log
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

    // Update facility preference weights for selected nodes
    if (selected_node_ids && selected_node_ids.length > 0) {
      await updatePreferenceWeights(user_id, selected_node_ids);
    }

    // Invalidate learning results cache
    // await redis.del(`learning_results:${user_id}`);

    console.log(`[Decision Record API] User ${user_id} recorded decision ${decision.id}`);

    return NextResponse.json({
      success: true,
      decision_id: decision.id
    } as DecisionRecordResponse);
  } catch (error) {
    console.error('[Decision Record API] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to record decision'
    }, { status: 500 });
  }
}

// GET /api/decision/record - Get decision history
export async function GET(request: NextRequest) {
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

    const { data, error, count } = await supabase
      .from('decision_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      decisions: data || [],
      total: count || 0,
      limit,
      offset
    });
  } catch (error) {
    console.error('[Decision Record API] Fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch decisions'
    }, { status: 500 });
  }
}

// Helper: Get time context based on current time
function getTimeContext(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'weekday-morning';
  if (hour >= 12 && hour < 17) return 'weekday-afternoon';
  if (hour >= 17 && hour < 21) return 'weekday-evening';
  return 'night';
}

// Helper: Get day of week
function getDayOfWeek(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

// Helper: Update facility preference weights
async function updatePreferenceWeights(userId: string, selectedNodeIds: string[]) {
  try {
    // For each selected node, update or create preference weight
    // Note: In production, you would look up the facility types from the nodes table
    // This is a simplified version
    
    for (const nodeId of selectedNodeIds) {
      // Extract facility type from node ID (simplified - would need proper lookup)
      const facilityType = extractFacilityType(nodeId);
      
      if (facilityType) {
        // Check if weight exists
        const { data: existing } = await supabase
          .from('facility_preference_weights')
          .select('*')
          .eq('user_id', userId)
          .eq('facility_type', facilityType)
          .single();

        if (existing) {
          // Update existing weight
          const newFreqScore = Math.min((existing.selection_count + 1) / 100, 1.0);
          await supabase
            .from('facility_preference_weights')
            .update({
              frequency_score: newFreqScore,
              recency_score: 1.0,  // Most recent
              last_selected_at: new Date().toISOString(),
              selection_count: existing.selection_count + 1,
              combined_score: newFreqScore * 0.3 + 1.0 * 0.3 + existing.positive_feedback_score * 0.25 + (1 - existing.negative_feedback_score) * 0.15,
              version: existing.version + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
        } else {
          // Create new weight
          await supabase
            .from('facility_preference_weights')
            .insert({
              user_id: userId,
              facility_type: facilityType,
              frequency_score: 0.01,
              recency_score: 1.0,
              positive_feedback_score: 0,
              negative_feedback_score: 0,
              combined_score: 0.01 * 0.3 + 1.0 * 0.3,  // Initial score
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

// Helper: Extract facility type from node ID
function extractFacilityType(nodeId: string): string | null {
  // Simplified - would need proper mapping from node ID to facility type
  // This is just an example
  if (nodeId.includes('convenience')) return 'convenience';
  if (nodeId.includes('cafe')) return 'cafe';
  if (nodeId.includes('restaurant')) return 'restaurant';
  if (nodeId.includes('station')) return 'station';
  
  // Default fallback - would need to query nodes table for actual type
  return 'general';
}
