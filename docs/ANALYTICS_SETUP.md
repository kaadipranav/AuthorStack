# Analytics Setup Guide

Guide for setting up PostHog or Plausible analytics in AuthorStack.

## 🎯 Overview

AuthorStack supports two analytics providers:
- **PostHog**: Full-featured product analytics
- **Plausible**: Privacy-friendly analytics

## 📊 PostHog Setup

### 1. Create PostHog Account

1. Go to [posthog.com](https://posthog.com)
2. Sign up for free account
3. Create a new project
4. Copy your API key

### 2. Configure Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-api-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 3. Deploy

The analytics component will automatically initialize PostHog when the key is set.

### 4. Track Events

```typescript
import { trackEvent } from '@/lib/analytics';

// Track custom event
trackEvent('book_created', {
  book_id: 'uuid',
  book_title: 'My Book',
});

// Identify user
import { identifyUser } from '@/lib/analytics';
identifyUser('user-id', {
  email: 'user@example.com',
  subscription_tier: 'pro',
});
```

## 🔒 Plausible Setup

### 1. Create Plausible Account

1. Go to [plausible.io](https://plausible.io)
2. Sign up for account
3. Add your domain
4. Copy your domain name

### 2. Configure Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

### 3. Deploy

The analytics component will automatically initialize Plausible when the domain is set.

### 4. Track Events

```typescript
import { trackPlausibleEvent } from '@/lib/analytics';

// Track custom event
trackPlausibleEvent('Book Created', {
  book_id: 'uuid',
});
```

## 🎨 Usage

### Automatic Tracking

The analytics component automatically tracks:
- Page views
- User sessions
- Basic interactions

### Custom Events

Track custom events in your code:

```typescript
// PostHog
trackEvent('subscription_created', {
  plan: 'pro',
  amount: 19,
});

// Plausible
trackPlausibleEvent('Subscription Created', {
  plan: 'pro',
});
```

## ✅ Verification

### PostHog

1. Go to PostHog dashboard
2. Check "Events" tab
3. Verify events are being tracked
4. Check "Insights" for analytics

### Plausible

1. Go to Plausible dashboard
2. Check "Stats" page
3. Verify page views are tracked
4. Check "Goal Conversions" for custom events

## 🐛 Troubleshooting

### Events Not Tracking

**Solutions**:
1. Check environment variables are set
2. Check analytics component is loaded
3. Check browser console for errors
4. Verify API keys are correct

### PostHog Not Loading

**Solutions**:
1. Check `NEXT_PUBLIC_POSTHOG_KEY` is set
2. Check `NEXT_PUBLIC_POSTHOG_HOST` is correct
3. Check browser console for errors
4. Verify PostHog account is active

### Plausible Not Loading

**Solutions**:
1. Check `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set
2. Check domain is verified in Plausible
3. Check browser console for errors
4. Verify Plausible account is active

## 📚 Additional Resources

- [PostHog Documentation](https://posthog.com/docs)
- [Plausible Documentation](https://plausible.io/docs)

---

**Status**: ✅ Analytics Setup Complete
**Last Updated**: 2024-01-XX

