# A/B Test MVP - Quick Start Guide

Quick guide to create and test A/B tests in AuthorStack.

## 🚀 Quick Setup

### 1. Database Setup

Run these SQL commands in Supabase SQL Editor:

```sql
-- Add target_url column
ALTER TABLE ab_tests ADD COLUMN IF NOT EXISTS target_url TEXT;

-- Add RLS policies (run ab_tests_rls_policies.sql)
-- See infra/sql/ab_tests_rls_policies.sql for full policies
```

### 2. Environment Variables

Ensure these are set:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📝 Creating a Test

### Step 1: Navigate to A/B Tests

1. Log in to your account
2. Navigate to `/ab-tests`
3. Ensure you have at least one book created

### Step 2: Fill in Test Form

1. **Select Book**: Choose the book you want to test
2. **Test Type**: Choose one of:
   - **Cover**: Test different book covers (requires image URLs)
   - **Title**: Test different titles (requires text)
   - **Description**: Test different descriptions (requires text)
3. **Target URL**: Enter your sales page URL (e.g., `https://gumroad.com/l/yourbook`)
4. **Add Variants**: Add at least 2 variants
   - For **Cover**: Provide image URL and name
   - For **Title/Description**: Provide text and name

### Step 3: Create Test

1. Click "Create Test"
2. You'll be redirected to the test stats page
3. Copy the short URLs for each variant

## 🧪 Simulating Traffic

### Method 1: Manual Testing

1. **Test Impressions**:
   - Visit the short URL: `https://yourdomain.com/r/abc12345`
   - Each visit increments impressions
   - You'll be redirected to the target URL with UTM parameters

2. **Test Clicks**:
   ```bash
   curl -X POST http://localhost:3000/api/tests/{test_id}/track \
     -H "Content-Type: application/json" \
     -d '{
       "variant_id": "variant_uuid",
       "event_type": "click"
     }'
   ```

3. **Test Conversions**:
   ```bash
   curl -X POST http://localhost:3000/api/tests/{test_id}/track \
     -H "Content-Type: application/json" \
     -d '{
       "variant_id": "variant_uuid",
       "event_type": "conversion"
     }'
   ```

### Method 2: Automated Script

Create a Node.js script to simulate traffic:

```javascript
// simulate-traffic.js
const testId = 'your-test-id';
const baseUrl = 'http://localhost:3000';

// Get test data to get variant IDs
async function getTestData() {
  const response = await fetch(`${baseUrl}/api/tests/${testId}`);
  const data = await response.json();
  return data;
}

// Simulate traffic
async function simulateTraffic() {
  const testData = await getTestData();
  const variants = testData.variants;

  // Simulate 1000 impressions for each variant
  for (const variant of variants) {
    const shortUrl = `${baseUrl}/r/${variant.short_url}`;
    
    // Simulate impressions
    for (let i = 0; i < 1000; i++) {
      // Visit short URL (increments impressions)
      await fetch(shortUrl, { redirect: 'manual' });
      
      // Simulate 10% click rate
      if (i % 10 === 0) {
        await fetch(`${baseUrl}/api/tests/${testId}/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variant_id: variant.id,
            event_type: 'click'
          })
        });
        
        // Simulate 20% conversion rate from clicks (2% overall)
        if (i % 50 === 0) {
          await fetch(`${baseUrl}/api/tests/${testId}/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              variant_id: variant.id,
              event_type: 'conversion'
            })
          });
        }
      }
    }
  }
}

simulateTraffic();
```

Run the script:

```bash
node simulate-traffic.js
```

### Method 3: Browser Extension

Use a browser extension like "Requestly" or "ModHeader" to:
1. Intercept requests to short URLs
2. Automatically track clicks/conversions
3. Simulate different user behaviors

## 📊 Viewing Results

1. Navigate to `/ab-tests/{test_id}`
2. View statistics:
   - **Impressions**: Number of times short URL was visited
   - **Clicks**: Number of clicks tracked
   - **Conversions**: Number of conversions tracked
   - **CTR**: Click-Through Rate (clicks / impressions)
   - **Conversion Rate**: Conversions / clicks

3. **Statistical Analysis**:
   - **Z-Score**: Statistical significance score
   - **P-Value**: Probability of observing this result by chance
   - **Winner**: Variant with higher conversion rate (if significant)

## 🎯 Example Test Scenario

### Scenario: Test Book Cover

1. **Create Test**:
   - Book: "My Awesome Book"
   - Test Type: Cover
   - Target URL: `https://gumroad.com/l/mybook`
   - Variant A: Cover A (image URL)
   - Variant B: Cover B (image URL)

2. **Get Short URLs**:
   - Variant A: `https://yourdomain.com/r/abc12345`
   - Variant B: `https://yourdomain.com/r/xyz67890`

3. **Share URLs**:
   - Share Variant A URL on Twitter
   - Share Variant B URL on Facebook
   - Or use both in different ad campaigns

4. **Track Results**:
   - Check stats page regularly
   - Wait for statistical significance (p < 0.05)
   - See winner when threshold is reached

## 🔍 Understanding Results

### Statistical Significance

- **Z-Score > 1.96**: 95% confidence (p < 0.05)
- **Z-Score > 2.58**: 99% confidence (p < 0.01)
- **Winner**: Variant with higher conversion rate

### Example Results

```
Variant A:
- Impressions: 1000
- Clicks: 50
- Conversions: 5
- CTR: 5.0%
- Conversion Rate: 10.0%

Variant B:
- Impressions: 1000
- Clicks: 40
- Conversions: 2
- CTR: 4.0%
- Conversion Rate: 5.0%

Z-Score: 2.0
P-Value: 0.046
Significant: Yes (p < 0.05)
Winner: Variant A
```

## 🐛 Troubleshooting

### Short URL Not Working

- Check that `SUPABASE_SERVICE_ROLE_KEY` is set
- Verify RLS policies are enabled
- Check server logs for errors

### Impressions Not Incrementing

- Verify service role key is configured
- Check RLS policies allow public updates
- Verify target_url is set in ab_tests table

### Stats Not Showing

- Ensure user owns the book
- Check RLS policies allow user to read tests
- Verify test was created successfully

## 📚 Next Steps

1. **Share URLs**: Share short URLs on social media, ads, etc.
2. **Track Conversions**: Integrate conversion tracking with your sales platform
3. **Analyze Results**: Check stats page regularly
4. **Declare Winner**: When statistical significance is reached, declare winner
5. **Update Book**: Update book with winning variant

## 🔗 API Reference

### Create Test

```bash
POST /api/tests/create
{
  "book_id": "uuid",
  "test_type": "cover",
  "target_url": "https://example.com",
  "variants": [
    { "name": "Variant A", "image_url": "https://..." },
    { "name": "Variant B", "image_url": "https://..." }
  ]
}
```

### Track Event

```bash
POST /api/tests/:id/track
{
  "variant_id": "uuid",
  "event_type": "click" | "conversion"
}
```

### Get Test Stats

```bash
GET /api/tests/:id
```

## ✅ Checklist

- [ ] Database setup complete (target_url column added)
- [ ] RLS policies added
- [ ] Environment variables set
- [ ] Test created
- [ ] Short URLs copied
- [ ] Traffic simulated
- [ ] Stats viewed
- [ ] Winner determined

---

**Ready to test!** Create your first A/B test and start optimizing your book sales.

