# AuthorStack - CONTEXT.md

## 🎯 PROJECT OVERVIEW

**AuthorStack** is an all-in-one SaaS dashboard for indie authors to manage their book business. Think "Stripe Dashboard meets ConvertKit" but specifically for book sales, launches, and marketing.

**Core Value Prop:** Stop logging into 10 different platforms. One dashboard to track sales, plan launches, monitor competitors, and optimize marketing.

**Target Users:** 
- Self-published authors selling on Amazon KDP, Gumroad, Apple Books, etc.
- Authors frustrated with fragmented data across platforms
- Writers who want to treat their books like a business but hate spreadsheets

**Pricing Strategy:**
- **Free Tier:** Sales dashboard (1 book, 1 platform), basic launch checklist
- **Pro Tier ($19/month):** Unlimited books, all platforms, competitor tracking, A/B testing, email alerts
- **Enterprise Tier ($49/month):** Custom integrations, priority support, bulk operations

---

## 🏗️ TECH STACK

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Charts:** Recharts or Chart.js
- **State Management:** React Context + TanStack Query for server state
- **Auth:** Supabase Auth

### Backend
- **Database:** Supabase (Postgres) - Free tier: 500MB database, 2GB bandwidth/month
- **API:** Next.js API routes (serverless functions on Vercel)
- **File Storage:** Supabase Storage (for cover images, exports)
- **Caching:** Upstash Redis - Free tier: 10K commands/day
- **Email:** Resend - Free tier: 100 emails/day
- **Cron Jobs:** Vercel Cron or Upstash QStash

### Third-Party APIs
- **Amazon KDP:** Web scraping (no official API) - use Puppeteer/Playwright
- **Gumroad:** Official API (sales data)
- **Apple Books:** iTunes Connect API (if available)
- **Whop:** For payments + subscription management

### DevOps
- **Hosting:** Vercel (free tier: unlimited sites, 100GB bandwidth)
- **Monitoring:** Sentry (error tracking)
- **Analytics:** PostHog or Plausible

---

## 📦 CORE FEATURES BREAKDOWN

### **FEATURE 1: Unified Sales Dashboard** 
*Priority: MVP / Critical*

**What it does:**
- Aggregates book sales from Amazon KDP, Gumroad, Apple Books, Whop into one dashboard
- Shows: Total revenue, units sold, page reads (KDP), daily/weekly/monthly trends
- Visual charts: Revenue over time, sales by platform, top-performing books

**Why authors will pay:**
- Currently have to log into 3-5 platforms daily to check sales
- Data is fragmented, hard to see overall picture
- Amazon reports are confusing and delayed

**Technical Implementation:**
```
Database Schema:
- users (id, email, subscription_tier, created_at)
- books (id, user_id, title, isbn, cover_url, platforms[])
- sales_data (id, book_id, platform, date, units_sold, revenue, currency)
- platform_connections (id, user_id, platform_name, api_key/credentials, last_synced)

API Integration Flow:
1. User connects platform (OAuth or API key)
2. Cron job runs daily: fetch sales data from each platform
3. Store in sales_data table
4. Dashboard queries aggregated data with SQL
5. Cache results in Redis (1 hour TTL)

Key Endpoints:
- POST /api/platforms/connect - Connect new platform
- GET /api/dashboard/overview - Get aggregated sales data
- GET /api/dashboard/charts - Get time-series data for charts
- POST /api/platforms/sync - Manually trigger sync
```

**UI Components:**
- Revenue card (total, today, this week, this month)
- Sales chart (line graph, filterable by date range)
- Platform breakdown (pie chart or cards)
- Book performance table (sortable by revenue, units)
- Sync status indicator (last synced time, "Sync Now" button)

---

### **FEATURE 2: Launch Checklist & Timeline**
*Priority: MVP / High*

