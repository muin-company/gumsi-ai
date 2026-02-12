# 검시AI Analytics & TAM Validation Setup

**Created:** 2026-02-08  
**Purpose:** Track user behavior, validate TAM, and measure product-market fit

## 📊 Overview

This document outlines the complete analytics setup for 검시AI to validate our Total Addressable Market (TAM) hypothesis and track key product metrics.

### Target Metrics
1. **User Signup Tracking** - Track registrations and sources
2. **DAU/MAU** - Daily/Monthly Active Users
3. **Feature Usage** - Which subjects/topics students use most
4. **Retention** - 7-day and 30-day retention rates
5. **Engagement** - Session length, questions asked, problem-solving patterns

---

## 🗄️ Database Schema

### Supabase Tables

#### 1. `users` table (if not exists)
```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  plan TEXT DEFAULT 'free', -- 'free' or 'premium'
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_email ON users(email);
```

#### 2. `user_sessions` table
Tracks daily active users and session data.

```sql
CREATE TABLE user_sessions (
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

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_start ON user_sessions(session_start);
CREATE INDEX idx_sessions_date ON user_sessions(DATE(session_start));
```

#### 3. `chat_interactions` table
Tracks AI tutor usage by subject and topic.

```sql
CREATE TABLE chat_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  subject TEXT, -- 'korean', 'math', 'english', 'social', 'science', 'history'
  topic TEXT, -- Extracted from chat content or user selection
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  response_time_ms INTEGER, -- AI response latency
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_user_id ON chat_interactions(user_id);
CREATE INDEX idx_chat_subject ON chat_interactions(subject);
CREATE INDEX idx_chat_created_at ON chat_interactions(created_at);
CREATE INDEX idx_chat_date ON chat_interactions(DATE(created_at));
```

#### 4. `question_attempts` table
Tracks practice question usage.

```sql
CREATE TABLE question_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  question_id TEXT NOT NULL, -- from questions-sample.json
  subject TEXT NOT NULL,
  difficulty TEXT, -- 'easy', 'medium', 'hard'
  topic TEXT,
  user_answer TEXT,
  is_correct BOOLEAN,
  time_spent_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_qa_user_id ON question_attempts(user_id);
CREATE INDEX idx_qa_subject ON question_attempts(subject);
CREATE INDEX idx_qa_created_at ON question_attempts(created_at);
CREATE INDEX idx_qa_correct ON question_attempts(is_correct);
```

#### 5. `user_events` table
General event tracking for feature usage.

```sql
CREATE TABLE user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'signup', 'login', 'page_view', 'feature_click', etc.
  event_name TEXT, -- specific event (e.g., 'subject_selected', 'question_started')
  event_data JSONB, -- flexible metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_user_id ON user_events(user_id);
CREATE INDEX idx_events_type ON user_events(event_type);
CREATE INDEX idx_events_created_at ON user_events(created_at);
CREATE INDEX idx_events_date ON user_events(DATE(created_at));
```

#### 6. `daily_metrics` table
Pre-aggregated daily metrics for fast dashboard queries.

```sql
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL UNIQUE,
  dau INTEGER DEFAULT 0, -- Daily Active Users
  new_users INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_chat_messages INTEGER DEFAULT 0,
  total_questions_attempted INTEGER DEFAULT 0,
  avg_session_duration_seconds INTEGER DEFAULT 0,
  subject_usage JSONB, -- {"korean": 45, "math": 78, ...}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_daily_metrics_date ON daily_metrics(metric_date);
```

---

## 📈 SQL Queries for Analytics

### 1. DAU (Daily Active Users)

```sql
-- DAU for a specific date
SELECT 
  DATE(session_start) as date,
  COUNT(DISTINCT user_id) as dau
FROM user_sessions
WHERE DATE(session_start) = CURRENT_DATE
GROUP BY DATE(session_start);

-- DAU for last 30 days
SELECT 
  DATE(session_start) as date,
  COUNT(DISTINCT user_id) as dau
FROM user_sessions
WHERE session_start >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(session_start)
ORDER BY date DESC;
```

### 2. MAU (Monthly Active Users)

