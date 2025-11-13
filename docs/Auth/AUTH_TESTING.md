# Authentication Testing Guide

Quick reference for testing all authentication features.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Visit http://localhost:3000
```

---

## 📝 Test Cases

### Test 1: User Sign Up ✓

**Steps:**
1. Go to http://localhost:3000/auth/signup
2. Enter email: `test1@example.com`
3. Enter password: `TestPassword123!`
4. Confirm password: `TestPassword123!`
5. Click "Create Account"

**Expected Result:**
- ✓ "Check your email" message appears
- ✓ User created in Supabase Auth
- ✓ Profile created in `profiles` table
- ✓ Confirmation email sent

**Verify in Supabase:**
```sql
SELECT * FROM profiles WHERE id = 'user-uuid';
-- Should show: subscription_tier = 'free'
```

---

### Test 2: Email Verification ✓

**Steps:**
1. Check email inbox for confirmation link
2. Click the confirmation link
3. You should be redirected to `/dashboard`

**Expected Result:**
- ✓ Email verified in Supabase Auth
- ✓ Redirected to dashboard
- ✓ Can now sign in

**Verify in Supabase:**
- Go to Authentication > Users
- Check that user's "Confirmed At" is populated

---

### Test 3: User Sign In ✓

**Steps:**
1. Go to http://localhost:3000/auth/login
2. Enter email: `test1@example.com`
3. Enter password: `TestPassword123!`
4. Click "Sign In"

**Expected Result:**
- ✓ Redirected to `/dashboard`
- ✓ Session created
- ✓ User email shown in header

---

### Test 4: View Profile ✓

**Steps:**
1. After signing in, click "Profile" in header
2. Or go to http://localhost:3000/profile

**Expected Result:**
- ✓ Profile page loads
- ✓ Shows email address
- ✓ Shows user ID
- ✓ Shows email verification status
- ✓ Shows subscription tier: "free"
- ✓ Shows account creation date

---

### Test 5: Password Reset ✓

**Steps:**
1. Go to http://localhost:3000/auth/forgot-password
2. Enter email: `test1@example.com`
3. Click "Send Reset Link"

**Expected Result:**
- ✓ "Check your email" message appears
- ✓ Reset email sent

**Continue:**
1. Check email for reset link
2. Click the reset link
3. You're redirected to `/auth/reset-password`
4. Enter new password: `NewPassword456!`
5. Confirm password: `NewPassword456!`
6. Click "Reset Password"

**Expected Result:**
- ✓ Redirected to `/auth/login`
- ✓ Can sign in with new password

---

### Test 6: Protected Routes ✓

**Steps:**
1. Sign out by clicking "Logout"
2. Try to access http://localhost:3000/dashboard

**Expected Result:**
- ✓ Redirected to `/auth/login`
- ✓ Cannot access dashboard without authentication

---

### Test 7: Session Persistence ✓

**Steps:**
1. Sign in at http://localhost:3000/auth/login
2. Refresh the page (F5)
3. Close browser completely
4. Reopen browser and go to http://localhost:3000

**Expected Result:**
- ✓ Still signed in after refresh
- ✓ Still signed in after browser restart
- ✓ Session persists in cookies

---

### Test 8: Logout ✓

**Steps:**
1. Sign in
2. Click "Logout" button in header

**Expected Result:**
- ✓ Signed out
- ✓ Redirected to home page
- ✓ Cannot access protected routes

---

### Test 9: Invalid Credentials ✓

**Steps:**
1. Go to http://localhost:3000/auth/login
2. Enter email: `test1@example.com`
3. Enter password: `WrongPassword123!`
4. Click "Sign In"

**Expected Result:**
- ✓ Error message: "Invalid login credentials"
- ✓ Not signed in
- ✓ Remains on login page

---

### Test 10: Password Validation ✓

**Steps:**
1. Go to http://localhost:3000/auth/signup
2. Enter email: `test2@example.com`
3. Enter password: `Short1!` (less than 8 chars)
4. Click "Create Account"

**Expected Result:**
- ✓ Error message: "Password must be at least 8 characters"
- ✓ Account not created

---

### Test 11: Email Validation ✓

**Steps:**
1. Go to http://localhost:3000/auth/signup
2. Enter email: `invalid-email`
3. Enter password: `TestPassword123!`
4. Click "Create Account"

**Expected Result:**
- ✓ Error message: "Invalid email format"
- ✓ Account not created

---

### Test 12: Duplicate Email ✓

**Steps:**
1. Sign up with email: `test3@example.com`
2. Try to sign up again with same email

**Expected Result:**
- ✓ Error message: "User already registered"
- ✓ Second account not created

---

## 🔍 Verification Queries

Run these in Supabase SQL Editor to verify data:

**Check all users:**
```sql
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
ORDER BY created_at DESC;
```

**Check all profiles:**
```sql
SELECT id, subscription_tier, created_at 
FROM profiles 
ORDER BY created_at DESC;
```

**Check specific user:**
```sql
SELECT * FROM profiles 
WHERE id = 'your-user-uuid';
```

**Count users:**
```sql
SELECT COUNT(*) as total_users FROM auth.users;
SELECT COUNT(*) as total_profiles FROM profiles;
```

---

## 📊 Test Data Summary

After running all tests, you should have:

| Test | Email | Status |
|------|-------|--------|
| Test 1-8 | test1@example.com | Verified, Active |
| Test 10 | test2@example.com | Not created |
| Test 12 | test3@example.com | Verified, Active |

---

## 🐛 Common Issues & Fixes

### Issue: "Email not found" when resetting password
**Fix:** Make sure email is registered. Check in Supabase Auth > Users

### Issue: Confirmation email not received
**Fix:** 
1. Check spam folder
2. In Supabase, go to Authentication > Email Templates
3. Verify email is configured

### Issue: "Redirect URL not allowed"
**Fix:**
1. Go to Supabase > Authentication > URL Configuration
2. Add: `http://localhost:3000/auth/callback`

### Issue: Can't sign in after signup
**Fix:**
1. If email confirmation is enabled, verify email first
2. Check that user exists in Supabase Auth > Users
3. Try resetting password

### Issue: Session not persisting
**Fix:**
1. Clear browser cookies
2. Restart dev server
3. Check that cookies are enabled in browser

---

## ✅ Test Checklist

- [ ] Sign up works
- [ ] Email verification works
- [ ] Sign in works
- [ ] Profile page shows correct data
- [ ] Password reset works
- [ ] Protected routes redirect to login
- [ ] Session persists after refresh
- [ ] Logout works
- [ ] Invalid credentials show error
- [ ] Password validation works
- [ ] Email validation works
- [ ] Duplicate email shows error

---

## 📚 Related Files

- `AUTH_SETUP.md` - Detailed setup guide
- `middleware.ts` - Route protection
- `lib/auth.ts` - Auth helper functions
- `components/auth/` - Auth form components
- `app/(auth)/` - Auth pages

---

## 🚀 Next Steps

After testing:
1. Customize auth pages with your branding
2. Add social login (Google, GitHub)
3. Implement role-based access control
4. Add 2FA (two-factor authentication)
5. Set up custom email templates

---

**Happy testing!** 🎉