**What it does:**
- Pre-built checklist for book launches (30/60/90 day plans)
- Automated email reminders: "3 days until launch - have you done X?"
- Task tracking: Mark complete, add custom tasks, reorder
- Templates by genre (fiction launch vs. non-fiction different)

**Why authors will pay:**
- Launches are overwhelming - easy to forget critical steps
- Authors miss optimal launch windows due to poor planning
- Proven checklists increase launch success dramatically

**Technical Implementation:**
```
Database Schema:
- launch_checklists (id, book_id, launch_date, template_id, status)
- checklist_tasks (id, checklist_id, task_name, description, due_date, completed, order)
- checklist_templates (id, name, genre, tasks_json)

Business Logic:
1. Author creates launch, sets date
2. System generates tasks from template (adjusts dates relative to launch)
3. Cron job runs daily: check for tasks due soon, send reminder emails
4. Author marks tasks complete via UI
5. Progress bar shows completion percentage

Key Endpoints:
- POST /api/launches/create - Create new launch with template
- GET /api/launches/:id - Get launch with all tasks
- PATCH /api/launches/:id/tasks/:taskId - Mark task complete
- POST /api/launches/:id/tasks - Add custom task
- GET /api/templates - List available templates

Email Triggers (via Resend):
- 30 days before: "Launch planning starts now"
- 7 days before: "Final prep checklist"
- 1 day before: "Launch day tomorrow!"
- Launch day: "Your book is live - here's what to do"
- 3 days after: "Post-launch optimization tips"
```

**Pre-built Templates:**
- Fiction Launch (ARC readers, cover reveal, pre-orders, launch day blitz)
- Non-Fiction Launch (beta readers, testimonials, media outreach, SEO)
- Minimal Launch (for authors with existing audience)
- Re-launch (for updating existing books)

**UI Components:**
- Timeline view (visual calendar of tasks)
- Task list (checkbox, due date, description)
- Progress bar (X/Y tasks complete)
- Template selector during creation
- Email notification toggle per task

---

### **FEATURE 3: Competitor Price Tracking**
*Priority: High Value / Pro Tier*

**What it does:**
- Track competitor book prices (Amazon, Apple Books, Kobo)
- Get alerts when competitors change prices
- See genre pricing trends (average price in your category)
- Suggest optimal pricing based on market data

**Why authors will pay:**
- Pricing is HUGE for book sales (wrong price = invisible)
- Competitors drop prices, you lose sales without knowing
- No easy way to monitor 10-20 competitor books manually

**Technical Implementation:**
```
Database Schema:
- tracked_competitors (id, user_id, book_asin, title, author, genre)
- price_history (id, competitor_id, platform, price, currency, checked_at)
- price_alerts (id, user_id, competitor_id, alert_type, triggered_at)

Scraping Logic:
1. Cron job runs every 6 hours: scrape prices from Amazon/Apple Books
2. Compare new price to last recorded price
3. If changed: store new price, trigger alert if user subscribed
4. Cache genre averages in Redis (24 hour TTL)

Key Endpoints:
- POST /api/competitors/track - Add competitor book
- GET /api/competitors - List tracked competitors with current prices
- GET /api/competitors/:id/history - Get price history chart data
- GET /api/insights/genre-pricing - Get genre pricing trends
- PATCH /api/alerts/settings - Configure alert preferences

Alert Types:
- Price drop (competitor lowered price)
- Price increase (competitor raised price)
- Below average (your price higher than genre average)
- Trend alert (genre average changed significantly)
```

**UI Components:**
- Competitor list (book, author, current price, last change)
- Price history chart per competitor
- Genre pricing insights card (average, median, your position)
- Alert settings panel
- "Add Competitor" modal (search by title/ASIN)

---

### **FEATURE 4: A/B Testing for Book Metadata**
*Priority: Pro Tier / High Value*

**What it does:**
- Test different book covers, titles, descriptions
- Generate unique tracking links for each variant
- See which variant drives more clicks/sales
- Statistical significance calculator

