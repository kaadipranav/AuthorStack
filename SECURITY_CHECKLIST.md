# AuthorStack - Production Security Checklist

Complete security checklist for deploying AuthorStack to production.

---

## 🔐 Pre-Deployment Security Review

### Phase 1: Environment Variables & Secrets

#### Vercel Environment Variables Setup
- [ ] Create `.env.production.local` from `.env.production.example`
- [ ] Generate new `NEXTAUTH_SECRET` with: `openssl rand -base64 32`
- [ ] Generate new `CRON_SECRET` with: `openssl rand -base64 32`
- [ ] Go to Vercel Project Settings > Environment Variables
- [ ] Add all secrets with **Sensitive** flag enabled:
  - [ ] `NEXTAUTH_SECRET` (Sensitive)
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (Sensitive)
  - [ ] `GOOGLE_CLIENT_SECRET` (Sensitive)
  - [ ] `WHOP_API_KEY` (Sensitive)
  - [ ] `WHOP_WEBHOOK_SECRET` (Sensitive)
  - [ ] `RESEND_API_KEY` (Sensitive)
  - [ ] `UPSTASH_REDIS_URL` (Sensitive)
  - [ ] `UPSTASH_REDIS_TOKEN` (Sensitive)
  - [ ] `QSTASH_TOKEN` (Sensitive)
  - [ ] `QSTASH_CURRENT_SIGNING_KEY` (Sensitive)
  - [ ] `CRON_SECRET` (Sensitive)
  - [ ] `NEXT_PUBLIC_SENTRY_DSN` (Public)
  - [ ] `NEXT_PUBLIC_POSTHOG_KEY` (Public)
- [ ] Set environment for each variable (Production, Preview, Development)
- [ ] Test deployment with staging environment first
- [ ] **NEVER** commit `.env.production.local` to git

#### Secret Rotation Schedule
- [ ] Document secret rotation schedule (quarterly minimum)
- [ ] Create process for rotating secrets without downtime
- [ ] Set calendar reminders for rotation dates
- [ ] Keep audit log of secret rotations

---

## 🗄️ Supabase Security Configuration

### Phase 2: Row Level Security (RLS)

#### Enable RLS on All Tables
```sql
-- Run in Supabase SQL Editor
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
```

- [ ] Enable RLS on all tables
- [ ] Verify RLS is enabled: Supabase Dashboard > Authentication > Policies

#### Create RLS Policies

**Profiles Table**
```sql
-- Users can only read their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

- [ ] Create profile read policy
- [ ] Create profile update policy
- [ ] Prevent profile deletion

**Books Table**
```sql
-- Users can only read their own books
CREATE POLICY "Users can read own books"
ON books FOR SELECT
USING (auth.uid() = user_id);

-- Users can only create books for themselves
CREATE POLICY "Users can create own books"
ON books FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own books
CREATE POLICY "Users can update own books"
ON books FOR UPDATE
USING (auth.uid() = user_id);
```

- [ ] Create books read policy
- [ ] Create books insert policy
- [ ] Create books update policy

**Sales Table**
```sql
-- Users can only read their own sales
CREATE POLICY "Users can read own sales"
ON sales FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own sales
CREATE POLICY "Users can insert own sales"
ON sales FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

- [ ] Create sales read policy
- [ ] Create sales insert policy

**Platform Connections Table**
```sql
-- Users can only read their own connections
CREATE POLICY "Users can read own connections"
ON platform_connections FOR SELECT
USING (auth.uid() = user_id);

-- Users can only create their own connections
CREATE POLICY "Users can create own connections"
ON platform_connections FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own connections
CREATE POLICY "Users can update own connections"
ON platform_connections FOR UPDATE
USING (auth.uid() = user_id);
```

- [ ] Create platform connections policies

**Launch Checklists & Tasks**
```sql
-- Users can only read their own checklists
CREATE POLICY "Users can read own checklists"
ON launch_checklists FOR SELECT
USING (auth.uid() = user_id);

-- Users can only read their own tasks
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

- [ ] Create launch checklist policies
- [ ] Create checklist tasks policies

**Competitors & Price History**
```sql
-- Users can only read their own competitors
CREATE POLICY "Users can read own competitors"
ON tracked_competitors FOR SELECT
USING (auth.uid() = user_id);

