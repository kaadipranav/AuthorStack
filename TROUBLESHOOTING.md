# AuthorStack - Troubleshooting Guide

Solutions for common errors and issues when setting up and running AuthorStack.

---

## 🔴 Critical Errors

### Error: "NEXT_PUBLIC_SUPABASE_URL is not set"

**Cause:** Missing environment variables in `.env.local`

**Solution:**
```bash
# 1. Create .env.local file
# Windows PowerShell
New-Item .env.local

# macOS/Linux
touch .env.local

# 2. Add Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 3. Restart dev server
pnpm dev
```

**Verification:**
```bash
# Check file exists
ls -la .env.local  # macOS/Linux
dir .env.local     # Windows

# Check content
cat .env.local     # macOS/Linux
type .env.local    # Windows
```

---

### Error: "Failed to seed database: Missing Supabase environment variables"

**Cause:** `SUPABASE_SERVICE_ROLE_KEY` not set or incorrect

**Solution:**
```bash
# 1. Get correct key from Supabase Dashboard
# - Go to Settings > API
# - Copy "service_role" key (NOT anon key)

# 2. Update .env.local
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 3. Verify connection
pnpm db:seed

# 4. Check for errors in output
```

**Debug:**
```bash
# Test Supabase connection
pnpm db:seed --verbose

# Check environment
echo $SUPABASE_SERVICE_ROLE_KEY  # macOS/Linux
echo %SUPABASE_SERVICE_ROLE_KEY% # Windows
```

---

### Error: "Cannot find module '@supabase/supabase-js'"

**Cause:** Dependencies not installed

**Solution:**
```bash
# 1. Install all dependencies
pnpm install

# 2. Verify installation
pnpm list @supabase/supabase-js

# 3. Clear cache if needed
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 4. Restart dev server
pnpm dev
```

---

### Error: "Port 3000 already in use"

**Cause:** Another process running on port 3000

**Solution:**

**Windows:**
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual number)
taskkill /PID 12345 /F

# Or use different port
pnpm dev -- -p 3001
```

**macOS/Linux:**
```bash
# Find process on port 3000
lsof -i :3000

# Kill process (replace PID with actual number)
kill -9 12345

# Or use different port
pnpm dev -- -p 3001
```

---

## 🟡 Common Errors

### Error: "TEST_USER_ID not found or invalid"

**Cause:** Test user UUID not set or incorrect

**Solution:**
```bash
# 1. Create test user in Supabase
# - Go to Authentication > Users
# - Click "Add User"
# - Email: test@authorstack.com
# - Password: TestPassword123!
# - Click "Create User"

# 2. Copy the UUID from the user list

# 3. Add to .env.local
TEST_USER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# 4. Seed database
pnpm db:seed
```

**Verify:**
```bash
# Check if user exists in Supabase
# Go to Authentication > Users and look for test@authorstack.com
```

---

### Error: "Build error: Module not found"

**Cause:** Missing or incorrect imports

**Solution:**
```bash
# 1. Clear Next.js cache
rm -rf .next

# 2. Reinstall dependencies
pnpm install

# 3. Check for import errors
pnpm type-check

# 4. Rebuild
pnpm build
```

**Debug:**
```bash
# Check specific file
pnpm type-check -- --noEmit

# Look for red squiggly lines in IDE
# Hover to see error details
```

---

### Error: "TypeScript error: Cannot find type definition"

**Cause:** Missing type definitions

**Solution:**
```bash
# 1. Install missing types
pnpm add -D @types/node @types/react @types/react-dom

# 2. Type check
pnpm type-check

# 3. Rebuild
pnpm build
```

---

### Error: "Supabase connection timeout"

**Cause:** Network issue or invalid credentials

**Solution:**
```bash
# 1. Check internet connection
ping google.com

# 2. Verify Supabase URL format
# Should be: https://xxxxx.supabase.co
# NOT: https://xxxxx.supabase.co/

# 3. Check credentials in Supabase dashboard
# Settings > API > Copy correct keys

# 4. Update .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 5. Test connection
pnpm db:seed
```

---

### Error: "Google OAuth redirect URI mismatch"

**Cause:** Redirect URI not configured in Google Cloud Console

**Solution:**
```bash
# 1. Go to Google Cloud Console
# https://console.cloud.google.com

# 2. Select your project

# 3. Go to APIs & Services > Credentials

# 4. Click on your OAuth 2.0 Client ID

# 5. Add authorized redirect URIs:
# - http://localhost:3000/api/auth/callback/google
# - https://your-domain.com/api/auth/callback/google

# 6. Save and restart dev server
pnpm dev
```

---

### Error: "NextAuth session not working"

**Cause:** Missing or incorrect NextAuth configuration

**Solution:**
```bash
# 1. Verify environment variables
NEXTAUTH_SECRET=your-secure-random-secret
NEXTAUTH_URL=http://localhost:3000