**Why authors will pay:**
- Book covers make or break sales (proven fact)
- Authors spend $500+ on covers without knowing if they work
- No easy way to test before committing

**Technical Implementation:**
```
Database Schema:
- ab_tests (id, book_id, test_type, status, started_at, ended_at)
- test_variants (id, test_id, variant_name, image_url, text_content, weight)
- test_events (id, test_id, variant_id, event_type, timestamp, metadata)

Tracking Flow:
1. Author creates test (upload 2-3 cover images or descriptions)
2. System generates unique short URLs for each variant
3. Author shares links on social/ads
4. Pixel tracking records: impressions, clicks, conversions
5. Dashboard shows real-time results
6. Statistical calculator shows when winner is clear

Key Endpoints:
- POST /api/tests/create - Create new A/B test
- GET /api/tests/:id - Get test results
- GET /api/tests/:id/variants/:variantId/url - Get tracking URL
- POST /api/tests/:id/track - Track event (impression/click/sale)
- POST /api/tests/:id/declare-winner - End test, set winner

Tracking Implementation:
- Generate short URLs (test.authorstack.com/abc123)
- Redirect to book sales page with UTM parameters
- Track clicks via redirect
- Track conversions via webhook from sales platforms
- Use Upstash Redis to cache click counts
```

**UI Components:**
- Test creation wizard (upload variants, set goals)
- Live results dashboard (impressions, CTR, conversions per variant)
- Winner recommendation (statistical confidence indicator)
- Share links modal (copy tracking URLs)
- Test history (past tests, winning variants)

---

### **FEATURE 5: Marketing Calendar & Reminders**
*Priority: Nice-to-Have / Retention Feature*

**What it does:**
- Visual calendar of marketing activities (promotions, social posts, ads)
- Recurring reminders (weekly newsletter, monthly promo)
- Integration with launch checklist
- Export calendar to Google Calendar/iCal

**Why authors will pay:**
- Marketing is ongoing, not just launch
- Easy to forget ongoing promotions
- Consistency = success, but hard to maintain

**Technical Implementation:**
```
Database Schema:
- marketing_events (id, user_id, book_id, event_type, date, time, description, recurrence_rule)
- event_templates (id, name, event_type, default_description)

Key Endpoints:
- POST /api/calendar/events - Create marketing event
- GET /api/calendar/events?month=2024-11 - Get events for month
- PATCH /api/calendar/events/:id - Update event
- DELETE /api/calendar/events/:id - Delete event
- GET /api/calendar/export.ics - Export to iCal format

Email Reminders:
- Cron job runs daily: check for events due today/tomorrow
- Send reminder email with event details
- Include quick action buttons ("Mark Complete", "Reschedule")
```

**UI Components:**
- Month view calendar (click to add event)
- Event list (upcoming events, sortable)
- Quick add form (event type, date, notes)
- Recurring event options (weekly, monthly, custom)
- Template library (common marketing activities)

---

### **FEATURE 6: Revenue Insights & Forecasting**
*Priority: Pro Tier / Differentiation*

**What it does:**
- Predict next month's revenue based on trends
- Show best-performing marketing channels (which links drove sales)
- Calculate key metrics: Revenue per book, CAC (if tracking ads), ROI
- Export reports for taxes/accounting

**Why authors will pay:**
- Authors treat books like hobby, not business
- No visibility into what marketing actually works
- Tax time = scrambling for data

**Technical Implementation:**
```
Database Schema:
- revenue_forecasts (id, user_id, forecast_month, predicted_revenue, confidence)
- attribution_data (id, book_id, traffic_source, clicks, conversions, revenue)
- reports (id, user_id, report_type, date_range, data_json, generated_at)

Forecasting Logic:
1. Get last 3-6 months of sales data
2. Calculate trend (linear regression or moving average)
3. Factor in seasonality (holidays, genre trends)
4. Generate forecast with confidence interval
5. Cache in Redis (recalculate weekly)

Key Endpoints:
- GET /api/insights/forecast?months=3 - Get revenue forecast
- GET /api/insights/attribution - Get marketing attribution data
- GET /api/insights/metrics - Get key business metrics
- POST /api/reports/generate - Generate custom report
- GET /api/reports/:id/download - Download report PDF/CSV
```

