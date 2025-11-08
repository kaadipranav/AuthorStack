# Competitor Price Scraping - Setup Guide

Complete implementation of competitor price tracking with Playwright scraping and CSV fallback.

## ✅ What's Implemented

### Backend
- ✓ Base scraper interface (`lib/scrapers/base.ts`)
- ✓ Amazon scraper (`lib/scrapers/amazon.ts`)
- ✓ Cron endpoint (`app/api/cron/check-competitors/route.ts`)
- ✓ CSV import endpoint (`app/api/competitors/import-csv/route.ts`)

### Features
- ✓ Mock scraper for testing (no Playwright required)
- ✓ Price change detection
- ✓ Price history tracking
- ✓ CSV fallback for manual upload
- ✓ Rate limiting recommendations
- ✓ Proxy support ready
- ✓ Error handling and logging

---

## 🚀 Quick Start

### Option 1: Mock Scraper (Testing)

No setup required! The scraper uses mock data by default.

```bash
# Test the cron endpoint
curl -X GET http://localhost:3000/api/cron/check-competitors \
  -H "Authorization: Bearer your-cron-secret"
```

### Option 2: Real Playwright Scraper (Production)

```bash
# Install Playwright
pnpm add -D playwright

# Install browsers
npx playwright install chromium
```

Then update `lib/scrapers/amazon.ts` to use real Playwright (see code comments).

### Option 3: CSV Import (Recommended for MVP)

```bash
# Import competitor prices via CSV
curl -X POST http://localhost:3000/api/competitors/import-csv \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -d '{
    "csv": "asin,title,author,genre,price,currency\nB0ABC123DEF,Book Title,Author,Fiction,14.99,USD"
  }'
```

---

## 📊 Example Output

### Cron Endpoint Response

```json
{
  "success": true,
  "pricesChecked": 2,
  "pricesUpdated": 2,
  "alertsTriggered": 1,
  "logs": [
    {
      "timestamp": "2025-11-08T10:30:00.000Z",
      "message": "Starting competitor price check cron job",
      "status": "info"
    },
    {
      "timestamp": "2025-11-08T10:30:01.000Z",
      "message": "Found 2 tracked competitor(s)",
      "status": "info"
    },
    {
      "timestamp": "2025-11-08T10:30:02.000Z",
      "message": "Price changed for Book Title: $19.99 → $17.99 (-10.01%)",
      "status": "success"
    }
  ]
}
```

### Scraped Price Response

```json
{
  "platform": "amazon",
  "price": 14.99,
  "currency": "USD",
  "checked_at": "2025-11-08T10:30:00.000Z",
  "title": "Book Title",
  "author": "Author Name"
}
```

### CSV Import Response

```json
{
  "success": true,
  "competitorsImported": 3,
  "pricesImported": 3
}
```

---

## 📋 CSV Format

### Required Columns
- `asin` - Amazon ASIN (required)
- `title` - Book title (required)

### Optional Columns
- `author` - Author name
- `genre` - Book genre
- `price` - Current price
- `currency` - Currency code (default: USD)

### Example CSV

```csv
asin,title,author,genre,price,currency
B0ABC123DEF,The Complete Guide to Self-Publishing,Jane Smith,Non-Fiction,19.99,USD
B0XYZ789GHI,Marketing Your Book Successfully,John Doe,Non-Fiction,24.99,USD
B001COMPETITOR1,Fiction Bestseller,Author Name,Fiction,14.99,USD
```

---

## 🧪 Testing

### Test 1: Mock Scraper (No Setup)

```bash
# Trigger cron with mock data
curl -X GET http://localhost:3000/api/cron/check-competitors \
  -H "Authorization: Bearer your-cron-secret"
```

**Expected Response:**
- 2 competitors checked
- Prices saved to price_history
- Price changes detected

### Test 2: CSV Import

```bash
# Create test CSV
cat > competitors.csv << EOF
asin,title,author,genre,price,currency
B0ABC123DEF,Test Book 1,Author 1,Fiction,15.99,USD
B0XYZ789GHI,Test Book 2,Author 2,Non-Fiction,19.99,USD
EOF

# Import via API
curl -X POST http://localhost:3000/api/competitors/import-csv \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -d @- << 'EOF'
{
  "csv": "asin,title,author,genre,price,currency\nB0ABC123DEF,Test Book 1,Author 1,Fiction,15.99,USD\nB0XYZ789GHI,Test Book 2,Author 2,Non-Fiction,19.99,USD"
}
EOF
```

