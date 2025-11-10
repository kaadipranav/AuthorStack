-- Add target_url column to ab_tests table
-- Run this in Supabase SQL Editor

ALTER TABLE ab_tests 
ADD COLUMN IF NOT EXISTS target_url TEXT;

-- Add comment
COMMENT ON COLUMN ab_tests.target_url IS 'Target URL for redirect (sales page)';

