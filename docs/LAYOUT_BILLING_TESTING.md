# Layout & Billing Gate Testing Guide

Complete testing guide for the global layout, header, footer, and billing gating components.

## 📋 Components Created

### Layout Components
- `components/layout/Header.tsx` - Global header with navigation
- `components/layout/Footer.tsx` - Global footer with links

### Billing Components
- `components/billing/BillingGate.tsx` - HOC for gating Pro features
- `components/billing/UpgradeModal.tsx` - Upgrade modal with plan selection

### Pages
- `app/pricing/page.tsx` - Pricing page with all plans
- `app/launches/page.tsx` - Launches (free tier)
- `app/competitors/page.tsx` - Competitors (free tier)
- `app/ab-tests/page.tsx` - A/B Tests (Pro tier, gated)
- `app/calendar/page.tsx` - Marketing Calendar (Pro tier, gated)
- `app/settings/page.tsx` - Settings page

---

## 🧪 Test Cases

### Test 1: Header Navigation (Unauthenticated)

**Steps:**
1. Visit http://localhost:3000
2. Look at the header

**Expected Results:**
- ✓ AuthorStack logo visible
- ✓ "Login" link visible
- ✓ "Sign Up" button visible
- ✓ No navigation menu (not authenticated)

---

### Test 2: Header Navigation (Authenticated - Free Tier)

**Steps:**
1. Sign in with test account (free tier)
2. Visit http://localhost:3000/dashboard
3. Look at the header

**Expected Results:**
- ✓ AuthorStack logo visible
- ✓ User email displayed
- ✓ "free" badge shown
- ✓ Navigation links visible:
  - Dashboard
  - Launches
  - Competitors
  - Settings
- ✓ A/B Tests and Calendar links NOT visible (free tier)
- ✓ Logout button visible

---

### Test 3: Header Navigation (Authenticated - Pro Tier)

**Steps:**
1. Create test user with Pro tier in database:
   ```sql
   UPDATE profiles SET subscription_tier = 'pro' WHERE id = 'user-uuid';
   ```
2. Sign in with that account
3. Visit http://localhost:3000/dashboard
4. Look at the header

**Expected Results:**
- ✓ User email displayed
- ✓ "pro" badge shown
- ✓ All navigation links visible:
  - Dashboard
  - Launches
  - Competitors
  - A/B Tests (now visible!)
  - Calendar (now visible!)
  - Settings

---

### Test 4: Pricing Page - Free Tier User

**Steps:**
1. Sign in with free tier account
2. Visit http://localhost:3000/pricing

**Expected Results:**
- ✓ All 3 pricing plans displayed (Free, Pro, Enterprise)
- ✓ Free plan shows "Get Started" button
- ✓ Pro plan shows "Upgrade to Pro" button
- ✓ Enterprise plan shows "Upgrade to Enterprise" button
- ✓ Pro plan has "MOST POPULAR" badge
- ✓ FAQ section visible
- ✓ CTA section at bottom (since user is on free tier)

---

### Test 5: Pricing Page - Pro Tier User

**Steps:**
1. Update user to Pro tier:
   ```sql
   UPDATE profiles SET subscription_tier = 'pro' WHERE id = 'user-uuid';
   ```
2. Sign in
3. Visit http://localhost:3000/pricing

**Expected Results:**
- ✓ All plans still visible
- ✓ CTA section at bottom NOT visible (user already on paid plan)

---

### Test 6: Upgrade Modal - Free Tier

**Steps:**
1. Sign in with free tier account
2. Visit http://localhost:3000/pricing
3. Click "Upgrade to Pro" button

**Expected Results:**
- ✓ Modal opens with overlay
- ✓ Pro plan card shown on left
- ✓ Enterprise plan card shown on right (marked "MOST POPULAR")
- ✓ Pro plan: $19/month with features listed
- ✓ Enterprise plan: $49/month with features listed
- ✓ "Upgrade to Pro" button in Pro card
- ✓ "Upgrade to Enterprise" button in Enterprise card
- ✓ Demo note at bottom explaining this is a mock
- ✓ X button to close modal

---

