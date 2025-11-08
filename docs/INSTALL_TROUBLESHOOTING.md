# Installation Troubleshooting Guide

Solutions for common installation issues.

## ❌ Issue 1: `pnpm: The term 'pnpm' is not recognized`

**Cause:** pnpm is not installed globally

**Solution A: Install pnpm globally**
```bash
npm install -g pnpm
```

Then verify:
```bash
pnpm --version
```

**Solution B: Use npm instead**
```bash
npm install
npm run dev
```

---

## ❌ Issue 2: `npm error notarget No matching version found for @radix-ui/react-slot@^2.0.2`

**Cause:** Package version doesn't exist in npm registry

**Solution: Already Fixed!**

I've updated `package.json` to use compatible versions:
- `@radix-ui/react-dropdown-menu@^2.0.6` (was ^2.1.1)
- `@radix-ui/react-slot@^2.0.1` (was ^2.0.2)

Now try:
```bash
npm install
```

---

## ✅ Installation Steps (Correct Order)

### Step 1: Clear npm cache (if needed)
```bash
npm cache clean --force
```

### Step 2: Delete node_modules and lock files
```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Or Windows Command Prompt
rmdir /s /q node_modules
del package-lock.json
```

### Step 3: Install dependencies
```bash
npm install
```

### Step 4: Verify installation
```bash
npm --version
node --version
```

### Step 5: Start dev server
```bash
npm run dev
```

---

## 🔧 Alternative: Use pnpm (Recommended)

pnpm is faster and more reliable:

### Install pnpm
```bash
npm install -g pnpm
```

### Install dependencies with pnpm
```bash
pnpm install
```

### Start dev server
```bash
pnpm dev
```

---

## 📋 Verified Commands

### Using npm
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
npm run format       # Format code
npm run type-check   # Check types
```

### Using pnpm
```bash
pnpm install         # Install dependencies
pnpm dev             # Start dev server
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run linter
pnpm format          # Format code
pnpm type-check      # Check types
```

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module 'next'"
**Fix:** Run `npm install` again

### Issue: "Port 3000 already in use"
**Fix:** Use different port
```bash
npm run dev -- -p 3001
```

### Issue: "TypeScript errors"
**Fix:** Run type check
```bash
npm run type-check
```

### Issue: "Module not found errors"
**Fix:** Clear cache and reinstall
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ Verification Checklist

- [ ] Node.js installed (v18+)
- [ ] npm or pnpm installed
- [ ] npm cache cleared (if needed)
- [ ] node_modules deleted (if needed)
- [ ] `npm install` or `pnpm install` completed successfully
- [ ] No error messages during installation
- [ ] `npm run dev` starts without errors
- [ ] Dev server running at http://localhost:3000

---

## 📞 Support

If you still have issues:

1. **Check Node.js version:**
   ```bash
   node --version  # Should be v18 or higher
   ```

2. **Check npm version:**
   ```bash
   npm --version   # Should be v9 or higher
   ```

3. **Check internet connection** - npm needs to download packages

4. **Try clearing npm cache:**
   ```bash
   npm cache clean --force
   ```

5. **Try installing with legacy peer deps:**
   ```bash
   npm install --legacy-peer-deps
   ```

---

## 🚀 Next Steps

After successful installation:

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000

3. Test authentication:
   - Go to http://localhost:3000/auth/signup
   - Create account
   - Verify email
   - Sign in

---

**Installation should now work!** 🎉
