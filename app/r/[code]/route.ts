import { NextRequest, NextResponse } from 'next/server';
import { buildRedirectUrl } from '@/lib/utils/ab-test';

/**
 * Short URL redirect route
 * GET /r/[code]
 * 
 * Increments impressions and redirects to target URL with UTM parameters
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    // For public redirect route, we need to use service role key
    // to bypass RLS for reading variants
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration for redirect route');
      return NextResponse.redirect(new URL('/404', request.url));
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }) as any;

    const { code } = params;

    if (!code) {
      return NextResponse.redirect(new URL('/404', request.url));
    }

    // Find variant by short_url
    const { data: variant, error: variantError } = await supabase
      .from('test_variants')
      .select('*, ab_tests!inner(id, target_url)')
      .eq('short_url', code)
      .single();

    if (variantError || !variant) {
      return NextResponse.redirect(new URL('/404', request.url));
    }

    // Increment impressions
    const currentImpressions = variant.impressions || 0;
    
    const { error: updateError } = await supabase
      .from('test_variants')
      .update({ impressions: currentImpressions + 1 })
      .eq('id', variant.id);

    if (updateError) {
      console.error('Error incrementing impressions:', updateError);
      // Continue with redirect even if impression tracking fails
    }

    // Get test info for building redirect URL
    const test = (variant as any).ab_tests;
    
    // Get target URL from test
    let targetUrl = test.target_url || request.nextUrl.searchParams.get('url');
    
    if (!targetUrl) {
      // Fallback: redirect to homepage
      targetUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com';
    }

    const redirectUrl = buildRedirectUrl(
      targetUrl,
      test.id,
      variant.id,
      variant.variant_name
    );

    // Redirect to target URL
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in redirect route:', error);
    return NextResponse.redirect(new URL('/404', request.url));
  }
}
