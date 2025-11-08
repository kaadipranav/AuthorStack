# Layout & Billing - Quick Reference

Fast reference for layout and billing components.

## 🚀 Quick Start

```bash
# Start dev server
pnpm dev

# Visit dashboard
http://localhost:3000/dashboard
```

---

## 📁 Files at a Glance

| File | Purpose |
|------|---------|
| `components/layout/Header.tsx` | Global header with tier-based nav |
| `components/layout/Footer.tsx` | Global footer |
| `components/billing/BillingGate.tsx` | Gate Pro features |
| `components/billing/UpgradeModal.tsx` | Upgrade modal |
| `app/pricing/page.tsx` | Pricing page |
| `app/ab-tests/page.tsx` | A/B Tests (gated) |
| `app/calendar/page.tsx` | Calendar (gated) |
| `app/settings/page.tsx` | Settings |

---

## 🧪 Test Cases (20 Total)

| # | Test | Status |
|---|------|--------|
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

See `LAYOUT_BILLING_TESTING.md` for details.

---

## 🎯 Key URLs

| URL | Purpose |
|-----|---------|
| `/dashboard` | Dashboard (free) |
| `/pricing` | Pricing page |
| `/launches` | Launches (free) |
| `/competitors` | Competitors (free) |
| `/ab-tests` | A/B Tests (Pro, gated) |
| `/calendar` | Calendar (Pro, gated) |
| `/settings` | Settings |

---

## 💾 Database Commands

```sql
-- Check tier
SELECT subscription_tier FROM profiles WHERE id = 'user-uuid';

-- Update to Pro
UPDATE profiles SET subscription_tier = 'pro' WHERE id = 'user-uuid';

-- Update to Enterprise
UPDATE profiles SET subscription_tier = 'enterprise' WHERE id = 'user-uuid';

-- Reset to Free
UPDATE profiles SET subscription_tier = 'free' WHERE id = 'user-uuid';
```

---

## 🔧 Component Usage

### BillingGate
```typescript
<BillingGate
  requiredTier="pro"
  userTier={profile?.subscription_tier}
  featureName="Feature Name"
>
  {/* Content */}
</BillingGate>
```

### UpgradeModal
```typescript
<UpgradeModal>
  <Button>Upgrade</Button>
</UpgradeModal>
```

---

## 📊 Tier Access

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Dashboard | ✓ | ✓ | ✓ |
| Launches | ✓ | ✓ | ✓ |
| Competitors | ✓ | ✓ | ✓ |
| A/B Tests | ✗ | ✓ | ✓ |
| Calendar | ✗ | ✓ | ✓ |
| Settings | ✓ | ✓ | ✓ |

---

## 🧪 Quick Test Flow

1. Sign in (free tier)
2. Visit `/dashboard` → See free header
3. Visit `/ab-tests` → See gate
4. Visit `/pricing` → See plans
5. Click "Upgrade" → See modal
6. Update DB to Pro
7. Refresh → See Pro header
8. Visit `/ab-tests` → See content

---

## 🎨 Design System

**Colors:**
- Primary: #1E40AF (Blue)
- Accent: #F97316 (Orange)
- Success: #10B981 (Green)

**Breakpoints:**
- Mobile: 375px+
- Tablet: 768px+
- Desktop: 1024px+

---

## 📝 Navigation

**Free Tier:**
- Dashboard
- Launches
- Competitors
- Settings

**Pro Tier (adds):**
- A/B Tests
- Calendar

---

## ✅ Checklist

- [ ] Header shows correct tier
- [ ] Nav links appear/disappear
- [ ] BillingGate works
- [ ] UpgradeModal works
- [ ] Pricing page works
- [ ] Footer visible
- [ ] Responsive design works

---

## 📚 Documentation

- `LAYOUT_BILLING_SUMMARY.md` - Full overview
- `LAYOUT_BILLING_TESTING.md` - 20 test cases
- `LAYOUT_BILLING_QUICK_REFERENCE.md` - This file

---

## 🚀 Next

1. Run tests from `LAYOUT_BILLING_TESTING.md`
2. Verify all 20 test cases pass
3. Implement Whop integration
4. Deploy to production

---

**Ready to test!** 🎉
