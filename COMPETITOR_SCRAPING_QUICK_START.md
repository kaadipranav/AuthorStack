# Competitor Scraping - Quick Start

Fast reference for testing competitor price scraping.

## 🚀 5-Minute Test

### Step 1: Test Mock Scraper
```bash
# Trigger cron with mock data (no setup needed)
curl -X GET http://localhost:3000/api/cron/check-competitors \
  -H "Authorization: Bearer your-cron-secret"
```

### Step 2: Check Response
```json
{
  "success": true,
  "pricesChecked": 2,
  "pricesUpdated": 2,
  "alertsTriggered": 0
}
```

### Step 3: Import CSV
```bash
curl -X POST http://localhost:3000/api/competitors/import-csv \
  -H "Content-Type: application/json" \
  -d '{
    "csv": "asin,title,author,price,currency\nB0ABC123DEF,Book 1,Author 1,14.99,USD"
  }'
```

---

## 📋 CSV Format

```csv
asin,title,author,genre,price,currency
B0ABC123DEF,Book Title,Author Name,Fiction,14.99,USD
B0XYZ789GHI,Another Book,Another Author,Non-Fiction,19.99,USD
```

---

## 🧪 Test Cases

### Test 1: Mock Scraper
1. Run cron endpoint
2. ✓ Returns 2 prices checked
3. ✓ Prices saved to database

### Test 2: CSV Import
1. Create CSV file
2. Import via API
3. ✓ Competitors added
4. ✓ Prices saved

### Test 3: Price Change Detection
1. Import competitor at $19.99
2. Update mock price to $17.99
3. Run cron
4. ✓ Price change detected
5. ✓ Alert triggered

---

## 🔧 Cron Endpoints

### Check Competitors
```
GET /api/cron/check-competitors
Authorization: Bearer your-cron-secret
```

### Import CSV
```
POST /api/competitors/import-csv
Content-Type: application/json
{
  "csv": "asin,title,price\n..."
}
```

---

## 📊 Mock Prices

Default mock prices in scraper:
- B0ABC123DEF: $14.99
- B0XYZ789GHI: $12.99
- B001COMPETITOR1: $19.99
- B002COMPETITOR2: $24.99

---

## 🎯 MVP Approach

**Recommended for MVP:**
1. Use CSV import
2. Manual upload of competitor prices
3. No rate limiting issues
4. Simple and reliable

**Upgrade later:**
1. Add Playwright scraper
2. Use proxies
3. Automate price checks

---

## 📚 Files

| File | Purpose |
|---|---|
| `lib/scrapers/base.ts` | Base interface |
| `lib/scrapers/amazon.ts` | Amazon scraper |
| `app/api/cron/check-competitors/route.ts` | Cron endpoint |
| `app/api/competitors/import-csv/route.ts` | CSV import |

---

## ✅ Checklist

- [ ] Dev server running
- [ ] Cron endpoint tested
- [ ] Mock prices returned
- [ ] CSV import works
- [ ] Prices saved to database
- [ ] Price changes detected

---

**Ready to test!** 🎉

```bash
curl -X GET http://localhost:3000/api/cron/check-competitors \
  -H "Authorization: Bearer your-cron-secret"
```