### Test 7: Upgrade Modal - Click Pro

**Steps:**
1. Open upgrade modal (see Test 6)
2. Click "Upgrade to Pro" button

**Expected Results:**
- ✓ Button shows loading state
- ✓ After 1 second, modal closes
- ✓ Console shows: "Upgrading to pro plan..."
- ✓ User remains on pricing page

**Note:** In production, this would redirect to Whop payment

---

### Test 8: Upgrade Modal - Click Enterprise

**Steps:**
1. Open upgrade modal
2. Click "Upgrade to Enterprise" button

**Expected Results:**
- ✓ Button shows loading state
- ✓ After 1 second, modal closes
- ✓ Console shows: "Upgrading to enterprise plan..."

---

### Test 9: BillingGate - Free Tier Access Denied

**Steps:**
1. Sign in with free tier account
2. Visit http://localhost:3000/ab-tests

**Expected Results:**
- ✓ Page loads
- ✓ "🔒 Premium Feature" card displayed
- ✓ Message: "A/B Testing is available on the Pro plan and above"
- ✓ "Upgrade to Pro" button shown
- ✓ Content behind gate NOT visible

---

### Test 10: BillingGate - Pro Tier Access Granted

**Steps:**
1. Update user to Pro tier:
   ```sql
   UPDATE profiles SET subscription_tier = 'pro' WHERE id = 'user-uuid';
   ```
2. Sign in
3. Visit http://localhost:3000/ab-tests

**Expected Results:**
- ✓ Gate NOT shown
- ✓ Content visible:
  - "Active Tests" card
  - "Test Results" card
- ✓ Page loads normally

---

### Test 11: BillingGate - Marketing Calendar

**Steps:**
1. Sign in with free tier account
2. Visit http://localhost:3000/calendar

**Expected Results:**
- ✓ "🔒 Premium Feature" card displayed
- ✓ Message: "Marketing Calendar is available on the Pro plan and above"
- ✓ "Upgrade to Pro" button shown

---

### Test 12: BillingGate - Upgrade Button

**Steps:**
1. Visit http://localhost:3000/ab-tests (free tier)
2. Click "Upgrade to Pro" button on gate

**Expected Results:**
- ✓ Upgrade modal opens
- ✓ Can select Pro or Enterprise plan
- ✓ Modal closes after selection

---

### Test 13: Footer - All Pages

**Steps:**
1. Visit any page (authenticated or not)
2. Scroll to bottom

**Expected Results:**
- ✓ Footer visible
- ✓ AuthorStack logo and description
- ✓ Product links: Pricing, Features, Dashboard
- ✓ Company links: About, Blog, Contact
- ✓ Legal links: Privacy, Terms, Cookies
- ✓ Copyright year correct
- ✓ Links are clickable (404 is OK for now)

---

### Test 14: Launches Page (Free Tier)

**Steps:**
1. Sign in with free tier
2. Visit http://localhost:3000/launches

**Expected Results:**
- ✓ Page loads
- ✓ "Create Launch" button visible
- ✓ Content visible (not gated)
- ✓ "No launches yet" message

---

### Test 15: Competitors Page (Free Tier)

**Steps:**
1. Sign in with free tier
2. Visit http://localhost:3000/competitors

**Expected Results:**
- ✓ Page loads
- ✓ "Track Competitor" button visible
- ✓ Content visible (not gated)
- ✓ "No competitors tracked yet" message

---

### Test 16: Settings Page

**Steps:**
1. Sign in
2. Visit http://localhost:3000/settings

**Expected Results:**
- ✓ Account section shows email
- ✓ Email verification status shown
- ✓ Subscription section shows current tier
- ✓ If free tier: "Upgrade" button shown
- ✓ If pro/enterprise: "Manage Billing" button shown
- ✓ Integrations section with platform buttons
- ✓ Danger zone with delete account button

---

### Test 17: Navigation Links

**Steps:**
1. Sign in with free tier
2. Click each header link:
   - Dashboard
   - Launches
   - Competitors
   - Settings

**Expected Results:**
- ✓ Each link navigates to correct page
- ✓ Page title updates
- ✓ Header remains visible

