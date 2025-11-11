# AuthorStack - Commands Cheatsheet

Quick visual reference for all commands. Print this page!

---

## 🎯 START HERE

```bash
# First time setup (one command)
pnpm setup

# Then start development
pnpm dev

# Visit http://localhost:3000
```

---

## 📦 Installation

```bash
# Install all dependencies
pnpm install

# Add a package
pnpm add <package-name>

# Remove a package
pnpm remove <package-name>

# Update all packages
pnpm update
```

---

## 🚀 Development

```bash
# Start dev server (port 3000)
pnpm dev

# Start on different port
pnpm dev -- -p 3001

# Build for production
pnpm build

# Start production server
pnpm start
```

---

## 🗄️ Database

```bash
# Seed with sample data
pnpm db:seed

# Run migrations
pnpm db:migrate

# Reset database (⚠️ deletes all data)
pnpm db:reset

# Install + Seed (one command)
pnpm setup
```

---

## 🧹 Code Quality

```bash
# Check for errors
pnpm lint

# Auto-format code
pnpm format

# Type check
pnpm type-check

# All checks at once
pnpm lint && pnpm type-check && pnpm format
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Watch mode (re-run on changes)
pnpm test:watch

# Coverage report
pnpm test:coverage

# Run specific test
pnpm test -- <filename>
```

---

## 🔥 One-Liners

```bash
# Fresh start
pnpm install && pnpm db:seed && pnpm dev

# Before committing
pnpm format && pnpm type-check && pnpm lint && pnpm test

# Production build
pnpm build && pnpm start

# Clean everything
rm -rf node_modules .next pnpm-lock.yaml && pnpm install && pnpm dev
```

---

## 🐛 Troubleshooting

```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml && pnpm install

# Check port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # macOS/Linux

# Kill process on port 3000
taskkill /PID <PID> /F         # Windows
kill -9 <PID>                  # macOS/Linux

# Use different port
pnpm dev -- -p 3001
```

---

## 📋 Environment Setup

```bash
# Create .env.local
touch .env.local  # macOS/Linux
New-Item .env.local  # Windows

# Add these variables:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-secure-random-secret
NEXTAUTH_URL=http://localhost:3000
TEST_USER_ID=your-test-user-uuid
```

---

## 📊 Seed Data Created

Running `pnpm db:seed` creates:

```
✓ 1 test profile (test@authorstack.com)
✓ 2 sample books
✓ 2 platform connections
✓ 56 sales records
✓ 1 launch checklist
✓ 5 checklist tasks
✓ 2 tracked competitors
✓ 4 price history records
```

---

## 🎯 Common Tasks

| Task | Command |
|------|---------|
| Start coding | `pnpm dev` |
| Add dependency | `pnpm add <pkg>` |
| Remove dependency | `pnpm remove <pkg>` |
| Format code | `pnpm format` |
| Check types | `pnpm type-check` |
| Run tests | `pnpm test` |
| Build app | `pnpm build` |
| Seed database | `pnpm db:seed` |

---

## 🚀 Deployment

```bash
# Vercel
vercel deploy

# Build check
pnpm build

# Production test
pnpm start
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `SETUP_GUIDE.md` | Complete setup instructions |
| `QUICK_COMMANDS.md` | Fast command reference |
| `SCRIPTS_REFERENCE.md` | Detailed documentation |
| `TROUBLESHOOTING.md` | Error solutions |
| `COMMANDS_CHEATSHEET.md` | This file |

---

## 🆘 Quick Help

```bash
# Check versions
node --version
pnpm --version

# List dependencies
pnpm list

# Check outdated packages
pnpm outdated

# View script help
pnpm run

# Clear pnpm cache
pnpm store prune
```

---

## ✅ Verification

After setup, run:

```bash
# All should pass ✓
pnpm type-check
pnpm lint
pnpm test
pnpm build
pnpm db:seed
pnpm dev
```

---

## 💡 Pro Tips

- **Bookmark this page** - For quick reference
- **Use `pnpm setup`** - Installs + seeds in one command
- **Check `TROUBLESHOOTING.md`** - Before asking for help
- **Use `.env.local`** - Never commit to git
- **Keep secrets safe** - Don't share API keys

---

## 🎉 Ready to Go!

```bash
pnpm dev
```

Visit `http://localhost:3000` 🚀

---

**Print this page for quick reference!** 📌
