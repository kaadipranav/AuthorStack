# AuthorStack - Row Level Security (RLS) Configuration Guide

Complete guide for configuring Row Level Security in Supabase.

---

## 🔐 RLS Overview

### What is RLS?
Row Level Security (RLS) is a database feature that restricts which rows users can access based on policies.

### Why RLS?
- Prevents users from accessing other users' data
- Enforces data isolation at database level
- Protects against SQL injection
- Complies with data privacy regulations

### How It Works
1. User authenticates with Supabase
2. `auth.uid()` is set to user's UUID
3. RLS policies check if user can access row
4. Only authorized rows are returned

---

## 🚀 Enable RLS on All Tables

### Step 1: Enable RLS

Go to Supabase Dashboard > SQL Editor and run:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
```

### Step 2: Verify RLS is Enabled

```sql
-- Check which tables have RLS enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Should show 't' (true) for all tables
```

---

## 👤 Profiles Table Policies

### Policy 1: Users can read their own profile

```sql
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);
```

**What it does:**
- Allows SELECT on profiles table
- Only returns rows where `id` matches authenticated user's UUID
- Users can only see their own profile

### Policy 2: Users can update their own profile

```sql
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

**What it does:**
- Allows UPDATE on profiles table
- Only allows updating own profile
- Prevents users from modifying other profiles

### Policy 3: Prevent profile deletion

```sql
CREATE POLICY "Prevent profile deletion"
ON profiles FOR DELETE
USING (false);
```

**What it does:**
- Prevents all DELETE operations
- Profiles should never be deleted
- Use soft delete if needed

### Policy 4: Service role can bypass RLS

```sql
-- Service role automatically bypasses RLS
-- No policy needed
-- Verified in code:
const supabase = createClient(url, serviceRoleKey);
// Can access all rows regardless of RLS
```

---

## 📚 Books Table Policies

### Policy 1: Users can read their own books

```sql
CREATE POLICY "Users can read own books"
ON books FOR SELECT
USING (auth.uid() = user_id);
```

### Policy 2: Users can create books

```sql
CREATE POLICY "Users can create own books"
ON books FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**What it does:**
- Allows INSERT on books table
- Only allows creating books for themselves
- Prevents users from creating books for others

### Policy 3: Users can update their own books

```sql
CREATE POLICY "Users can update own books"
ON books FOR UPDATE
USING (auth.uid() = user_id);
```

### Policy 4: Users can delete their own books

```sql
CREATE POLICY "Users can delete own books"
ON books FOR DELETE
USING (auth.uid() = user_id);
```

---

## 💰 Sales Table Policies

### Policy 1: Users can read their own sales

```sql
CREATE POLICY "Users can read own sales"
ON sales FOR SELECT
USING (auth.uid() = user_id);
```

### Policy 2: Users can insert their own sales

```sql
CREATE POLICY "Users can insert own sales"
ON sales FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### Policy 3: Prevent sales updates

```sql
CREATE POLICY "Prevent sales updates"
ON sales FOR UPDATE
USING (false);
```

**Why prevent updates?**
- Sales data should be immutable
- Prevents accidental modifications
- Maintains audit trail

### Policy 4: Prevent sales deletion

```sql
CREATE POLICY "Prevent sales deletion"
ON sales FOR DELETE
USING (false);
```

---

## 🔗 Platform Connections Policies

### Policy 1: Users can read their own connections

```sql
CREATE POLICY "Users can read own connections"
ON platform_connections FOR SELECT
USING (auth.uid() = user_id);
```

### Policy 2: Users can create connections

