# Whop Subscription Integration Guide

Complete guide for integrating Whop subscriptions in AuthorStack.

## 📋 Overview

This integration enables:
- Subscription checkout flow via Whop
- Webhook handling for subscription events
- Role-based feature gating (Free, Pro, Enterprise)
- Automatic subscription tier updates

## 🔑 Environment Variables

Add these to your `.env.local` file:

```env
# Whop API Configuration
WHOP_API_KEY=your_whop_api_key
WHOP_COMPANY_ID=your_whop_company_id
WHOP_PLAN_ID_PRO=your_pro_plan_id
WHOP_PLAN_ID_ENTERPRISE=your_enterprise_plan_id
WHOP_WEBHOOK_SECRET=your_webhook_secret

# Supabase (for webhooks)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App URL (for redirects)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Getting Whop Credentials

1. **API Key**: Go to Whop Dashboard → Settings → API Keys → Create API Key
2. **Company ID**: Found in your Whop dashboard URL or settings
3. **Plan IDs**: Create plans in Whop Dashboard → Plans → Copy Plan ID
4. **Webhook Secret**: Set in Whop Dashboard → Webhooks → Create Webhook → Secret

## 🚀 Setup Steps

### 1. Create Whop Plans

1. Log in to [Whop Dashboard](https://whop.com)
2. Navigate to **Plans** section
3. Create two plans:
   - **Pro Plan**: $19/month
   - **Enterprise Plan**: $49/month
4. Copy the Plan IDs and add to `.env.local`

### 2. Configure Webhook Endpoint

1. In Whop Dashboard, go to **Webhooks**
2. Create a new webhook with:
   - **URL**: `https://yourdomain.com/api/webhooks/whop`
   - **Events**: Select all subscription events:
     - `membership.activated`
     - `membership.deactivated`
     - `payment.failed`
     - `subscription.created`
     - `subscription.cancelled`
   - **Secret**: Generate a secure secret (save to `.env.local`)

### 3. Database Setup

The database schema already includes the required fields:

```sql
-- profiles table already has:
-- subscription_tier TEXT DEFAULT 'free'
-- whop_customer_id TEXT UNIQUE
```

No additional migration needed if you've run the initial schema.

## 📁 File Structure

```
app/api/
├── payments/
│   └── create-session/
│       └── route.ts          # Creates Whop checkout session
└── webhooks/
    └── whop/
        └── route.ts          # Handles Whop webhook events

lib/
├── subscription.ts           # Subscription utility functions
└── middleware/
    └── auth.ts              # Auth & subscription middleware

components/billing/
└── UpgradeModal.tsx         # Updated to call checkout API

middleware.ts                # Updated with route protection
```

## 🔄 Subscription Flow

### 1. User Clicks Upgrade

```typescript
// User clicks "Upgrade to Pro" in UpgradeModal
// Component calls /api/payments/create-session
```

### 2. Create Checkout Session

**Endpoint**: `POST /api/payments/create-session`

**Request**:
```json
{
  "plan": "pro" // or "enterprise"
}
```

**Response**:
```json
{
  "checkoutUrl": "https://whop.com/checkout/abc123",
  "sessionId": "checkout_session_id"
}
```

### 3. User Completes Payment

- User is redirected to Whop checkout
- After payment, Whop sends webhook to `/api/webhooks/whop`
- Webhook updates user's `subscription_tier` and `whop_customer_id`
- User is redirected back to app (configured in checkout metadata)

### 4. Webhook Updates Profile

**Webhook Events Handled**:
- `membership.activated` → Updates `subscription_tier` to `pro` or `enterprise`
- `membership.deactivated` → Updates `subscription_tier` to `free`
- `payment.failed` → Logs error (can be extended to send notifications)

## 🛡️ Feature Gating

### Route Protection (Middleware)

Protected routes are defined in `middleware.ts`:

```typescript
const PRO_ROUTES = ['/ab-tests', '/calendar'];
const ENTERPRISE_ROUTES: string[] = [];
```

Free users accessing Pro routes are redirected to `/pricing?upgrade=pro`.

### API Route Protection

Use the subscription middleware in API routes:

