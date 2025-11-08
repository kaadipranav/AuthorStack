# AuthorStack Quick Start - Database Setup

**TL;DR:** 5-step setup to get your database running.

## Step 1: Get Supabase Credentials (2 min)

```
1. Go to https://supabase.com
2. Create project or use existing
3. Go to Settings > API
4. Copy: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

## Step 2: Update .env.local (1 min)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

## Step 3: Create Database Schema (1 min)

**Via Dashboard (easiest):**
1. Supabase > SQL Editor > New Query
2. Copy `infra/sql/create_tables.sql`
3. Paste & Run

**Via CLI:**
```bash
npm install -g supabase
supabase link --project-ref your-project-ref
supabase db execute < infra/sql/create_tables.sql
```

## Step 4: Create Test User (1 min)

1. Supabase > Authentication > Users > Add User
2. Email: `test@authorstack.com`
3. Password: `TestPassword123!`
4. **Copy the UUID**

## Step 5: Seed Database (1 min)

1. Open `infra/sql/seed.sql`
2. Replace `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` with your UUID
3. Supabase > SQL Editor > New Query
4. Paste & Run

## Verify

Run in Supabase SQL Editor:
```sql
SELECT COUNT(*) FROM profiles;  -- Should be 1
SELECT COUNT(*) FROM books;     -- Should be 2
SELECT COUNT(*) FROM sales_data; -- Should be 21
```

## Start Dev Server

```bash
pnpm dev
```

Visit: http://localhost:3000

---

**Done!** Your database is ready. 🚀

For detailed instructions, see:
- `SUPABASE_SETUP.md` - Step-by-step guide
- `DATABASE_SETUP_COMMANDS.md` - All commands
- `infra/README.md` - Database documentation