-- Users can only read their own price history
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

- [ ] Create competitors policies
- [ ] Create price history policies

#### Verify RLS Policies
- [ ] Go to Supabase Dashboard > Authentication > Policies
- [ ] Verify all tables have RLS enabled
- [ ] Verify all policies are correctly configured
- [ ] Test policies with test user account
- [ ] Verify service role can bypass RLS (for admin operations)

### Phase 3: Credential Encryption (JSONB Fields)

#### Encrypt Platform API Keys

**Create Encryption Function**
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

- [ ] Enable pgcrypto extension
- [ ] Create encryption function
- [ ] Create decryption function

**Update Platform Connections Table**
```sql
-- Add encrypted_api_key column
ALTER TABLE platform_connections
ADD COLUMN encrypted_api_key TEXT;

-- Migrate existing keys (if any)
UPDATE platform_connections
SET encrypted_api_key = encrypt_data(
  api_key,
  current_setting('app.encryption_key')
)
WHERE api_key IS NOT NULL;

-- Drop old column
ALTER TABLE platform_connections
DROP COLUMN api_key;

-- Rename encrypted column
ALTER TABLE platform_connections
RENAME COLUMN encrypted_api_key TO api_key;
```

- [ ] Add encrypted_api_key column
- [ ] Create migration function
- [ ] Encrypt existing keys
- [ ] Drop unencrypted column

**Create Trigger for Auto-Encryption**
```sql
-- Create trigger function
CREATE OR REPLACE FUNCTION encrypt_platform_key()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.api_key IS NOT NULL THEN
    NEW.api_key := encrypt_data(
      NEW.api_key,
      current_setting('app.encryption_key')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER encrypt_api_key_trigger
BEFORE INSERT OR UPDATE ON platform_connections
FOR EACH ROW
EXECUTE FUNCTION encrypt_platform_key();
```

- [ ] Create encryption trigger function
- [ ] Create trigger for auto-encryption
- [ ] Test encryption on insert/update

**Set Encryption Key in Application**
```typescript
// In your server-side code
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, serviceKey);

// Set encryption key for the session
await supabase.rpc('set_encryption_key', {
  key: process.env.ENCRYPTION_KEY
});
```

- [ ] Add `ENCRYPTION_KEY` to environment variables
- [ ] Set encryption key in application startup
- [ ] Test encryption/decryption in staging

### Phase 4: Supabase Security Settings

- [ ] Go to Supabase Dashboard > Settings > Security
- [ ] Enable "Enforce SSL" for all connections
- [ ] Set up IP whitelist (if applicable)
- [ ] Enable audit logging
- [ ] Configure backup schedule (daily minimum)
- [ ] Enable point-in-time recovery
- [ ] Set up database password rotation (90 days)
- [ ] Review and update JWT expiration (default 1 hour)
- [ ] Configure session timeout (30 minutes recommended)
- [ ] Enable 2FA for Supabase account

---

## 💳 Whop Payment Security

### Phase 5: Whop Configuration

#### API Key Management
- [ ] Go to Whop Dashboard > Settings > API Keys
- [ ] Generate new API key for production
- [ ] Copy API key to Vercel environment variables
- [ ] Add `WHOP_API_KEY` as Sensitive in Vercel
- [ ] Add `WHOP_WEBHOOK_SECRET` as Sensitive in Vercel
- [ ] **NEVER** share API keys
- [ ] Rotate API keys quarterly