```sql
CREATE POLICY "Users can create own connections"
ON platform_connections FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### Policy 3: Users can update their own connections

```sql
CREATE POLICY "Users can update own connections"
ON platform_connections FOR UPDATE
USING (auth.uid() = user_id);
```

### Policy 4: Users can delete their own connections

```sql
CREATE POLICY "Users can delete own connections"
ON platform_connections FOR DELETE
USING (auth.uid() = user_id);
```

---

## 📋 Launch Checklists Policies

### Policy 1: Users can read their own checklists

```sql
CREATE POLICY "Users can read own checklists"
ON launch_checklists FOR SELECT
USING (auth.uid() = user_id);
```

### Policy 2: Users can create checklists

```sql
CREATE POLICY "Users can create own checklists"
ON launch_checklists FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### Policy 3: Users can update their own checklists

```sql
CREATE POLICY "Users can update own checklists"
ON launch_checklists FOR UPDATE
USING (auth.uid() = user_id);
```

### Policy 4: Users can delete their own checklists

```sql
CREATE POLICY "Users can delete own checklists"
ON launch_checklists FOR DELETE
USING (auth.uid() = user_id);
```

---

## ✅ Checklist Tasks Policies

### Policy 1: Users can read their own tasks

```sql
CREATE POLICY "Users can read own tasks"
ON checklist_tasks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM launch_checklists
    WHERE id = checklist_tasks.checklist_id
    AND user_id = auth.uid()
  )
);
```

**What it does:**
- Allows reading tasks only if user owns the checklist
- Uses subquery to check checklist ownership
- Prevents access to other users' tasks

### Policy 2: Users can create tasks

```sql
CREATE POLICY "Users can create own tasks"
ON checklist_tasks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM launch_checklists
    WHERE id = checklist_tasks.checklist_id
    AND user_id = auth.uid()
  )
);
```

### Policy 3: Users can update their own tasks

```sql
CREATE POLICY "Users can update own tasks"
ON checklist_tasks FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM launch_checklists
    WHERE id = checklist_tasks.checklist_id
    AND user_id = auth.uid()
  )
);
```

### Policy 4: Users can delete their own tasks

```sql
CREATE POLICY "Users can delete own tasks"
ON checklist_tasks FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM launch_checklists
    WHERE id = checklist_tasks.checklist_id
    AND user_id = auth.uid()
  )
);
```

---

## 🏆 Tracked Competitors Policies

### Policy 1: Users can read their own competitors

```sql
CREATE POLICY "Users can read own competitors"
ON tracked_competitors FOR SELECT
USING (auth.uid() = user_id);
```

### Policy 2: Users can create competitors

