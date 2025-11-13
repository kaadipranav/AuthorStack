# Revenue Forecasting Implementation Guide

Complete guide for the revenue forecasting feature in AuthorStack.

## 📋 Overview

The forecasting feature provides:
- **Moving Average Forecast**: Simple average of recent revenue
- **Linear Regression Forecast**: Trend-based prediction using linear regression
- **Confidence Intervals**: 95% confidence interval for predicted revenue
- **Trend Analysis**: Identifies increasing, decreasing, or stable trends
- **Caching**: Results cached for 1 hour (Upstash Redis or in-memory)

## 🗄️ Database Setup

### Prerequisites

Ensure you have sales data for at least 3 months. If you don't have enough data, use the seed script:

```sql
-- Run infra/sql/seed_forecast_data.sql
-- This creates 90 days of sales data with a trend
```

### Verify Data

```sql
-- Check if you have enough data
SELECT 
  COUNT(DISTINCT sale_date) as days_with_data,
  MIN(sale_date) as earliest_date,
  MAX(sale_date) as latest_date,
  SUM(revenue) as total_revenue
FROM sales_data
WHERE book_id IN (
  SELECT id FROM books WHERE user_id = 'your-user-id'
);
```

You need at least **90 days** of data for a 3-month forecast.

## 🔑 Environment Variables

### Optional: Upstash Redis

For production caching, add these to `.env.local`:

```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

**Note**: The system works without Upstash Redis using in-memory caching. Upstash Redis is recommended for production.

### Setting Up Upstash Redis

1. **Create Account**: Go to [Upstash Console](https://console.upstash.com)
2. **Create Database**: Click "Create Database"
3. **Get Credentials**: Copy REST URL and token
4. **Add to .env**: Add credentials to `.env.local`
5. **Test**: The system will automatically use Upstash if credentials are available

## 📁 File Structure

```
app/api/insights/
└── forecast/
    └── route.ts          # Forecast API endpoint

lib/utils/
└── forecast.ts           # Forecast calculation utilities

lib/cache/
└── redis.ts             # Cache implementation (Upstash + in-memory)

components/dashboard/
└── ForecastCard.tsx     # Forecast UI component

lib/hooks/
└── useForecast.ts       # React Query hook for forecast
```

## 🚀 API Endpoint

### GET /api/insights/forecast

Get revenue forecast for next month.

**Query Parameters**:
- `months` (optional): Number of months of data to use (default: 3)

**Request**:
```bash
GET /api/insights/forecast?months=3
```

**Response**:
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
  "generatedAt": "2024-01-15T10:30:00Z",
  "period": "month",
  "monthsOfData": 3
}
```

## 🎨 UI Component

The forecast is displayed in a card on the dashboard:

- **Predicted Revenue**: Forecasted revenue for next month
- **Confidence Interval**: Range of likely revenue (95% confidence)
- **Trend**: Increasing, decreasing, or stable
- **Method**: Moving average or linear regression
- **Data Points**: Number of days used in forecast

## 🔍 How It Works

### 1. Data Collection

- Fetches last 3 months of sales data from `sales_data` table
- Aggregates daily revenue by date
- Filters to user's books only

### 2. Forecast Calculation

**Moving Average**:
- Calculates average of last 30 days (or available data)
- Simple and reliable for stable trends
- Used when data shows no clear trend

**Linear Regression**:
- Fits a line to the data using least squares
- Predicts next period based on trend
- Used when data shows a clear trend (slope > 0.1)

### 3. Confidence Interval

- Calculates standard deviation of revenue
- Uses z-score (1.96 for 95% confidence)
- Provides upper and lower bounds for prediction

### 4. Caching

- Results cached for 1 hour (3600 seconds)
- Cache key: `forecast:{userId}`
- Automatically uses Upstash Redis if available
- Falls back to in-memory cache if not configured

## 🧪 Testing

### 1. Verify Forecast Endpoint

```bash
# Test forecast API
curl http://localhost:3000/api/insights/forecast?months=3 \
  -H "Cookie: your-session-cookie"
```

### 2. Check Dashboard

1. Navigate to `/dashboard`
2. Look for "Revenue Forecast (Next Month)" card
3. Verify forecast is displayed
4. Check confidence interval is shown
5. Verify trend indicator (increasing/decreasing/stable)

### 3. Test Caching

1. **First Request**: Should show `cached: false`
2. **Second Request** (within 1 hour): Should show `cached: true`
3. **After 1 Hour**: Should regenerate and show `cached: false`

### 4. Test with Different Data

**Increasing Trend**:
```sql
-- Create data with increasing trend
-- Revenue increases from $20/day to $50/day over 90 days
```

**Decreasing Trend**:
```sql
-- Create data with decreasing trend
-- Revenue decreases from $50/day to $20/day over 90 days
```

**Stable Trend**:
```sql
-- Create data with stable trend
-- Revenue stays around $30/day with small variations
```

## 📊 Sample Outputs

### Example 1: Increasing Trend

