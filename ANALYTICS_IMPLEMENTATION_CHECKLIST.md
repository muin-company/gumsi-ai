# 검시AI Analytics Implementation Checklist

Quick reference for implementing analytics and TAM validation.

## 📋 Pre-Implementation

### Environment Setup
- [ ] Have Supabase project created
- [ ] Have `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
- [ ] Have `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- [ ] Have `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (for admin operations)

### Install Dependencies
```bash
npm install @supabase/supabase-js
npm install -D tsx  # For running test scripts
```

## 🗄️ Database Setup (1 hour)

### Step 1: Create Tables
- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Copy contents of `scripts/setup-analytics-db.sql`
- [ ] Run the script
- [ ] Verify all tables created:
  - [ ] `users`
  - [ ] `user_sessions`
  - [ ] `chat_interactions`
  - [ ] `question_attempts`
  - [ ] `user_events`
  - [ ] `daily_metrics`

### Step 2: Verify Functions
- [ ] Test `get_dau()` in SQL Editor: `SELECT * FROM get_dau();`
- [ ] Test `get_mau()` in SQL Editor: `SELECT * FROM get_mau();`
- [ ] Test `aggregate_daily_metrics()`: `SELECT aggregate_daily_metrics();`

## 🔌 Integration (2-3 hours)

### Step 3: Update Signup Flow
- [ ] Replace `app/(auth)/signup/page.tsx` localStorage logic with Supabase Auth
- [ ] Add event tracking on successful signup
- [ ] Test signup flow
- [ ] Verify user appears in Supabase Auth + `users` table

**Code changes needed:**
```typescript
// In app/(auth)/signup/page.tsx
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

// Replace handleSubmit with:
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { name } },
});

if (data.user) {
  await trackEvent({
    userId: data.user.id,
    eventType: 'signup',
    eventName: 'account_created',
    eventData: { name, email, source: 'web' },
  });
}
```

### Step 4: Add Session Tracking
- [ ] Add session start on login/app load
- [ ] Add session end on logout/window close
- [ ] Store session ID in localStorage for event correlation

**Add to root layout (`app/layout.tsx`):**
```typescript
'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { startSession, endSession, setSessionId, detectDeviceType } from '@/lib/analytics';

export default function RootLayout({ children }) {
  useEffect(() => {
    let sessionId: string | null = null;

    async function initSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        sessionId = await startSession(user.id, {
          deviceType: detectDeviceType(navigator.userAgent),
          userAgent: navigator.userAgent,
        });
        if (sessionId) setSessionId(sessionId);
      }
    }

    initSession();

    return () => {
      if (sessionId) endSession(sessionId);
    };
  }, []);

  return <html>{children}</html>;
}
```

### Step 5: Track Chat Interactions
- [ ] Add tracking in `components/chat/ChatInterface.tsx`
- [ ] Track on every AI response
- [ ] Include subject, response time, message content

**Add to ChatInterface.tsx:**
```typescript
import { trackChatInteraction } from '@/lib/analytics';
import { getSessionId } from '@/lib/analytics';

// In handleSend, after getting AI response:
const startTime = Date.now();
// ... fetch AI response ...
const responseTimeMs = Date.now() - startTime;

const { data: { user } } = await supabase.auth.getUser();
if (user) {
  await trackChatInteraction({
    userId: user.id,
    sessionId: getSessionId() || undefined,
    subject: subject || 'general',
    userMessage: content,
    aiResponse: assistantMessage,
    responseTimeMs,
  });
}
```

### Step 6: Track Question Attempts
- [ ] Add tracking in question attempt handler
- [ ] Track question ID, subject, correctness, time spent

**Add to question submission handler:**
```typescript
import { trackQuestionAttempt } from '@/lib/analytics';