```sql
CREATE POLICY "Users can create own competitors"
ON tracked_competitors FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### Policy 3: Users can update their own competitors

```sql
CREATE POLICY "Users can update own competitors"
ON tracked_competitors FOR UPDATE
USING (auth.uid() = user_id);
```

### Policy 4: Users can delete their own competitors

```sql
CREATE POLICY "Users can delete own competitors"
ON tracked_competitors FOR DELETE
USING (auth.uid() = user_id);
```

---

## 💹 Price History Policies

### Policy 1: Users can read their own price history

```sql
CREATE POLICY "Users can read own price history"
ON price_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM tracked_competitors
    WHERE id = price_history.competitor_id
    AND user_id = auth.uid()
  )
);
```

### Policy 2: Service role can insert price history

```sql
CREATE POLICY "Service role can insert price history"
ON price_history FOR INSERT
WITH CHECK (true);
```

**Why allow service role?**
- Cron jobs insert price history
- Uses service role key (server-side only)
- Users cannot insert directly

### Policy 3: Prevent price history updates

```sql
CREATE POLICY "Prevent price history updates"
ON price_history FOR UPDATE
USING (false);
```

### Policy 4: Prevent price history deletion

```sql
CREATE POLICY "Prevent price history deletion"
ON price_history FOR DELETE
USING (false);
```

---

## 🔐 Encryption for JSONB Fields

### Step 1: Create Encryption Functions

```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create function to encrypt data
CREATE OR REPLACE FUNCTION encrypt_data(data TEXT, secret TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(
    encrypt(
      convert_to(data, 'UTF8'),
      convert_to(secret, 'UTF8'),
      'aes'
    ),
    'base64'
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to decrypt data
CREATE OR REPLACE FUNCTION decrypt_data(encrypted TEXT, secret TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN convert_from(
    decrypt(
      decode(encrypted, 'base64'),
      convert_to(secret, 'UTF8'),
      'aes'
    ),
    'UTF8'
  );
END;
$$ LANGUAGE plpgsql;
```

### Step 2: Add Encrypted Column

```sql
-- Add encrypted_credentials column to platform_connections
ALTER TABLE platform_connections
ADD COLUMN encrypted_credentials JSONB;

-- Example structure:
-- {
--   "api_key": "encrypted_value",
--   "access_token": "encrypted_value",
--   "refresh_token": "encrypted_value"
-- }
```

### Step 3: Create Encryption Trigger

```sql
-- Create trigger function
CREATE OR REPLACE FUNCTION encrypt_platform_credentials()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.encrypted_credentials IS NOT NULL THEN
    -- Encrypt each field in the JSONB object
    NEW.encrypted_credentials := jsonb_build_object(
      'api_key',
      CASE WHEN NEW.encrypted_credentials->>'api_key' IS NOT NULL
        THEN encrypt_data(
          NEW.encrypted_credentials->>'api_key',
          current_setting('app.encryption_key')
        )
        ELSE NULL
      END,
      'access_token',
      CASE WHEN NEW.encrypted_credentials->>'access_token' IS NOT NULL
        THEN encrypt_data(
          NEW.encrypted_credentials->>'access_token',
          current_setting('app.encryption_key')
        )
        ELSE NULL
      END,
      'refresh_token',
      CASE WHEN NEW.encrypted_credentials->>'refresh_token' IS NOT NULL
        THEN encrypt_data(
          NEW.encrypted_credentials->>'refresh_token',
          current_setting('app.encryption_key')
        )
        ELSE NULL
      END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER encrypt_credentials_trigger
BEFORE INSERT OR UPDATE ON platform_connections
FOR EACH ROW
EXECUTE FUNCTION encrypt_platform_credentials();
```

### Step 4: Create Decryption View

```sql
-- Create view that automatically decrypts credentials
CREATE OR REPLACE VIEW platform_connections_decrypted AS
SELECT
  id,
  user_id,
  platform_name,
  is_active,
  jsonb_build_object(
    'api_key',
    CASE WHEN encrypted_credentials->>'api_key' IS NOT NULL
      THEN decrypt_data(
        encrypted_credentials->>'api_key',
        current_setting('app.encryption_key')
      )
      ELSE NULL
    END,
    'access_token',
    CASE WHEN encrypted_credentials->>'access_token' IS NOT NULL
      THEN decrypt_data(
        encrypted_credentials->>'access_token',
        current_setting('app.encryption_key')
      )
      ELSE NULL
    END,
    'refresh_token',
    CASE WHEN encrypted_credentials->>'refresh_token' IS NOT NULL
      THEN decrypt_data(
        encrypted_credentials->>'refresh_token',
        current_setting('app.encryption_key')
      )
      ELSE NULL
    END
  ) AS credentials,
  created_at,
  updated_at
FROM platform_connections;
```

### Step 5: Use in Application

```typescript
// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Set encryption key for the session
export async function setEncryptionKey() {
  await supabase.rpc('set_config', {
    key: 'app.encryption_key',
    value: process.env.ENCRYPTION_KEY!
  });
}

// Get decrypted credentials
export async function getPlatformCredentials(connectionId: string) {
  await setEncryptionKey();
  
  const { data, error } = await supabase
    .from('platform_connections_decrypted')
    .select('credentials')
    .eq('id', connectionId)
    .single();
  
  if (error) throw error;
  return data?.credentials;
}
```

---

## 🧪 Testing RLS Policies

### Test 1: User Can Only See Own Data

```typescript
// Test with user's own token
const userClient = createClient(url, userToken);
const { data } = await userClient.from('books').select();
// Should return only user's books

// Test with different user's token
const otherUserClient = createClient(url, otherUserToken);
const { data: otherData } = await otherUserClient.from('books').select();
// Should return only other user's books
// Should NOT include first user's books
```

### Test 2: Service Role Can Access All Data

```typescript
// Test with service role key
const adminClient = createClient(url, serviceRoleKey);
const { data } = await adminClient.from('books').select();
// Should return ALL books (bypasses RLS)
```

### Test 3: Unauthenticated Users Cannot Access Data

```typescript
// Test without authentication
const anonClient = createClient(url, anonKey);
const { error } = await anonClient.from('books').select();
// Should return permission denied error
```

### Test 4: Users Cannot Update Other Users' Data

```typescript
// Try to update another user's book
const { error } = await userClient
  .from('books')
  .update({ title: 'Hacked!' })
  .eq('id', otherUsersBookId);
// Should return permission denied error
```

---

## 📊 Verify RLS Policies

### In Supabase Dashboard

1. Go to **Authentication** > **Policies**
2. Select each table
3. Verify policies are listed:
   - ✅ SELECT policy
   - ✅ INSERT policy (if applicable)
   - ✅ UPDATE policy (if applicable)
   - ✅ DELETE policy (if applicable)

### Via SQL Query

```sql
-- List all RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 🚀 Deploy RLS to Production

### Step 1: Test in Development

```bash
# Test RLS locally with Supabase
supabase start
pnpm test
```

### Step 2: Create Migration

```bash
# Create migration file
supabase migration new add_rls_policies

# Edit migration file with RLS policies
```

### Step 3: Deploy to Staging

```bash
# Push to staging
supabase db push --linked
```

### Step 4: Test in Staging

```bash
# Run tests against staging database
pnpm test:staging
```

### Step 5: Deploy to Production

```bash
# Push to production
supabase db push --linked --prod
```

---

## ⚠️ Common RLS Mistakes

### Mistake 1: Forgetting to Enable RLS

```sql
-- ❌ WRONG - RLS not enabled
-- Table is accessible to all authenticated users

-- ✅ CORRECT
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
```

### Mistake 2: Overly Permissive Policies

```sql
-- ❌ WRONG - Allows all users to read all books
CREATE POLICY "Anyone can read"
ON books FOR SELECT
USING (true);

-- ✅ CORRECT - Only own books
CREATE POLICY "Users can read own books"
ON books FOR SELECT
USING (auth.uid() = user_id);
```

### Mistake 3: Forgetting WITH CHECK

```sql
-- ❌ WRONG - INSERT not restricted
CREATE POLICY "Users can insert"
ON books FOR INSERT
USING (auth.uid() = user_id);

-- ✅ CORRECT - WITH CHECK ensures user_id matches
CREATE POLICY "Users can insert own books"
ON books FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### Mistake 4: Exposing Service Role Key

```typescript
// ❌ WRONG - Exposed to client
const supabase = createClient(url, serviceRoleKey);

// ✅ CORRECT - Only in server-side code
// app/api/admin/route.ts
const supabase = createClient(url, serviceRoleKey);
```

---

## ✅ RLS Deployment Checklist

Before going to production:

- [ ] RLS enabled on all tables
- [ ] All policies created and tested
- [ ] SELECT policies restrict to own data
- [ ] INSERT policies use WITH CHECK
- [ ] UPDATE policies restrict to own data
- [ ] DELETE policies prevent unauthorized deletion
- [ ] Service role can bypass RLS
- [ ] Tested with multiple users
- [ ] Tested with unauthenticated requests
- [ ] Encryption configured for sensitive fields
- [ ] Encryption keys stored securely
- [ ] Decryption functions working correctly
- [ ] Performance tested with large datasets
- [ ] Backup and recovery tested

---

**Last Updated:** November 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