#### Webhook Security
- [ ] Go to Whop Dashboard > Settings > Webhooks
- [ ] Add webhook endpoint: `https://authorstack.com/api/webhooks/whop`
- [ ] Copy webhook secret to environment variables
- [ ] Verify webhook signature in code:

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
  // ... handle event
}
```

- [ ] Implement webhook signature verification
- [ ] Test webhook with Whop test events
- [ ] Monitor webhook logs for errors
- [ ] Set up alerts for failed webhooks

#### Subscription Verification
- [ ] Implement server-side subscription verification
- [ ] Never trust client-side subscription status
- [ ] Verify subscription on every protected endpoint
- [ ] Cache subscription status (5-minute TTL)
- [ ] Handle subscription cancellation gracefully

---

## 📧 Resend Email Security

### Phase 6: Email Configuration

- [ ] Go to Resend Dashboard > API Keys
- [ ] Generate new API key for production
- [ ] Add `RESEND_API_KEY` as Sensitive in Vercel
- [ ] Configure sender email domain
- [ ] Set up DKIM/SPF records
- [ ] Enable email verification
- [ ] Test email delivery in staging
- [ ] Monitor bounce rates
- [ ] Set up email rate limiting (prevent spam)

---

## 🔄 Upstash Redis & QStash Security

### Phase 7: Upstash Configuration

#### Redis Cache
- [ ] Go to Upstash Console > Redis
- [ ] Create production database
- [ ] Copy connection URL to environment variables
- [ ] Add `UPSTASH_REDIS_URL` as Sensitive in Vercel
- [ ] Enable TLS/SSL encryption
- [ ] Set eviction policy to `allkeys-lru`
- [ ] Configure backup schedule
- [ ] Monitor memory usage
- [ ] Set up alerts for high memory

#### QStash Jobs
- [ ] Go to Upstash Console > QStash
- [ ] Generate signing key
- [ ] Add `QSTASH_TOKEN` as Sensitive in Vercel
- [ ] Add `QSTASH_CURRENT_SIGNING_KEY` as Sensitive in Vercel
- [ ] Verify QStash signatures in webhook handlers:

```typescript
// Verify QStash signature
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

export const POST = verifySignatureAppRouter(async (request) => {
  // Process job
});
```

- [ ] Implement signature verification
- [ ] Set up job retry policy
- [ ] Monitor job failures
- [ ] Set up alerts for failed jobs

---

## 🔍 Sentry Error Monitoring

### Phase 8: Sentry Configuration

- [ ] Create Sentry account and project
- [ ] Copy DSN to environment variables
- [ ] Add `NEXT_PUBLIC_SENTRY_DSN` to Vercel
- [ ] Configure error sampling (recommended: 100% in production)
- [ ] Set up performance monitoring
- [ ] Configure release tracking
- [ ] Set up alerts for critical errors
- [ ] Configure error grouping rules
- [ ] Monitor error trends
- [ ] Review and fix critical errors weekly

---

## 📊 PostHog Analytics Security

### Phase 9: PostHog Configuration

- [ ] Create PostHog account and project
- [ ] Copy API key to environment variables
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` to Vercel
- [ ] Configure data retention policy
- [ ] Enable GDPR compliance mode
- [ ] Set up user identification
- [ ] Configure event tracking
- [ ] Monitor analytics for anomalies
- [ ] Review privacy policy for analytics disclosure

---

## 🔐 Application Security

### Phase 10: Code Security

#### Authentication & Authorization
- [ ] Verify NextAuth is properly configured
- [ ] Test OAuth flow in production
- [ ] Verify JWT tokens are validated
- [ ] Test session expiration
- [ ] Verify CSRF protection is enabled
- [ ] Test rate limiting on auth endpoints
- [ ] Verify password requirements (if applicable)
- [ ] Test account lockout after failed attempts

#### API Security
- [ ] Add rate limiting to all API endpoints
- [ ] Implement request validation
- [ ] Add CORS configuration
- [ ] Verify API keys are not exposed
- [ ] Test API with invalid/expired tokens
- [ ] Implement request logging
- [ ] Monitor API usage patterns
- [ ] Set up alerts for unusual activity

#### Data Security
- [ ] Verify sensitive data is encrypted at rest
- [ ] Verify sensitive data is encrypted in transit (HTTPS)
- [ ] Test data access controls
- [ ] Verify PII is properly handled
- [ ] Test data deletion/retention policies
- [ ] Implement audit logging for sensitive operations
- [ ] Monitor access logs for anomalies

