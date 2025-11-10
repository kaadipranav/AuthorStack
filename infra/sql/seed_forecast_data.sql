-- Seed 3 months of sales data for forecasting tests
-- Run this after the main seed.sql to add more data for forecasting

-- This script generates 90 days of sales data with a trend
-- Replace 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' with your actual book_id
-- Replace 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' with your actual user_id

-- First, ensure you have a book (if not, create one)
-- INSERT INTO books (id, user_id, title, author, created_at)
-- VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid, 'Test Book', 'Test Author', NOW())
-- ON CONFLICT DO NOTHING;

-- Generate 90 days of sales data with increasing trend
-- Revenue starts at ~$20/day and increases to ~$50/day
DO $$
DECLARE
  book_uuid UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid;
  day_offset INTEGER;
  base_revenue DECIMAL;
  revenue DECIMAL;
  units INTEGER;
  page_reads INTEGER;
  sale_date DATE;
BEGIN
  FOR day_offset IN 90..1 LOOP
    sale_date := CURRENT_DATE - (day_offset - 1);
    
    -- Calculate base revenue with increasing trend
    -- Starts at $20/day, increases to ~$50/day over 90 days
    base_revenue := 20 + ((90 - day_offset) * 0.33);
    
    -- Add some random variation (±20%)
    revenue := base_revenue * (0.8 + (RANDOM() * 0.4));
    
    -- Calculate units (assuming $5 per unit on average)
    units := FLOOR(revenue / 5) + FLOOR(RANDOM() * 3);
    
    -- Calculate page reads (assuming 200 pages per unit)
    page_reads := units * 200 + FLOOR(RANDOM() * 500);
    
    -- Insert sales data
    INSERT INTO sales_data (
      book_id,
      platform,
      sale_date,
      units_sold,
      revenue,
      page_reads,
      currency,
      created_at
    )
    VALUES (
      book_uuid,
      'amazon',
      sale_date,
      units,
      revenue,
      page_reads,
      'USD',
      NOW()
    )
    ON CONFLICT (book_id, platform, sale_date) DO UPDATE
    SET
      units_sold = EXCLUDED.units_sold,
      revenue = EXCLUDED.revenue,
      page_reads = EXCLUDED.page_reads;
    
    -- Also add Gumroad sales (50% of Amazon revenue)
    INSERT INTO sales_data (
      book_id,
      platform,
      sale_date,
      units_sold,
      revenue,
      page_reads,
      currency,
      created_at
    )
    VALUES (
      book_uuid,
      'gumroad',
      sale_date,
      FLOOR(units * 0.5),
      revenue * 0.5,
      0, -- Gumroad doesn't have page reads
      'USD',
      NOW()
    )
    ON CONFLICT (book_id, platform, sale_date) DO UPDATE
    SET
      units_sold = EXCLUDED.units_sold,
      revenue = EXCLUDED.revenue,
      page_reads = EXCLUDED.page_reads;
  END LOOP;
END $$;

-- Verify data was created
SELECT 
  COUNT(*) as total_records,
  MIN(sale_date) as earliest_date,
  MAX(sale_date) as latest_date,
  SUM(revenue) as total_revenue,
  AVG(revenue) as avg_daily_revenue
FROM sales_data
WHERE book_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid;

-- Check trend
SELECT 
  sale_date,
  SUM(revenue) as daily_revenue
FROM sales_data
WHERE book_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid
GROUP BY sale_date
ORDER BY sale_date
LIMIT 10; -- First 10 days

SELECT 
  sale_date,
  SUM(revenue) as daily_revenue
FROM sales_data
WHERE book_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid
GROUP BY sale_date
ORDER BY sale_date DESC
LIMIT 10; -- Last 10 days

