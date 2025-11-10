import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Creates a Whop checkout session for subscription upgrade
 * POST /api/payments/create-session
 * Body: { plan: 'pro' | 'enterprise' }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { plan } = body;

    if (!plan || !['pro', 'enterprise'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "pro" or "enterprise"' },
        { status: 400 }
      );
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, whop_customer_id')
      .eq('id', user.id)
      .single();

    // Check if user already has this tier or higher
    const tierHierarchy = { free: 0, pro: 1, enterprise: 2 };
    const currentTier = (profile?.subscription_tier as keyof typeof tierHierarchy) || 'free';
    const requestedTier = plan as keyof typeof tierHierarchy;

    if (tierHierarchy[currentTier] >= tierHierarchy[requestedTier]) {
      return NextResponse.json(
        { error: `You are already on the ${currentTier} plan or higher` },
        { status: 400 }
      );
    }

    // Get Whop configuration from environment
    const whopApiKey = process.env.WHOP_API_KEY;
    const whopCompanyId = process.env.WHOP_COMPANY_ID;
    const whopPlanIds = {
      pro: process.env.WHOP_PLAN_ID_PRO,
      enterprise: process.env.WHOP_PLAN_ID_ENTERPRISE,
    };

    if (!whopApiKey || !whopCompanyId) {
      console.error('Missing Whop configuration');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    const planId = whopPlanIds[plan as keyof typeof whopPlanIds];
    if (!planId) {
      console.error(`Missing Whop plan ID for ${plan}`);
      return NextResponse.json(
        { error: 'Plan not available' },
        { status: 500 }
      );
    }

    // Create checkout configuration using Whop API
    // Reference: https://dev.whop.com/api-reference
    const checkoutResponse = await fetch('https://api.whop.com/api/v2/checkout_configurations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whopApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_id: whopCompanyId,
        plan_id: planId,
        metadata: {
          user_id: user.id,
          user_email: user.email,
          plan: plan,
          // Add redirect URL for after payment
          redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?success=true`,
        },
        // Set expiration (optional, 1 hour)
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }),
    });

    if (!checkoutResponse.ok) {
      const errorData = await checkoutResponse.text();
      console.error('Whop API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    const checkoutData = await checkoutResponse.json();

    // Return checkout URL
    // Whop returns a checkout URL in the response
    const checkoutUrl = checkoutData.checkout_url || `https://whop.com/checkout/${checkoutData.id}`;

    return NextResponse.json({
      checkoutUrl,
      sessionId: checkoutData.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

