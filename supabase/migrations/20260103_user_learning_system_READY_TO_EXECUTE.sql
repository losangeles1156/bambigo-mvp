-- =============================================================================
-- User Preferences & Learning System Database Schema
-- Execution: Copy and paste this entire content into Supabase Dashboard SQL Editor
-- Created: 2026-01-03
-- =============================================================================

-- =============================================================================
-- 1. USER PREFERENCES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL UNIQUE,
    default_lat DECIMAL(10, 8) DEFAULT 35.7138,
    default_lon DECIMAL(11, 8) DEFAULT 139.7773,
    default_zoom INT DEFAULT 15,
    map_style VARCHAR(50) DEFAULT 'light',
    show_hubs_only BOOLEAN DEFAULT FALSE,
    show_labels BOOLEAN DEFAULT TRUE,
    label_language VARCHAR(10) DEFAULT 'zh-TW',
    dark_mode BOOLEAN DEFAULT FALSE,
    preferred_facility_types JSONB DEFAULT '[]'::jsonb,
    excluded_facility_types JSONB DEFAULT '[]'::jsonb,
    max_walking_distance INT DEFAULT 500,
    sort_by VARCHAR(50) DEFAULT 'distance',
    sort_order VARCHAR(10) DEFAULT 'asc',
    user_profile VARCHAR(50) DEFAULT 'general',
    version INT DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    data_hash TEXT,
    last_synced_at TIMESTAMPTZ,
    device_id VARCHAR(100),
    source VARCHAR(50) DEFAULT 'web',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_updated_at ON user_preferences(updated_at);

-- =============================================================================
-- 2. DECISION LOGS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS decision_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL,
    query_geo_bounds JSONB NOT NULL,
    query_center JSONB,
    query_radius_meters INT,
    query_facility_types JSONB DEFAULT '[]'::jsonb,
    query_time_context VARCHAR(50),
    result_node_ids TEXT[],
    result_count INT,
    selected_node_ids TEXT[],
    decision_duration_ms INT,
    scroll_depth DECIMAL(5, 2),
    filter_changes JSONB DEFAULT '[]'::jsonb,
    map_zoom INT,
    weather_condition VARCHAR(50),
    time_of_day VARCHAR(20),
    day_of_week VARCHAR(10),
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decision_logs_user_id ON decision_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_decision_logs_created_at ON decision_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_decision_logs_selected_nodes ON decision_logs USING GIN(selected_node_ids);

-- =============================================================================
-- 3. DECISION FEEDBACK TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS decision_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID REFERENCES decision_logs(id) ON DELETE CASCADE,
    user_id VARCHAR(100) NOT NULL,
    feedback_type VARCHAR(20) NOT NULL CHECK (feedback_type IN ('positive', 'negative', 'bookmark', 'report_issue')),
    feedback_score DECIMAL(3, 2),
    feedback_text TEXT,
    reported_issues JSONB DEFAULT '[]'::jsonb,
    time_since_decision_hours DECIMAL(10, 2),
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decision_feedback_decision_id ON decision_feedback(decision_id);
CREATE INDEX IF NOT EXISTS idx_decision_feedback_user_id ON decision_feedback(user_id);

-- =============================================================================
-- 4. FACILITY PREFERENCE WEIGHTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS facility_preference_weights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL,
    facility_type VARCHAR(100) NOT NULL,
    frequency_score DECIMAL(5, 3) DEFAULT 0,
    recency_score DECIMAL(5, 3) DEFAULT 0,
    positive_feedback_score DECIMAL(5, 3) DEFAULT 0,
    negative_feedback_score DECIMAL(5, 3) DEFAULT 0,
    combined_score DECIMAL(5, 3) DEFAULT 0,
    selection_count INT DEFAULT 0,
    last_selected_at TIMESTAMPTZ,
    version INT DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, facility_type)
);

CREATE INDEX IF NOT EXISTS idx_facility_weights_user_id ON facility_preference_weights(user_id);
CREATE INDEX IF NOT EXISTS idx_facility_weights_combined ON facility_preference_weights(user_id, combined_score DESC);

-- =============================================================================
-- 5. USER PREFERENCE SNAPSHOTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_preference_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL,
    preference_id UUID REFERENCES user_preferences(id) ON DELETE CASCADE,
    snapshot_data JSONB NOT NULL,
    snapshot_hash TEXT NOT NULL,
    snapshot_reason VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    ab_test_group VARCHAR(20),
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preference_snapshots_user_id ON user_preference_snapshots(user_id);

-- =============================================================================
-- TRIGGER FUNCTIONS
-- =============================================================================

-- Update timestamp and version for user_preferences
CREATE OR REPLACE FUNCTION update_user_preference_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.version = COALESCE(OLD.version, 0) + 1;
    NEW.data_hash := encode(digest(
        COALESCE(NEW.preferred_facility_types, '{}')::text ||
        COALESCE(NEW.excluded_facility_types, '{}')::text ||
        COALESCE(NEW.user_profile, 'general')::text,
        'sha256'
    ), 'hex');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_preference_update ON user_preferences;