#### HTTPS & TLS
- [ ] Verify HTTPS is enforced on all pages
- [ ] Check SSL certificate validity
- [ ] Enable HSTS header
- [ ] Test mixed content warnings
- [ ] Verify TLS 1.2+ is enforced
- [ ] Check certificate expiration date

---

## 🚀 Deployment Security

### Phase 11: Vercel Deployment

#### Pre-Deployment
- [ ] Run security audit: `npm audit`
- [ ] Fix all critical vulnerabilities
- [ ] Run type check: `pnpm type-check`
- [ ] Run linter: `pnpm lint`
- [ ] Run tests: `pnpm test`
- [ ] Build locally: `pnpm build`

#### Vercel Configuration
- [ ] Set up branch protection rules
- [ ] Require code review before merge
- [ ] Enable automatic deployments on merge
- [ ] Configure preview deployments
- [ ] Set up staging environment
- [ ] Configure production environment
- [ ] Set environment variables for each environment
- [ ] Enable Vercel's security headers

#### Security Headers
- [ ] Add Content-Security-Policy header
- [ ] Add X-Frame-Options header
- [ ] Add X-Content-Type-Options header
- [ ] Add Referrer-Policy header
- [ ] Add Permissions-Policy header

**Example next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.posthog.com; style-src 'self' 'unsafe-inline'",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

- [ ] Add security headers to next.config.js
- [ ] Test headers with browser DevTools
- [ ] Verify headers on production

---

## 📋 Monitoring & Maintenance

### Phase 12: Ongoing Security

#### Daily Checks
- [ ] Monitor Sentry for new errors
- [ ] Check Vercel deployment status
- [ ] Review failed webhook logs
- [ ] Monitor database performance

#### Weekly Checks
- [ ] Review security logs
- [ ] Check for failed authentication attempts
- [ ] Monitor API usage patterns
- [ ] Review error trends

#### Monthly Checks
- [ ] Run security audit: `npm audit`
- [ ] Update dependencies: `pnpm update`
- [ ] Review access logs
- [ ] Audit user accounts
- [ ] Check backup integrity
- [ ] Review and update security policies

#### Quarterly Checks
- [ ] Rotate API keys
- [ ] Rotate database passwords
- [ ] Review RLS policies
- [ ] Conduct security review
- [ ] Update security documentation
- [ ] Test disaster recovery

---

## 🆘 Incident Response

### Phase 13: Security Incident Plan

#### If API Key is Compromised
1. [ ] Immediately revoke the compromised key
2. [ ] Generate new key
3. [ ] Update environment variables
4. [ ] Redeploy application
5. [ ] Monitor for unauthorized access
6. [ ] Review audit logs for suspicious activity
7. [ ] Notify affected users if necessary

#### If Database is Breached
1. [ ] Isolate the database
2. [ ] Enable audit logging
3. [ ] Review access logs
4. [ ] Identify affected data
5. [ ] Notify users if PII is exposed
6. [ ] Restore from backup if necessary
7. [ ] Implement additional security measures

#### If Application is Compromised
1. [ ] Take application offline
2. [ ] Review recent deployments
3. [ ] Check for unauthorized code changes
4. [ ] Restore from clean backup
5. [ ] Redeploy with security fixes
6. [ ] Monitor for continued attacks
7. [ ] Conduct security audit

---

## 📞 Security Contacts

- **Supabase Support:** support@supabase.io
- **Vercel Support:** support@vercel.com
- **Whop Support:** support@whop.com
- **Sentry Support:** support@sentry.io

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/security)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Vercel Security](https://vercel.com/docs/security)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

## ✅ Final Verification

Before going live:

- [ ] All environment variables are set in Vercel
- [ ] RLS policies are enabled on all tables
- [ ] Encryption is configured for sensitive data
- [ ] Webhook signatures are verified
- [ ] Security headers are configured
- [ ] HTTPS is enforced
- [ ] Backups are configured
- [ ] Monitoring is enabled
- [ ] Incident response plan is in place
- [ ] Team is trained on security procedures

---

**Last Updated:** November 2025
**Version:** 1.0.0
**Status:** ✅ Ready for Production
