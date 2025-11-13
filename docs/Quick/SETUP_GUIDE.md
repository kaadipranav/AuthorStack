# AuthorStack - Setup & Development Guide

Complete guide for setting up and running AuthorStack locally with database seeding and troubleshooting.

---

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Environment Variables
Create `.env.local` in the project root:

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

# Test User (for seeding)
TEST_USER_ID=your-test-user-uuid
```

### 3. Create Test User in Supabase
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication** > **Users**
3. Click **Add User**
4. Email: `test@authorstack.com`
5. Password: `TestPassword123!`
6. Copy the UUID and set it as `TEST_USER_ID` in `.env.local`

### 4. Seed Database
```bash
pnpm db:seed
```

### 5. Start Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000` 🎉

---

## 📋 Available Scripts

### Development
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Database
```bash
# Seed database with sample data
pnpm db:seed

# Run migrations
pnpm db:migrate

# Reset database (WARNING: deletes all data)
pnpm db:reset

# Complete setup (install + seed)
pnpm setup
```

### Code Quality
```bash
# Run linter
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

---

## 🗄️ Database Setup

### Option 1: Supabase Cloud (Recommended)
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and keys to `.env.local`
4. Run migrations and seed:
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

### Option 2: Local Supabase (Docker)
```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Run migrations
supabase migration up

# Seed database
pnpm db:seed
```

---

## 🌱 Database Seeding

### What Gets Seeded?
The `pnpm db:seed` command creates:

- **1 Test Profile** - `test@authorstack.com` (Pro tier)
- **2 Sample Books** - "The Art of Book Marketing" & "Midnight in the Garden"
- **2 Platform Connections** - Amazon & Gumroad
- **56 Sales Records** - 14 days of sales data across platforms
- **1 Launch Checklist** - 30 days from now with 5 tasks
- **2 Tracked Competitors** - For price tracking
- **4 Price History Records** - Competitor price history

### Manual Seeding
If you need to reseed:

```bash
# Reset database (WARNING: deletes all data)
pnpm db:reset

# Seed again
pnpm db:seed
```

### Seed Data Locations
- Seed script: `scripts/seed-db.ts`
- Reference data: `infra/seed-data.json`

---

## 🔐 Environment Variables

### Required
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Google OAuth
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-secure-random-secret
NEXTAUTH_URL=http://localhost:3000
```

### Optional
```bash
# Test user UUID for seeding
TEST_USER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Resend Email
RESEND_API_KEY=your-resend-api-key

# Cron Jobs
CRON_SECRET=your-cron-secret
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

### Test Files
- Dashboard API: `__tests__/api/dashboard-overview.test.ts`
- Forecast Utils: `__tests__/utils/forecast.test.ts`

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution:**
```bash
pnpm install
pnpm install @supabase/supabase-js
```

### Issue: "NEXT_PUBLIC_SUPABASE_URL is not set"
**Solution:**
1. Create `.env.local` file in project root
2. Add Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Restart dev server: `pnpm dev`

### Issue: "Failed to seed database: Missing Supabase environment variables"
**Solution:**
1. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
2. Check `.env.local` file exists
3. Verify credentials are correct in Supabase dashboard
4. Run: `pnpm db:seed`

### Issue: "TEST_USER_ID not found or invalid"
**Solution:**
1. Create test user in Supabase Auth:
   - Email: `test@authorstack.com`
   - Password: `TestPassword123!`
2. Copy the UUID from Supabase dashboard
3. Set in `.env.local`:
   ```bash
   TEST_USER_ID=your-uuid-here
   ```
4. Run: `pnpm db:seed`

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Use different port
pnpm dev -- -p 3001

# Or kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Issue: "Build error: Module not found"
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Issue: "TypeScript errors after update"
**Solution:**
```bash
# Type check
pnpm type-check

# Fix issues
pnpm format
```

### Issue: "Supabase connection timeout"
**Solution:**
1. Check internet connection
2. Verify Supabase project is running
3. Check credentials in `.env.local`
4. Try again: `pnpm dev`

### Issue: "Google OAuth redirect URI mismatch"
**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your OAuth app
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google`
4. Save and restart dev server

### Issue: "NextAuth session not working"
**Solution:**
1. Ensure `NEXTAUTH_SECRET` is set (random 32+ char string)
2. Ensure `NEXTAUTH_URL=http://localhost:3000`
3. Check cookies are enabled in browser
4. Clear browser cache and restart dev server

---

## 📊 Database Schema

### Main Tables
- `profiles` - User profiles
- `books` - Books data
- `sales` - Sales records
- `platform_connections` - Platform integrations
- `launch_checklists` - Launch planning
- `checklist_tasks` - Individual tasks
- `tracked_competitors` - Competitor tracking
- `price_history` - Price history records

### Relationships
```
profiles (1) ──→ (many) books
profiles (1) ──→ (many) sales
profiles (1) ──→ (many) platform_connections
profiles (1) ──→ (many) launch_checklists
books (1) ──→ (many) sales
launch_checklists (1) ──→ (many) checklist_tasks
tracked_competitors (1) ──→ (many) price_history
```

---

## 🚀 Deployment

### Vercel
```bash
# Build
pnpm build

# Deploy
vercel deploy
```

### Environment Variables on Vercel
1. Go to Project Settings > Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

### Database Migrations on Vercel
```bash
# Before deployment
pnpm db:migrate
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 💡 Tips

1. **Use `.env.local` for local development** - Never commit to git
2. **Keep `SUPABASE_SERVICE_ROLE_KEY` secret** - Only use in server-side code
3. **Test with seed data first** - Before connecting real platforms
4. **Check logs** - `pnpm dev` shows helpful error messages
5. **Use TypeScript** - Catch errors before runtime

---

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review error messages carefully
3. Check `.env.local` configuration
4. Verify Supabase credentials
5. Try clearing cache: `rm -rf .next node_modules`
6. Restart dev server: `pnpm dev`

---

**Last Updated:** November 2025
**Version:** 1.0.0
