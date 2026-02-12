-- 검시AI Analytics Database Setup
-- Run this script in Supabase SQL Editor
-- Created: 2026-02-08

-- ============================================
-- 1. Users Table (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  plan TEXT DEFAULT 'free', -- 'free' or 'premium'
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 2. User Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  duration_seconds INTEGER,
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start ON user_sessions(session_start);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON user_sessions(DATE(session_start));

-- ============================================
-- 3. Chat Interactions Table
-- ============================================
CREATE TABLE IF NOT EXISTS chat_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  subject TEXT, -- 'korean', 'math', 'english', 'social', 'science', 'history'
  topic TEXT, -- Extracted from chat content
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  response_time_ms INTEGER, -- AI response latency
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_user_id ON chat_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_subject ON chat_interactions(subject);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_date ON chat_interactions(DATE(created_at));

-- ============================================
-- 4. Question Attempts Table
-- ============================================
CREATE TABLE IF NOT EXISTS question_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  question_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty TEXT, -- 'easy', 'medium', 'hard'
  topic TEXT,
  user_answer TEXT,
  is_correct BOOLEAN,
  time_spent_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qa_user_id ON question_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_qa_subject ON question_attempts(subject);
CREATE INDEX IF NOT EXISTS idx_qa_created_at ON question_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_qa_correct ON question_attempts(is_correct);

-- ============================================
-- 5. User Events Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'signup', 'login', 'page_view', 'feature_click'
  event_name TEXT, -- specific event name
  event_data JSONB, -- flexible metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON user_events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_date ON user_events(DATE(created_at));

-- ============================================
-- 6. Daily Metrics Table
-- ============================================
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL UNIQUE,
  dau INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_chat_messages INTEGER DEFAULT 0,
  total_questions_attempted INTEGER DEFAULT 0,
  avg_session_duration_seconds INTEGER DEFAULT 0,
  subject_usage JSONB, -- {"korean": 45, "math": 78, ...}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(metric_date);

-- ============================================
-- 7. Helper Functions
-- ============================================

-- Get DAU for today
CREATE OR REPLACE FUNCTION get_dau()
RETURNS TABLE (dau BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT COUNT(DISTINCT user_id)::BIGINT
  FROM user_sessions
  WHERE DATE(session_start) = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Get MAU for current month
CREATE OR REPLACE FUNCTION get_mau()
RETURNS TABLE (mau BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT COUNT(DISTINCT user_id)::BIGINT
  FROM user_sessions
  WHERE session_start >= DATE_TRUNC('month', CURRENT_DATE)
    AND session_start < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';
END;
$$ LANGUAGE plpgsql;

-- Calculate session duration
CREATE OR REPLACE FUNCTION calculate_session_duration(session_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  duration INTEGER;
BEGIN
  SELECT EXTRACT(EPOCH FROM (session_end - session_start))::INTEGER
  INTO duration
  FROM user_sessions
  WHERE id = session_uuid;
  
  RETURN COALESCE(duration, 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. Daily Metrics Aggregation Function
-- ============================================
CREATE OR REPLACE FUNCTION aggregate_daily_metrics(target_date DATE DEFAULT CURRENT_DATE - INTERVAL '1 day')
RETURNS VOID AS $$
DECLARE
  metric_dau INTEGER;
  metric_new_users INTEGER;
  metric_total_sessions INTEGER;
  metric_total_chat_messages INTEGER;
  metric_total_questions INTEGER;
  metric_avg_duration INTEGER;
  metric_subject_usage JSONB;
BEGIN
  -- Calculate DAU
  SELECT COUNT(DISTINCT user_id)::INTEGER
  INTO metric_dau
  FROM user_sessions
  WHERE DATE(session_start) = target_date;

  -- Calculate new users
  SELECT COUNT(*)::INTEGER
  INTO metric_new_users
  FROM users
  WHERE DATE(created_at) = target_date;

  -- Calculate total sessions
  SELECT COUNT(*)::INTEGER
  INTO metric_total_sessions
  FROM user_sessions
  WHERE DATE(session_start) = target_date;

  -- Calculate total chat messages
  SELECT COUNT(*)::INTEGER
  INTO metric_total_chat_messages
  FROM chat_interactions
  WHERE DATE(created_at) = target_date;

  -- Calculate total question attempts
  SELECT COUNT(*)::INTEGER
  INTO metric_total_questions
  FROM question_attempts
  WHERE DATE(created_at) = target_date;

  -- Calculate average session duration
  SELECT COALESCE(AVG(duration_seconds)::INTEGER, 0)
  INTO metric_avg_duration
  FROM user_sessions
  WHERE DATE(session_start) = target_date
    AND duration_seconds IS NOT NULL;

  -- Calculate subject usage
  SELECT COALESCE(
    jsonb_object_agg(subject, count),
    '{}'::jsonb
  )
  INTO metric_subject_usage
  FROM (
    SELECT subject, COUNT(*)::INTEGER as count
    FROM chat_interactions
    WHERE DATE(created_at) = target_date
      AND subject IS NOT NULL
    GROUP BY subject
  ) subquery;

  -- Insert or update daily metrics
  INSERT INTO daily_metrics (
    metric_date,
    dau,
    new_users,
    total_sessions,
    total_chat_messages,
    total_questions_attempted,
    avg_session_duration_seconds,
    subject_usage,
    updated_at
  )
  VALUES (
    target_date,
    metric_dau,
    metric_new_users,
    metric_total_sessions,
    metric_total_chat_messages,
    metric_total_questions,
    metric_avg_duration,
    metric_subject_usage,
    NOW()
  )
  ON CONFLICT (metric_date)
  DO UPDATE SET
    dau = EXCLUDED.dau,
    new_users = EXCLUDED.new_users,
    total_sessions = EXCLUDED.total_sessions,
    total_chat_messages = EXCLUDED.total_chat_messages,
    total_questions_attempted = EXCLUDED.total_questions_attempted,
    avg_session_duration_seconds = EXCLUDED.avg_session_duration_seconds,
    subject_usage = EXCLUDED.subject_usage,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. Enable Row Level Security (Optional)
-- ============================================
-- Uncomment if you want RLS enabled

-- ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chat_interactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Users can view their own sessions" ON user_sessions
--   FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can view their own chat history" ON chat_interactions
--   FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can view their own question attempts" ON question_attempts
--   FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- Success Message
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Analytics database setup complete!';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  - users';
  RAISE NOTICE '  - user_sessions';
  RAISE NOTICE '  - chat_interactions';
  RAISE NOTICE '  - question_attempts';
  RAISE NOTICE '  - user_events';
  RAISE NOTICE '  - daily_metrics';
  RAISE NOTICE 'Functions created:';
  RAISE NOTICE '  - get_dau()';
  RAISE NOTICE '  - get_mau()';
  RAISE NOTICE '  - calculate_session_duration()';
  RAISE NOTICE '  - aggregate_daily_metrics()';
END $$;
