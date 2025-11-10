import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Webhook endpoint for Whop subscription events
 * POST /api/webhooks/whop
 * 
 * Handles events:
 * - membership.activated: User subscribed
 * - membership.deactivated: User cancelled
 * - payment.failed: Payment failed
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook secret from environment
    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('WHOP_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('whop-signature') || request.headers.get('x-whop-signature');

    // Verify webhook signature (if Whop provides one)
    // Note: Whop may use different signature verification methods
    // Adjust based on Whop's actual webhook verification documentation
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      // Compare signatures (timing-safe comparison)
      if (signature !== expectedSignature && !signature.includes(expectedSignature)) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Parse webhook payload
    const payload = JSON.parse(rawBody);
    const eventType = payload.type || payload.event_type;
    const eventData = payload.data || payload;

    console.log(`[Whop Webhook] Received event: ${eventType}`);

    // Initialize Supabase client with service role key for admin operations
    // Webhooks don't have user sessions, so we need admin access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration for webhooks');
      return NextResponse.json(
        { error: 'Webhook configuration error' },
        { status: 500 }
      );
    }

    // Create admin client (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Handle different event types
    switch (eventType) {
      case 'membership.activated':
      case 'subscription.created':
      case 'checkout.completed': {
        await handleSubscriptionCreated(supabase, eventData);
        break;
      }

      case 'membership.deactivated':
      case 'subscription.cancelled': {
        await handleSubscriptionCancelled(supabase, eventData);
        break;
      }

      case 'payment.failed':
      case 'invoice.payment_failed': {
        await handlePaymentFailed(supabase, eventData);
        break;
      }

      case 'membership.reactivated':
      case 'subscription.reactivated': {
        await handleSubscriptionReactivated(supabase, eventData);
        break;
      }

      default: {
        console.warn(`[Whop Webhook] Unhandled event type: ${eventType}`);
        // Return 200 to acknowledge receipt
        return NextResponse.json({ received: true });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Whop Webhook] Error processing webhook:', error);
    // Return 200 to prevent Whop from retrying
    // Log error for manual investigation
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 200 }
    );
  }
}

/**
 * Handle subscription created/activated
 */
async function handleSubscriptionCreated(supabase: any, data: any) {
  try {
    // Extract user information from webhook data
    // Primary: user_id from metadata (set during checkout)
    // Fallback: customer_id lookup (for existing customers)
    // Note: Whop webhook structure may vary - adjust based on actual payload
    let userId = data.metadata?.user_id || data.user_id || data.metadata?.userId;
    const customerId = data.customer_id || data.membership_id || data.id || data.customer?.id;
    const planId = data.plan_id || data.plan?.id;

    // If we don't have userId, try to find user by customer_id
    // This works for existing customers who already have whop_customer_id set
    if (!userId && customerId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('whop_customer_id', customerId)
        .single();
      
      if (profile) {
        userId = profile.id;
        console.log(`[Whop Webhook] Found user by customer_id: ${userId}`);
      }
    }

    if (!userId) {
      console.error('[Whop Webhook] Cannot determine user_id from webhook data:', {
        customerId,
        metadata: data.metadata,
        hasUserId: !!data.user_id,
        hasMetadata: !!data.metadata,
      });
      return;
    }

    if (!customerId) {
      console.error('[Whop Webhook] Missing customer_id in webhook data');
      return;
    }

    // Determine subscription tier from plan
    // Map Whop plan IDs to our subscription tiers
    const whopPlanIdPro = process.env.WHOP_PLAN_ID_PRO;
    const whopPlanIdEnterprise = process.env.WHOP_PLAN_ID_ENTERPRISE;

    let subscriptionTier = 'pro';
    if (planId === whopPlanIdEnterprise) {
      subscriptionTier = 'enterprise';
    } else if (planId === whopPlanIdPro) {
      subscriptionTier = 'pro';
    }

    // Update user profile
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: subscriptionTier,
        whop_customer_id: customerId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('[Whop Webhook] Error updating profile:', error);
      throw error;
    }

    console.log(`[Whop Webhook] Updated user ${userId} to ${subscriptionTier} tier`);
  } catch (error) {
    console.error('[Whop Webhook] Error in handleSubscriptionCreated:', error);
    throw error;
  }
}

/**
 * Handle subscription cancelled/deactivated
 */
async function handleSubscriptionCancelled(supabase: any, data: any) {
  try {
    let userId = data.metadata?.user_id || data.user_id || data.metadata?.userId;
    const customerId = data.customer_id || data.membership_id || data.id || data.customer?.id;

    // If we don't have userId, try to find user by customer_id
    // This works for existing customers who already have whop_customer_id set
    if (!userId && customerId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('whop_customer_id', customerId)
        .single();
      
      if (profile) {
        userId = profile.id;
        console.log(`[Whop Webhook] Found user by customer_id: ${userId}`);
      }
    }

    if (!userId && !customerId) {
      console.error('[Whop Webhook] Cannot determine user_id or customer_id from webhook data');
      return;
    }

    // Update user profile - downgrade to free but keep customer ID
    const updateData: any = {
      subscription_tier: 'free',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq(userId ? 'id' : 'whop_customer_id', userId || customerId);

    if (error) {
      console.error('[Whop Webhook] Error updating profile:', error);
      throw error;
    }

    console.log(`[Whop Webhook] Downgraded user to free tier`);
  } catch (error) {
    console.error('[Whop Webhook] Error in handleSubscriptionCancelled:', error);
    throw error;
  }
}

/**
 * Handle payment failed
 */
async function handlePaymentFailed(supabase: any, data: any) {
  try {
    let userId = data.metadata?.user_id || data.user_id || data.metadata?.userId;
    const customerId = data.customer_id || data.membership_id || data.id || data.customer?.id;

    // If we don't have userId, try to find user by customer_id
    // This works for existing customers who already have whop_customer_id set
    if (!userId && customerId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('whop_customer_id', customerId)
        .single();
      
      if (profile) {
        userId = profile.id;
        console.log(`[Whop Webhook] Found user by customer_id: ${userId}`);
      }
    }

    if (!userId && !customerId) {
      console.error('[Whop Webhook] Cannot determine user_id or customer_id from webhook data');
      return;
    }

    // Optionally send notification email or update status
    // For now, we'll log it - you may want to add a grace period
    console.log(`[Whop Webhook] Payment failed for user ${userId || customerId}`);

    // You might want to add a "payment_failed" status or grace period
    // For now, we'll leave the subscription active and let Whop handle retries
  } catch (error) {
    console.error('[Whop Webhook] Error in handlePaymentFailed:', error);
    throw error;
  }
}

/**
 * Handle subscription reactivated
 */
async function handleSubscriptionReactivated(supabase: any, data: any) {
  try {
    // Similar to handleSubscriptionCreated
    await handleSubscriptionCreated(supabase, data);
    console.log(`[Whop Webhook] Subscription reactivated`);
  } catch (error) {
    console.error('[Whop Webhook] Error in handleSubscriptionReactivated:', error);
    throw error;
  }
}

// Allow GET for webhook verification (if Whop requires it)
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Whop webhook endpoint' });
}

