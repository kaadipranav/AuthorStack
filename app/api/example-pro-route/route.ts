/**
 * Example API route with Pro subscription protection
 * 
 * This demonstrates how to protect API routes with subscription tiers.
 * Replace this with your actual Pro feature API routes.
 */

import { withSubscriptionTier } from '@/lib/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';

async function proFeatureHandler(request: NextRequest) {
  try {
    // Your Pro feature logic here
    // This code only runs if user has Pro or higher subscription

    return NextResponse.json({
      success: true,
      data: 'This is a Pro feature',
      message: 'You have access to this Pro feature',
    });
  } catch (error) {
    console.error('Pro feature error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Protect this route with Pro subscription
export const GET = withSubscriptionTier(proFeatureHandler, 'pro');
export const POST = withSubscriptionTier(proFeatureHandler, 'pro');

// For Enterprise-only routes, use:
// export const GET = withSubscriptionTier(proFeatureHandler, 'enterprise');

