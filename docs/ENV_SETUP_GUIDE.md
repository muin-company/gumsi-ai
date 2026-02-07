# 🚀 검시AI Environment Setup Guide

**Target Time:** 10 minutes  
**Difficulty:** Easy  
**For:** ONE (post-vacation setup)

---

## ⚡ Quick Setup Checklist (5 minutes)

### Step 1: Vercel Environment Variables
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Navigate to **gumsi-ai** project
- [ ] Go to **Settings** → **Environment Variables**
- [ ] Add the following variables (get values from steps below):

| Variable Name | Source | Notes |
|--------------|--------|-------|
| `DEEPSEEK_API_KEY` | platform.deepseek.com | Start with `sk-...` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard | Looks like `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard | Public key, safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard | Secret key, never expose client-side |

- [ ] Select environments: **Production**, **Preview**, **Development** (check all)
- [ ] Click **Save**

---

## 🔑 Step 2: DeepSeek API Key

### Setup Process
- [ ] Visit [platform.deepseek.com](https://platform.deepseek.com)
- [ ] Sign up / Log in (email or GitHub)
- [ ] Go to **API Keys** section
- [ ] Click **Create New Key**
- [ ] Copy the key (starts with `sk-`) — **save it immediately, can't view again!**

### Add Credits
- [ ] Go to **Billing** section
- [ ] Click **Add Credits**
- [ ] Add **$10-20** (recommended starting amount)
- [ ] Use credit card or crypto

💡 **Tip:** DeepSeek is very cheap (~$0.28/1M tokens), $10 lasts a long time for beta testing.

---

## 🗄️ Step 3: Supabase Setup

### Create Project
- [ ] Visit [supabase.com](https://supabase.com)
- [ ] Log in / Sign up
- [ ] Click **New Project**
- [ ] Fill in:
  - **Name:** gumsi-ai (or your preference)
  - **Database Password:** Save this somewhere secure!
  - **Region:** Choose closest to your users (e.g., Seoul, Tokyo)
- [ ] Wait 2-3 minutes for project creation

### Get API Keys
- [ ] In your Supabase project, go to **Settings** (gear icon)
- [ ] Click **API** in the left sidebar
- [ ] Copy these values:

```
Project URL → NEXT_PUBLIC_SUPABASE_URL
anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
service_role → SUPABASE_SERVICE_ROLE_KEY (click "Reveal" first)
```

⚠️ **Security Note:** `service_role` key has full database access. Never expose it client-side!

### Database Schema
- [ ] Go to **SQL Editor** in Supabase
- [ ] Run the schema migration:
  - If schema file exists: Check `~/muin/gumsi-ai/supabase/migrations/` or `schema.sql`
  - Paste and run SQL in the editor
- [ ] Verify tables are created in **Table Editor**

📁 **Migration File Location:** Check `./supabase/migrations/` or `./prisma/schema.prisma` in your repo.

---

## ✅ Step 4: Verification

### Test the Setup
- [ ] Go to Vercel project → **Deployments**
- [ ] Trigger a new deployment or wait for auto-deploy
- [ ] Visit your deployed URL
- [ ] Try the main features:
  - [ ] Can you submit a search query?
  - [ ] Does DeepSeek respond?
  - [ ] Do results save to Supabase?

### Check Logs
- [ ] Vercel Dashboard → **Deployments** → Click latest → **Logs**
- [ ] Supabase → **Database** → **Logs**
- [ ] Look for errors related to API keys or connections

### Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Invalid API key` (DeepSeek) | Wrong key or no credits | Double-check key in Vercel, verify credits in DeepSeek billing |
| `supabase is not defined` | Missing public keys | Ensure `NEXT_PUBLIC_*` vars are set and deployment is re-triggered |
| `Unauthorized` (Supabase) | Wrong anon key or RLS policy | Check anon key, verify Row Level Security policies in Supabase |
| `Connection refused` | Wrong Supabase URL | Verify URL format: `https://xxx.supabase.co` |

---

## 💰 Cost Estimates

### DeepSeek API
- **Pricing:** ~$0.28 per 1M tokens (input+output combined)
- **Example Usage:**
  - 100 searches/day × 2K tokens avg = 200K tokens/day
  - Monthly cost: ~$1.70
- **Recommended:** Start with $10-20, monitor usage in platform dashboard

### Supabase
- **Free Tier Includes:**
  - 500MB database
  - 1GB file storage
  - 2GB bandwidth
  - 50,000 monthly active users
- **For Beta:** Free tier is more than sufficient
- **Upgrade Triggers:** If you exceed limits (unlikely in beta)

💡 **Total Monthly Estimate for Beta:** $2-5 (mostly DeepSeek, Supabase free)

---

## 🎯 Post-Setup Checklist

- [ ] All 4 environment variables added to Vercel
- [ ] DeepSeek has $10+ credits
- [ ] Supabase project created and schema migrated
- [ ] Test deployment successful
- [ ] Monitor logs for first 24h

---

## 📞 Need Help?

- **Vercel Docs:** [vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)
- **DeepSeek Docs:** [platform.deepseek.com/docs](https://platform.deepseek.com/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)

**Stuck?** Check MJ's notes in `~/muin/gumsi-ai/docs/` or ping the team.

---

**Last Updated:** 2026-02-07  
**Estimated Setup Time:** 10 minutes  
**Status:** Ready for ONE's return 🏖️ → 🚀
