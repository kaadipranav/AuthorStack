# Database Setup Summary

Complete overview of all database files created and setup instructions.

## 📦 Files Created

### SQL Migrations
- **`infra/sql/create_tables.sql`** (500+ lines)
  - 11 tables with full schema
  - Row Level Security (RLS) on all tables
  - Indexes for performance
  - Triggers for updated_at timestamps
  - Complete documentation

- **`infra/sql/seed.sql`** (400+ lines)
  - 1 test user profile
  - 2 test books
  - 2 platform connections
  - 21 sales records (14 days × 2 books)
  - 1 launch checklist with 5 tasks
  - 2 tracked competitors with price history
  - 3 marketing events

### Setup Scripts
- **`infra/setup-db.sh`** - Bash setup script (Linux/Mac)
- **`infra/setup-db.ps1`** - PowerShell setup script (Windows)

### Documentation
- **`SUPABASE_SETUP.md`** - Complete step-by-step guide (detailed)
- **`DATABASE_SETUP_COMMANDS.md`** - All commands reference
- **`QUICK_START.md`** - 5-minute quick start
- **`infra/README.md`** - Database infrastructure docs
- **`infra/seed-data.json`** - Seed data reference (JSON format)

---

## 🎯 Quick Setup (5 minutes)

### 1. Get Credentials
```
Supabase > Settings > API > Copy 3 keys
```

### 2. Update .env.local
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 3. Create Schema
```bash
# Via CLI
npm install -g supabase
supabase link --project-ref your-project-ref
supabase db execute < infra/sql/create_tables.sql

# Or via Dashboard: Copy create_tables.sql > SQL Editor > Run
```

### 4. Create Test User
```
Supabase > Auth > Users > Add User
Email: test@authorstack.com
Password: TestPassword123!
Copy UUID
```

### 5. Seed Database
```bash
# Replace UUID in seed.sql, then:
supabase db execute < infra/sql/seed.sql

# Or via Dashboard: Copy seed.sql > SQL Editor > Run
```

---

## 📊 Database Schema

### Tables (11 total)

**User & Auth:**
- `profiles` - User profiles (extends Supabase Auth)

**Books & Sales:**
- `books` - Author's books
- `platform_connections` - Connected platforms
- `sales_data` - Daily sales records

**Launch Planning:**
- `launch_checklists` - Book launch plans
- `checklist_tasks` - Individual tasks

**Competitor Tracking:**
- `tracked_competitors` - Competitor books
- `price_history` - Historical prices

**A/B Testing:**
- `ab_tests` - A/B test campaigns
- `test_variants` - Test variants

**Marketing:**
- `marketing_events` - Marketing calendar

### Features

✅ Row Level Security (RLS) on all tables
✅ Users can only see their own data
✅ Automatic updated_at timestamps
✅ Performance indexes
✅ Referential integrity
✅ Unique constraints

---

## 🧪 Test Data Included

**1 Test User:**
- Email: test@authorstack.com
- Password: TestPassword123!
- Tier: Pro
- Whop ID: whop_test_customer_123

**2 Test Books:**
- "The Art of Book Marketing" (Non-Fiction)
- "Midnight in the Garden" (Fiction)

**2 Platform Connections:**
- Amazon KDP
- Gumroad

**21 Sales Records:**
- 14 days of data
- 2 books × 2 platforms
- 128 units on Amazon
- 20 units on Gumroad
- $1,028.62 total revenue

**1 Launch Checklist:**
- 5 tasks
- 2 completed
- 3 pending
- 30 days from now

**2 Tracked Competitors:**
- With price history
- Price changes tracked

**3 Marketing Events:**
- Social posts
- Email campaigns
- Promotions

---

## 🔐 Environment Variables

### Required

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optional

```bash
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

### Where to Find

| Variable | Location |
|----------|----------|
| URL | Settings > API > Project URL |
| Anon Key | Settings > API > Anon public |
| Service Key | Settings > API > Service role |
| Database URL | Settings > Database > Connection string |

---

## 📋 Setup Checklist

- [ ] Supabase project created
- [ ] API keys copied to `.env.local`
- [ ] Supabase CLI installed: `npm install -g supabase`
- [ ] Project linked: `supabase link --project-ref xxx`
- [ ] Schema created: `supabase db execute < infra/sql/create_tables.sql`
- [ ] Test user created in Auth
- [ ] Test user UUID copied
- [ ] Seed data inserted: `supabase db execute < infra/sql/seed.sql`
- [ ] Tables verified in Table Editor
- [ ] Test queries run successfully
- [ ] Dev server starts: `pnpm dev`

---

## 🚀 Exact Commands to Run

### Install CLI
```bash
npm install -g supabase
```

### Link to Project
```bash
supabase link --project-ref your-project-ref
```

### Create Schema
```bash
supabase db execute < infra/sql/create_tables.sql
```

### Seed Database
```bash
supabase db execute < infra/sql/seed.sql
```

### Verify Setup
```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) FROM profiles;    -- 1
SELECT COUNT(*) FROM books;       -- 2
SELECT COUNT(*) FROM sales_data;  -- 21
```

### Start Dev Server
```bash
pnpm dev
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `QUICK_START.md` | 5-minute setup |
| `SUPABASE_SETUP.md` | Detailed guide |
| `DATABASE_SETUP_COMMANDS.md` | All commands |
| `infra/README.md` | Infrastructure docs |
| `infra/seed-data.json` | Seed data reference |
| `infra/sql/create_tables.sql` | Database schema |
| `infra/sql/seed.sql` | Test data |

---

## 🔄 Common Tasks

### Reset Database
```bash
supabase db reset
```

### View Database Status
```bash
supabase status
```

### View Logs
```bash
supabase logs --follow
```

### Pull Remote Schema
```bash
supabase db pull
```

---

## ✨ What's Included

✅ 11 production-ready tables
✅ Row Level Security on all tables
✅ Complete schema with indexes
✅ Automatic timestamps
✅ Test data for 14 days
✅ Launch checklist example
✅ Competitor tracking setup
✅ Marketing calendar events
✅ Multiple setup methods (CLI, Dashboard, Scripts)
✅ Comprehensive documentation
✅ Troubleshooting guides

---

## 🎯 Next Steps

1. **Setup Database** (5 min)
   - Follow QUICK_START.md or SUPABASE_SETUP.md

2. **Verify Connection** (1 min)
   - Run test queries in SQL Editor

3. **Start Dev Server** (1 min)
   ```bash
   pnpm dev
   ```

4. **Test Login** (1 min)
   - Go to http://localhost:3000/auth/login
   - Email: test@authorstack.com
   - Password: TestPassword123!

5. **Build Features**
   - Implement Supabase auth
   - Create dashboard
   - Add API routes

---

## 📞 Support

- **Quick Start:** `QUICK_START.md`
- **Detailed Setup:** `SUPABASE_SETUP.md`
- **All Commands:** `DATABASE_SETUP_COMMANDS.md`
- **Infrastructure:** `infra/README.md`
- **Supabase Docs:** https://supabase.com/docs

---

## ✅ You're Ready!

Your database infrastructure is complete and ready for development. 🎉

Start with: `pnpm dev`
