# Google OAuth Quick Reference

## What to Add to `.env.local`

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
```

## Google Cloud Console Configuration

### Redirect URIs
These go in **Google Cloud Console** → **Credentials** → **OAuth 2.0 Client IDs** → **Web application**

**Local Development:**
```
http://localhost:3000/auth/callback
```

**Production (Supabase):**
```
https://your-project.supabase.co/auth/v1/callback?provider=google
```

### Authorized JavaScript Origins
These also go in the same **OAuth 2.0 Client IDs** configuration

**Local Development:**
```
http://localhost:3000
```

**Production:**
```
https://your-domain.com
https://your-vercel-deployment.vercel.app
```

## Supabase Configuration

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Enable **Google**
5. Paste your **Client ID** and **Client Secret** from Google Cloud Console
6. Save

## Implementation Details

- **Login page location:** `/auth/login`
- **Callback route:** `/auth/callback` (already implemented)
- **OAuth provider:** Google (via Supabase)
- **Client library:** `@supabase/auth-helpers-nextjs`

## Testing

1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000/auth/login`
3. Click "Sign in with Google"
4. Complete Google authentication
5. Should redirect to dashboard

## Important Notes

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is intentionally public (visible to clients)
- The Client Secret is stored securely in Supabase only
- Always use HTTPS in production
- The callback route automatically handles OAuth code exchange