---

### Test 18: Pro-Only Navigation Links

**Steps:**
1. Update user to Pro tier
2. Sign in
3. Look at header navigation

**Expected Results:**
- ✓ "A/B Tests" link now visible
- ✓ "Calendar" link now visible
- ✓ Click each link navigates correctly
- ✓ Content is visible (not gated)

---

### Test 19: Settings Upgrade Button

**Steps:**
1. Sign in with free tier
2. Visit http://localhost:3000/settings
3. Click "Upgrade" button in Subscription section

**Expected Results:**
- ✓ Upgrade modal opens
- ✓ Can select plan

---

### Test 20: Responsive Design

**Steps:**
1. Visit any page
2. Resize browser to mobile (375px width)
3. Check header and footer

**Expected Results:**
- ✓ Header is responsive
- ✓ Navigation stacks properly
- ✓ Footer is responsive
- ✓ Pricing cards stack on mobile
- ✓ No horizontal scrolling

---

## 🔍 Verification Queries

Check database state:

```sql
-- Check user tier
SELECT id, subscription_tier FROM profiles WHERE id = 'user-uuid';

-- Update to Pro
UPDATE profiles SET subscription_tier = 'pro' WHERE id = 'user-uuid';

-- Update to Enterprise
UPDATE profiles SET subscription_tier = 'enterprise' WHERE id = 'user-uuid';

-- Reset to Free
UPDATE profiles SET subscription_tier = 'free' WHERE id = 'user-uuid';
```

---

## 📊 Test Summary

| Test | Component | Status |
|------|-----------|--------|
| 1 | Header (Unauth) | ✓ |
| 2 | Header (Free) | ✓ |
| 3 | Header (Pro) | ✓ |
| 4 | Pricing (Free) | ✓ |
| 5 | Pricing (Pro) | ✓ |
| 6 | Modal Open | ✓ |
| 7 | Modal Pro Click | ✓ |
| 8 | Modal Enterprise Click | ✓ |
| 9 | Gate Denied | ✓ |
| 10 | Gate Allowed | ✓ |
| 11 | Gate Calendar | ✓ |
| 12 | Gate Upgrade | ✓ |
| 13 | Footer | ✓ |
| 14 | Launches | ✓ |
| 15 | Competitors | ✓ |
| 16 | Settings | ✓ |
| 17 | Nav Links | ✓ |
| 18 | Pro Nav | ✓ |
| 19 | Settings Upgrade | ✓ |
| 20 | Responsive | ✓ |

---

## 🚀 Quick Test Flow

**Fastest way to test everything:**

1. Sign in with free tier account
2. Visit `/dashboard` - See free tier header
3. Visit `/ab-tests` - See billing gate
4. Visit `/pricing` - See all plans
5. Click "Upgrade to Pro" - See modal
6. Update DB to Pro tier
7. Refresh - See Pro header
8. Visit `/ab-tests` - See content (gate gone)
9. Visit `/settings` - See Pro subscription

---

## 📝 Manual Testing Checklist

- [ ] Header shows correct tier badge
- [ ] Navigation links appear/disappear based on tier
- [ ] Pricing page displays all plans
- [ ] Upgrade modal opens and closes
- [ ] BillingGate hides Pro features for free users
- [ ] BillingGate shows content for Pro users
- [ ] Footer appears on all pages
- [ ] Settings page shows correct subscription info
- [ ] Responsive design works on mobile
- [ ] All links navigate correctly

---

## 🐛 Known Limitations

- Upgrade modal is a mock (doesn't actually charge)
- Whop integration not yet implemented
- Settings page buttons are placeholders
- Delete account button is not functional

---

## 🔗 Related Files

- `components/layout/Header.tsx` - Header component
- `components/layout/Footer.tsx` - Footer component
- `components/billing/BillingGate.tsx` - Billing gate HOC
- `components/billing/UpgradeModal.tsx` - Upgrade modal
- `app/pricing/page.tsx` - Pricing page
- `app/ab-tests/page.tsx` - Example gated page
- `app/calendar/page.tsx` - Example gated page

---

**All tests should pass!** ✅
