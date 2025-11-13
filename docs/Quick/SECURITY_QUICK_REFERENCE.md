# AuthorStack - Security Quick Reference

One-page security checklist for production deployment.

---

## 🔐 Secrets Checklist

### Generate Secrets
```bash
openssl rand -base64 32  # For NEXTAUTH_SECRET, CRON_SECRET, ENCRYPTION_KEY
```

### Vercel Environment Variables (Mark as Sensitive)
- [ ] `NEXTAUTH_SECRET` ⭐
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ⭐
- [ ] `GOOGLE_CLIENT_SECRET` ⭐
- [ ] `WHOP_API_KEY` ⭐
- [ ] `WHOP_WEBHOOK_SECRET` ⭐
- [ ] `RESEND_API_KEY` ⭐
- [ ] `UPSTASH_REDIS_URL` ⭐
- [ ] `UPSTASH_REDIS_TOKEN` ⭐
- [ ] `QSTASH_TOKEN` ⭐
- [ ] `QSTASH_CURRENT_SIGNING_KEY` ⭐
- [ ] `CRON_SECRET` ⭐
- [ ] `ENCRYPTION_KEY` ⭐
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_SENTRY_DSN`
- [ ] `NEXT_PUBLIC_POSTHOG_KEY`
- [ ] `NEXTAUTH_URL`
- [ ] `NODE_ENV=production`
- [ ] `APP_URL=https://authorstack.com`

---

## 🗄️ Supabase RLS Setup

### Enable RLS
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
```

### Create Policies
- [ ] Profiles: SELECT, UPDATE (own only)
- [ ] Books: SELECT, INSERT, UPDATE, DELETE (own only)
- [ ] Sales: SELECT, INSERT (own only, no update/delete)
- [ ] Platform Connections: SELECT, INSERT, UPDATE, DELETE (own only)
- [ ] Launch Checklists: SELECT, INSERT, UPDATE, DELETE (own only)
- [ ] Checklist Tasks: SELECT, INSERT, UPDATE, DELETE (own only)
- [ ] Tracked Competitors: SELECT, INSERT, UPDATE, DELETE (own only)
- [ ] Price History: SELECT (own only), INSERT (service role only)

### Verify RLS
- [ ] Go to Supabase Dashboard > Authentication > Policies
- [ ] All tables show RLS enabled
- [ ] All policies are listed
- [ ] Test with multiple users

---

## 🔐 Encryption Setup

### Create Functions
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Create encrypt_data() function
-- Create decrypt_data() function
```

### Add Encrypted Column
```sql
ALTER TABLE platform_connections
ADD COLUMN encrypted_credentials JSONB;
```

### Create Trigger
```sql
-- Create encrypt_platform_credentials() function
-- Create trigger on INSERT/UPDATE
```

### Create View
```sql
-- Create platform_connections_decrypted view
-- Automatically decrypts on SELECT
```

### Test Encryption
- [ ] Insert encrypted data
- [ ] Verify data is encrypted in database
- [ ] Decrypt via view
- [ ] Verify decrypted data is correct

---

## 🚀 Vercel Deployment

### Pre-Deployment
- [ ] `pnpm type-check` ✓
- [ ] `pnpm lint` ✓
- [ ] `pnpm test` ✓
- [ ] `pnpm build` ✓
- [ ] Test in staging

### Environment Setup
- [ ] All secrets in Vercel
- [ ] Correct environment selected
- [ ] Sensitive flag set
- [ ] No secrets in code

### Security Headers
- [ ] Content-Security-Policy
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy: geolocation=(), microphone=(), camera=()

### Post-Deployment
- [ ] Verify deployment successful
- [ ] Check Sentry for errors
- [ ] Monitor API usage
- [ ] Test all features

---

## 💳 Payment Security (Whop)

- [ ] Get API key from Whop Dashboard
- [ ] Get webhook secret from Whop Dashboard
- [ ] Add to Vercel as Sensitive
- [ ] Implement webhook signature verification
- [ ] Test webhook delivery
- [ ] Monitor for failed webhooks

---

## 📧 Email Security (Resend)

- [ ] Get API key from Resend Dashboard
- [ ] Add to Vercel as Sensitive
- [ ] Configure sender domain
- [ ] Set up DKIM/SPF records
- [ ] Test email delivery
- [ ] Monitor bounce rates

---

## 🔄 Upstash Security

### Redis
- [ ] Create production database
- [ ] Copy connection URL to Vercel
- [ ] Enable TLS/SSL
- [ ] Set eviction policy to `allkeys-lru`
- [ ] Configure backup schedule

