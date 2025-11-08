-- AuthorStack Database Seed Data
-- This creates test data for development

-- ============================================
-- TEST USER (via Supabase Auth)
-- ============================================
-- Note: You must create this user via Supabase Auth dashboard or use the auth API
-- Email: test@authorstack.com
-- Password: TestPassword123!
-- After creating the user, copy the UUID and replace 'TEST_USER_ID' below

-- For now, we'll use a placeholder UUID that you should replace
-- To get the actual UUID, check Supabase Auth > Users after creating the test user

-- ============================================
-- INSERT TEST PROFILE
-- ============================================
-- Replace 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' with actual user UUID from Supabase Auth
INSERT INTO profiles (id, subscription_tier, whop_customer_id, created_at, updated_at)
VALUES (
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid,
  'pro',
  'whop_test_customer_123',
  NOW() - INTERVAL '30 days',
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- INSERT TEST BOOKS
-- ============================================
INSERT INTO books (id, user_id, title, author, isbn, asin, cover_url, genre, platforms, created_at)
VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid,
  'The Art of Book Marketing',
  'Sarah Johnson',
  '978-1234567890',
  'B0ABC123DEF',
  'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
  'Non-Fiction',
  ARRAY['amazon', 'gumroad'],
  NOW() - INTERVAL '60 days'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid,
  'Midnight in the Garden',
  'Sarah Johnson',
  '978-0987654321',
  'B0XYZ789GHI',
  'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
  'Fiction',
  ARRAY['amazon', 'apple'],
  NOW() - INTERVAL '45 days'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT PLATFORM CONNECTIONS
-- ============================================
INSERT INTO platform_connections (id, user_id, platform_name, credentials, is_active, last_synced_at, created_at)
VALUES
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid,
  'amazon',
  '{"email": "author@example.com", "encrypted": true}'::jsonb,
  true,
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '30 days'
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid,
  'gumroad',
  '{"api_key": "gumroad_test_key_123", "encrypted": true}'::jsonb,
  true,
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '25 days'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT SALES DATA (14 days of test data)
-- ============================================
-- Sales data for "The Art of Book Marketing" on Amazon
INSERT INTO sales_data (id, book_id, platform, sale_date, units_sold, revenue, page_reads, currency, created_at)
VALUES
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '14 days',
  5,
  24.95,
  1250,
  'USD',
  NOW()
),
(
  'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '13 days',
  8,
  39.92,
  2100,
  'USD',
  NOW()
),
(
  '11111111-1111-1111-1111-111111111111'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '12 days',
  6,
  29.94,
  1680,
  'USD',
  NOW()
),
(
  '22222222-2222-2222-2222-222222222222'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '11 days',
  12,
  59.88,
  3200,
  'USD',
  NOW()
),
(
  '33333333-3333-3333-3333-333333333333'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '10 days',
  9,
  44.91,
  2400,
  'USD',
  NOW()
),
(
  '44444444-4444-4444-4444-444444444444'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '9 days',
  7,
  34.93,
  1900,
  'USD',
  NOW()
),
(
  '55555555-5555-5555-5555-555555555555'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '8 days',
  11,
  54.89,
  2950,
  'USD',
  NOW()
),
(
  '66666666-6666-6666-6666-666666666666'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '7 days',
  4,
  19.96,
  1100,
  'USD',
  NOW()
),
(
  '77777777-7777-7777-7777-777777777777'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '6 days',
  10,
  49.90,
  2700,
  'USD',
  NOW()
),
(
  '88888888-8888-8888-8888-888888888888'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '5 days',
  8,
  39.92,
  2150,
  'USD',
  NOW()
),
(
  '99999999-9999-9999-9999-999999999999'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '4 days',
  13,
  64.87,
  3500,
  'USD',
  NOW()
),
(
  'aaaabbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '3 days',
  9,
  44.91,
  2400,
  'USD',
  NOW()
),
(
  'aaaacccc-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '2 days',
  15,
  74.85,
  4000,
  'USD',
  NOW()
),
(
  'aaaadddd-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '1 day',
  11,
  54.89,
  2950,
  'USD',
  NOW()
)
ON CONFLICT (book_id, platform, sale_date) DO NOTHING;