```typescript
import { withSubscriptionTier } from '@/lib/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';

async function proFeatureHandler(request: NextRequest) {
  // Your Pro feature logic here
  return NextResponse.json({ data: 'Pro feature data' });
}

// Wrap handler with subscription check
export const GET = withSubscriptionTier(proFeatureHandler, 'pro');
export const POST = withSubscriptionTier(proFeatureHandler, 'pro');
```

### Component Gating

Use `BillingGate` component (already implemented):

```tsx
import { BillingGate } from '@/components/billing/BillingGate';

<BillingGate
  requiredTier="pro"
  userTier={profile?.subscription_tier || 'free'}
  featureName="A/B Testing"
>
  <YourProFeature />
</BillingGate>
```

## 🧪 Testing

### Local Development

#### 1. Using ngrok (Recommended)

1. **Install ngrok**:
   ```bash
   npm install -g ngrok
   # or
   brew install ngrok
   ```

2. **Start your Next.js app**:
   ```bash
   npm run dev
   ```

3. **Start ngrok**:
   ```bash
   ngrok http 3000
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

5. **Configure Whop webhook**:
   - URL: `https://abc123.ngrok.io/api/webhooks/whop`
   - Events: All subscription events
   - Secret: Add to `.env.local` as `WHOP_WEBHOOK_SECRET`

6. **Test webhook**:
   - Use Whop's webhook testing tool
   - Or send test POST request:
     ```bash
     curl -X POST https://abc123.ngrok.io/api/webhooks/whop \
       -H "Content-Type: application/json" \
       -H "x-whop-signature: test" \
       -d '{
         "type": "membership.activated",
         "data": {
           "metadata": {"user_id": "user-uuid"},
           "customer_id": "whop_customer_123",
           "plan_id": "your_pro_plan_id"
         }
       }'
     ```

#### 2. Using Vercel Preview

1. **Deploy to Vercel**:
   ```bash
   vercel
   ```

2. **Get preview URL** (e.g., `https://your-app-git-branch.vercel.app`)

3. **Configure webhook in Whop**:
   - URL: `https://your-app-git-branch.vercel.app/api/webhooks/whop`
   - Add webhook secret to Vercel environment variables

4. **Test webhook** using Whop's dashboard or API

### Manual Testing

#### Test Checkout Flow

1. **Start app**: `npm run dev`
2. **Log in** as a test user
3. **Navigate to** `/pricing`
4. **Click** "Upgrade to Pro"
5. **Verify** redirect to Whop checkout
6. **Complete payment** (use test card)
7. **Verify** redirect back to app
8. **Check** user's subscription tier in database:
   ```sql
   SELECT subscription_tier, whop_customer_id 
   FROM profiles 
   WHERE id = 'user-uuid';
   ```

#### Test Webhook

1. **Get test user ID** from database
2. **Send test webhook** (using ngrok or Vercel preview):
   ```bash
   curl -X POST http://localhost:3000/api/webhooks/whop \
     -H "Content-Type: application/json" \
     -H "x-whop-signature: test" \
     -d '{
       "type": "membership.activated",
       "data": {
         "metadata": {"user_id": "YOUR_USER_ID"},
         "customer_id": "test_customer_123",
         "plan_id": "YOUR_PRO_PLAN_ID"
       }
     }'
   ```
3. **Verify** user's subscription tier updated

#### Test Feature Gating

1. **Free user** tries to access `/ab-tests`
   - Should be redirected to `/pricing?upgrade=pro`

2. **Pro user** accesses `/ab-tests`
   - Should see the page content

3. **Free user** calls Pro API endpoint
   - Should receive `403 Forbidden` with error message

## 🔍 Webhook Verification

Whop webhooks are verified using HMAC SHA-256 signature:

```typescript
const signature = request.headers.get('whop-signature');
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(rawBody)
  .digest('hex');
```

**Note**: Whop's actual signature format may vary. Check [Whop API Documentation](https://dev.whop.com) for the exact verification method.

## 🐛 Troubleshooting

### Checkout URL Not Generated

**Issue**: `create-session` returns error