# 2. Generate secure secret
# Windows PowerShell
$secret = [Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))
Write-Host $secret

# macOS/Linux
openssl rand -base64 32

# 3. Update .env.local with generated secret
NEXTAUTH_SECRET=your-generated-secret

# 4. Clear browser cookies
# - Open DevTools (F12)
# - Go to Application > Cookies
# - Delete all cookies for localhost:3000

# 5. Restart dev server
pnpm dev
```

---

### Error: "Prettier formatting fails"

**Cause:** Prettier configuration issue

**Solution:**
```bash
# 1. Check prettier config
cat .prettierrc

# 2. Format specific file
pnpm format -- src/app/page.tsx

# 3. Fix all files
pnpm format

# 4. If still failing, reinstall
pnpm remove prettier
pnpm add -D prettier
pnpm format
```

---

## 🟢 Performance Issues

### Issue: "Dev server is slow"

**Cause:** Large node_modules or cache issues

**Solution:**
```bash
# 1. Clear caches
rm -rf .next node_modules/.cache

# 2. Rebuild
pnpm dev

# 3. If still slow, reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

---

### Issue: "Build takes too long"

**Cause:** Large bundle or unoptimized code

**Solution:**
```bash
# 1. Analyze bundle
pnpm build

# 2. Check for unused dependencies
pnpm list --depth=0

# 3. Remove unused packages
pnpm remove <package-name>

# 4. Rebuild
pnpm build
```

---

### Issue: "High memory usage"

**Cause:** Node process using too much memory

**Solution:**
```bash
# 1. Increase Node memory limit
NODE_OPTIONS=--max-old-space-size=4096 pnpm dev

# 2. Or restart dev server
# Kill process and restart
pnpm dev
```

---

## 🔧 Database Issues

### Issue: "Seed script fails silently"

**Cause:** Database connection issue

**Solution:**
```bash
# 1. Check Supabase status
# Go to https://status.supabase.com

# 2. Verify credentials
echo $SUPABASE_SERVICE_ROLE_KEY

# 3. Test with verbose output
pnpm db:seed

# 4. Check Supabase logs
# Go to Supabase Dashboard > Logs

# 5. Try again
pnpm db:seed
```

---

### Issue: "Seed data not appearing in database"

**Cause:** Seed script ran but data not saved

**Solution:**
```bash
# 1. Check Supabase tables
# Go to Supabase Dashboard > SQL Editor
# Run: SELECT * FROM profiles;

# 2. Verify test user exists
# Go to Authentication > Users

# 3. Check RLS policies
# Go to Authentication > Policies
# Ensure policies allow inserts

# 4. Reseed with fresh data
pnpm db:reset
pnpm db:seed
```

---

### Issue: "Cannot connect to local Supabase"

**Cause:** Local Supabase not running

**Solution:**
```bash
# 1. Start local Supabase
supabase start

# 2. Check status
supabase status

# 3. Update .env.local with local URL
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 4. Seed database
pnpm db:seed
```

---

## 🧪 Testing Issues

### Error: "Jest tests fail"

**Cause:** Missing test configuration

**Solution:**
```bash
# 1. Check jest.config.js exists
ls jest.config.js

# 2. Run tests with verbose output
pnpm test -- --verbose

# 3. Run specific test
pnpm test -- dashboard-overview.test.ts

# 4. Clear cache
pnpm test -- --clearCache
```

---

### Error: "Cannot find test files"

**Cause:** Test files not in correct location

**Solution:**
```bash
# 1. Check test file location
# Should be in __tests__ directory

# 2. Verify file naming
# Should end with .test.ts or .test.tsx

# 3. Run tests
pnpm test
```

---

## 📋 Diagnostic Checklist

Run this checklist to diagnose issues:

```bash
# 1. Check Node version
node --version  # Should be 18+

# 2. Check pnpm version
pnpm --version  # Should be 8+

# 3. Check .env.local exists
ls .env.local

# 4. Check dependencies installed
pnpm list | head -20

# 5. Check TypeScript
pnpm type-check

# 6. Check linting
pnpm lint

# 7. Check build
pnpm build

# 8. Check database connection
pnpm db:seed

# 9. Start dev server
pnpm dev

# 10. Visit http://localhost:3000
```

---

## 🆘 Getting Help

If you're still stuck:

1. **Check error message carefully** - Read the full error output
2. **Search documentation** - Check SETUP_GUIDE.md and QUICK_COMMANDS.md
3. **Check environment variables** - Verify .env.local is correct
4. **Try clean install** - `rm -rf node_modules && pnpm install`
5. **Check Supabase status** - Go to https://status.supabase.com
6. **Review logs** - Check console output and Supabase logs
7. **Ask for help** - Include error message and steps to reproduce

---

## 📞 Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **NextAuth Docs:** https://next-auth.js.org
- **Tailwind Docs:** https://tailwindcss.com/docs

---

**Last Updated:** November 2025
**Version:** 1.0.0
