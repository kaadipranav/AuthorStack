import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserSubscriptionTier, hasFeatureAccess, type SubscriptionTier } from '@/lib/subscription';

/**
 * Middleware to check if user is authenticated
 */
export async function requireAuth(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return { user, supabase };
}

/**
 * Middleware to check if user has required subscription tier
 */
export async function requireSubscriptionTier(
  request: NextRequest,
  requiredTier: SubscriptionTier
) {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user, supabase } = authResult;

  // Get user's subscription tier
  const userTier = await getUserSubscriptionTier(user.id);

  // Check if user has access
  if (!hasFeatureAccess(userTier, requiredTier)) {
    return NextResponse.json(
      {
        error: 'Subscription required',
        message: `This feature requires a ${requiredTier} subscription. Please upgrade your plan.`,
        requiredTier,
        currentTier: userTier,
      },
      { status: 403 }
    );
  }

  return { user, supabase, userTier };
}

/**
 * Higher-order function to wrap API route handlers with subscription check
 */
export function withSubscriptionTier(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>,
  requiredTier: SubscriptionTier
) {
  return async (request: NextRequest, context: any) => {
    const authCheck = await requireSubscriptionTier(request, requiredTier);

    if (authCheck instanceof NextResponse) {
      return authCheck;
    }

    return handler(request, context);
  };
}

