# Database Setup - Exact Commands to Run

Complete reference of all commands needed to set up your Supabase database.

## 🎯 Quick Setup (5 minutes)

### 1. Get Your Supabase Credentials

Go to https://supabase.com:
- Create project or use existing
- Go to **Settings > API**
- Copy these three values:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### 2. Update .env.local

```bash
# Open .env.local and update:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 3. Create Database Schema

**Option A: Via Supabase Dashboard (Easiest)**

1. Go to your Supabase project
2. Click **SQL Editor** > **New Query**
3. Copy contents of: `infra/sql/create_tables.sql`
4. Paste into editor
5. Click **Run**

**Option B: Via CLI (Recommended)**

```bash
# Install Supabase CLI (one time)
npm install -g supabase

# Navigate to project
cd d:\Pranav\AuthorStack

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db execute < infra/sql/create_tables.sql
```

**Option C: Via PowerShell (Windows)**

```powershell
cd d:\Pranav\AuthorStack\infra
.\setup-db.ps1
```

### 4. Create Test User

In Supabase dashboard:
1. Click **Authentication** > **Users**
2. Click **Add User**
3. Email: `test@authorstack.com`
4. Password: `TestPassword123!`
5. Click **Create User**
6. **Copy the UUID** (you'll need this next)

### 5. Seed Database

1. Open `infra/sql/seed.sql`
2. Replace all: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
3. With your test user UUID from step 4
4. Go to Supabase **SQL Editor** > **New Query**
5. Paste modified seed.sql
6. Click **Run**

Or via CLI:

```bash
# After replacing UUID in seed.sql
supabase db execute < infra/sql/seed.sql
```

### 6. Verify Setup

Run test query in Supabase SQL Editor:

```sql
SELECT COUNT(*) as profiles FROM profiles;
SELECT COUNT(*) as books FROM books;
SELECT COUNT(*) as sales FROM sales_data;
```

Expected results:
- profiles: 1
- books: 2
- sales: 21

---

## 📋 Detailed Command Reference

### Install Supabase CLI

```bash
npm install -g supabase
```

Or with yarn:

```bash
yarn global add supabase
```

### Link to Supabase Project

```bash
supabase link --project-ref your-project-ref
```

Get `your-project-ref` from Supabase dashboard URL:
```
https://app.supabase.com/project/[your-project-ref]/...
```

### Run SQL Migrations

**Single file:**

```bash
supabase db execute < infra/sql/create_tables.sql
```

**Multiple files:**

```bash
supabase db execute < infra/sql/create_tables.sql
supabase db execute < infra/sql/seed.sql
```

**Or pipe directly:**

```bash
cat infra/sql/create_tables.sql | supabase db execute
```

### View Database Status

```bash
supabase status
```

### Pull Remote Schema

```bash
supabase db pull
```

### Reset Database

```bash
supabase db reset
```

### View Database Logs

```bash
supabase logs --follow
```

### List Functions

```bash
supabase functions list
```

---

## 🔑 Environment Variables

### Required

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optional

```bash
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
NEXTAUTH_SECRET=your-secret-here
```

### Where to Find

| Variable | Path |
|----------|------|
| URL | Settings > API > Project URL |
| Anon Key | Settings > API > Anon public |
| Service Key | Settings > API > Service role |
| Database URL | Settings > Database > Connection string |

---

## 📁 File Structure

```
infra/
├── sql/
│   ├── create_tables.sql    # Main schema (11 tables + RLS)
│   └── seed.sql             # Test data (1 user, 2 books, 14 days sales)
├── setup-db.sh              # Bash setup script
├── setup-db.ps1             # PowerShell setup script
├── seed-data.json           # Seed data reference
└── README.md                # Detailed documentation
```

---

## 🧪 Test Queries

After setup, run these in Supabase SQL Editor to verify:

### Count all records

```sql
SELECT 
  (SELECT COUNT(*) FROM profiles) as profiles,
  (SELECT COUNT(*) FROM books) as books,
  (SELECT COUNT(*) FROM sales_data) as sales_data,
  (SELECT COUNT(*) FROM launch_checklists) as checklists,
  (SELECT COUNT(*) FROM tracked_competitors) as competitors;
```

### View test user

```sql
SELECT id, subscription_tier, whop_customer_id, created_at 
FROM profiles 
LIMIT 1;
```

### View test books

```sql
SELECT id, title, author, genre, platforms 
FROM books 
ORDER BY created_at DESC;
```

### View sales summary

```sql
SELECT 
  b.title,
  sd.platform,
  COUNT(*) as days,
  SUM(sd.units_sold) as total_units,
  SUM(sd.revenue) as total_revenue
FROM sales_data sd
JOIN books b ON sd.book_id = b.id
GROUP BY b.title, sd.platform
ORDER BY b.title, sd.platform;
```

### View launch checklist

```sql
SELECT 
  ct.task_name,
  ct.due_date,
  ct.completed,
  ct.task_order
FROM checklist_tasks ct
JOIN launch_checklists lc ON ct.checklist_id = lc.id
ORDER BY ct.task_order;
```

---

## 🔐 Security Notes

### Never Expose

❌ `SUPABASE_SERVICE_ROLE_KEY` - Keep this secret!
❌ Database password
❌ API keys in public code

### Safe to Expose

✅ `NEXT_PUBLIC_SUPABASE_URL` - Public URL
✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Limited permissions

### Best Practices

- Use `.env.local` for local development (gitignored)
- Use `.env.example` for template (no secrets)
- Set environment variables in Vercel dashboard for production
- Rotate keys regularly
- Use Row Level Security (RLS) on all tables

---

## 🐛 Troubleshooting Commands

### Check CLI version

```bash
supabase --version
```

### Verify connection

```bash
supabase status
```

### View recent errors

```bash
supabase logs --follow
```

### Reset everything

```bash
# WARNING: This deletes all data!
supabase db reset
```

### Check table structure

```sql
-- View all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- View table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'books';
```

---

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **CLI Reference:** https://supabase.com/docs/guides/cli
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security

---

## ✅ Setup Checklist

- [ ] Supabase project created
- [ ] API keys copied to `.env.local`
- [ ] CLI installed: `npm install -g supabase`
- [ ] Linked to project: `supabase link --project-ref xxx`
- [ ] Schema created: `supabase db execute < infra/sql/create_tables.sql`
- [ ] Test user created in Auth dashboard
- [ ] Test user UUID copied
- [ ] Seed data inserted: `supabase db execute < infra/sql/seed.sql`
- [ ] Tables verified in Table Editor
- [ ] Test queries run successfully
- [ ] Dev server starts: `pnpm dev`

---

## 🚀 Next Steps

After database is set up:

1. Start dev server:
   ```bash
   pnpm dev
   ```

2. Test login at http://localhost:3000/auth/login
   - Email: `test@authorstack.com`
   - Password: `TestPassword123!`

3. Implement Supabase auth integration

4. Build dashboard features

---

**All set!** Your database is ready for development. 🎉
