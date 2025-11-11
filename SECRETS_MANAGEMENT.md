# AuthorStack - Secrets Management Guide

How to securely store and manage secrets in Vercel, Supabase, and Whop.

---

## 🔐 Secrets Overview

### What Are Secrets?
Secrets are sensitive values that should never be exposed:
- API keys
- Database passwords
- Encryption keys
- Webhook secrets
- OAuth credentials
- JWT secrets

### Where Secrets Go
- **Development:** `.env.local` (never commit to git)
- **Staging:** Vercel environment variables (Preview)
- **Production:** Vercel environment variables (Production)

---

## 📝 Vercel Environment Variables Setup

### Step 1: Access Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Select your AuthorStack project
3. Go to **Settings** > **Environment Variables**

### Step 2: Add Secrets

#### For Each Secret:
1. Click **Add New**
2. Enter **Name** (e.g., `NEXTAUTH_SECRET`)
3. Enter **Value** (your secret)
4. Select **Environments**:
   - Check **Production** for production secrets
   - Check **Preview** for staging/preview secrets
   - Check **Development** for local development
5. **IMPORTANT:** Check **Sensitive** flag for sensitive values
6. Click **Save**

### Step 3: Mark as Sensitive

**Sensitive Variables (check "Sensitive" flag):**
- `NEXTAUTH_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_CLIENT_SECRET`
- `WHOP_API_KEY`
- `WHOP_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `UPSTASH_REDIS_URL`
- `UPSTASH_REDIS_TOKEN`
- `QSTASH_TOKEN`
- `QSTASH_CURRENT_SIGNING_KEY`
- `CRON_SECRET`
- `ENCRYPTION_KEY`

**Public Variables (do NOT check "Sensitive"):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXTAUTH_URL`
- `NODE_ENV`
- `APP_URL`

### Step 4: Verify Variables

After adding all variables:
1. Go to **Deployments**
2. Click on latest deployment
3. Check **Environment Variables** section
4. Verify all variables are present
5. Sensitive variables should show as `***`

---

## 🗄️ Supabase Secrets Management

### Step 1: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **Settings** > **API**

**Copy These Values:**
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Secure Service Role Key

**CRITICAL:** The Service Role Key has full database access!

**Best Practices:**
- ✅ Store in Vercel as Sensitive variable
- ✅ Only use in server-side code (API routes, middleware)
- ✅ Never expose to client-side code
- ✅ Never commit to git
- ✅ Rotate quarterly

**Where to Use Service Role Key:**
```typescript
// ✅ CORRECT - Server-side only
// app/api/admin/route.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ Server-side only
);
```

**Where NOT to Use Service Role Key:**
```typescript
// ❌ WRONG - Never in client-side code
// components/MyComponent.tsx
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ❌ EXPOSED!
);
```

### Step 3: Rotate Supabase Keys

**Every 90 days:**
1. Go to Supabase Dashboard > Settings > API
2. Click **Rotate Key** next to Service Role Key
3. Copy new key
4. Update Vercel environment variable
5. Redeploy application
6. Monitor logs for errors

### Step 4: Enable Supabase Security Features

1. Go to **Settings** > **Security**
2. Enable **Enforce SSL**
3. Set **JWT Expiration** to 1 hour
4. Enable **Audit Logging**
5. Configure **Backup Schedule** (daily)
6. Enable **Point-in-Time Recovery**

---

## 💳 Whop Secrets Management

### Step 1: Get Whop Credentials