### Test 3: Price Change Detection

1. Import competitor with price $19.99
2. Update mock price in `amazon.ts`
3. Run cron endpoint
4. Check logs for price change alert

---

## 🔧 Playwright Setup (Production)

### Installation

```bash
pnpm add -D playwright
npx playwright install chromium
```

### Update Amazon Scraper

Replace the mock implementation in `lib/scrapers/amazon.ts`:

```typescript
import { chromium } from 'playwright';

private async scrapePriceWithPlaywright(asin: string): Promise<ScrapedPrice> {
  const browser = await chromium.launch({
    headless: true,
    proxy: this.options.proxy ? { server: this.options.proxy } : undefined,
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  });

  const page = await context.newPage();

  try {
    await page.goto(`https://www.amazon.com/dp/${asin}`, {
      waitUntil: 'networkidle',
      timeout: this.options.timeout,
    });

    await page.waitForSelector('[data-a-color="price"]', { timeout: 10000 });

    const priceText = await page.textContent('[data-a-color="price"]');
    const price = this.formatPrice(priceText || '0');

    return {
      platform: 'amazon',
      price,
      currency: 'USD',
      checked_at: this.getTimestamp(),
    };
  } finally {
    await browser.close();
  }
}
```

### Serverless Deployment

For Vercel/AWS Lambda, use Playwright serverless:

```bash
pnpm add @sparticuz/chromium
```

```typescript
import chromium from '@sparticuz/chromium';

const browser = await chromium.puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});
```

---

## 🚀 Cron Configuration

### Vercel (vercel.json)

```json
{
  "crons": [
    {
      "path": "/api/cron/check-competitors",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Runs every 6 hours.

### Upstash QStash

```
URL: https://your-domain.com/api/cron/check-competitors
Schedule: 0 */6 * * *
Header: Authorization: Bearer your-cron-secret
```

---

## 🔐 Rate Limiting & Proxies

### Amazon Rate Limiting

Amazon blocks aggressive scraping. Recommendations:

1. **Use Proxies** (Recommended)
   - Bright Data
   - Oxylabs
   - Smartproxy
   - Rotating proxies reduce blocking

2. **CSV Fallback** (Recommended for MVP)
   - Manual upload of competitor prices
   - No rate limiting issues
   - Simple and reliable

3. **Delay Between Requests**
   ```typescript
   // Add delay between scrapes
   await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
   ```

4. **User Agent Rotation**
   ```typescript
   const userAgents = [
     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
     'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
   ];
   ```

### Recommended Approach for MVP

**Use CSV import** until you have:
- Proxy infrastructure
- Rate limiting strategy
- Error handling for blocked requests

---

## 📊 Database Schema

### tracked_competitors
```sql
- id: UUID
- user_id: UUID (FK)
- book_asin: TEXT
- title: TEXT
- author: TEXT
- genre: TEXT
- created_at: TIMESTAMP
```

### price_history
```sql
- id: UUID
- competitor_id: UUID (FK)
- platform: TEXT
- price: DECIMAL
- currency: TEXT
- checked_at: TIMESTAMP
```

---

## 🧪 Mock Data

The scraper includes mock prices for testing:

```typescript
const mockPrices: { [key: string]: number } = {
  B0ABC123DEF: 14.99,
  B0XYZ789GHI: 12.99,
  B001COMPETITOR1: 19.99,
  B002COMPETITOR2: 24.99,
};
```

Update these to test price change detection.

---

## 📚 Related Files

- `lib/scrapers/base.ts` - Base scraper interface
- `lib/scrapers/amazon.ts` - Amazon scraper
- `app/api/cron/check-competitors/route.ts` - Cron endpoint
- `app/api/competitors/import-csv/route.ts` - CSV import

---

## ✅ Verification Checklist

- [ ] Mock scraper tested
- [ ] Cron endpoint returns data
- [ ] Price history saved to database
- [ ] CSV import works
- [ ] Price changes detected
- [ ] Logs show correct output
- [ ] Cron schedule configured
- [ ] Production deployment verified

---

## 🎯 Next Steps

1. **MVP:** Use CSV import for competitor prices
2. **Phase 2:** Add Playwright scraper with proxies
3. **Phase 3:** Add price alert notifications
4. **Phase 4:** Add competitor analysis dashboard

---

**Competitor scraping is ready!** 🚀

Start with CSV import, upgrade to Playwright later.
