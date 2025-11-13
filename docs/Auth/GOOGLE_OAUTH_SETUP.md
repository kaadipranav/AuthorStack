# Google OAuth Setup Guide for AuthorStack

This guide walks you through setting up Google OAuth authentication for AuthorStack using Supabase.

## Overview

AuthorStack uses **Supabase** for authentication, which has built-in support for Google OAuth. The implementation is already complete in the codebase. You just need to:

1. Create OAuth credentials in Google Cloud Console
2. Add environment variables to `.env.local`
3. Enable Google as an OAuth provider in Supabase

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
- Visit [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select an existing one

### 1.2 Enable Google+ API
- Go to **APIs & Services** → **Library**
- Search for "Google+ API"
- Click on it and press **Enable**

### 1.3 Create OAuth 2.0 Credentials
- Go to **APIs & Services** → **Credentials**
- Click **Create Credentials** → **OAuth client ID**
- Choose **Web application**
- Fill in the application name (e.g., "AuthorStack")

### 1.4 Configure Authorized Redirect URIs

Add these redirect URIs in the Google Cloud Console:

**For Local Development:**
```
http://localhost:3000/auth/callback
```

**For Production (Supabase):**
```
https://your-project.supabase.co/auth/v1/callback?provider=google
```

Replace `your-project` with your actual Supabase project name.

### 1.5 Configure Authorized JavaScript Origins

Add these origins in the Google Cloud Console:

**For Local Development:**
```
http://localhost:3000
```

**For Production:**
```
https://your-domain.com
https://your-vercel-deployment.vercel.app
```

Replace with your actual domain and Vercel deployment URL.

### 1.6 Copy Your Credentials
- Copy your **Client ID** (you'll need this for `.env.local`)
- Copy your **Client Secret** (you'll need this for Supabase)

## Step 2: Configure Supabase

### 2.1 Go to Supabase Dashboard
- Visit [Supabase Dashboard](https://app.supabase.com/)
- Select your project

### 2.2 Enable Google Provider
- Go to **Authentication** → **Providers**
- Find **Google** and click to enable it
- Paste your **Client ID** and **Client Secret** from Google Cloud Console
- Save

## Step 3: Update Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
```

**Note:** The Client ID is public (prefixed with `NEXT_PUBLIC_`). The Client Secret is stored securely in Supabase and never exposed to the client.

## Step 4: Test the Implementation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/auth/login`

3. Click the **"Sign in with Google"** button

4. You should be redirected to Google's login page

5. After authenticating, you'll be redirected back to your app and logged in

## How It Works

### Login Flow

1. User clicks **"Sign in with Google"** button on `/auth/login`
2. `handleGoogleSignIn()` is triggered, which calls `supabase.auth.signInWithOAuth()`
3. User is redirected to Google's OAuth consent screen
4. After authentication, Google redirects to `/auth/callback?code=...&provider=google`
5. The callback route exchanges the authorization code for a session
6. User is redirected to the dashboard

### Code Changes Made

**File: `app/auth/login/page.tsx`**
- Added `handleGoogleSignIn()` function that initiates OAuth flow
- Added Google sign-in button with divider
- Added `isGoogleLoading` state to handle button loading state
- Imported `Mail` icon from lucide-react for the button

**File: `.env.example`**
- Added `NEXT_PUBLIC_GOOGLE_CLIENT_ID` environment variable

## Troubleshooting

### "Redirect URI mismatch" Error
- Ensure the redirect URI in Google Cloud Console matches exactly:
  - For local: `http://localhost:3000/auth/callback`
  - For production: `https://your-project.supabase.co/auth/v1/callback?provider=google`

### "Invalid Client ID" Error
- Verify you've copied the correct Client ID from Google Cloud Console
- Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `.env.local`

### User Not Redirected After Login
- Check browser console for errors
- Verify that the callback route at `app/auth/callback/route.ts` is working
- Ensure Supabase provider is enabled in the dashboard

### "Unauthorized" Error in Supabase
- Go to Supabase Dashboard → Authentication → Providers
- Verify Google provider is enabled
- Check that Client ID and Client Secret are correct

## Additional Resources

- [Supabase Google OAuth Docs](https://supabase.com/docs/guides/auth/social-auth/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)

## Production Deployment

When deploying to production:

1. Update your domain in Google Cloud Console authorized origins
2. Update the Supabase redirect URI if using a custom domain
3. Ensure environment variables are set in your deployment platform (Vercel, etc.)
4. Test the OAuth flow on your production domain

## Security Notes

- Never commit `.env.local` to version control (it's in `.gitignore`)
- The `NEXT_PUBLIC_` prefix means the Client ID is visible to clients (this is intentional and secure)
- The Client Secret is stored only in Supabase and never exposed to the client
- Always use HTTPS in production for OAuth flows