1. Go to [whop.com](https://whop.com) Dashboard
2. Go to **Settings** > **API Keys**
3. Generate new API key for production
4. Copy **API Key** → `WHOP_API_KEY`

### Step 2: Get Webhook Secret

1. Go to **Settings** > **Webhooks**
2. Add webhook endpoint: `https://authorstack.com/api/webhooks/whop`
3. Copy **Webhook Secret** → `WHOP_WEBHOOK_SECRET`

### Step 3: Store in Vercel

1. Add `WHOP_API_KEY` as Sensitive variable
2. Add `WHOP_WEBHOOK_SECRET` as Sensitive variable
3. Set for Production environment only

### Step 4: Verify Webhook

```typescript
// app/api/webhooks/whop/route.ts
import crypto from 'crypto';

export async function POST(request: Request) {
  const signature = request.headers.get('x-whop-signature');
  const body = await request.text();
  
  // Verify signature
  const hash = crypto
    .createHmac('sha256', process.env.WHOP_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');
  
  if (hash !== signature) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Process webhook
  const event = JSON.parse(body);
  
  if (event.type === 'subscription.created') {
    // Handle subscription creation
  }
  
  return new Response('OK', { status: 200 });
}
```

### Step 5: Rotate Whop Keys

**Every 90 days:**
1. Go to Whop Dashboard > Settings > API Keys
2. Generate new API key
3. Update Vercel environment variable
4. Redeploy application
5. Delete old API key from Whop

---

## 🔑 Encryption Key Management

### Step 1: Generate Encryption Key

For encrypting sensitive data in database:

```bash
# Generate random encryption key
openssl rand -base64 32

# Output: something like: aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890+/=
```

### Step 2: Store Encryption Key

1. Add to Vercel as `ENCRYPTION_KEY` (Sensitive)
2. Set for Production environment only
3. **NEVER** commit to git
4. **NEVER** share with anyone

### Step 3: Use in Application

```typescript
// lib/encryption.ts
import crypto from 'crypto';

const encryptionKey = process.env.ENCRYPTION_KEY!;

export function encryptData(data: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decryptData(encrypted: string): string {
  const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### Step 4: Rotate Encryption Key

**Every 6 months:**
1. Generate new encryption key
2. Create migration to re-encrypt all data with new key
3. Update Vercel environment variable
4. Run migration
5. Verify all data is still accessible
6. Delete old encryption key

---

## 🔄 Secret Rotation Schedule

### Monthly
- [ ] Review access logs
- [ ] Check for unauthorized access attempts
- [ ] Monitor API usage

### Quarterly (Every 3 Months)
- [ ] Rotate `WHOP_API_KEY`
- [ ] Rotate `RESEND_API_KEY`
- [ ] Rotate `UPSTASH_REDIS_TOKEN`
- [ ] Rotate `QSTASH_TOKEN`

### Semi-Annually (Every 6 Months)
- [ ] Rotate `NEXTAUTH_SECRET`
- [ ] Rotate `CRON_SECRET`
- [ ] Rotate `ENCRYPTION_KEY`
- [ ] Rotate Supabase Service Role Key

### Annually (Every 12 Months)
- [ ] Rotate all secrets
- [ ] Update security policies
- [ ] Conduct security audit
- [ ] Review and update this guide

---

## 🚨 Emergency Secret Rotation

### If a Secret is Compromised:

1. **Immediately revoke the secret:**
   - Delete from Vercel
   - Revoke in the service (Whop, Supabase, etc.)

2. **Generate new secret:**
   - Use secure random generation
   - Store in Vercel as Sensitive

3. **Redeploy application:**
   - Vercel will automatically redeploy
   - Or manually trigger deployment

4. **Monitor for unauthorized access:**
   - Check Sentry for errors
   - Review access logs
   - Monitor API usage

5. **Notify team:**
   - Document the incident
   - Update security log
   - Brief team on what happened

---

## ✅ Secrets Checklist

### Before Production Deployment

- [ ] All secrets are in Vercel (not in code)
- [ ] All sensitive secrets are marked as "Sensitive"
- [ ] Service Role Key is not exposed to client
- [ ] Webhook secrets are verified
- [ ] Encryption keys are generated and stored
- [ ] All environment variables are set
- [ ] No secrets in git history
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.production.local` is in `.gitignore`
- [ ] Secrets are unique per environment

### After Production Deployment

- [ ] Verify all secrets are working
- [ ] Check Sentry for errors
- [ ] Monitor API usage
- [ ] Review access logs
- [ ] Test webhook delivery
- [ ] Verify encryption/decryption

---

## 🔍 Audit Secrets

### Check for Exposed Secrets

```bash
# Search for common secret patterns in git history
git log -p | grep -i "api_key\|secret\|password"

# Search in current code
grep -r "NEXTAUTH_SECRET\|SUPABASE_SERVICE_ROLE_KEY" --include="*.ts" --include="*.tsx"

# Should only find in .env.example files, not actual values
```

### Check Environment Variables

```bash
# In Vercel dashboard:
# 1. Go to Settings > Environment Variables
# 2. Verify all secrets are present
# 3. Verify sensitive variables show as ***
# 4. Verify correct environment is selected
```

---

## 📚 Best Practices

1. **Never commit secrets to git**
   - Use `.env.local` for development
   - Use `.env.production.example` as template
   - Add to `.gitignore`

2. **Use strong, random secrets**
   - Minimum 32 characters
   - Mix of letters, numbers, symbols
   - Use `openssl rand -base64 32`

3. **Rotate secrets regularly**
   - Follow rotation schedule
   - Document rotations
   - Monitor for issues

4. **Limit secret access**
   - Only share with team members who need it
   - Use Vercel's team permissions
   - Audit who has access

5. **Monitor secret usage**
   - Check Sentry for errors
   - Review API usage patterns
   - Alert on unusual activity

6. **Use different secrets per environment**
   - Development secrets
   - Staging secrets
   - Production secrets

7. **Document secret management**
   - Keep this guide updated
   - Document rotation schedule
   - Create incident response plan

---

## 🆘 Troubleshooting

### "Environment variable not found"
- [ ] Check variable name spelling
- [ ] Verify variable is set in Vercel
- [ ] Verify correct environment is selected
- [ ] Redeploy application
- [ ] Check Vercel logs

### "Permission denied" errors
- [ ] Verify API key is correct
- [ ] Check API key permissions
- [ ] Verify API key is not expired
- [ ] Rotate API key if necessary

### "Webhook signature verification failed"
- [ ] Verify webhook secret is correct
- [ ] Check webhook URL is correct
- [ ] Verify signature calculation method
- [ ] Test with Whop webhook test tool

---

**Last Updated:** November 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