```json
{
  "predictedRevenue": 1425.75,
  "confidenceInterval": {
    "lower": 1120.50,
    "upper": 1730.00
  },
  "confidenceLevel": 0.95,
  "method": "linear_regression",
  "dataPoints": 90,
  "trend": "increasing",
  "cached": false,
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

### Example 2: Stable Trend

```json
{
  "predictedRevenue": 900.00,
  "confidenceInterval": {
    "lower": 750.00,
    "upper": 1050.00
  },
  "confidenceLevel": 0.95,
  "method": "moving_average",
  "dataPoints": 90,
  "trend": "stable",
  "cached": false,
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

### Example 3: Decreasing Trend

```json
{
  "predictedRevenue": 625.25,
  "confidenceInterval": {
    "lower": 480.00,
    "upper": 770.50
  },
  "confidenceLevel": 0.95,
  "method": "linear_regression",
  "dataPoints": 90,
  "trend": "decreasing",
  "cached": false,
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

## 🔍 Verification Steps

### Step 1: Seed Test Data

```bash
# 1. Run seed script to create 3 months of data
psql -d your-database -f infra/sql/seed_forecast_data.sql

# 2. Verify data was created
psql -d your-database -c "
  SELECT 
    COUNT(*) as total_records,
    MIN(sale_date) as earliest_date,
    MAX(sale_date) as latest_date,
    SUM(revenue) as total_revenue
  FROM sales_data
  WHERE book_id = 'your-book-id';
"
```

### Step 2: Test API Endpoint

```bash
# 1. Start development server
npm run dev

# 2. Test forecast endpoint (replace with your session cookie)
curl http://localhost:3000/api/insights/forecast?months=3 \
  -H "Cookie: your-session-cookie" \
  | jq

# 3. Verify response includes:
# - predictedRevenue (number)
# - confidenceInterval (object with lower/upper)
# - method (moving_average or linear_regression)
# - trend (increasing/decreasing/stable)
```

### Step 3: Verify Dashboard

1. **Navigate to Dashboard**: `http://localhost:3000/dashboard`
2. **Check Forecast Card**: Should display predicted revenue
3. **Verify Confidence Interval**: Should show lower/upper bounds
4. **Check Trend**: Should show increasing/decreasing/stable
5. **Verify Method**: Should show moving_average or linear_regression

### Step 4: Test Caching

```bash
# 1. Make first request (should show cached: false)
curl http://localhost:3000/api/insights/forecast?months=3 \
  -H "Cookie: your-session-cookie" \
  | jq '.cached'

# 2. Make second request immediately (should show cached: true)
curl http://localhost:3000/api/insights/forecast?months=3 \
  -H "Cookie: your-session-cookie" \
  | jq '.cached'

# 3. Wait 1 hour and make third request (should show cached: false)
# (Or manually clear cache and test)
```

### Step 5: Test with Upstash Redis

1. **Set Up Upstash**: Follow setup instructions above
2. **Add Credentials**: Add to `.env.local`
3. **Restart Server**: `npm run dev`
4. **Test Cache**: Should use Upstash Redis (check logs)
5. **Verify**: Cache should persist across server restarts

## 🐛 Troubleshooting

### Forecast Not Showing

**Issue**: Forecast card shows "Not enough data"

**Solutions**:
1. Check if you have at least 90 days of sales data
2. Verify data is for user's books
3. Check RLS policies allow user to read sales_data
4. Verify sales_data table has revenue values

### Forecast Always Zero

**Issue**: predictedRevenue is always 0

**Solutions**:
1. Check sales_data has revenue > 0
2. Verify date range includes last 3 months
3. Check book_id matches user's books
4. Verify revenue values are numeric

### Cache Not Working

**Issue**: Cache not working or always showing `cached: false`

**Solutions**:
1. **In-Memory Cache**: Check server logs for cache messages
2. **Upstash Redis**: Verify credentials are correct
3. **Cache TTL**: Check cache TTL is set correctly (3600 seconds)
4. **Cache Key**: Verify cache key format is correct

### Wrong Trend

**Issue**: Trend shows incorrect direction

**Solutions**:
1. Check data has clear trend (increasing/decreasing)
2. Verify trend calculation uses first half vs second half
3. Check threshold (5% change) is appropriate
4. Verify data is sorted by date correctly

## 📚 Algorithm Details

### Moving Average

1. **Window Size**: Uses last 30 days or half of available data
2. **Calculation**: `average = sum(recent_revenue) / window_size`
3. **Forecast**: `monthly_forecast = daily_average * 30`

### Linear Regression

1. **Data Preparation**: Converts dates to numeric (days since start)
2. **Least Squares**: Calculates slope and intercept
3. **Forecast**: `forecast = slope * (last_x + 1) + intercept`
4. **Monthly**: `monthly_forecast = daily_forecast * 30`

### Confidence Interval

1. **Standard Deviation**: Calculates std dev of revenue
2. **Standard Error**: `se = std_dev / sqrt(n)` for moving average
3. **Margin**: `margin = z_score * standard_error`
4. **Interval**: `[forecast - margin, forecast + margin]`

## 🎯 Next Steps

1. **Add More Forecast Methods**: Exponential smoothing, ARIMA
2. **Add Seasonality**: Account for seasonal patterns
3. **Add Confidence Levels**: Allow user to choose (90%, 95%, 99%)
4. **Add Forecast Periods**: Forecast for different periods (week, quarter, year)
5. **Add Forecast History**: Track forecast accuracy over time
6. **Add Alerts**: Notify when forecast exceeds thresholds

## ✅ Checklist

- [ ] Database has at least 90 days of sales data
- [ ] Forecast API endpoint works
- [ ] Forecast card displays on dashboard
- [ ] Confidence interval is shown
- [ ] Trend indicator works
- [ ] Cache is working (in-memory or Upstash)
- [ ] Forecast updates after cache expires
- [ ] Different trends are detected correctly
- [ ] Forecast method is chosen appropriately

---

**Status**: ✅ Implementation Complete
**Version**: 1.0.0
**Last Updated**: 2024-01-XX