```sql
-- MAU for current month
SELECT 
  COUNT(DISTINCT user_id) as mau
FROM user_sessions
WHERE session_start >= DATE_TRUNC('month', CURRENT_DATE)
  AND session_start < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';

-- MAU trend (last 6 months)
SELECT 
  DATE_TRUNC('month', session_start) as month,
  COUNT(DISTINCT user_id) as mau
FROM user_sessions
WHERE session_start >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', session_start)
ORDER BY month DESC;
```

### 3. Feature Usage by Subject

```sql
-- Most used subjects (chat interactions)
SELECT 
  subject,
  COUNT(*) as interaction_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(response_time_ms) as avg_response_time_ms
FROM chat_interactions
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  AND subject IS NOT NULL
GROUP BY subject
ORDER BY interaction_count DESC;

-- Most attempted question subjects
SELECT 
  subject,
  COUNT(*) as attempts,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(CASE WHEN is_correct THEN 1.0 ELSE 0.0 END) * 100 as success_rate
FROM question_attempts
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY subject
ORDER BY attempts DESC;
```

### 4. Topic Popularity

```sql
-- Most popular topics in chat
SELECT 
  subject,
  topic,
  COUNT(*) as mentions,
  COUNT(DISTINCT user_id) as unique_users
FROM chat_interactions
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  AND topic IS NOT NULL
GROUP BY subject, topic
ORDER BY mentions DESC
LIMIT 20;
```

### 5. 7-Day Retention

```sql
-- 7-day retention cohort analysis
WITH cohorts AS (
  SELECT 
    user_id,
    DATE(MIN(created_at)) as signup_date
  FROM users
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY user_id
),
activity AS (
  SELECT DISTINCT
    c.signup_date,
    c.user_id,
    DATE(s.session_start) as activity_date
  FROM cohorts c
  LEFT JOIN user_sessions s ON c.user_id = s.user_id
  WHERE s.session_start >= c.signup_date
    AND s.session_start < c.signup_date + INTERVAL '8 days'
)
SELECT 
  signup_date,
  COUNT(DISTINCT user_id) as cohort_size,
  COUNT(DISTINCT CASE 
    WHEN activity_date >= signup_date + INTERVAL '7 days' 
    THEN user_id 
  END) as retained_users,
  ROUND(
    COUNT(DISTINCT CASE 
      WHEN activity_date >= signup_date + INTERVAL '7 days' 
      THEN user_id 
    END)::NUMERIC / COUNT(DISTINCT user_id) * 100, 
    2
  ) as retention_rate_7d
FROM activity
GROUP BY signup_date
ORDER BY signup_date DESC;
```

### 6. 30-Day Retention

```sql
-- 30-day retention cohort analysis
WITH cohorts AS (
  SELECT 
    user_id,
    DATE(MIN(created_at)) as signup_date
  FROM users
  WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY user_id
),
activity AS (
  SELECT DISTINCT
    c.signup_date,
    c.user_id,
    DATE(s.session_start) as activity_date
  FROM cohorts c
  LEFT JOIN user_sessions s ON c.user_id = s.user_id
  WHERE s.session_start >= c.signup_date
    AND s.session_start < c.signup_date + INTERVAL '31 days'
)
SELECT 
  signup_date,
  COUNT(DISTINCT user_id) as cohort_size,
  COUNT(DISTINCT CASE 
    WHEN activity_date >= signup_date + INTERVAL '30 days' 
    THEN user_id 
  END) as retained_users,
  ROUND(
    COUNT(DISTINCT CASE 
      WHEN activity_date >= signup_date + INTERVAL '30 days' 
      THEN user_id 
    END)::NUMERIC / COUNT(DISTINCT user_id) * 100, 
    2
  ) as retention_rate_30d
FROM activity
GROUP BY signup_date
ORDER BY signup_date DESC;
```

### 7. Engagement Metrics

