# Supabase Setup Guide for AuthorStack

Complete step-by-step guide to set up your Supabase database for AuthorStack development.

## 📋 Prerequisites

- Supabase account (free at https://supabase.com)
- Node.js 18+ installed
- pnpm installed
- Text editor or IDE

## 🎯 Setup Steps

### Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click **"New Project"** or **"Create a new project"**
3. Fill in the form:
   - **Name:** `authorstack`
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Select closest to your location
4. Click **"Create new project"**
5. Wait 2-3 minutes for initialization

### Step 2: Get Your API Keys

1. After project is created, click **Settings** (gear icon) in left sidebar
2. Click **API** in the left menu
3. You'll see three important keys:

**Copy these values:**

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Update Environment Variables

1. Open `.env.local` in your project root
2. Update these values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Create Database Schema

**Option A: Using Supabase Dashboard (Recommended for beginners)**

1. In your Supabase project, click **SQL Editor** in left sidebar
2. Click **"New Query"** button
3. Open `infra/sql/create_tables.sql` in your text editor
4. Copy the entire file contents
5. Paste into the SQL Editor
6. Click **"Run"** button
7. Wait for success message (should see green checkmark)

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI globally
npm install -g supabase

# Navigate to your project
cd d:\Pranav\AuthorStack

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Run the schema migration
supabase db execute < infra/sql/create_tables.sql
```

**Option C: Using PowerShell Script (Windows)**

```powershell
cd d:\Pranav\AuthorStack\infra
.\setup-db.ps1
```

### Step 5: Create Test User

1. In Supabase dashboard, click **Authentication** in left sidebar
2. Click **Users** tab
3. Click **"Add user"** button
4. Fill in:
   - **Email:** `test@authorstack.com`
   - **Password:** `TestPassword123!`
5. Click **"Create user"**
6. **Important:** Copy the **UUID** from the user row (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Step 6: Seed Database with Test Data

1. Open `infra/sql/seed.sql` in your text editor
2. Find all instances of: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
3. Replace with your test user UUID from Step 5
4. Go to Supabase **SQL Editor**
5. Click **"New Query"**
6. Copy and paste the modified `seed.sql`
7. Click **"Run"**

**Or via CLI:**

```bash
# After replacing UUID in seed.sql
supabase db execute < infra/sql/seed.sql
```

### Step 7: Verify Setup

Check that everything is working:

1. Go to **Table Editor** in Supabase dashboard
2. Verify these tables exist:
   - ✓ profiles
   - ✓ books
   - ✓ platform_connections
   - ✓ sales_data
   - ✓ launch_checklists
   - ✓ checklist_tasks
   - ✓ tracked_competitors
   - ✓ price_history
   - ✓ ab_tests
   - ✓ test_variants
   - ✓ marketing_events

3. Run test query in SQL Editor:

```sql
-- Check profiles
SELECT COUNT(*) as profile_count FROM profiles;

-- Check books
SELECT COUNT(*) as book_count FROM books;

-- Check sales data
SELECT COUNT(*) as sales_count FROM sales_data;

-- Check launch checklists
SELECT COUNT(*) as checklist_count FROM launch_checklists;
```

You should see:
- profile_count: 1
- book_count: 2
- sales_count: 21
- checklist_count: 1

## 🔐 Environment Variables Reference

### Required Variables

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional but recommended
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

### Where to Find Each Value

| Variable | Location |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings > API > Anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings > API > Service role |
| `DATABASE_URL` | Settings > Database > Connection string |

## 📊 Database Schema Overview

### Tables Created

**User & Auth:**
- `profiles` - User profiles (extends Supabase Auth)

**Books & Sales:**
- `books` - Author's books
- `platform_connections` - Connected platforms (Amazon, Gumroad, etc.)
- `sales_data` - Daily sales records

**Launch Planning:**
- `launch_checklists` - Book launch plans
- `checklist_tasks` - Individual tasks

**Competitor Tracking:**
- `tracked_competitors` - Competitor books to monitor
- `price_history` - Historical price data

**A/B Testing:**
- `ab_tests` - A/B test campaigns
- `test_variants` - Test variants (cover, title, etc.)

**Marketing:**
- `marketing_events` - Marketing calendar events

### Security Features

✅ Row Level Security (RLS) enabled on all tables
✅ Users can only see their own data
✅ Service role key for server operations
✅ Encrypted credentials storage

## 🧪 Test Data Included

The seed.sql creates:

- **1 Test User:** test@authorstack.com
- **2 Test Books:**
  - "The Art of Book Marketing" (Non-Fiction)
  - "Midnight in the Garden" (Fiction)
- **2 Platform Connections:**
  - Amazon KDP
  - Gumroad
- **21 Sales Records:** 14 days of data across 2 books and 2 platforms
- **1 Launch Checklist:** With 5 sample tasks
- **2 Tracked Competitors:** With price history
- **3 Marketing Events:** Sample calendar events

## 🔄 Common Tasks

### Reset Database

If you need to start over:

```bash
# Via Supabase CLI
supabase db reset

# Or manually in dashboard:
# 1. Go to SQL Editor
# 2. Run: DROP SCHEMA public CASCADE;
# 3. Then re-run create_tables.sql
```

### Add New Table

1. Create SQL file in `infra/sql/` (e.g., `add_feature.sql`)
2. Write your migration
3. Run via SQL Editor or CLI

### View Database Logs

```bash
# Via Supabase CLI
supabase logs --follow
```

### Export Data

1. Go to **Table Editor**
2. Click table name
3. Click **"Export"** button
4. Choose format (CSV, JSON, etc.)

## 🐛 Troubleshooting

### "Connection refused" error

**Solution:**
- Check that `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify your Supabase project is active
- Restart your dev server: `pnpm dev`

### "Permission denied" error

**Solution:**
- Ensure you're using correct API keys
- Check RLS policies in table settings
- Use service role key for server operations

### "Table already exists" error

**Solution:**
- The table already exists in your database
- Use `DROP TABLE table_name CASCADE;` to remove it first
- Or modify the SQL to use `CREATE TABLE IF NOT EXISTS`

### UUID conflicts in seed data

**Solution:**
- Make sure you replaced the placeholder UUID with your actual test user UUID
- Each UUID in the seed should be unique
- Check for duplicate UUIDs in your seed.sql

### Can't see tables in Table Editor

**Solution:**
- Refresh the page
- Check that the SQL ran without errors
- Go to SQL Editor and run: `SELECT * FROM information_schema.tables;`

## 📚 Useful Resources

- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Row Level Security Guide:** https://supabase.com/docs/guides/auth/row-level-security
- **Supabase CLI Docs:** https://supabase.com/docs/guides/cli
- **Database Migrations:** https://supabase.com/docs/guides/migrations

## ✅ Setup Checklist

- [ ] Supabase account created
- [ ] Project created
- [ ] API keys copied to `.env.local`
- [ ] Database schema created (create_tables.sql)
- [ ] Test user created in Auth
- [ ] Test user UUID copied
- [ ] Seed data inserted (seed.sql with UUID replaced)
- [ ] Tables verified in Table Editor
- [ ] Test queries run successfully
- [ ] Dev server starts without errors

## 🚀 Next Steps

After setup is complete:

1. Start your dev server:
   ```bash
   pnpm dev
   ```

2. Test the connection:
   - Navigate to http://localhost:3000
   - Try signing in with test@authorstack.com / TestPassword123!

3. Check the browser console for any errors

4. Start building features!

## 💬 Need Help?

- Check `infra/README.md` for more details
- Review `CONTEX.md` for project specifications
- Check Supabase documentation
- Create an issue in the project repository

---

**You're all set!** Your Supabase database is ready for AuthorStack development. 🎉