await trackQuestionAttempt({
  userId: user.id,
  sessionId: getSessionId() || undefined,
  questionId: question.id,
  subject: question.subject,
  difficulty: question.difficulty,
  topic: question.topic,
  userAnswer,
  isCorrect: checkAnswer(userAnswer, question.correctAnswer),
  timeSpentSeconds: Math.floor((Date.now() - startTime) / 1000),
});
```

## 🧪 Testing (30 minutes)

### Step 7: Run Test Script
```bash
npx tsx scripts/test-analytics.ts
```

**Expected output:**
- ✅ Test user created
- ✅ Event tracked
- ✅ Session started and ended
- ✅ Chat interaction tracked
- ✅ Question attempt tracked
- ✅ DAU/MAU functions work

### Step 8: Manual Testing
- [ ] Sign up a new user → Check `users` table
- [ ] Use AI tutor → Check `chat_interactions` table
- [ ] Answer a question → Check `question_attempts` table
- [ ] Check session recorded in `user_sessions` table

## 📊 Dashboard (2-3 hours)

### Step 9: Create Admin Dashboard
- [ ] Create `app/(admin)/analytics/page.tsx`
- [ ] Add authentication check (admin only)
- [ ] Display key metrics:
  - [ ] Total users
  - [ ] DAU
  - [ ] MAU
  - [ ] Top subjects (last 30d)
  - [ ] Retention rates

### Step 10: Set Up Daily Aggregation
- [ ] Create cron job to run `aggregate_daily_metrics()` nightly
- [ ] Or use Supabase Functions (if available)
- [ ] Or Vercel Cron Jobs

**Vercel cron example (`vercel.json`):**
```json
{
  "crons": [
    {
      "path": "/api/cron/aggregate-metrics",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**API route (`app/api/cron/aggregate-metrics/route.ts`):**
```typescript
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();
  await supabase.rpc('aggregate_daily_metrics');
  return Response.json({ success: true });
}
```

## 🚀 Post-Launch Monitoring

### Week 1-2: Foundation Metrics
- [ ] Track daily signups
- [ ] Monitor DAU growth
- [ ] Check for errors in analytics logging

### Week 3-4: Engagement Metrics
- [ ] Calculate 7-day retention
- [ ] Identify most popular subjects
- [ ] Analyze session durations
- [ ] Find drop-off points

### Month 2+: Optimization
- [ ] Run cohort analyses
- [ ] A/B test features based on usage data
- [ ] Optimize for high-engagement subjects
- [ ] Improve retention for at-risk users

## 📈 TAM Validation Milestones

Track these in `daily_metrics` and review weekly:

| Metric | Target (Week 4) | TAM Validation |
|--------|-----------------|----------------|
| Total Signups | 100+ | Market interest |
| DAU/MAU | 20%+ | Daily habit |
| 7-day retention | 40%+ | Core value |
| Avg session (min) | 15+ | Engagement |
| Math usage | Top 3 | Subject demand |

## 🔍 SQL Queries for Reports

### Weekly Report
```sql
-- Last 7 days summary
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) as total_interactions
FROM chat_interactions
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Subject Popularity
```sql
-- Top subjects this week
SELECT 
  subject,
  COUNT(*) as uses,
  COUNT(DISTINCT user_id) as unique_users
FROM chat_interactions
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY subject
ORDER BY uses DESC;
```

### User Segments
```sql
-- Active vs inactive users
WITH user_activity AS (
  SELECT 
    user_id,
    COUNT(DISTINCT DATE(session_start)) as active_days
  FROM user_sessions
  WHERE session_start >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY user_id
)
SELECT 
  CASE 
    WHEN active_days >= 20 THEN 'Power'
    WHEN active_days >= 10 THEN 'Regular'
    WHEN active_days >= 3 THEN 'Casual'
    ELSE 'At Risk'
  END as segment,
  COUNT(*) as users
FROM user_activity
GROUP BY segment;
```

## ✅ Definition of Done

- [ ] All database tables created
- [ ] Test script passes
- [ ] Signup tracking works
- [ ] Chat interactions logged
- [ ] Question attempts logged
- [ ] Admin dashboard shows metrics
- [ ] Daily aggregation scheduled
- [ ] Documentation complete
- [ ] Team trained on analytics queries

## 🆘 Troubleshooting

### Tables not created
- Check Supabase logs for SQL errors
- Verify permissions (service role key needed)
- Run migration script in parts

### Events not tracking
- Check browser console for errors
- Verify Supabase client initialized
- Check RLS policies if enabled
- Verify user is authenticated

### Dashboard shows 0 data
- Check if tables have data: `SELECT COUNT(*) FROM chat_interactions;`
- Verify RPC functions: `SELECT * FROM get_dau();`
- Check date ranges in queries

---

**Need help?** Check `ANALYTICS_SETUP.md` for detailed documentation.
