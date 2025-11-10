import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Pro/Enterprise protected routes
 * These routes require a paid subscription
 */
const PRO_ROUTES = ['/ab-tests', '/calendar'];
const ENTERPRISE_ROUTES: string[] = []; // Add enterprise-only routes here

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create a Supabase client for middleware
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Refresh session if expired
  await supabase.auth.getSession();

  // Get the user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth/') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect Pro/Enterprise routes
  if (user) {
    // Check if route requires Pro subscription
    const requiresPro = PRO_ROUTES.some((route) => pathname.startsWith(route));
    const requiresEnterprise = ENTERPRISE_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (requiresPro || requiresEnterprise) {
      // Get user's subscription tier
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      const subscriptionTier = profile?.subscription_tier || 'free';

      // Check access
      if (requiresEnterprise && subscriptionTier !== 'enterprise') {
        return NextResponse.redirect(
          new URL('/pricing?upgrade=enterprise', request.url)
        );
      }

      if (requiresPro && subscriptionTier === 'free') {
        return NextResponse.redirect(
          new URL('/pricing?upgrade=pro', request.url)
        );
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    // Protect dashboard routes
    '/dashboard/:path*',
    // Redirect authenticated users from auth pages
    '/auth/:path*',
    // Protect Pro routes
    '/ab-tests/:path*',
    '/calendar/:path*',
  ],
};