```sql
-- Average session duration and questions per user
SELECT 
  DATE(session_start) as date,
  COUNT(DISTINCT user_id) as active_users,
  AVG(duration_seconds) as avg_session_duration_sec,
  COUNT(*) as total_sessions,
  ROUND(AVG(duration_seconds) / 60.0, 2) as avg_session_duration_min
FROM user_sessions
WHERE session_start >= CURRENT_DATE - INTERVAL '30 days'
  AND duration_seconds IS NOT NULL
GROUP BY DATE(session_start)
ORDER BY date DESC;

-- Questions asked per user
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) as total_questions,
  ROUND(COUNT(*)::NUMERIC / COUNT(DISTINCT user_id), 2) as avg_questions_per_user
FROM chat_interactions
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 8. User Segmentation

```sql
-- User activity segments (power users, casual, churned)
WITH user_activity AS (
  SELECT 
    user_id,
    COUNT(DISTINCT DATE(session_start)) as active_days_30d,
    MAX(session_start) as last_active,
    COUNT(*) as total_sessions
  FROM user_sessions
  WHERE session_start >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY user_id
)
SELECT 
  CASE 
    WHEN active_days_30d >= 20 THEN 'Power User'
    WHEN active_days_30d >= 10 THEN 'Regular User'
    WHEN active_days_30d >= 3 THEN 'Casual User'
    ELSE 'At Risk'
  END as segment,
  COUNT(*) as user_count,
  AVG(active_days_30d) as avg_active_days,
  AVG(total_sessions) as avg_sessions
FROM user_activity
GROUP BY 
  CASE 
    WHEN active_days_30d >= 20 THEN 'Power User'
    WHEN active_days_30d >= 10 THEN 'Regular User'
    WHEN active_days_30d >= 3 THEN 'Casual User'
    ELSE 'At Risk'
  END
ORDER BY user_count DESC;
```

---

## 🔧 Implementation Guide

### Step 1: Set Up Supabase Tables

1. Log in to Supabase dashboard
2. Go to SQL Editor
3. Run the schema creation scripts above in order
4. Verify tables are created under "Table Editor"

### Step 2: Install Supabase Client (if not already done)

```bash
npm install @supabase/supabase-js
```

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client (for API routes)
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

### Step 3: Update Signup Page

Replace localStorage with Supabase in `app/(auth)/signup/page.tsx`:

```typescript
import { supabase } from '@/lib/supabase';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("비밀번호가 일치하지 않습니다");
    return;
  }

  try {
    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    // Track signup event
    if (data.user) {
      await supabase.from('user_events').insert({
        user_id: data.user.id,
        event_type: 'signup',
        event_name: 'account_created',
        event_data: {
          name,
          email,
          source: 'web',
        },
      });
    }

    alert("베타 신청이 완료되었습니다! 이메일을 확인해주세요.");
    window.location.href = "/";
  } catch (err: any) {
    setError(err.message || "신청 중 오류가 발생했습니다.");
    console.error("Signup error:", err);
  }
};
```

### Step 4: Create Analytics Utility

Create `lib/analytics.ts`:

```typescript
import { supabase } from './supabase';

export interface AnalyticsEvent {
  userId?: string;
  sessionId?: string;
  eventType: string;
  eventName?: string;
  eventData?: Record<string, any>;
}

export async function trackEvent(event: AnalyticsEvent) {
  try {
    const { error } = await supabase.from('user_events').insert({
      user_id: event.userId,
      session_id: event.sessionId,
      event_type: event.eventType,
      event_name: event.eventName,
      event_data: event.eventData,
    });

    if (error) {
      console.error('Analytics tracking error:', error);
    }
  } catch (err) {
    console.error('Analytics error:', err);
  }
}

export async function trackChatInteraction(data: {
  userId: string;
  sessionId?: string;
  subject?: string;
  topic?: string;
  userMessage: string;
  aiResponse: string;
  responseTimeMs: number;
}) {
  try {
    const { error } = await supabase.from('chat_interactions').insert(data);

    if (error) {
      console.error('Chat tracking error:', error);
    }
  } catch (err) {
    console.error('Chat tracking error:', err);
  }
}

export async function trackQuestionAttempt(data: {
  userId: string;
  sessionId?: string;
  questionId: string;
  subject: string;
  difficulty?: string;
  topic?: string;
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpentSeconds: number;
}) {
  try {
    const { error } = await supabase.from('question_attempts').insert(data);

    if (error) {
      console.error('Question tracking error:', error);
    }
  } catch (err) {
    console.error('Question tracking error:', err);
  }
}

