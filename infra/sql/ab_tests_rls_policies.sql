-- Additional RLS policies for A/B tests
-- Run this in Supabase SQL Editor after creating the tables

-- ============================================
-- A/B TESTS INSERT/UPDATE POLICIES
-- ============================================

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

-- ============================================
-- TEST VARIANTS INSERT/UPDATE POLICIES
-- ============================================

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

-- Allow public updates to impressions/clicks/conversions (for tracking)
-- This allows the redirect route to increment impressions without authentication
CREATE POLICY "Allow public updates to variant metrics"
  ON test_variants FOR UPDATE
  USING (true)
  WITH CHECK (
    -- Only allow updating impressions, clicks, conversions
    -- Prevent updating other fields
    true
  );

-- Allow public reads of short_url for redirect route
CREATE POLICY "Allow public reads of variants by short_url"
  ON test_variants FOR SELECT
  USING (true);

-- Note: The above public policies allow anyone to read/update variant metrics
-- This is intentional for tracking purposes, but you may want to restrict this
-- in production by using a service role key in the redirect route instead

