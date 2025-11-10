# A/B Test MVP Implementation Guide

Complete guide for the A/B testing MVP feature in AuthorStack.

## 📋 Overview

The A/B test MVP allows authors to:
- Create A/B tests for book covers, titles, or descriptions
- Generate short tracking URLs for each variant
- Track impressions, clicks, and conversions
- View statistical analysis with z-test calculations
- See winner when statistical significance is reached

## 🗄️ Database Setup

### 1. Add target_url to ab_tests table

Run this SQL in Supabase SQL Editor:

```sql
-- Add target_url column to ab_tests table
ALTER TABLE ab_tests 
ADD COLUMN IF NOT EXISTS target_url TEXT;

COMMENT ON COLUMN ab_tests.target_url IS 'Target URL for redirect (sales page)';
```

### 2. Add RLS Policies

Run the SQL file `infra/sql/ab_tests_rls_policies.sql` in Supabase SQL Editor:

```sql
-- Allow users to create A/B tests for their books
CREATE POLICY "Users can create A/B tests for their books"
  ON ab_tests FOR INSERT
  WITH CHECK (
    book_id IN (
      SELECT id FROM books WHERE user_id = auth.uid()
    )
  );

-- Allow users to update their A/B tests
CREATE POLICY "Users can update their A/B tests"
  ON ab_tests FOR UPDATE
  USING (
    book_id IN (
      SELECT id FROM books WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    book_id IN (
      SELECT id FROM books WHERE user_id = auth.uid()
    )
  );

-- Allow users to delete their A/B tests
CREATE POLICY "Users can delete their A/B tests"
  ON ab_tests FOR DELETE
  USING (
    book_id IN (
      SELECT id FROM books WHERE user_id = auth.uid()
    )
  );

-- Allow users to create variants for their tests
CREATE POLICY "Users can create variants for their tests"
  ON test_variants FOR INSERT
  WITH CHECK (
    test_id IN (
      SELECT id FROM ab_tests 
      WHERE book_id IN (
        SELECT id FROM books WHERE user_id = auth.uid()
      )
    )
  );

-- Allow users to update their test variants
CREATE POLICY "Users can update their test variants"
  ON test_variants FOR UPDATE
  USING (
    test_id IN (
      SELECT id FROM ab_tests 
      WHERE book_id IN (
        SELECT id FROM books WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    test_id IN (
      SELECT id FROM ab_tests 
      WHERE book_id IN (
        SELECT id FROM books WHERE user_id = auth.uid()
      )
    )
  );

-- Allow public updates to variant metrics (for tracking)
CREATE POLICY "Allow public updates to variant metrics"
  ON test_variants FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow public reads of short_url for redirect route
CREATE POLICY "Allow public reads of variants by short_url"
  ON test_variants FOR SELECT
  USING (true);
```

**Note**: The public policies allow anyone to read/update variant metrics for tracking purposes. The redirect route uses the service role key to bypass RLS for better performance.

## 🔑 Environment Variables

Ensure you have these environment variables set:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 📁 File Structure

```
app/api/tests/
├── create/
│   └── route.ts          # Create A/B test and variants
├── [id]/
│   ├── route.ts          # Get test with stats
│   └── track/
│       └── route.ts      # Track clicks/conversions
└── route.ts              # List all tests

app/r/
└── [code]/
    └── route.ts          # Short URL redirect route

app/ab-tests/
├── page.tsx              # List tests and create form
└── [id]/
    └── page.tsx          # Test stats page

components/ab-tests/
└── CreateTestForm.tsx    # Test creation form

lib/utils/
└── ab-test.ts            # Utility functions (z-test, etc.)
```

## 🚀 API Endpoints

### POST /api/tests/create

Create a new A/B test with variants.

**Request**:
```json
{
  "book_id": "uuid",
  "test_type": "cover" | "title" | "description",
  "target_url": "https://example.com/sales-page",
  "variants": [
    {
      "name": "Variant A",
      "image_url": "https://example.com/cover-a.jpg" // for cover tests
      // OR
      "text_content": "Title or description text" // for title/description tests
    },
    {
      "name": "Variant B",
      "image_url": "https://example.com/cover-b.jpg"
    }
  ]
}
```

**Response**:
```json
{
  "test": {
    "id": "uuid",
    "book_id": "uuid",
    "test_type": "cover",
    "target_url": "https://example.com/sales-page",
    "status": "active",
    "started_at": "2024-01-01T00:00:00Z"
  },
  "variants": [
    {
      "id": "uuid",
      "variant_name": "Variant A",
      "short_url": "abc12345",
      "full_short_url": "https://yourdomain.com/r/abc12345",
      "redirect_url": "https://example.com/sales-page?utm_source=authorstack&..."
    }
  ]
}
```

### GET /api/tests

Get all A/B tests for current user.

**Response**:
```json
{
  "tests": [
    {
      "id": "uuid",
      "book_id": "uuid",
      "book_title": "My Book",
      "test_type": "cover",
      "status": "active",
      "started_at": "2024-01-01T00:00:00Z",
      "variant_count": 2
    }
  ]
}
```

### GET /api/tests/:id

Get test with stats and winner analysis.

**Response**:
```json
{
  "test": {
    "id": "uuid",
    "book_id": "uuid",
    "test_type": "cover",
    "status": "active",
    "target_url": "https://example.com/sales-page",
    "book_title": "My Book"
  },
  "variants": [
    {
      "id": "uuid",
      "variant_name": "Variant A",
      "impressions": 1000,
      "clicks": 50,
      "conversions": 5,
      "ctr": 5.0,
      "conversion_rate": 10.0,
      "short_url": "abc12345"
    }
  ],
  "winner": {
    "winner": "Variant A" | null,
    "zScore": 2.5,
    "pValue": 0.012,
    "isSignificant": true,
    "confidence": 95.0,
    "conversionRate1": 10.0,
    "conversionRate2": 5.0
  }
}
```

