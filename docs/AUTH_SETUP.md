# AuthorStack Authentication Setup Guide

Complete guide to set up and test Supabase authentication in AuthorStack.

## 🎯 What's Implemented

✅ **Supabase Auth Integration**
- Email/password authentication
- Email verification flow
- Password reset functionality
- Session management with middleware

✅ **Auth Pages**
- `/auth/login` - Sign in
- `/auth/signup` - Create account
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password` - Set new password
- `/auth/callback` - Email verification callback

✅ **Protected Routes**
- `/dashboard` - Protected dashboard
- `/profile` - User profile page
- Middleware redirects unauthenticated users to login

✅ **User Profile**
- Profile information from `profiles` table
- Subscription tier display
- Account creation date

---

## 📋 Prerequisites

1. **Supabase Project** - Already created (from DATABASE_SETUP_COMMANDS.md)
2. **Environment Variables** - Already in `.env.local`
3. **Dependencies** - Need to install

---

## 🚀 Setup Steps

### Step 1: Install Dependencies

```bash
cd d:\Pranav\AuthorStack
pnpm install
```

This installs `@supabase/auth-helpers-nextjs` and all other dependencies.

### Step 2: Configure Supabase Auth

In your Supabase project dashboard:

1. Go to **Authentication > Providers**
2. Ensure **Email** provider is enabled (it should be by default)
3. Go to **Authentication > Email Templates**
4. Verify confirmation email template is set up

### Step 3: Set Redirect URLs

In Supabase dashboard:

1. Go to **Authentication > URL Configuration**
2. Add these redirect URLs:
   ```
   http://localhost:3000/auth/callback
   https://your-production-domain.com/auth/callback
   ```

### Step 4: Enable Email Confirmation (Optional but Recommended)

In Supabase dashboard:

1. Go to **Authentication > Providers > Email**
2. Toggle **Confirm email** to ON
3. This requires users to verify their email before signing in

### Step 5: Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

---

## 🧪 How to Test

### Test 1: Sign Up

1. Go to http://localhost:3000/auth/signup
2. Enter:
   - Email: `testuser@example.com`
   - Password: `TestPassword123!`
   - Confirm Password: `TestPassword123!`
3. Click **Create Account**
4. You should see: "Check your email" message

**What happens:**
- User is created in Supabase Auth
- Confirmation email is sent (check spam folder)
- Profile is created in `profiles` table with `free` tier

### Test 2: Verify Email (If Email Confirmation Enabled)

1. Check your email for confirmation link
2. Click the link (or copy the link to browser)
3. You'll be redirected to `/auth/callback`
4. Then redirected to `/dashboard`

**If email confirmation is disabled:**
- You can sign in immediately after signup

### Test 3: Sign In

1. Go to http://localhost:3000/auth/login
2. Enter:
   - Email: `testuser@example.com`
   - Password: `TestPassword123!`
3. Click **Sign In**
4. You should be redirected to `/dashboard`

**What happens:**
- Session is created
- Middleware verifies authentication
- User can access protected routes

### Test 4: View Profile

1. After signing in, click **Profile** in the header
2. Or go to http://localhost:3000/profile
3. You should see:
   - Your email
   - User ID
   - Email verification status
   - Subscription tier (free)
   - Account creation date

### Test 5: Password Reset

1. Go to http://localhost:3000/auth/forgot-password
2. Enter your email: `testuser@example.com`
3. Click **Send Reset Link**
4. You should see: "Check your email" message

**What happens:**
- Password reset email is sent
- Email contains reset link with token

5. Check your email for reset link
6. Click the link or copy to browser
7. You'll be redirected to `/auth/reset-password`
8. Enter new password: `NewPassword456!`
9. Click **Reset Password**
10. You'll be redirected to `/auth/login`
11. Sign in with new password

### Test 6: Protected Routes

1. Sign out by clicking **Logout** in the header
2. Try to access http://localhost:3000/dashboard
3. You should be redirected to `/auth/login`

**What happens:**
- Middleware checks for valid session
- If no session, redirects to login

### Test 7: Session Persistence

1. Sign in at http://localhost:3000/auth/login
2. Refresh the page
3. You should remain signed in
4. Close the browser and reopen
5. You should still be signed in (session persists in cookies)

---

## 📁 File Structure

```
app/
├── (auth)/                    # Auth layout group
│   ├── layout.tsx            # Auth pages layout
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── signup/
│   │   └── page.tsx          # Signup page
│   ├── forgot-password/
│   │   └── page.tsx          # Forgot password page
│   ├── reset-password/
│   │   └── page.tsx          # Reset password page
│   └── callback/
│       └── route.ts          # Email verification callback
├── dashboard/
│   ├── layout.tsx            # Dashboard layout
│   └── page.tsx              # Dashboard page
└── profile/
    └── page.tsx              # User profile page

