# Gumroad Integration - Quick Reference

Fast reference for Gumroad integration testing and usage.

## 🚀 Quick Test (2 minutes)

```bash
# 1. Start dev server
pnpm dev

# 2. Sign in
# Email: testuser@example.com
# Password: TestPassword123!

# 3. Go to Settings
http://localhost:3000/settings

# 4. Click "Connect / Manage Gumroad"
# Enter any text as API key (for testing)
# Click "Connect Gumroad"

# 5. Go to "Data Sync"
# Check "Use mock data for testing"
# Click "Sync Now"

# 6. Watch progress logs
# Should see: "Fetched 14 sales from Gumroad"
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `lib/integrations/gumroad.ts` | Service logic |
| `app/api/platforms/sync/route.ts` | Sync API |
| `components/platforms/ConnectGumroadForm.tsx` | Connection form |
| `components/platforms/SyncButton.tsx` | Sync button |
| `app/platforms/connect/page.tsx` | Connect page |

---

## 🔧 API Endpoints

### POST /api/platforms/sync

**Mock data:**
```bash
curl -X POST http://localhost:3000/api/platforms/sync \
  -H "Content-Type: application/json" \
  -d '{"platform":"gumroad","useMockData":true}'
```

**Real data:**
```bash
curl -X POST http://localhost:3000/api/platforms/sync \
  -H "Content-Type: application/json" \
  -d '{"platform":"gumroad","useMockData":false}'
```

---

## 🧪 Test Cases

### Test 1: Connect (Mock)
1. Visit /settings
2. Click "Connect / Manage Gumroad"
3. Enter test key
4. ✓ Redirects to settings

### Test 2: Sync (Mock)
1. Go to Data Sync
2. Check "Use mock data"
3. Click "Sync Now"
4. ✓ See logs, 14 records inserted

### Test 3: Sync (Real)
1. Connect real Gumroad account
2. Uncheck "Use mock data"
3. Click "Sync Now"
4. ✓ Real sales synced

### Test 4: Error Handling
1. Invalid API key → Error shown
2. No books → Error shown
3. Rate limit → Retry with backoff

---

## 📊 Mock Data

14 days of sales data:
- 1-3 sales per day
- Random prices: $5-$55
- Aggregated by date

---

## 🔐 Security

✓ API keys encrypted
✓ Stored in JSONB credentials
✓ Never logged
✓ Revocable from Gumroad

---

## ⚡ Retry Logic

- 3 retry attempts
- Exponential backoff (1s, 2s, 4s)
- Handles rate limiting
- Handles timeouts

---

## 📈 Data Flow

```
Connect Form → Save API Key → Sync Button
                                   ↓
                        POST /api/platforms/sync
                                   ↓
                        Fetch Gumroad Sales
                                   ↓
                        Normalize & Aggregate
                                   ↓
                        Insert into sales_data
                                   ↓
                        Show Progress Logs
```

---

## 🎯 Features

✓ Encrypted credentials
✓ Retry with backoff
✓ Mock data support
✓ Real-time logs
✓ Error handling
✓ Rate limiting

---

## 📚 Documentation

- `GUMROAD_INTEGRATION.md` - Full guide
- `GUMROAD_QUICK_REFERENCE.md` - This file

---

## ✅ Checklist

- [ ] Dev server running
- [ ] Signed in
- [ ] Connected Gumroad (mock)
- [ ] Synced with mock data
- [ ] Saw progress logs
- [ ] Dashboard updated

---

**Ready to test!** 🎉

Visit http://localhost:3000/settings
