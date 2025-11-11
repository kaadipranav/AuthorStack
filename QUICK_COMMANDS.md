# AuthorStack - Quick Commands Reference

Fast lookup for common development commands.

---

## 🎯 Most Used Commands

### Start Development
```bash
pnpm dev
```
Starts Next.js dev server at `http://localhost:3000`

### Seed Database
```bash
pnpm db:seed
```
Creates sample data (books, sales, competitors, etc.)

### Install Dependencies
```bash
pnpm install
```
Installs all required packages

---

## 🗄️ Database Commands

| Command | Purpose |
|---------|---------|
| `pnpm db:seed` | Seed with sample data |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm db:reset` | ⚠️ Delete all data & reset |
| `pnpm setup` | Install deps + seed |

---

## 🏗️ Build Commands

| Command | Purpose |
|---------|---------|
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Check code quality |
| `pnpm format` | Auto-format code |
| `pnpm type-check` | Check TypeScript types |

---

## 🧪 Testing Commands

| Command | Purpose |
|---------|---------|
| `pnpm test` | Run all tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Generate coverage report |

---

## ⚡ One-Liners

### Fresh Start
```bash
pnpm install && pnpm db:seed && pnpm dev
```

### Clean Build
```bash
rm -rf .next node_modules && pnpm install && pnpm build
```

### Check Everything
```bash
pnpm type-check && pnpm lint && pnpm test
```

---

## 🔧 Troubleshooting Commands

### Clear Cache
```bash
rm -rf .next
```

### Reinstall Dependencies
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Check Port 3000
```bash
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000
```

### Kill Process on Port 3000
```bash
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

---

## 📝 Environment Setup

### Create .env.local
```bash
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

## 🚀 Deployment

### Vercel
```bash
vercel deploy
```

### Build Check
```bash
pnpm build
```

---

## 📊 Seed Data Summary

Running `pnpm db:seed` creates:
- 1 test profile
- 2 sample books
- 2 platform connections
- 56 sales records
- 1 launch checklist with 5 tasks
- 2 tracked competitors
- 4 price history records

---

## 🆘 Quick Fixes

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `pnpm dev -- -p 3001` |
| Module not found | `pnpm install` |
| Build fails | `rm -rf .next && pnpm build` |
| TypeScript errors | `pnpm type-check` |
| Env vars not loading | Restart dev server |

---

**Tip:** Bookmark this page for quick reference! 📌
