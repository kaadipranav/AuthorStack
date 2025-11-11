import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  console.log('[api/auth/callback] OAuth callback received', { code, next });

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log('[api/auth/callback] exchangeCodeForSession result', { data, error });

      if (error) {
        console.error('[api/auth/callback] Auth exchange error:', error);
        return NextResponse.redirect(new URL(`/auth/login?error=auth_failed&message=${encodeURIComponent(error.message)}`, requestUrl.origin));
      }

      // Successfully exchanged code for session
      console.log('[api/auth/callback] Successfully authenticated user');
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    } catch (err) {
      console.error('[api/auth/callback] Unexpected error during exchangeCodeForSession:', err);
      return NextResponse.redirect(new URL(`/auth/login?error=auth_failed&message=${encodeURIComponent('Unexpected error during authentication')}`, requestUrl.origin));
    }
  }

  // No code provided, redirect to login
  console.log('[api/auth/callback] No code provided, redirecting to login');
  return NextResponse.redirect(new URL('/auth/login?error=no_code', requestUrl.origin));
}