-- Sales data for "The Art of Book Marketing" on Gumroad
INSERT INTO sales_data (id, book_id, platform, sale_date, units_sold, revenue, currency, created_at)
VALUES
(
  'bbbbcccc-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'gumroad',
  CURRENT_DATE - INTERVAL '14 days',
  2,
  19.98,
  'USD',
  NOW()
),
(
  'bbbbdddd-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'gumroad',
  CURRENT_DATE - INTERVAL '12 days',
  3,
  29.97,
  'USD',
  NOW()
),
(
  'bbbbeeee-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'gumroad',
  CURRENT_DATE - INTERVAL '10 days',
  1,
  9.99,
  'USD',
  NOW()
),
(
  'bbbbffff-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'gumroad',
  CURRENT_DATE - INTERVAL '8 days',
  4,
  39.96,
  'USD',
  NOW()
),
(
  'cccceeee-cccc-cccc-cccc-cccccccccccc'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'gumroad',
  CURRENT_DATE - INTERVAL '6 days',
  2,
  19.98,
  'USD',
  NOW()
),
(
  'ccccffff-cccc-cccc-cccc-cccccccccccc'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'gumroad',
  CURRENT_DATE - INTERVAL '4 days',
  5,
  49.95,
  'USD',
  NOW()
),
(
  'ccccgggg-cccc-cccc-cccc-cccccccccccc'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'gumroad',
  CURRENT_DATE - INTERVAL '2 days',
  3,
  29.97,
  'USD',
  NOW()
)
ON CONFLICT (book_id, platform, sale_date) DO NOTHING;

-- Sales data for "Midnight in the Garden" on Amazon
INSERT INTO sales_data (id, book_id, platform, sale_date, units_sold, revenue, page_reads, currency, created_at)
VALUES
(
  'ddddeeee-dddd-dddd-dddd-dddddddddddd'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '14 days',
  3,
  14.97,
  800,
  'USD',
  NOW()
),
(
  'dddfffff-dddd-dddd-dddd-dddddddddddd'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '12 days',
  5,
  24.95,
  1350,
  'USD',
  NOW()
),
(
  'ddddgggg-dddd-dddd-dddd-dddddddddddd'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '10 days',
  4,
  19.96,
  1100,
  'USD',
  NOW()
),
(
  'ddddhhhh-dddd-dddd-dddd-dddddddddddd'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '8 days',
  7,
  34.93,
  1900,
  'USD',
  NOW()
),
(
  'eeeegggg-eeee-eeee-eeee-eeeeeeeeeeee'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '6 days',
  6,
  29.94,
  1650,
  'USD',
  NOW()
),
(
  'eeeehhhh-eeee-eeee-eeee-eeeeeeeeeeee'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '4 days',
  8,
  39.92,
  2200,
  'USD',
  NOW()
),
(
  'eeeeiiiii-eeee-eeee-eeee-eeeeeeeeeeee'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'amazon',
  CURRENT_DATE - INTERVAL '2 days',
  5,
  24.95,
  1350,
  'USD',
  NOW()
)
ON CONFLICT (book_id, platform, sale_date) DO NOTHING;