### QStash
- [ ] Generate signing key
- [ ] Add to Vercel as Sensitive
- [ ] Implement signature verification
- [ ] Test job delivery
- [ ] Monitor job failures

---

## 🔍 Sentry Monitoring

- [ ] Create Sentry project
- [ ] Copy DSN to Vercel
- [ ] Configure error sampling
- [ ] Set up performance monitoring
- [ ] Configure alerts
- [ ] Monitor error trends

---

## 📊 PostHog Analytics

- [ ] Create PostHog project
- [ ] Copy API key to Vercel
- [ ] Configure data retention
- [ ] Enable GDPR mode
- [ ] Set up user identification
- [ ] Monitor analytics

---

## 🔐 Application Security

### Authentication
- [ ] NextAuth configured correctly
- [ ] OAuth flow tested
- [ ] JWT tokens validated
- [ ] Session expiration working
- [ ] CSRF protection enabled
- [ ] Rate limiting on auth endpoints

### API Security
- [ ] Rate limiting implemented
- [ ] Request validation added
- [ ] CORS configured
- [ ] API keys not exposed
- [ ] Request logging enabled
- [ ] Unusual activity alerts set up

### Data Security
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced
- [ ] PII properly handled
- [ ] Data deletion policies implemented
- [ ] Audit logging enabled

### HTTPS & TLS
- [ ] HTTPS enforced on all pages
- [ ] SSL certificate valid
- [ ] HSTS header enabled
- [ ] TLS 1.2+ enforced

---

## 📋 Before Going Live

### Code
- [ ] No secrets in code
- [ ] No secrets in git history
- [ ] All tests passing
- [ ] Build successful
- [ ] No console errors

### Configuration
- [ ] All environment variables set
- [ ] RLS policies enabled
- [ ] Encryption configured
- [ ] Webhooks verified
- [ ] Backups configured

### Monitoring
- [ ] Sentry configured
- [ ] Upstash logs accessible
- [ ] Database backups running
- [ ] Alerts configured
- [ ] Team trained

### Documentation
- [ ] Security checklist completed
- [ ] Incident response plan created
- [ ] Secret rotation schedule set
- [ ] Team notified of security procedures

---

## 🔄 Secret Rotation

### Quarterly (Every 3 Months)
```
WHOP_API_KEY
RESEND_API_KEY
UPSTASH_REDIS_TOKEN
QSTASH_TOKEN
```

### Semi-Annually (Every 6 Months)
```
NEXTAUTH_SECRET
CRON_SECRET
ENCRYPTION_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Annually (Every 12 Months)
```
All secrets
Update security policies
Conduct security audit
```

---

## 🆘 Emergency Procedures

### If Secret is Compromised
1. [ ] Revoke compromised secret
2. [ ] Generate new secret
3. [ ] Update Vercel environment variable
4. [ ] Redeploy application
5. [ ] Monitor for unauthorized access
6. [ ] Review audit logs

### If Database is Breached
1. [ ] Isolate database
2. [ ] Enable audit logging
3. [ ] Review access logs
4. [ ] Identify affected data
5. [ ] Notify users if necessary
6. [ ] Restore from backup

### If Application is Compromised
1. [ ] Take application offline
2. [ ] Review recent deployments
3. [ ] Check for unauthorized changes
4. [ ] Restore from clean backup
5. [ ] Redeploy with fixes
6. [ ] Monitor for continued attacks

---

## ✅ Final Checklist

Before Production:
- [ ] All secrets generated
- [ ] All secrets in Vercel
- [ ] RLS enabled and tested
- [ ] Encryption configured
- [ ] Security headers added
- [ ] HTTPS enforced
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Team trained
- [ ] Incident plan ready

---

## 📞 Quick Links

- Vercel: https://vercel.com/dashboard
- Supabase: https://app.supabase.com
- Whop: https://whop.com/dashboard
- Sentry: https://sentry.io
- Resend: https://resend.com
- Upstash: https://console.upstash.com

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `.env.production.example` | Env template |
| `SECURITY_CHECKLIST.md` | Full checklist |
| `SECRETS_MANAGEMENT.md` | Secrets guide |
| `RLS_CONFIGURATION.md` | RLS setup |
| `PRODUCTION_SECURITY_SUMMARY.md` | Summary |
| `SECURITY_QUICK_REFERENCE.md` | This file |

---

**Print this page for quick reference!** 📌

**Status:** ✅ Production Ready
**Last Updated:** November 2025
**Version:** 1.0.0
