# AuthorStack Database Setup - Complete

## ✅ All Files Created

### SQL Files (2)
```
infra/sql/create_tables.sql    - 11 tables, RLS, indexes, triggers
infra/sql/seed.sql             - Test data: 1 user, 2 books, 21 sales records
```

### Setup Scripts (2)
```
infra/setup-db.sh              - Bash setup script
infra/setup-db.ps1             - PowerShell setup script
```

### Documentation (6)
```
QUICK_START.md                 - 5-minute setup
SUPABASE_SETUP.md              - Detailed step-by-step guide
DATABASE_SETUP_COMMANDS.md     - All commands reference
DATABASE_SUMMARY.md            - Complete overview
infra/README.md                - Infrastructure documentation
infra/seed-data.json           - Seed data reference (JSON)
```

### Reference Files (2)
```
SETUP_REFERENCE.txt            - Quick reference card
DATABASE_COMPLETE.md           - This file
```

---

## 🚀 Setup in 5 Steps

### Step 1: Get Credentials (2 min)
```
https://supabase.com
→ Settings > API
→ Copy 3 keys
```

### Step 2: Update .env.local (1 min)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Step 3: Create Schema (1 min)
```bash
# Via CLI
npm install -g supabase
supabase link --project-ref your-project-ref
supabase db execute < infra/sql/create_tables.sql

# Or via Dashboard: SQL Editor > New Query > Paste create_tables.sql > Run
```

### Step 4: Create Test User (1 min)
```
Supabase > Authentication > Users > Add User
Email: test@authorstack.com
Password: TestPassword123!
→ Copy UUID
```

### Step 5: Seed Database (1 min)
```bash
# Replace UUID in infra/sql/seed.sql, then:
supabase db execute < infra/sql/seed.sql

# Or via Dashboard: SQL Editor > New Query > Paste seed.sql > Run
```

---

## 📊 Database Schema

### 11 Tables Created

| Table | Purpose | Records |
|-------|---------|---------|
| profiles | User profiles | 1 |
| books | Author's books | 2 |
| platform_connections | Connected platforms | 2 |
| sales_data | Daily sales | 21 |
| launch_checklists | Launch plans | 1 |
| checklist_tasks | Launch tasks | 5 |
| tracked_competitors | Competitor books | 2 |
| price_history | Price tracking | 4 |
| ab_tests | A/B tests | 0 |
| test_variants | Test variants | 0 |
| marketing_events | Marketing calendar | 3 |

### Features
✅ Row Level Security (RLS) - Users see only their data
✅ Automatic timestamps - updated_at auto-updates
✅ Performance indexes - Fast queries
✅ Referential integrity - Foreign keys
✅ Unique constraints - No duplicates

---

## 🧪 Test Data

**User:** test@authorstack.com / TestPassword123! (Pro tier)

**Books:** 2 test books with 14 days of sales data
- "The Art of Book Marketing" (Non-Fiction)
- "Midnight in the Garden" (Fiction)

**Sales:** 21 records across 2 platforms
- Amazon: 128 units, $639.12 revenue
- Gumroad: 20 units, $199.80 revenue

**Launch Checklist:** 1 with 5 tasks (2 completed)

**Competitors:** 2 tracked with price history

**Marketing:** 3 calendar events

---

## 🔐 Environment Variables

### Required
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Where to Find
- **URL** → Supabase Settings > API > Project URL
- **Anon Key** → Supabase Settings > API > Anon public
- **Service Key** → Supabase Settings > API > Service role

---

## 📋 Exact Commands

```bash
# Install CLI
npm install -g supabase

# Link to project
supabase link --project-ref your-project-ref

# Create schema
supabase db execute < infra/sql/create_tables.sql

# Seed database (after replacing UUID)
supabase db execute < infra/sql/seed.sql

# Verify setup (run in Supabase SQL Editor)
SELECT COUNT(*) FROM profiles;    -- 1
SELECT COUNT(*) FROM books;       -- 2
SELECT COUNT(*) FROM sales_data;  -- 21

# Start dev server
pnpm dev
```

---

## ✅ Verification

After setup, verify in Supabase SQL Editor:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check record counts
SELECT 
  (SELECT COUNT(*) FROM profiles) as profiles,
  (SELECT COUNT(*) FROM books) as books,
  (SELECT COUNT(*) FROM sales_data) as sales_data;

-- Check test user
SELECT * FROM profiles LIMIT 1;

-- Check test books
SELECT title, genre FROM books ORDER BY created_at DESC;

-- Check sales summary
SELECT platform, SUM(units_sold) as units, SUM(revenue) as revenue 
FROM sales_data GROUP BY platform;
```

---

## 📚 Documentation

| File | Purpose | Read Time |
|------|---------|-----------|
| QUICK_START.md | 5-minute setup | 5 min |
| SUPABASE_SETUP.md | Detailed guide | 15 min |
| DATABASE_SETUP_COMMANDS.md | All commands | 10 min |
| DATABASE_SUMMARY.md | Complete overview | 10 min |
| infra/README.md | Infrastructure docs | 10 min |
| SETUP_REFERENCE.txt | Quick reference | 2 min |

---

## 🎯 Next Steps

1. **Setup Database** (5 min)
   - Follow QUICK_START.md

2. **Verify Connection** (1 min)
   - Run test queries

3. **Start Dev Server** (1 min)
   ```bash
   pnpm dev
   ```

4. **Test Login** (1 min)
   - http://localhost:3000/auth/login
   - test@authorstack.com / TestPassword123!

5. **Build Features**
   - Implement auth integration
   - Create dashboard
   - Add API routes

---

## 🐛 Troubleshooting

### "Connection refused"
- Check NEXT_PUBLIC_SUPABASE_URL is correct
- Verify Supabase project is active
- Restart dev server

### "Permission denied"
- Ensure correct API keys in .env.local
- Check RLS policies
- Use service role key for server operations

### "Table already exists"
- Use `CREATE TABLE IF NOT EXISTS`
- Or drop table first: `DROP TABLE name CASCADE;`

### "UUID not found"
- Make sure you replaced placeholder UUID in seed.sql
- Use actual test user UUID from Supabase Auth

---

## 📞 Support

- **Quick Setup:** QUICK_START.md
- **Detailed Help:** SUPABASE_SETUP.md
- **Commands:** DATABASE_SETUP_COMMANDS.md
- **Overview:** DATABASE_SUMMARY.md
- **Docs:** https://supabase.com/docs

---

## ✨ What You Get

✅ Production-ready database schema
✅ 11 fully configured tables
✅ Row Level Security on all tables
✅ Performance indexes
✅ Automatic timestamps
✅ 14 days of test data
✅ Multiple setup methods
✅ Comprehensive documentation
✅ Troubleshooting guides
✅ Quick reference cards

---

## 🚀 Ready to Go!

Your database infrastructure is complete and ready for development.

**Start here:** `pnpm dev`

**Questions?** Check the documentation files.

**Happy coding!** 🎉