**UI Components:**
- Forecast chart (predicted vs. actual)
- Attribution table (source, clicks, conversions, revenue)
- Key metrics cards (avg revenue/book, growth rate, etc.)
- Report builder (select date range, metrics, format)
- Export buttons (PDF, CSV, Excel)

---

## 🔐 AUTHENTICATION & USER MANAGEMENT

**Auth Flow:**
- Email/password signup via Supabase Auth
- Email verification required
- Optional: Google OAuth for faster signup
- Password reset via email

**User Roles:**
- Free tier: Limited features (1 book, 1 platform)
- Pro tier: Full features
- Admin: Dashboard for managing users, monitoring system

**Subscription Management:**
- Whop integration for payments
- Webhook handling for subscription events (created, cancelled, payment failed)
- Graceful degradation: Pro user cancels → keep data but limit access

---

## 📊 DATABASE SCHEMA (Supabase/Postgres)

```sql
-- Users (handled by Supabase Auth)
-- We extend with custom profile table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  subscription_tier TEXT DEFAULT 'free',
  whop_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Books
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT,
  isbn TEXT,
  asin TEXT,
  cover_url TEXT,
  genre TEXT,
  platforms TEXT[], -- ['amazon', 'gumroad', 'apple']
  created_at TIMESTAMP DEFAULT NOW()
);

-- Platform Connections
CREATE TABLE platform_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL, -- 'amazon', 'gumroad', etc.
  credentials JSONB, -- encrypted API keys
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sales Data
CREATE TABLE sales_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  sale_date DATE NOT NULL,
  units_sold INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  page_reads INTEGER DEFAULT 0, -- KDP specific
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(book_id, platform, sale_date)
);

-- Launch Checklists
CREATE TABLE launch_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  launch_date DATE NOT NULL,
  template_id UUID,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE checklist_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checklist_id UUID REFERENCES launch_checklists(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  task_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Competitor Tracking
CREATE TABLE tracked_competitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  book_asin TEXT NOT NULL,
  title TEXT,
  author TEXT,
  genre TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_id UUID REFERENCES tracked_competitors(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  checked_at TIMESTAMP DEFAULT NOW()
);

-- A/B Tests
CREATE TABLE ab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL, -- 'cover', 'title', 'description'
  status TEXT DEFAULT 'active',
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

CREATE TABLE test_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES ab_tests(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,
  image_url TEXT,
  text_content TEXT,
  short_url TEXT UNIQUE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0
);

-- Marketing Calendar
CREATE TABLE marketing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id),
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  description TEXT,
  recurrence_rule TEXT, -- iCal RRULE format
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sales_data_book_date ON sales_data(book_id, sale_date);
CREATE INDEX idx_price_history_competitor ON price_history(competitor_id, checked_at);
CREATE INDEX idx_marketing_events_user_date ON marketing_events(user_id, event_date);
```

---

## 🔄 CRON JOBS & BACKGROUND TASKS

**Daily Jobs (runs at 2am UTC):**
1. **Sync Sales Data** - Fetch from all connected platforms
2. **Check Competitor Prices** - Scrape and compare prices
3. **Send Task Reminders** - Email authors about due tasks
4. **Update Forecasts** - Recalculate revenue predictions
5. **Generate Daily Reports** - Summary emails for pro users

**Weekly Jobs (runs Sunday 12pm UTC):**
1. **Calculate Genre Trends** - Update pricing averages
2. **Send Weekly Digest** - Top insights, upcoming tasks
3. **Clean Old Data** - Archive data older than 2 years

**Implementation:**
- Use Vercel Cron (config in vercel.json)
- Or Upstash QStash for more reliable scheduling
- Rate limit API calls to avoid hitting platform limits
- Use Redis for job locks (prevent duplicate runs)