CREATE TRIGGER trigger_user_preference_update
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_user_preference_timestamp();

-- Update timestamp for decision_feedback
CREATE OR REPLACE FUNCTION update_decision_feedback_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.version = COALESCE(OLD.version, 0) + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_decision_feedback_update ON decision_feedback;
CREATE TRIGGER trigger_decision_feedback_update
    BEFORE UPDATE ON decision_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_decision_feedback_timestamp();

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Get user's facility preference weights
CREATE OR REPLACE FUNCTION get_user_preference_weights(p_user_id VARCHAR)
RETURNS TABLE (facility_type VARCHAR, combined_score DECIMAL, selection_count INT) AS $$
BEGIN
    RETURN QUERY
    SELECT fpw.facility_type, fpw.combined_score, fpw.selection_count
    FROM facility_preference_weights fpw
    WHERE fpw.user_id = p_user_id
    ORDER BY fpw.combined_score DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get recent decisions for a user
CREATE OR REPLACE FUNCTION get_recent_decisions(p_user_id VARCHAR, p_limit INT DEFAULT 20)
RETURNS TABLE (id UUID, query_time TIMESTAMPTZ, selected_count INT, decision_duration_ms INT, facility_types TEXT[]) AS $$
BEGIN
    RETURN QUERY
    SELECT dl.id, dl.created_at, ARRAY_LENGTH(dl.selected_node_ids, 1), dl.decision_duration_ms, dl.query_facility_types::text[]
    FROM decision_logs dl
    WHERE dl.user_id = p_user_id
    ORDER BY dl.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate preference score with time decay
CREATE OR REPLACE FUNCTION calculate_weighted_score(p_frequency INT, p_last_selected_at TIMESTAMPTZ, p_positive_count INT, p_negative_count INT)
RETURNS DECIMAL AS $$
DECLARE
    v_freq_score DECIMAL;
    v_recency_score DECIMAL;
    v_pos_score DECIMAL;
    v_neg_score DECIMAL;
    v_days_since NUMERIC;
BEGIN
    v_freq_score := LEAST(p_frequency::DECIMAL / 100, 1.0);
    v_days_since := EXTRACT(EPOCH FROM (NOW() - COALESCE(p_last_selected_at, NOW()))) / 86400;
    v_recency_score := EXP(-0.1 * v_days_since);
    v_pos_score := LEAST(p_positive_count::DECIMAL / 20, 1.0);
    v_neg_score := 1.0 - LEAST(p_negative_count::DECIMAL / 10, 1.0);
    RETURN ROUND((v_freq_score * 0.30 + v_recency_score * 0.30 + v_pos_score * 0.25 + v_neg_score * 0.15)::DECIMAL, 3);
END;
$$ LANGUAGE plpgsql;

-- Bulk export user learning data
CREATE OR REPLACE FUNCTION export_user_learning_data(p_user_id VARCHAR)
RETURNS JSONB AS $$
DECLARE
    v_preferences JSONB;
    v_decisions JSONB;
    v_weights JSONB;
BEGIN
    SELECT to_jsonb(user_preferences) INTO v_preferences FROM user_preferences WHERE user_id = p_user_id;
    SELECT json_agg(to_jsonb(dl)) INTO v_decisions FROM decision_logs dl WHERE dl.user_id = p_user_id;
    SELECT json_agg(to_jsonb(fpw)) INTO v_weights FROM facility_preference_weights fpw WHERE fpw.user_id = p_user_id;
    RETURN jsonb_build_object('preferences', COALESCE(v_preferences, '{}'::jsonb), 'decisions', COALESCE(v_decisions, '[]'::jsonb), 'weights', COALESCE(v_weights, '[]'::jsonb), 'exported_at', NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Preference audit procedure
CREATE OR REPLACE PROCEDURE preference_audit(p_user_id VARCHAR)
LANGUAGE plpgsql AS $$
DECLARE
    v_pref_count INT;
    v_decision_count INT;
    v_weight_count INT;
    v_issue_count INT := 0;
BEGIN
    SELECT COUNT(*) INTO v_pref_count FROM user_preferences WHERE user_id = p_user_id;
    SELECT COUNT(*) INTO v_decision_count FROM decision_logs WHERE user_id = p_user_id;
    SELECT COUNT(*) INTO v_weight_count FROM facility_preference_weights WHERE user_id = p_user_id;
    PERFORM 1 FROM facility_preference_weights WHERE user_id = p_user_id AND (combined_score < 0 OR combined_score > 1);
    GET DIAGNOSTICS v_issue_count = ROW_COUNT;
    RAISE NOTICE 'User: %, Preferences: %, Decisions: %, Weights: %, Invalid: %', p_user_id, v_pref_count, v_decision_count, v_weight_count, v_issue_count;
    IF v_issue_count > 0 THEN
        UPDATE facility_preference_weights SET combined_score = 0.0 WHERE user_id = p_user_id AND (combined_score < 0 OR combined_score > 1);
    END IF;
END;
$$;

-- Done
DO $$
BEGIN
    RAISE NOTICE 'User Learning System schema created successfully';
END;
$$;
