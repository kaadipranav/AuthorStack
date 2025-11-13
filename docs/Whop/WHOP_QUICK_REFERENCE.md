# Whop Integration - Quick Reference

Quick reference for Whop subscription integration.

## 🔑 Environment Variables

```env
WHOP_API_KEY=your_whop_api_key
WHOP_COMPANY_ID=your_whop_company_id
WHOP_PLAN_ID_PRO=your_pro_plan_id
WHOP_PLAN_ID_ENTERPRISE=your_enterprise_plan_id
WHOP_WEBHOOK_SECRET=your_webhook_secret
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🚀 Quick Setup

1. **Create Whop Plans**: Pro ($19/mo) and Enterprise ($49/mo)
2. **Configure Webhook**: `https://yourdomain.com/api/webhooks/whop`
3. **Add Environment Variables**: Copy from Whop dashboard
4. **Test**: Use ngrok for local testing

## 📍 Key Endpoints

- **Checkout**: `POST /api/payments/create-session`
- **Webhook**: `POST /api/webhooks/whop`

## 🛡️ Feature Gating

### Route Protection (Middleware)

```typescript
// middleware.ts
const PRO_ROUTES = ['/ab-tests', '/calendar'];
```

### API Route Protection

```typescript
import { withSubscriptionTier } from '@/lib/middleware/auth';

export const GET = withSubscriptionTier(handler, 'pro');
```

### Component Protection

```tsx
<BillingGate requiredTier="pro" userTier={tier} featureName="Feature">
  <ProFeature />
</BillingGate>
```

## 🧪 Testing with ngrok

```bash
# 1. Start app
npm run dev

# 2. Start ngrok
ngrok http 3000

# 3. Configure webhook in Whop
# URL: https://abc123.ngrok.io/api/webhooks/whop
```

## 🔍 Webhook Events

- `membership.activated` → Update to `pro`/`enterprise`
- `membership.deactivated` → Update to `free`
- `payment.failed` → Log error

## 📚 Files

- `app/api/payments/create-session/route.ts` - Checkout API
- `app/api/webhooks/whop/route.ts` - Webhook handler
- `lib/subscription.ts` - Subscription utilities
- `lib/middleware/auth.ts` - Auth middleware
- `components/billing/UpgradeModal.tsx` - Upgrade UI
- `middleware.ts` - Route protection

## 🐛 Common Issues

1. **Checkout fails**: Check Whop API key and plan IDs
2. **Webhook not firing**: Verify webhook URL and secret
3. **Tier not updating**: Check webhook payload structure
4. **Route not protected**: Verify middleware config

## 📖 Full Documentation

See `WHOP_INTEGRATION.md` for complete guide.

