# AuthorStack Database Infrastructure

This directory contains all database setup, migrations, and seed data for AuthorStack.

## 📁 Structure

```
infra/
├── sql/
│   ├── create_tables.sql    # Main schema with all tables and RLS policies
│   └── seed.sql             # Test data for development
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- Supabase project created (https://supabase.com)
- Supabase CLI installed (optional but recommended)
- Access to Supabase dashboard

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in project details:
   - **Name:** authorstack
   - **Database Password:** Generate strong password
   - **Region:** Choose closest to your users
4. Wait for project to initialize (~2 minutes)

### Step 2: Get Your Credentials

After project creation, go to **Settings > API** and copy:

- `NEXT_PUBLIC_SUPABASE_URL` - Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon public key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)

Add these to your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Step 3: Run Database Schema

**Option A: Using Supabase Dashboard (Easiest)**

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. Copy entire contents of `infra/sql/create_tables.sql`
5. Paste into the SQL editor
6. Click **Run**
7. Wait for success message

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push

# Or run SQL directly
supabase db execute < infra/sql/create_tables.sql
```

### Step 4: Create Test User

1. Go to **Authentication > Users** in Supabase dashboard
2. Click **Add User**
3. Enter:
   - **Email:** test@authorstack.com
   - **Password:** TestPassword123!
4. Click **Create User**
5. Copy the **UUID** from the user row

### Step 5: Seed Database

1. Open `infra/sql/seed.sql`
2. Replace all instances of `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` with your test user UUID
3. Go to **SQL Editor** in Supabase dashboard
4. Create **New Query**
5. Paste the modified seed.sql
6. Click **Run**

**Or via CLI:**

```bash
# After replacing the UUID in seed.sql
supabase db execute < infra/sql/seed.sql
```

### Step 6: Verify Setup

Check that tables were created:

```bash
# Via Supabase dashboard
# Go to Table Editor and verify these tables exist:
# - profiles
# - books
# - platform_connections
# - sales_data
# - launch_checklists
# - checklist_tasks
# - tracked_competitors
# - price_history
# - ab_tests
# - test_variants
# - marketing_events
```

Or run a test query in SQL Editor:

```sql
SELECT COUNT(*) as profile_count FROM profiles;
SELECT COUNT(*) as book_count FROM books;
SELECT COUNT(*) as sales_count FROM sales_data;
```

## 📊 Database Schema Overview

### Core Tables

- **profiles** - User profiles (extends Supabase Auth)
- **books** - Author's books
- **platform_connections** - Connected sales platforms (Amazon, Gumroad, etc.)
- **sales_data** - Sales records with daily aggregation

### Features

- **launch_checklists** - Book launch planning
- **checklist_tasks** - Individual tasks in a launch
- **tracked_competitors** - Competitor books to monitor
- **price_history** - Historical price data for competitors
- **ab_tests** - A/B tests for covers, titles, descriptions
- **test_variants** - Variants within A/B tests
- **marketing_events** - Marketing calendar events

### Security

All tables have **Row Level Security (RLS)** enabled:

- Users can only see their own data
- Policies prevent unauthorized access
- Service role key can bypass RLS (for server operations)

## 🔄 Migrations

To add new tables or modify schema:

1. Create new SQL file in `infra/sql/` (e.g., `add_new_feature.sql`)
2. Write your migration SQL
3. Test in Supabase dashboard first
4. Run via SQL Editor or CLI

Example migration:

```sql
-- infra/sql/add_user_preferences.sql
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);
```

## 🌱 Seed Data

The `seed.sql` file includes:

- 1 test user (you must create this first)
- 2 test books
- 2 platform connections
- 14 days of sales data (2 books × 2 platforms)
- 1 launch checklist with 5 tasks
- 2 tracked competitors with price history
- 3 marketing events

**Important:** Replace the placeholder UUID before running seed.sql

## 🔐 Environment Variables

Required for database access:

```bash
# Public (safe to expose)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Secret (never expose)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Optional
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

## 📚 Useful Supabase Commands

```bash
# Link to project
supabase link --project-ref your-project-ref

# View project status
supabase status

# Pull remote schema
supabase db pull

# Push local migrations
supabase db push

# Reset database
supabase db reset

# View logs
supabase functions list
supabase logs --follow
```

## 🐛 Troubleshooting

### "Permission denied" error

- Ensure you're using the correct API keys
- Check that RLS policies are correct
- Use service role key for server operations

### "Table already exists" error

- The table already exists in your database
- Use `CREATE TABLE IF NOT EXISTS` to avoid errors
- Or drop the table first: `DROP TABLE table_name CASCADE;`

### UUID conflicts in seed data

- Make sure to replace the placeholder UUID with your actual test user UUID
- Use unique UUIDs for each record

### Can't connect to database

- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check that your Supabase project is active
- Ensure you're using the correct API keys

## 📖 Resources

- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security
- **Supabase CLI:** https://supabase.com/docs/guides/cli

## 🔗 Related Files

- `.env.example` - Environment variables template
- `.env.local` - Your local environment (gitignored)
- `lib/supabase.ts` - Supabase client initialization
- `CONTEX.md` - Full project specifications

## ✅ Setup Checklist

- [ ] Supabase project created
- [ ] API keys copied to `.env.local`
- [ ] Database schema created (create_tables.sql)
- [ ] Test user created in Auth
- [ ] Seed data inserted (seed.sql)
- [ ] Tables verified in Table Editor
- [ ] Test queries run successfully
- [ ] Ready to start development!

---

**Need help?** Check Supabase docs or create an issue in the project repository.