components/
├── auth/
│   ├── LoginForm.tsx         # Login form component
│   ├── SignupForm.tsx        # Signup form component
│   ├── ForgotPasswordForm.tsx # Forgot password form
│   ├── ResetPasswordForm.tsx  # Reset password form
│   └── LogoutButton.tsx      # Logout button
└── dashboard/
    └── DashboardHeader.tsx   # Dashboard header

lib/
├── auth.ts                   # Auth helper functions
└── supabase.ts               # Supabase client

middleware.ts                 # Route protection middleware
```

---

## 🔐 Environment Variables

Your `.env.local` should already have:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

These are used by:
- Client-side: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server-side: All three variables
- Middleware: All three variables

---

## 🔄 Auth Flow Diagram

```
User visits app
    ↓
Middleware checks session
    ↓
├─ If authenticated → Allow access
└─ If not authenticated → Redirect to /auth/login

Sign Up Flow:
/auth/signup → Enter email/password → Create user → Send confirmation email
    ↓
User clicks email link → /auth/callback → Create profile → Redirect to /dashboard

Sign In Flow:
/auth/login → Enter email/password → Create session → Redirect to /dashboard

Password Reset Flow:
/auth/forgot-password → Enter email → Send reset email
    ↓
User clicks reset link → /auth/reset-password → Enter new password → Redirect to /auth/login
```

---

## 🐛 Troubleshooting

### "Email not found" error when signing up

**Cause:** Email already exists in Supabase Auth
**Solution:** Use a different email or delete the user from Supabase Auth dashboard

### "Invalid password" error

**Cause:** Password is less than 8 characters
**Solution:** Use a password with at least 8 characters

### "Passwords do not match" error

**Cause:** Password and confirm password don't match
**Solution:** Make sure both password fields are identical

### Confirmation email not received

**Cause:** Email confirmation might be disabled or email is in spam
**Solution:**
1. Check spam folder
2. In Supabase dashboard, go to Authentication > Email Templates
3. Verify confirmation email is configured
4. Check Supabase logs for email sending errors

### "Redirect URL not allowed" error

**Cause:** Callback URL not configured in Supabase
**Solution:**
1. Go to Supabase > Authentication > URL Configuration
2. Add `http://localhost:3000/auth/callback`
3. For production, add your production domain

### Session not persisting after refresh

**Cause:** Cookies not being set properly
**Solution:**
1. Check browser cookies are enabled
2. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
3. Clear browser cache and try again

### Middleware not protecting routes

**Cause:** Middleware not running or routes not matched
**Solution:**
1. Verify `middleware.ts` exists in project root
2. Check matcher pattern includes your routes
3. Restart dev server

---

## 📚 Key Functions

### `getCurrentUser()`
```typescript
import { getCurrentUser } from '@/lib/auth';

const user = await getCurrentUser();
// Returns: Supabase User object or null
```

### `getUserProfile()`
```typescript
import { getUserProfile } from '@/lib/auth';

const profile = await getUserProfile();
// Returns: Profile from profiles table or null
```

### `getServerSession()`
```typescript
import { getServerSession } from '@/lib/auth';

const session = await getServerSession();
// Returns: Session object or null
```

---

## 🚀 Next Steps

1. **Test all auth flows** (follow "How to Test" section)
2. **Customize auth pages** (update styling, add branding)
3. **Add social login** (Google, GitHub, etc.)
4. **Implement role-based access** (admin, pro, free tiers)
5. **Add 2FA** (two-factor authentication)
6. **Set up email templates** (customize confirmation emails)

---

## 📞 Support

- **Supabase Auth Docs:** https://supabase.com/docs/guides/auth
- **Next.js Auth Helpers:** https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- **Troubleshooting:** Check Supabase logs in dashboard

---

## ✅ Checklist

- [ ] Dependencies installed: `pnpm install`
- [ ] Supabase Auth enabled
- [ ] Redirect URLs configured
- [ ] Dev server running: `pnpm dev`
- [ ] Sign up test passed
- [ ] Email verification test passed
- [ ] Sign in test passed
- [ ] Profile page test passed
- [ ] Password reset test passed
- [ ] Protected routes test passed
- [ ] Session persistence test passed

---

**You're ready to test authentication!** 🎉

Start with: `pnpm dev` and visit http://localhost:3000/auth/signup
