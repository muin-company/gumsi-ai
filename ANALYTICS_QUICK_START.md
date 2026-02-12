# 검시AI Analytics - Quick Start Guide

**TL;DR:** Complete analytics setup in 3 steps, ~2 hours total.

## 🚀 Super Quick Setup (Minimal Viable Analytics)

If you need analytics running ASAP for beta launch:

### 1. Database Setup (15 min)
```bash
# 1. Copy the SQL script
cat scripts/setup-analytics-db.sql

# 2. Go to Supabase Dashboard → SQL Editor
# 3. Paste and run the script
# 4. Verify: Table Editor shows 6 new tables
```

### 2. Install & Configure (10 min)
```bash
# Install Supabase client
npm install @supabase/supabase-js

# Add to .env.local (get from Supabase Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # For admin operations
```

### 3. Add Tracking Code (30 min)

**A) Update Signup Page** (`app/(auth)/signup/page.tsx`)
```typescript
// Replace the entire handleSubmit function with:
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("비밀번호가 일치하지 않습니다");
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) throw error;

    if (data.user) {
      await trackEvent({
        userId: data.user.id,
        eventType: 'signup',
        eventName: 'account_created',
        eventData: { name, email, source: 'web' },
      });
    }

    alert("회원가입이 완료되었습니다!");
    window.location.href = "/";
  } catch (err: any) {
    setError(err.message || "오류가 발생했습니다.");
  }
};
```

**B) Track Chat Messages** (Add to `components/chat/ChatInterface.tsx`)
```typescript
import { trackChatInteraction } from '@/lib/analytics';
import { supabase } from '@/lib/supabase';

// In handleSend, after getting AI response:
const { data: { user } } = await supabase.auth.getUser();
if (user) {
  await trackChatInteraction({
    userId: user.id,
    subject: subject || 'general',
    userMessage: content,
    aiResponse: assistantMessage,
    responseTimeMs: Date.now() - startTime, // add startTime before fetch
  });
}
```

### 4. Test It (5 min)
```bash
# Run test script
npx tsx scripts/test-analytics.ts

# Should see:
# ✅ Test user created
# ✅ Event tracked
# ✅ Session started
# ✅ Chat interaction tracked
# ✅ All tests passed!
```

### 5. View Analytics (10 min)

**Quick SQL Queries** (Run in Supabase SQL Editor):

```sql
-- Total signups today
SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURRENT_DATE;

-- DAU (Daily Active Users)
SELECT * FROM get_dau();

-- Top subjects used
SELECT subject, COUNT(*) as uses 
FROM chat_interactions 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY subject 
ORDER BY uses DESC;
```

---

## 📊 What You Get

After setup, you can track:

✅ **User Signups** - Who's joining, when, from where  
✅ **Daily Active Users** - How many use it each day  
✅ **Feature Usage** - Which subjects students use most  
✅ **Engagement** - How long sessions last, questions asked  

---

## 🎯 For TAM Validation

Key metrics to watch (check weekly):

| Metric | Where to Find | TAM Signal |
|--------|--------------|------------|
| Total Users | `SELECT COUNT(*) FROM users;` | Market size |
| DAU/MAU Ratio | `SELECT * FROM get_dau();` / `get_mau();` | Stickiness |
| Chat/User | `SELECT COUNT(*) / COUNT(DISTINCT user_id) FROM chat_interactions;` | Engagement |
| Top Subject | `SELECT subject, COUNT(*) FROM chat_interactions GROUP BY subject;` | Product focus |

**Target for Week 4:** 100 users, 20% DAU/MAU, 40% 7-day retention

---

## 🔍 View Data in Supabase

Instead of building a dashboard right away:

1. Go to Supabase Dashboard → Table Editor
2. Click each table to browse data:
   - `users` - All registered users
   - `user_sessions` - Every session
   - `chat_interactions` - All AI conversations
   - `question_attempts` - Practice questions answered

3. Use SQL Editor for queries (see `ANALYTICS_SETUP.md` for more)

---

## 🚨 Troubleshooting

### "Supabase client not found"
```bash
npm install @supabase/supabase-js
```

### "Table doesn't exist"
- Run `scripts/setup-analytics-db.sql` in Supabase SQL Editor
- Check Table Editor to verify tables created

### "No data showing up"
- Check browser console for errors
- Verify user is logged in: `const { data } = await supabase.auth.getUser();`
- Check Supabase logs for failed inserts

### "Permission denied"
- RLS (Row Level Security) might be blocking writes
- Temporarily disable RLS for testing (re-enable in production!)

---

## 📈 Next Steps

**Week 1:** Basic tracking (signup, chat, questions)  
**Week 2:** Add session tracking, improve accuracy  
**Week 3:** Build simple dashboard (`app/(admin)/analytics/page.tsx.example`)  
**Week 4:** Add retention cohorts, user segmentation  

---

## 📚 Full Documentation

- **Detailed Setup:** `ANALYTICS_SETUP.md`
- **Implementation Checklist:** `ANALYTICS_IMPLEMENTATION_CHECKLIST.md`
- **Test Script:** `scripts/test-analytics.ts`
- **Database Schema:** `scripts/setup-analytics-db.sql`

---

## 💡 Pro Tips

1. **Start simple** - Track signups and chats first, add complexity later
2. **Test early** - Run test script before beta launch
3. **Daily checks** - Review data daily for first 2 weeks to catch issues
4. **Aggregate nightly** - Run `aggregate_daily_metrics()` to pre-compute stats
5. **Protect admin routes** - Add auth middleware to analytics dashboard

---

**Questions?** Check `ANALYTICS_SETUP.md` or test with `scripts/test-analytics.ts`

**Ready to launch?** ✅ Run through `ANALYTICS_IMPLEMENTATION_CHECKLIST.md`