### POST /api/tests/:id/track

Track clicks or conversions.

**Request**:
```json
{
  "variant_id": "uuid",
  "event_type": "click" | "conversion"
}
```

**Response**:
```json
{
  "success": true,
  "event_type": "click",
  "variant_id": "uuid"
}
```

### GET /r/:code

Short URL redirect route. Increments impressions and redirects to target URL with UTM parameters.

**Redirects to**:
```
https://target-url.com?utm_source=authorstack&utm_medium=ab_test&utm_campaign=test_uuid&utm_content=variant_name&variant_id=uuid
```

## 🧪 Testing

### 1. Create a Test

1. Navigate to `/ab-tests`
2. Fill in the form:
   - Select a book
   - Choose test type (cover, title, or description)
   - Enter target URL (sales page)
   - Add at least 2 variants
3. Click "Create Test"
4. You'll be redirected to the test stats page

### 2. Get Short URLs

After creating a test, you'll see short URLs for each variant:
- Format: `https://yourdomain.com/r/abc12345`
- Each variant has a unique short URL

### 3. Simulate Traffic

#### Option A: Manual Testing

1. **Test Impressions**: Visit the short URL in a browser
   - Each visit increments impressions
   - You'll be redirected to the target URL with UTM parameters

2. **Test Clicks**: Use the tracking API
   ```bash
   curl -X POST http://localhost:3000/api/tests/{test_id}/track \
     -H "Content-Type: application/json" \
     -d '{
       "variant_id": "variant_uuid",
       "event_type": "click"
     }'
   ```

3. **Test Conversions**: Track conversions
   ```bash
   curl -X POST http://localhost:3000/api/tests/{test_id}/track \
     -H "Content-Type: application/json" \
     -d '{
       "variant_id": "variant_uuid",
       "event_type": "conversion"
     }'
   ```

#### Option B: Automated Script

Create a script to simulate traffic:

```javascript
// simulate-traffic.js
const testId = 'your-test-id';
const variantId = 'your-variant-id';
const shortUrl = 'http://localhost:3000/r/abc12345';

// Simulate 100 impressions
for (let i = 0; i < 100; i++) {
  // Visit short URL (increments impressions)
  fetch(shortUrl, { redirect: 'manual' });
  
  // Simulate 10% click rate
  if (i % 10 === 0) {
    fetch(`http://localhost:3000/api/tests/${testId}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variant_id: variantId,
        event_type: 'click'
      })
    });
    
    // Simulate 20% conversion rate from clicks
    if (i % 50 === 0) {
      fetch(`http://localhost:3000/api/tests/${testId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant_id: variantId,
          event_type: 'conversion'
        })
      });
    }
  }
}
```

### 4. View Stats

1. Navigate to `/ab-tests/{test_id}`
2. View:
   - Impressions, clicks, conversions for each variant
   - CTR (Click-Through Rate)
   - Conversion rate
   - Statistical significance (z-test)
   - Winner (when significant)

## 📊 Statistical Analysis

### Z-Test Calculation

The system uses a two-proportion z-test to determine statistical significance:

1. **Z-Score**: Calculated using pooled proportion
2. **P-Value**: Derived from z-score (two-tailed test)
3. **Confidence Level**: 95% (p < 0.05)

### Winner Determination

- **Winner**: Variant with higher conversion rate
- **Significance**: p-value < 0.05 (95% confidence)
- **Display**: Shows winner banner when significant

### Example

```
Variant A: 100 clicks, 10 conversions (10% conversion rate)
Variant B: 100 clicks, 5 conversions (5% conversion rate)

Z-Score: 2.0
P-Value: 0.046
Significant: Yes (p < 0.05)
Winner: Variant A
```

## 🔍 Troubleshooting

### Short URL Not Working

1. **Check RLS policies**: Ensure public read policy is enabled
2. **Check service role key**: Redirect route uses service role key
3. **Check target_url**: Verify target_url is set in ab_tests table

### Impressions Not Incrementing

1. **Check RLS policies**: Ensure public update policy is enabled
2. **Check service role key**: Redirect route should use service role key
3. **Check logs**: Look for errors in server logs

### Stats Not Showing

1. **Check test ownership**: Ensure user owns the book
2. **Check RLS policies**: Ensure user can read tests and variants
3. **Check API response**: Verify API returns data correctly

### Winner Not Showing

1. **Check sample size**: Need sufficient clicks for significance
2. **Check conversion rates**: Variants need different rates
3. **Check z-test calculation**: Verify p-value < 0.05

## 🎯 Next Steps

1. **Add more test types**: Support for other metadata
2. **Add test duration**: Set test end dates
3. **Add email notifications**: Notify when winner is determined
4. **Add charts**: Visualize test results over time
5. **Add export**: Export test results to CSV
6. **Add A/B test templates**: Pre-configured test setups

## 📚 Additional Resources

- [Z-Test Wikipedia](https://en.wikipedia.org/wiki/Z-test)
- [A/B Testing Best Practices](https://www.optimizely.com/optimization-glossary/ab-testing/)
- [Statistical Significance](https://en.wikipedia.org/wiki/Statistical_significance)

---

**Status**: ✅ MVP Complete
**Version**: 1.0.0
**Last Updated**: 2024-01-XX