**Solutions**:
1. Verify `WHOP_API_KEY` is correct
2. Verify `WHOP_COMPANY_ID` is correct
3. Verify `WHOP_PLAN_ID_PRO` and `WHOP_PLAN_ID_ENTERPRISE` are correct
4. Check Whop API logs for errors

### Webhook Not Receiving Events

**Issue**: Webhooks not firing or not updating database

**Solutions**:
1. Verify webhook URL is accessible (use ngrok/Vercel preview)
2. Check webhook secret matches in Whop dashboard and `.env.local`
3. Check server logs for webhook errors
4. Verify Supabase `SUPABASE_SERVICE_ROLE_KEY` is correct
5. Test webhook manually using curl

### Subscription Tier Not Updating

**Issue**: Payment successful but tier not updated

**Solutions**:
1. Check webhook is receiving events (check logs)
2. Verify webhook payload structure matches expected format
3. Check `user_id` in webhook metadata matches database user ID
4. Verify webhook handler is updating correct user
5. Check database RLS policies allow updates

### Route Protection Not Working

**Issue**: Free users can access Pro routes

**Solutions**:
1. Verify middleware is running (check `middleware.ts` config)
2. Verify route is in `PRO_ROUTES` array
3. Check user's `subscription_tier` in database
4. Verify middleware is checking subscription correctly

## 📚 API Reference

### POST /api/payments/create-session

Creates a Whop checkout session.

**Request**:
```json
{
  "plan": "pro" | "enterprise"
}
```

**Response**:
```json
{
  "checkoutUrl": "https://whop.com/checkout/abc123",
  "sessionId": "checkout_session_id"
}
```

**Errors**:
- `401 Unauthorized`: User not authenticated
- `400 Bad Request`: Invalid plan or already on higher tier
- `500 Internal Server Error`: Whop API error or misconfiguration

### POST /api/webhooks/whop

Handles Whop webhook events.

**Events Handled**:
- `membership.activated`: Updates subscription to `pro` or `enterprise`
- `membership.deactivated`: Updates subscription to `free`
- `payment.failed`: Logs error
- `subscription.created`: Same as `membership.activated`
- `subscription.cancelled`: Same as `membership.deactivated`

**Response**:
```json
{
  "received": true
}
```

## 🔐 Security Considerations

1. **Webhook Secret**: Always use a strong, unique secret for webhook verification
2. **Service Role Key**: Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
3. **API Key**: Keep `WHOP_API_KEY` secure and never commit to git
4. **Signature Verification**: Always verify webhook signatures before processing
5. **Rate Limiting**: Consider adding rate limiting to webhook endpoint
6. **Idempotency**: Webhook handlers should be idempotent (handle duplicate events)

## 📖 Additional Resources

- [Whop API Documentation](https://dev.whop.com)
- [Whop Webhooks Guide](https://dev.whop.com/webhooks)
- [Supabase Service Role Key](https://supabase.com/docs/guides/api/service-role-key)
- [ngrok Documentation](https://ngrok.com/docs)

## ✅ Checklist

- [ ] Whop API key configured
- [ ] Whop company ID configured
- [ ] Whop plan IDs configured
- [ ] Webhook secret configured
- [ ] Webhook URL configured in Whop dashboard
- [ ] Supabase service role key configured
- [ ] Test checkout flow works
- [ ] Test webhook receives events
- [ ] Test subscription tier updates
- [ ] Test feature gating works
- [ ] Test route protection works

## 🚨 Important Notes

1. **Webhook Payload Structure**: Whop's webhook payload structure may vary. Adjust the webhook handler based on actual Whop API documentation.

2. **Signature Verification**: Whop's signature verification method may differ from the implementation. Check Whop's documentation for the exact method.

3. **Plan ID Mapping**: Ensure Whop plan IDs in `.env.local` match the actual plan IDs in your Whop dashboard.

4. **User ID in Metadata**: The checkout session includes `user_id` in metadata. Ensure Whop includes this in webhook payloads, or adjust the webhook handler to extract user ID differently.

5. **Testing in Production**: Always test webhook integration thoroughly in a staging environment before deploying to production.

---

**Last Updated**: 2024-01-XX
**Version**: 1.0.0

