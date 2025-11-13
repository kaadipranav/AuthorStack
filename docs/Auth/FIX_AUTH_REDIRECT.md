# Fix: Google OAuth Redirect Loop

If you're stuck in a redirect loop after Google sign-in, follow these steps:

## 🔧 Quick Fix

### Step 1: Update Supabase Database Schema

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy and paste the contents of `infra/sql/add_profile_fields.sql`
5. Click **"Run"**

This will:
- Add `email` and `full_name` columns to the `profiles` table
- Create an automatic trigger to create a profile when a user signs up
- Enable auto-creation of profiles on first login

### Step 2: Clear Browser Cache

1. Open browser DevTools (F12)
2. Go to **Application** tab
3. Clear **Cookies** and **Local Storage** for `localhost:3000`
4. Close and reopen the browser

### Step 3: Test Google Sign-In

1. Go to http://localhost:3000/auth/login
2. Click **"Sign in with Google"**
3. Select your Google account
4. **Should now redirect to dashboard** ✅

## 🔍 If It Still Doesn't Work

### Check the Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for error messages
4. Common errors:
   - `PGRST116` - Profile table doesn't exist (run Step 1)
   - `relation "profiles" does not exist` - Table not created
   - `permission denied` - RLS policy issue

### Check Supabase Logs

1. Go to Supabase Dashboard
2. Click **Logs** in left sidebar
3. Look for errors in the past 5 minutes
4. Check for database errors

### Verify Supabase Setup

1. Go to **Table Editor** in Supabase
2. Check that `profiles` table exists
3. Check that it has these columns:
   - `id` (UUID, Primary Key)
   - `email` (Text)
   - `full_name` (Text)
   - `subscription_tier` (Text)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

### Verify Google OAuth Configuration

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Check that **Google** is enabled
3. Verify **Client ID** and **Client Secret** are set
4. Go to Google Cloud Console
5. Verify redirect URIs:
   - Authorized redirect URIs: `https://<project-ref>.supabase.co/auth/v1/callback`
   - Authorized JavaScript origins: `http://localhost:3000`

## 📝 What Changed

### Files Modified:
- `lib/auth.ts` - Added auto-profile creation with fallback
- `app/auth/callback/route.ts` - Added error handling
- `app/dashboard/layout.tsx` - Added loading state

### Files Created:
- `infra/sql/add_profile_fields.sql` - Migration to add profile fields and trigger

## ✅ Expected Behavior

1. User clicks "Sign in with Google"
2. Redirected to Google login
3. User selects account
4. Redirected back to `/auth/callback`
5. Callback exchanges code for session
6. Profile auto-created if doesn't exist
7. Redirected to `/dashboard`
8. Dashboard loads with user data ✅

## 🆘 Still Having Issues?

1. Check that `.env.local` has correct Supabase keys
2. Verify Google OAuth credentials in Supabase
3. Clear all cookies and try again
4. Check browser console for specific error messages
5. Check Supabase logs for database errors

---

_If you're still stuck, check the error message in the browser console and share it for debugging._
