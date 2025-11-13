# AuthorStack - Scripts Reference

Complete reference for all npm/pnpm scripts and exact terminal commands.

---

## 📦 package.json Scripts

### Current Scripts Configuration

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

---

## 🎯 Running Scripts

### Development
```bash
# Start development server (port 3000)
pnpm dev

# Start on different port
pnpm dev -- -p 3001

# Build for production
pnpm build

# Start production server
pnpm start
```

### Database
```bash
# Seed database with sample data
pnpm db:seed

# Run pending migrations
pnpm db:migrate

# Reset database (WARNING: deletes all data)
pnpm db:reset

# Complete setup (install dependencies + seed)
pnpm setup
```

### Code Quality
```bash
# Run ESLint
pnpm lint

# Format all files
pnpm format

# Type check with TypeScript
pnpm type-check

# Run Jest tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

---

## 🌱 Database Seeding Details

### What `pnpm db:seed` Does

The seed script (`scripts/seed-db.ts`) creates:

1. **Test Profile**
   - Email: `test@authorstack.com`
   - Tier: Pro
   - Whop Customer ID: `whop_test_customer_123`

2. **2 Sample Books**
   - "The Art of Book Marketing" (ASIN: B0ABC123DEF)
   - "Midnight in the Garden" (ASIN: B0XYZ789GHI)

3. **2 Platform Connections**
   - Amazon (active)
   - Gumroad (active)

4. **56 Sales Records**
   - 14 days of data
   - 2 books × 2 platforms
   - Random units & revenue

5. **1 Launch Checklist**
   - 30 days from now
   - 5 tasks (2 completed, 3 pending)

6. **2 Tracked Competitors**
   - "The Complete Guide to Self-Publishing"
   - "Marketing Your Book Successfully"

7. **4 Price History Records**
   - Competitor price tracking
   - Shows price changes

### Seed Script Location
- **File:** `scripts/seed-db.ts`
- **Runs with:** `pnpm db:seed`
- **Requires:** `SUPABASE_SERVICE_ROLE_KEY` environment variable

---

## 🔐 Environment Variables Required

### For Development
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
# Windows PowerShell
@"
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-secure-random-secret
NEXTAUTH_URL=http://localhost:3000
TEST_USER_ID=your-test-user-uuid
"@ | Out-File .env.local

# macOS/Linux
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-secure-random-secret
NEXTAUTH_URL=http://localhost:3000
TEST_USER_ID=your-test-user-uuid
EOF
```

---

## 📋 Step-by-Step Setup

### 1. Clone & Install
```bash
# Clone repository
git clone <repo-url>
cd AuthorStack

# Install dependencies
pnpm install
```

### 2. Configure Environment
```bash
# Create .env.local with your credentials
# See "Create .env.local" section above
```

### 3. Create Test User
```bash
# In Supabase Dashboard:
# 1. Go to Authentication > Users
# 2. Add User
# 3. Email: test@authorstack.com
# 4. Password: TestPassword123!
# 5. Copy UUID and set TEST_USER_ID in .env.local
```

### 4. Seed Database
```bash
pnpm db:seed
```

### 5. Start Development
```bash
pnpm dev
```

Visit `http://localhost:3000` ✅

---

## 🚀 Common Workflows

### Fresh Development Start
```bash
# Install dependencies
pnpm install

# Seed database
pnpm db:seed

# Start dev server
pnpm dev
```

### Before Committing Code
```bash
# Format code
pnpm format

# Check types
pnpm type-check

# Run linter
pnpm lint

# Run tests
pnpm test
```

### Production Build
```bash
# Type check
pnpm type-check

# Build
pnpm build

# Test production build locally
pnpm start
```

### Reset Everything
```bash
# Delete node_modules and lock file
rm -rf node_modules pnpm-lock.yaml

# Reinstall
pnpm install

# Reseed database
pnpm db:seed

# Start fresh
pnpm dev
```

---

## 🐛 Troubleshooting Commands

### Check Node/pnpm Version
```bash
node --version
pnpm --version
```

### Verify Environment Variables
```bash
# Windows PowerShell
Get-Content .env.local

# macOS/Linux
cat .env.local
```

### Clear All Caches
```bash
# Clear Next.js cache
rm -rf .next

# Clear pnpm cache
pnpm store prune

# Clear node_modules
rm -rf node_modules
```

### Reinstall Everything
```bash
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
pnpm db:seed
pnpm dev
```

### Check Database Connection
```bash
# Run seed to test connection
pnpm db:seed

# If successful, database is connected
```

### View Build Output
```bash
# Verbose build
pnpm build --verbose

# Check for errors
pnpm type-check
```

---

## 📊 Script Execution Flow

### `pnpm setup` Flow
```
pnpm setup
├── pnpm install (installs dependencies)
└── pnpm db:seed (seeds database)
    ├── Creates test profile
    ├── Creates sample books
    ├── Creates platform connections
    ├── Creates sales data
    ├── Creates launch checklist
    ├── Creates competitors
    └── Creates price history
```

### `pnpm dev` Flow
```
pnpm dev
├── Starts Next.js dev server
├── Watches for file changes
├── Compiles TypeScript
├── Hot reloads on save
└── Available at http://localhost:3000
```

### `pnpm build` Flow
```
pnpm build
├── Type checks all files
├── Compiles TypeScript
├── Bundles code
├── Optimizes assets
└── Creates .next directory
```

---

## 🔄 CI/CD Commands

### GitHub Actions Example
```yaml
- name: Install dependencies
  run: pnpm install

- name: Type check
  run: pnpm type-check

- name: Lint
  run: pnpm lint

- name: Test
  run: pnpm test

- name: Build
  run: pnpm build
```

---

## 📝 Notes

- **`pnpm`** is used instead of `npm` for faster installation
- **`tsx`** is used to run TypeScript scripts directly
- **`supabase`** CLI is required for migrations
- All scripts are defined in `package.json`
- Environment variables must be in `.env.local` for local development

---

## 🆘 Quick Help

| Need | Command |
|------|---------|
| Start coding | `pnpm dev` |
| Add dependencies | `pnpm add <package>` |
| Remove dependencies | `pnpm remove <package>` |
| Update dependencies | `pnpm update` |
| Check outdated | `pnpm outdated` |
| Run specific test | `pnpm test -- <filename>` |
| Format specific file | `pnpm format -- <filename>` |

---

**Last Updated:** November 2025
**Version:** 1.0.0
