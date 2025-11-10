# Deployment Guide - Vercel

Complete guide for deploying AuthorStack to Vercel.

## 🚀 Quick Deploy

### Option 1: Deploy from GitHub

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables** (see below)

4. **Deploy**: Click "Deploy"

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🔑 Environment Variables

### Required Variables

Add these to Vercel Dashboard → Settings → Environment Variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Optional Variables

```env
# Whop (for subscriptions)
WHOP_API_KEY=your-whop-api-key
WHOP_COMPANY_ID=your-whop-company-id
WHOP_PLAN_ID_PRO=your-pro-plan-id
WHOP_PLAN_ID_ENTERPRISE=your-enterprise-plan-id
WHOP_WEBHOOK_SECRET=your-webhook-secret

# Upstash Redis (for caching)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Sentry (for error tracking)
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com

# Resend (for emails)
RESEND_API_KEY=your-resend-api-key

# Cron Secret (for protecting cron jobs)
CRON_SECRET=your-cron-secret
```

## 📋 Environment Variable Mapping

| Variable | Vercel Environment | Description |
|----------|-------------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | Supabase service role key (server-only) |
| `NEXT_PUBLIC_APP_URL` | Production, Preview | Your app URL |
| `WHOP_API_KEY` | Production, Preview | Whop API key |
| `WHOP_WEBHOOK_SECRET` | Production | Whop webhook secret |
| `UPSTASH_REDIS_REST_URL` | Production, Preview | Upstash Redis URL |
| `SENTRY_DSN` | Production | Sentry DSN (server) |
| `NEXT_PUBLIC_SENTRY_DSN` | Production | Sentry DSN (client) |
| `RESEND_API_KEY` | Production, Preview | Resend API key |
| `CRON_SECRET` | Production | Cron job secret |

## 🔄 Cron Jobs Configuration

Vercel cron jobs are configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/platforms/sync",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/check-competitors",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### Cron Job Schedules

- **Sync Sales**: Daily at 2:00 AM UTC (`0 2 * * *`)
- **Check Competitors**: Every 6 hours (`0 */6 * * *`)
- **Send Reminders**: Daily at 2:00 AM UTC (`0 2 * * *`)

### Protecting Cron Jobs

Add `CRON_SECRET` to environment variables and verify in cron routes:

```typescript
const authHeader = request.headers.get('authorization');
const cronSecret = process.env.CRON_SECRET;

if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## 🌐 Domain Configuration

### Custom Domain

1. **Add Domain in Vercel**:
   - Go to Project Settings → Domains
   - Add your domain (e.g., `authorstack.com`)

2. **Configure DNS**:
   - Add CNAME record pointing to Vercel
   - Or add A record with Vercel IP

3. **Update Environment Variables**:
   - Update `NEXT_PUBLIC_APP_URL` to your domain
   - Update webhook URLs in external services (Whop, etc.)

## 🔒 Security Checklist

- [ ] All environment variables set in Vercel
- [ ] `SUPABASE_SERVICE_ROLE_KEY` only in server environment
- [ ] `CRON_SECRET` set for cron job protection
- [ ] `WHOP_WEBHOOK_SECRET` set for webhook verification
- [ ] Custom domain configured with HTTPS
- [ ] RLS policies enabled in Supabase
- [ ] Webhook URLs updated to production domain

## 📊 Monitoring

### Vercel Analytics

- Enable Vercel Analytics in project settings
- View performance metrics in Vercel dashboard

### Sentry

- Set up Sentry project
- Add `SENTRY_DSN` to environment variables
- View errors in Sentry dashboard

### PostHog/Plausible

- Set up analytics account
- Add keys to environment variables
- View analytics in dashboard

## 🧪 Testing Deployment

### 1. Test Production Build

```bash
# Build locally
npm run build

# Test production build
npm start
```

### 2. Test Environment Variables

```bash
# Check environment variables are set
vercel env ls

# Pull environment variables
vercel env pull .env.local
```

### 3. Test Cron Jobs

1. **Manual Trigger**:
   ```bash
   curl -X GET https://yourdomain.com/api/cron/check-competitors \
     -H "Authorization: Bearer your-cron-secret"
   ```

2. **Check Logs**: View cron job logs in Vercel dashboard

### 4. Test Webhooks

1. **Update Webhook URL**: Update Whop webhook to production URL
2. **Test Webhook**: Use Whop's webhook testing tool
3. **Check Logs**: View webhook logs in Vercel dashboard

## 🐛 Troubleshooting

### Build Fails

**Issue**: Build fails with errors

**Solutions**:
1. Check environment variables are set
2. Verify TypeScript errors: `npm run type-check`
3. Check build logs in Vercel dashboard
4. Verify all dependencies are installed

### Environment Variables Not Working

**Issue**: Environment variables not available in production

**Solutions**:
1. Check variables are set in Vercel dashboard
2. Verify variable names match exactly
3. Redeploy after adding variables
4. Check variable scope (Production, Preview, Development)

### Cron Jobs Not Running

**Issue**: Cron jobs not executing

**Solutions**:
1. Check `vercel.json` cron configuration
2. Verify cron routes are accessible
3. Check cron job logs in Vercel dashboard
4. Verify `CRON_SECRET` is set if using protection

### Webhooks Not Working

**Issue**: Webhooks not receiving events

**Solutions**:
1. Check webhook URL is correct (production domain)
2. Verify webhook secret is set
3. Check webhook logs in Vercel dashboard
4. Test webhook manually with curl

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Custom domain configured
- [ ] Cron jobs configured
- [ ] Webhook URLs updated
- [ ] Sentry configured
- [ ] Analytics configured
- [ ] Production build successful
- [ ] All features tested in production
- [ ] Monitoring set up
- [ ] Error tracking working

---

**Status**: ✅ Ready for Deployment
**Last Updated**: 2024-01-XX

