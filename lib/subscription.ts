import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

/**
 * Get user's subscription tier
 */
export async function getUserSubscriptionTier(userId: string): Promise<SubscriptionTier> {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    return 'free';
  }

  return (profile.subscription_tier as SubscriptionTier) || 'free';
}

/**
 * Check if user has access to a feature based on tier
 */
export function hasFeatureAccess(
  userTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  const tierHierarchy: Record<SubscriptionTier, number> = {
    free: 0,
    pro: 1,
    enterprise: 2,
  };

  return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
}

/**
 * Check if user is Pro or higher
 */
export function isProOrHigher(tier: SubscriptionTier): boolean {
  return hasFeatureAccess(tier, 'pro');
}

/**
 * Check if user is Enterprise
 */
export function isEnterprise(tier: SubscriptionTier): boolean {
  return tier === 'enterprise';
}

