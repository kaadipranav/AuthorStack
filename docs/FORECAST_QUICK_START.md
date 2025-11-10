# Revenue Forecasting - Quick Start Guide

Quick guide to set up and test revenue forecasting in AuthorStack.

## 🚀 Quick Setup

### 1. Seed Test Data

```bash
# Run seed script to create 3 months of sales data
psql -d your-database -f infra/sql/seed_forecast_data.sql

# Or run in Supabase SQL Editor
```

### 2. Configure Upstash Redis (Optional)

```env
# Add to .env.local
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

**Note**: Works without Upstash Redis using in-memory cache.

### 3. Test Forecast

```bash
# Test API endpoint
curl http://localhost:3000/api/insights/forecast?months=3 \
  -H "Cookie: your-session-cookie" \
  | jq

# Check dashboard
open http://localhost:3000/dashboard
```

## 📊 Expected Output

```json
{
  "predictedRevenue": 1250.50,
  "confidenceInterval": {
    "lower": 980.25,
    "upper": 1520.75
  },
  "confidenceLevel": 0.95,
  "method": "linear_regression",
  "dataPoints": 90,
  "trend": "increasing",
  "cached": false,
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

## ✅ Verification Steps

1. **Check Data**: Verify you have 90+ days of sales data
2. **Test API**: Call `/api/insights/forecast?months=3`
3. **Check Dashboard**: Forecast card should display
4. **Test Cache**: Second request should show `cached: true`
5. **Verify Trend**: Should show increasing/decreasing/stable

## 🔍 Troubleshooting

- **No forecast**: Need at least 90 days of data
- **Cache not working**: Check Upstash credentials or use in-memory
- **Wrong trend**: Verify data has clear trend pattern

## 📚 Full Documentation

See `FORECAST_IMPLEMENTATION.md` for complete guide.

