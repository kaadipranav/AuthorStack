# Sentry Error Tracking Setup

Guide for setting up Sentry error tracking in AuthorStack.

## 🎯 Overview

Sentry provides error tracking and monitoring for both client-side and server-side errors.

## 🔧 Setup

### 1. Create Sentry Account

1. Go to [sentry.io](https://sentry.io)
2. Sign up for free account
3. Create a new project (Next.js)
4. Copy your DSN

### 2. Configure Environment Variables

Add to `.env.local`:

```env
# Server-side (optional, for full Sentry integration)
SENTRY_DSN=your-sentry-dsn

# Client-side (optional, for full Sentry integration)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 3. Install Sentry SDK (Optional)

For full Sentry integration, install the SDK:

```bash
npm install @sentry/nextjs
```

Then run the setup wizard:

```bash
npx @sentry/wizard@latest -i nextjs
```

### 4. Minimal Setup (Current)

The current implementation uses a minimal setup that:
- Logs errors to console in development
- Can send errors to Sentry API in production
- Can be enhanced with full SDK later

## 🔍 Usage

### Server-Side

```typescript
import { captureServerException } from '@/lib/sentry';

try {
  // Your code
} catch (error) {
  captureServerException(error, { context: 'additional info' });
}
```

### Client-Side

```typescript
import { captureException } from '@/lib/sentry';

try {
  // Your code
} catch (error) {
  captureException(error, { context: 'additional info' });
}
```

### Error Handler

```typescript
import { handleApiError } from '@/lib/errors/handler';

export async function GET() {
  try {
    // Your code
  } catch (error) {
    return handleApiError(error, { endpoint: '/api/endpoint' });
  }
}
```

## 🚀 Production Setup

### Option 1: Minimal (Current)

The current implementation works without the Sentry SDK:
- Errors are logged to console
- Can be enhanced to send to Sentry API
- No additional dependencies

### Option 2: Full SDK

For full Sentry features:

1. **Install SDK**:
   ```bash
   npm install @sentry/nextjs
   ```

2. **Run Setup Wizard**:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Configure**:
   - Follow wizard instructions
   - Update `sentry.client.config.ts`
   - Update `sentry.server.config.ts`
   - Update `sentry.edge.config.ts`

## 📊 Features

### Current (Minimal)

- ✅ Error logging
- ✅ Error context tracking
- ✅ Server-side error capture
- ✅ Client-side error capture

### Full SDK (Optional)

- ✅ Error tracking
- ✅ Performance monitoring
- ✅ Session replay
- ✅ Source maps
- ✅ Release tracking
- ✅ User context

## ✅ Verification

### Test Error Tracking

1. **Trigger an error**:
   ```typescript
   throw new Error('Test error');
   ```

2. **Check Sentry dashboard**:
   - Go to Sentry dashboard
   - Check "Issues" tab
   - Verify error is captured

### Test in Production

1. Deploy to production
2. Trigger an error
3. Check Sentry dashboard
4. Verify error is captured with context

## 🐛 Troubleshooting

### Errors Not Captured

**Solutions**:
1. Check `SENTRY_DSN` is set
2. Check Sentry project is active
3. Check network requests to Sentry
4. Verify error handler is called

### SDK Not Working

**Solutions**:
1. Check SDK is installed: `npm list @sentry/nextjs`
2. Check configuration files exist
3. Check environment variables are set
4. Verify build includes Sentry

## 📚 Additional Resources

- [Sentry Documentation](https://docs.sentry.io)
- [Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

**Status**: ✅ Minimal Setup Complete
**Last Updated**: 2024-01-XX

