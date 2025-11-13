# AuthorStack - Scripts Setup Summary

Complete summary of all scripts, commands, and setup instructions added to the project.

---

## ✅ What Was Added

### 1. Updated `package.json` Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:seed": "tsx scripts/seed-db.ts",
    "db:migrate": "supabase migration up",
    "db:reset": "supabase db reset",
    "setup": "pnpm install && pnpm db:seed"
  }
}
```

### 2. New Database Seed Script

**File:** `scripts/seed-db.ts`

**Features:**
- Creates test profile with Pro tier
- Generates 2 sample books
- Creates 2 platform connections (Amazon, Gumroad)
- Seeds 56 sales records (14 days of data)
- Creates launch checklist with 5 tasks
- Adds 2 tracked competitors
- Generates 4 price history records

**Run with:**
```bash
pnpm db:seed
```

### 3. Documentation Files

#### A. `SETUP_GUIDE.md` (Comprehensive)
- 5-minute quick start
- Environment variables setup
- Database configuration options
- Testing instructions
- Deployment guide
- Troubleshooting section

#### B. `QUICK_COMMANDS.md` (Fast Reference)
- Most used commands
- Database commands table
- Build commands table
- Testing commands
- One-liners for common tasks
- Troubleshooting commands

#### C. `SCRIPTS_REFERENCE.md` (Detailed)
- Complete package.json scripts
- Exact terminal commands
- Seed data details
- Environment variables required
- Step-by-step setup
- Common workflows
- CI/CD examples

#### D. `TROUBLESHOOTING.md` (Problem Solving)
- Critical errors with solutions
- Common errors with fixes
- Performance issues
- Database issues
- Testing issues
- Diagnostic checklist
- Support resources

---

## 🚀 Quick Start Commands

### Installation & Setup
```bash
# 1. Install dependencies
pnpm install

# 2. Create .env.local with credentials
# (See SETUP_GUIDE.md for details)

# 3. Create test user in Supabase
# Email: test@authorstack.com
# Password: TestPassword123!

# 4. Seed database
pnpm db:seed

# 5. Start development
pnpm dev
```

### Most Used Commands
```bash
pnpm dev              # Start development server
pnpm db:seed          # Seed database with sample data
pnpm build            # Build for production
pnpm lint             # Check code quality
pnpm format           # Format code
pnpm test             # Run tests
pnpm setup            # Install + seed (one command)
```

---

## 📊 Database Seeding Details

### What Gets Created
- **1 Test Profile** - test@authorstack.com (Pro tier)
- **2 Books** - Sample books with ASINs
- **2 Platform Connections** - Amazon & Gumroad
- **56 Sales Records** - 14 days of sales data
- **1 Launch Checklist** - 30 days from now
- **5 Checklist Tasks** - Mixed completed/pending
- **2 Competitors** - For price tracking
- **4 Price History Records** - Competitor prices

### Seed Script Location
```
scripts/seed-db.ts
```

### Run Seeding
```bash
pnpm db:seed
```

### Reset & Reseed
```bash
# WARNING: Deletes all data
pnpm db:reset

# Then reseed
pnpm db:seed
```

---

## 🔐 Environment Variables

### Required for Development
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth
NEXTAUTH_SECRET=your-secure-random-secret
NEXTAUTH_URL=http://localhost:3000

# Seeding
TEST_USER_ID=your-test-user-uuid
```

### Create .env.local
```bash
# Create file
touch .env.local  # macOS/Linux
New-Item .env.local  # Windows

# Add variables (see above)
```

---

## 📚 Documentation Files

| File | Purpose | Size |
|------|---------|------|
| `SETUP_GUIDE.md` | Complete setup instructions | ~5KB |
| `QUICK_COMMANDS.md` | Fast command reference | ~3KB |
| `SCRIPTS_REFERENCE.md` | Detailed scripts documentation | ~8KB |
| `TROUBLESHOOTING.md` | Error solutions & fixes | ~10KB |
| `SCRIPTS_SETUP_SUMMARY.md` | This file | ~3KB |

---

## 🎯 Common Workflows

### Fresh Start
```bash
pnpm install && pnpm db:seed && pnpm dev
```

### Before Committing
```bash
pnpm format && pnpm type-check && pnpm lint && pnpm test
```

### Production Build
```bash
pnpm build && pnpm start
```

### Clean Reinstall
```bash
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
pnpm db:seed
pnpm dev
```

---

## 🧪 Testing

### Run All Tests
```bash
pnpm test
```

### Watch Mode
```bash
pnpm test:watch
```

### Coverage Report
```bash
pnpm test:coverage
```

### Test Files Location
```
__tests__/
├── api/
│   └── dashboard-overview.test.ts
└── utils/
    └── forecast.test.ts
```

---

## 🚀 Deployment

### Vercel
```bash
pnpm build
vercel deploy
```

### Environment Variables on Vercel
1. Go to Project Settings > Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

---

## 🐛 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Module not found | `pnpm install` |
| Port 3000 in use | `pnpm dev -- -p 3001` |
| Env vars not loading | Restart dev server |
| Build fails | `rm -rf .next && pnpm build` |
| Seed fails | Check `SUPABASE_SERVICE_ROLE_KEY` |
| TypeScript errors | `pnpm type-check` |

**See `TROUBLESHOOTING.md` for detailed solutions**

---

## 📋 Verification Checklist

After setup, verify everything works:

```bash
# ✓ Dependencies installed
pnpm list | head -5

# ✓ Environment variables set
cat .env.local

# ✓ Database seeded
pnpm db:seed

# ✓ Dev server starts
pnpm dev

# ✓ Visit http://localhost:3000
# Should see AuthorStack dashboard

# ✓ Tests pass
pnpm test

# ✓ Build succeeds
pnpm build
```

---

## 💡 Pro Tips

1. **Use `pnpm setup`** - Installs dependencies and seeds in one command
2. **Bookmark `QUICK_COMMANDS.md`** - For fast command lookup
3. **Check `TROUBLESHOOTING.md`** - Before asking for help
4. **Use `.env.local`** - Never commit to git
5. **Keep `SUPABASE_SERVICE_ROLE_KEY` secret** - Only use server-side

---

## 📞 Getting Help

1. Check relevant documentation file:
   - Quick reference → `QUICK_COMMANDS.md`
   - Setup issues → `SETUP_GUIDE.md`
   - Errors → `TROUBLESHOOTING.md`
   - Details → `SCRIPTS_REFERENCE.md`

2. Run diagnostic commands:
   ```bash
   node --version
   pnpm --version
   cat .env.local
   pnpm type-check
   ```

3. Check error messages carefully - they usually point to the solution

---

## 📦 Dependencies Added

### For Database Seeding
- `tsx` (v4.7.0) - Run TypeScript scripts

### Already Included
- `@supabase/supabase-js` - Supabase client
- `next` - Next.js framework
- `typescript` - TypeScript compiler

---

## 🎉 You're All Set!

Everything is configured and ready to use. Start with:

```bash
pnpm dev
```

Then visit `http://localhost:3000` to see your AuthorStack dashboard!

---

**Created:** November 2025
**Version:** 1.0.0
**Status:** ✅ Complete