export async function startSession(userId: string, deviceInfo: {
  deviceType: string;
  userAgent: string;
  ipAddress?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: userId,
        ...deviceInfo,
      })
      .select()
      .single();

    if (error) {
      console.error('Session start error:', error);
      return null;
    }

    return data.id;
  } catch (err) {
    console.error('Session start error:', err);
    return null;
  }
}

export async function endSession(sessionId: string) {
  try {
    const { error } = await supabase
      .from('user_sessions')
      .update({
        session_end: new Date().toISOString(),
        duration_seconds: supabase.rpc('calculate_session_duration', {
          session_id: sessionId,
        }),
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Session end error:', error);
    }
  } catch (err) {
    console.error('Session end error:', err);
  }
}
```

### Step 5: Integrate Analytics into Chat

Update `components/chat/ChatInterface.tsx`:

```typescript
import { trackChatInteraction } from '@/lib/analytics';
import { supabase } from '@/lib/supabase';

// In handleSend function, after getting AI response:
const startTime = Date.now();

// ... existing fetch logic ...

const responseTimeMs = Date.now() - startTime;

// Get current user
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  await trackChatInteraction({
    userId: user.id,
    subject: subject || 'general',
    userMessage: content,
    aiResponse: assistantMessage,
    responseTimeMs,
  });
}
```

### Step 6: Integrate Analytics into Questions

Update `app/(main)/questions/[id]/page.tsx` to track attempts when user submits answer.

---

## 📊 Admin Dashboard

### Option A: Simple SQL-Based Dashboard

Create `app/(admin)/analytics/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Metrics {
  dau: number;
  mau: number;
  totalUsers: number;
  retention7d: number;
  retention30d: number;
  topSubjects: Array<{ subject: string; count: number }>;
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    try {
      // Fetch DAU
      const { data: dauData } = await supabase.rpc('get_dau');
      
      // Fetch MAU
      const { data: mauData } = await supabase.rpc('get_mau');
      
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch top subjects
      const { data: subjectData } = await supabase
        .from('chat_interactions')
        .select('subject')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const subjectCounts = (subjectData || []).reduce((acc, { subject }) => {
        if (subject) {
          acc[subject] = (acc[subject] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const topSubjects = Object.entries(subjectCounts)
        .map(([subject, count]) => ({ subject, count }))
        .sort((a, b) => b.count - a.count);

      setMetrics({
        dau: dauData?.[0]?.dau || 0,
        mau: mauData?.[0]?.mau || 0,
        totalUsers: totalUsers || 0,
        retention7d: 0, // Implement via RPC function
        retention30d: 0, // Implement via RPC function
        topSubjects,
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">검시AI Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Total Users" value={metrics?.totalUsers || 0} />
        <MetricCard title="DAU" value={metrics?.dau || 0} />
        <MetricCard title="MAU" value={metrics?.mau || 0} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Top Subjects (30d)</h2>
        <div className="space-y-2">
          {metrics?.topSubjects.map(({ subject, count }) => (
            <div key={subject} className="flex justify-between items-center">
              <span className="font-medium">{subject}</span>
              <span className="text-gray-600">{count} interactions</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  );
}
```

### Option B: Use Supabase Analytics (if available)

Supabase includes built-in analytics. Check if it's enabled:

1. Go to Supabase Dashboard → Analytics
2. View pre-built charts for API usage, database performance
3. For custom metrics, use the SQL queries provided above in the "Reports" section

---

## 🎯 TAM Validation Metrics

### Key Questions to Answer

1. **Who are our users?**
   - Age distribution (infer from signup patterns)
   - Geographic location (IP-based)
   - Device usage (mobile vs desktop)

2. **How do they use the product?**
   - Most popular subjects (validates curriculum focus)
   - Peak usage times (helps with scaling)
   - Average session length (engagement indicator)

3. **Are they retained?**
   - 7-day retention (early engagement)
   - 30-day retention (product-market fit)
   - Churn rate (identify drop-off points)

4. **What features drive value?**
   - Chat vs questions (which is more engaging?)
   - Subject preference (where to invest content?)
   - Success rate on questions (difficulty calibration)

### TAM Validation Milestones

| Milestone | Target | Validates |
|-----------|--------|-----------|
| 100 signups | Week 1-2 | Initial interest |
| 20% DAU/MAU | Week 3-4 | Daily habit formation |
| 40% 7-day retention | Week 4 | Core value delivered |
| 25% 30-day retention | Month 1-2 | Product-market fit |
| 1,000 active users | Month 3 | Scalability to 58K TAM |

---

## 🔒 Privacy & Compliance

### Data Collection Guidelines

1. **Anonymous by default**: Don't collect PII unless necessary
2. **Opt-in for detailed tracking**: Allow users to disable analytics
3. **Data retention**: Keep raw events for 90 days, aggregated data indefinitely
4. **GDPR compliance**: Provide data export and deletion on request

### Privacy Policy Updates

Add to privacy policy:
- What data is collected (usage patterns, not content)
- How it's used (product improvement, not selling)
- User rights (opt-out, data deletion)

---

## 🚀 Next Steps

### Week 1: Foundation
- [ ] Create Supabase tables
- [ ] Install Supabase client
- [ ] Update signup to use Supabase Auth
- [ ] Add basic event tracking (signup, login, page views)

### Week 2: Core Analytics
- [ ] Implement session tracking
- [ ] Track chat interactions
- [ ] Track question attempts
- [ ] Create SQL functions for DAU/MAU

### Week 3: Dashboard
- [ ] Build admin analytics page
- [ ] Add retention queries
- [ ] Implement subject usage charts
- [ ] Create daily aggregation cron job

### Week 4: Optimization
- [ ] Add indexes for performance
- [ ] Set up daily_metrics aggregation
- [ ] Create alert system for anomalies
- [ ] Document insights and iterate

---

## 📝 Notes

### Supabase RPC Functions

Create these PostgreSQL functions for easier queries:

```sql
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
  WHERE session_start >= DATE_TRUNC('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

-- Calculate session duration
CREATE OR REPLACE FUNCTION calculate_session_duration(session_id UUID)
RETURNS INTEGER AS $$
DECLARE
  duration INTEGER;
BEGIN
  SELECT EXTRACT(EPOCH FROM (session_end - session_start))::INTEGER
  INTO duration
  FROM user_sessions
  WHERE id = session_id;
  
  RETURN duration;
END;
$$ LANGUAGE plpgsql;
```

### Testing Analytics

Create a test script `scripts/test-analytics.ts`:

```typescript
import { supabase } from '../lib/supabase';
import { trackEvent, trackChatInteraction } from '../lib/analytics';

async function testAnalytics() {
  console.log('Testing analytics setup...');

  // Test event tracking
  await trackEvent({
    userId: 'test-user-123',
    eventType: 'test',
    eventName: 'analytics_test',
    eventData: { source: 'script' },
  });

  console.log('✅ Event tracked');

  // Test chat interaction
  await trackChatInteraction({
    userId: 'test-user-123',
    subject: 'math',
    userMessage: 'What is 2+2?',
    aiResponse: 'The answer is 4.',
    responseTimeMs: 250,
  });

  console.log('✅ Chat interaction tracked');

  // Verify data
  const { data: events } = await supabase
    .from('user_events')
    .select('*')
    .eq('user_id', 'test-user-123')
    .order('created_at', { ascending: false })
    .limit(1);

  console.log('Latest event:', events?.[0]);

  const { data: chats } = await supabase
    .from('chat_interactions')
    .select('*')
    .eq('user_id', 'test-user-123')
    .order('created_at', { ascending: false })
    .limit(1);

  console.log('Latest chat:', chats?.[0]);

  console.log('✅ All tests passed!');
}

testAnalytics();
```

Run with:
```bash
npx tsx scripts/test-analytics.ts
```

---

## 📚 References

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Cohort Analysis Guide](https://mode.com/sql-tutorial/cohort-analysis/)
- [Product Analytics Best Practices](https://amplitude.com/blog/product-analytics)

---

**Last Updated:** 2026-02-08  
**Maintained by:** MJ (COO)  
**Status:** Ready for Implementation
