-- AuthorStack Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends Supabase Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  whop_customer_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- BOOKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT,
  isbn TEXT,
  asin TEXT,
  cover_url TEXT,
  genre TEXT,
  platforms TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on books
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own books"
  ON books FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create books"
  ON books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books"
  ON books FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books"
  ON books FOR DELETE
  USING (auth.uid() = user_id);

-- Create index on user_id for faster queries
CREATE INDEX idx_books_user_id ON books(user_id);

-- ============================================
-- PLATFORM CONNECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS platform_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL,
  credentials JSONB,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on platform_connections
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own platform connections"
  ON platform_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create platform connections"
  ON platform_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own platform connections"
  ON platform_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own platform connections"
  ON platform_connections FOR DELETE
  USING (auth.uid() = user_id);

-- Create index on user_id
CREATE INDEX idx_platform_connections_user_id ON platform_connections(user_id);

-- ============================================
-- SALES DATA TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sales_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  sale_date DATE NOT NULL,
  units_sold INTEGER DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  page_reads INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, platform, sale_date)
);

-- Enable RLS on sales_data
ALTER TABLE sales_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sales data for their books"
  ON sales_data FOR SELECT
  USING (
    book_id IN (
      SELECT id FROM books WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert sales data for their books"
  ON sales_data FOR INSERT
  WITH CHECK (
    book_id IN (
      SELECT id FROM books WHERE user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_sales_data_book_date ON sales_data(book_id, sale_date);
CREATE INDEX idx_sales_data_platform ON sales_data(platform);

-- ============================================
-- LAUNCH CHECKLISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS launch_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  launch_date DATE NOT NULL,
  template_id UUID,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on launch_checklists
ALTER TABLE launch_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view launch checklists for their books"
  ON launch_checklists FOR SELECT
  USING (
    book_id IN (
      SELECT id FROM books WHERE user_id = auth.uid()
    )
  );

-- Create index on book_id
CREATE INDEX idx_launch_checklists_book_id ON launch_checklists(book_id);

-- ============================================
-- CHECKLIST TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS checklist_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checklist_id UUID NOT NULL REFERENCES launch_checklists(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  task_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on checklist_tasks
ALTER TABLE checklist_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks for their checklists"
  ON checklist_tasks FOR SELECT
  USING (
    checklist_id IN (
      SELECT id FROM launch_checklists 
      WHERE book_id IN (
        SELECT id FROM books WHERE user_id = auth.uid()
      )
    )
  );

-- Create index on checklist_id
CREATE INDEX idx_checklist_tasks_checklist_id ON checklist_tasks(checklist_id);

-- ============================================
-- TRACKED COMPETITORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tracked_competitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_asin TEXT NOT NULL,
  title TEXT,
  author TEXT,
  genre TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tracked_competitors
ALTER TABLE tracked_competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their tracked competitors"
  ON tracked_competitors FOR SELECT
  USING (auth.uid() = user_id);

-- Create index on user_id
CREATE INDEX idx_tracked_competitors_user_id ON tracked_competitors(user_id);

-- ============================================
-- PRICE HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_id UUID NOT NULL REFERENCES tracked_competitors(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on price_history
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view price history for their competitors"
  ON price_history FOR SELECT
  USING (
    competitor_id IN (
      SELECT id FROM tracked_competitors WHERE user_id = auth.uid()
    )
  );

-- Create index on competitor_id and checked_at
CREATE INDEX idx_price_history_competitor ON price_history(competitor_id, checked_at);

-- ============================================
-- A/B TESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL CHECK (test_type IN ('cover', 'title', 'description')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on ab_tests
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view A/B tests for their books"
  ON ab_tests FOR SELECT
  USING (
    book_id IN (
      SELECT id FROM books WHERE user_id = auth.uid()
    )
  );

-- Create index on book_id
CREATE INDEX idx_ab_tests_book_id ON ab_tests(book_id);

-- ============================================
-- TEST VARIANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS test_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,
  image_url TEXT,
  text_content TEXT,
  short_url TEXT UNIQUE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on test_variants
ALTER TABLE test_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view variants for their tests"
  ON test_variants FOR SELECT
  USING (
    test_id IN (
      SELECT id FROM ab_tests 
      WHERE book_id IN (
        SELECT id FROM books WHERE user_id = auth.uid()
      )
    )
  );

-- Create index on test_id
CREATE INDEX idx_test_variants_test_id ON test_variants(test_id);

-- ============================================
-- MARKETING EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS marketing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  description TEXT,
  recurrence_rule TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on marketing_events
ALTER TABLE marketing_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their marketing events"
  ON marketing_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create marketing events"
  ON marketing_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their marketing events"
  ON marketing_events FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index on user_id and event_date
CREATE INDEX idx_marketing_events_user_date ON marketing_events(user_id, event_date);

-- ============================================
-- CREATED FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_connections_updated_at BEFORE UPDATE ON platform_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_launch_checklists_updated_at BEFORE UPDATE ON launch_checklists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklist_tasks_updated_at BEFORE UPDATE ON checklist_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracked_competitors_updated_at BEFORE UPDATE ON tracked_competitors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ab_tests_updated_at BEFORE UPDATE ON ab_tests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_events_updated_at BEFORE UPDATE ON marketing_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