---

## 🎨 UI/UX GUIDELINES

**Design Principles:**
- **Clean & Professional** - Authors are running a business
- **Data-Dense but Not Overwhelming** - Show insights, not raw data
- **Mobile-Responsive** - Many authors check stats on phone
- **Fast Loading** - Cache aggressively, use skeleton loaders
- **Accessible** - WCAG AA compliance minimum

**Color Scheme:**
- Primary: Deep Blue (#1E40AF) - Trust, professionalism
- Accent: Vibrant Orange (#F97316) - Energy, action
- Success: Green (#10B981) - Positive metrics
- Warning: Yellow (#F59E0B) - Alerts, reminders
- Danger: Red (#EF4444) - Issues, declines

**Typography:**
- Headings: Inter or Outfit (bold, modern)
- Body: Inter or system font stack
- Monospace: JetBrains Mono (for numbers, code)

**Component Library:**
- Use shadcn/ui for consistency
- Custom components for charts (Recharts)
- Icons: Lucide React

---

## 📈 METRICS TO TRACK (Product Analytics)

**User Engagement:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Time to first value (connect first platform)
- Feature adoption rates (% using each feature)
- Retention (Day 1, Day 7, Day 30)

**Revenue Metrics:**
- MRR (Monthly Recurring Revenue)
- Churn rate
- ARPU (Average Revenue Per User)
- Free → Pro conversion rate
- Lifetime Value (LTV)

**Product Health:**
- Dashboard load time
- API error rates
- Sync success rate (per platform)
- Email delivery rate
- User-reported issues

---

## 🚀 MVP LAUNCH PLAN

**Phase 1: Core MVP (Weeks 1-4)**
- ✅ User auth (Supabase)
- ✅ Sales dashboard (Amazon + Gumroad only)
- ✅ Basic launch checklist (fiction template only)
- ✅ Whop payment integration
- ✅ Landing page + pricing page

**Phase 2: Enhanced Features (Weeks 5-8)**
- ✅ Competitor price tracking
- ✅ More platform integrations (Apple Books)
- ✅ Email alerts (Resend integration)
- ✅ A/B testing (basic version)

**Phase 3: Pro Features (Weeks 9-12)**
- ✅ Revenue forecasting
- ✅ Marketing calendar
- ✅ Advanced analytics
- ✅ Export reports
- ✅ API documentation

**Launch Strategy:**
- Soft launch on Indie Hackers (get first 10-20 users)
- Iterate based on feedback
- ProductHunt launch once product is polished
- Content marketing (blog posts solving author problems)

---

## 🛡️ SECURITY & COMPLIANCE

**Data Protection:**
- Encrypt sensitive credentials (platform API keys)
- Use Supabase RLS (Row Level Security)
- HTTPS everywhere
- Regular security audits

**Privacy:**
- GDPR compliant (EU users)
- Clear privacy policy
- Data export on request
- Account deletion removes all data

**Rate Limiting:**
- Protect API endpoints (Upstash Redis)
- Prevent scraping abuse
- Fair usage policy for free tier

---

## 💰 MONETIZATION STRATEGY

**Free Tier:**
- 1 book
- 1 platform connection
- Basic dashboard (7 days of data)
- Launch checklist (no reminders)
- Goal: Hook users, prove value

**Pro Tier ($19/month):**
- Unlimited books
- All platform integrations
- Full data history
- Competitor tracking (up to 10)
- A/B testing
- Email alerts
- Marketing calendar
- Priority support

**Enterprise Tier ($49/month):**
- Everything in Pro
- Custom integrations
- White-label reports
- API access
- Dedicated account manager

**Upsell Opportunities:**
- One-time services: Cover design review ($50)
- Consulting: Launch strategy call ($200)
- Partnerships: Affiliate deals with cover designers, editors

---

## 🎯 SUCCESS METRICS

**3 Months Post-Launch:**
- 100 total signups
- 20 paying customers ($380 MRR)
- 5% free → pro conversion
- <10% monthly churn

**6 Months Post-Launch:**
- 500 total signups
- 100 paying customers ($1,900 MRR)
- 10% free → pro conversion
- <5% monthly churn

**12 Months Post-Launch:**
- 2000 total signups
- 400 paying customers ($7,600 MRR)
- 15% free → pro conversion
- Profitability (MRR > costs)

---

## 🐛 KNOWN CHALLENGES & SOLUTIONS

**Challenge 1: Amazon KDP has no official API**
- Solution: Web scraping with Puppeteer (use residential proxies)
- Fallback: Manual CSV upload
- Future: Partner with KDP Rocket or similar services

**Challenge 2: Platform sync failures**
- Solution: Retry logic with exponential backoff
- User notification if sync fails 3 times
- Manual sync button as backup

**Challenge 3: Free tier abuse**
- Solution: Rate limiting (Redis)
- Email verification required
- Monitoring for suspicious activity

**Challenge 4: Churn after launch period**
- Solution: Marketing calendar keeps users engaged
- Email digests with insights (weekly)
- New feature announcements
- Educational content (blog posts)

---

## 📝 DEVELOPMENT WORKFLOW

**For AI Coding Assistants (Cursor/Windsurf):**

When implementing features, follow this order:
1. **Database schema** - Set up tables in Supabase
2. **API routes** - Build endpoints (test with Postman)
3. **Data fetching** - Set up TanStack Query hooks
4. **UI components** - Build with shadcn/ui
5. **Integration testing** - Test full flow
6. **Deploy** - Push to Vercel, test production

**Code Style:**
- Use TypeScript for type safety
- Write JSDoc comments for complex functions
- Keep components small (<200 lines)
- Extract reusable logic into hooks
- Use server components where possible (Next.js App Router)

**Git Workflow:**
- Feature branches (feature/sales-dashboard)
- Descriptive commit messages
- PR review before merging to main
- Main branch auto-deploys to production

---

## 🔗 EXTERNAL RESOURCES

**APIs & Documentation:**
- Supabase Docs: https://supabase.com/docs
- Gumroad API: https://gumroad.com/api
- Whop API: https://whop.com/docs
- Resend Docs: https://resend.com/docs
- Upstash Redis: https://upstash.com/docs

**Inspiration:**
- Plausible Analytics (clean dashboard design)
- ConvertKit (email automation UX)
- Stripe Dashboard (financial metrics)
- Baremetrics (SaaS analytics)

---

## 🎬 NEXT STEPS FOR DEVELOPMENT

**Week 1 Tasks:**
1. Set up Next.js project with TypeScript
2. Configure Supabase (database + auth)
3. Create database schema (run SQL in Supabase)
4. Build basic auth flow (signup, login, logout)
5. Set up Whop test account
6. Deploy to Vercel (staging environment)

**Week 2 Tasks:**
1. Build sales dashboard UI (empty state)
2. Implement Gumroad API integration
3. Create sales_data sync endpoint
4. Add chart components (Recharts)
5. Test with dummy data

**Week 3 Tasks:**
1. Build launch checklist feature
2. Create checklist templates
3. Implement task creation/completion
4. Add email reminders (Resend)
5. Test full launch flow

**Week 4 Tasks:**
1. Add pricing page
2. Implement Whop subscription flow
3. Set up webhook handlers
4. Add tier-based feature gates
5. Test payment flow end-to-end
6. Polish UI, fix bugs
7. Prepare for soft launch

**Prompt for AI Assistant:**
"I'm building AuthorStack following the specs in CONTEXT.md. Start with [FEATURE NAME]. Create the database schema, API routes, and React components needed. Use Next.js 14 App Router, Supabase for database, and shadcn/ui for components. Show me the implementation step-by-step."

---

END OF CONTEXT.md