-- ============================================
-- INSERT LAUNCH CHECKLIST
-- ============================================
INSERT INTO launch_checklists (id, book_id, launch_date, template_id, status, created_at)
VALUES
(
  'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  CURRENT_DATE + INTERVAL '30 days',
  NULL,
  'active',
  NOW() - INTERVAL '7 days'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT CHECKLIST TASKS
-- ============================================
INSERT INTO checklist_tasks (id, checklist_id, task_name, description, due_date, completed, task_order, created_at)
VALUES
(
  '10101010-1010-1010-1010-101010101010'::uuid,
  'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid,
  'Finalize book cover',
  'Get final approval on cover design',
  CURRENT_DATE + INTERVAL '25 days',
  true,
  1,
  NOW() - INTERVAL '7 days'
),
(
  '20202020-2020-2020-2020-202020202020'::uuid,
  'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid,
  'Send to beta readers',
  'Distribute ARC to beta readers for feedback',
  CURRENT_DATE + INTERVAL '20 days',
  true,
  2,
  NOW() - INTERVAL '7 days'
),
(
  '30303030-3030-3030-3030-303030303030'::uuid,
  'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid,
  'Create launch day social media posts',
  'Write and schedule 5 social media posts for launch day',
  CURRENT_DATE + INTERVAL '5 days',
  false,
  3,
  NOW() - INTERVAL '7 days'
),
(
  '40404040-4040-4040-4040-404040404040'::uuid,
  'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid,
  'Set up pre-order links',
  'Configure pre-order links on all platforms',
  CURRENT_DATE + INTERVAL '3 days',
  false,
  4,
  NOW() - INTERVAL '7 days'
),
(
  '50505050-5050-5050-5050-505050505050'::uuid,
  'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid,
  'Launch day promotion',
  'Execute launch day marketing blitz',
  CURRENT_DATE + INTERVAL '30 days',
  false,
  5,
  NOW() - INTERVAL '7 days'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT TRACKED COMPETITORS
-- ============================================
INSERT INTO tracked_competitors (id, user_id, book_asin, title, author, genre, created_at)
VALUES
(
  '60606060-6060-6060-6060-606060606060'::uuid,
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid,
  'B001COMPETITOR1',
  'The Complete Guide to Self-Publishing',
  'Jane Smith',
  'Non-Fiction',
  NOW() - INTERVAL '14 days'
),
(
  '70707070-7070-7070-7070-707070707070'::uuid,
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid,
  'B002COMPETITOR2',
  'Marketing Your Book Successfully',
  'John Doe',
  'Non-Fiction',
  NOW() - INTERVAL '10 days'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT PRICE HISTORY
-- ============================================
INSERT INTO price_history (id, competitor_id, platform, price, currency, checked_at)
VALUES
(
  '80808080-8080-8080-8080-808080808080'::uuid,
  '60606060-6060-6060-6060-606060606060'::uuid,
  'amazon',
  19.99,
  'USD',
  NOW() - INTERVAL '7 days'
),
(
  '90909090-9090-9090-9090-909090909090'::uuid,
  '60606060-6060-6060-6060-606060606060'::uuid,
  'amazon',
  17.99,
  'USD',
  NOW() - INTERVAL '3 days'
),
(
  'a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0'::uuid,
  '70707070-7070-7070-7070-707070707070'::uuid,
  'amazon',
  24.99,
  'USD',
  NOW() - INTERVAL '7 days'
),
(
  'b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0'::uuid,
  '70707070-7070-7070-7070-707070707070'::uuid,
  'amazon',
  22.99,
  'USD',
  NOW() - INTERVAL '3 days'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT MARKETING EVENTS
-- ============================================
INSERT INTO marketing_events (id, user_id, book_id, event_type, event_date, event_time, description, completed, created_at)
VALUES
(
  'c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0'::uuid,
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'social_post',
  CURRENT_DATE + INTERVAL '5 days',
  '09:00:00',
  'Post about book launch on Twitter and Instagram',
  false,
  NOW()
),
(
  'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0'::uuid,
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'email_campaign',
  CURRENT_DATE + INTERVAL '7 days',
  '10:00:00',
  'Send launch announcement email to subscribers',
  false,
  NOW()
),
(
  'e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0'::uuid,
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'promotion',
  CURRENT_DATE + INTERVAL '14 days',
  '00:00:00',
  'Launch 50% off promotion for first 100 copies',
  false,
  NOW()
)
ON CONFLICT DO NOTHING;

-- ============================================
-- IMPORTANT: REPLACE TEST USER ID
-- ============================================
-- The seed data above uses 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' as a placeholder
-- You MUST replace this with your actual test user ID from Supabase Auth
-- 
-- Steps:
-- 1. Create a user in Supabase Auth dashboard (test@authorstack.com)
-- 2. Copy the user UUID from the Auth > Users page
-- 3. Replace all instances of 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' with your UUID
-- 4. Run this seed script
