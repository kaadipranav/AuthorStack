import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Create a new A/B test
 * POST /api/tests/create
 * Body: { book_id, test_type, target_url, variants: [{ name, image_url?, text_content? }] }
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

    // Parse request body
    const body = await request.json();
    const { book_id, test_type, target_url, variants } = body;

    // Validate input
    if (!book_id || !test_type || !target_url || !variants || !Array.isArray(variants) || variants.length < 2) {
      return NextResponse.json(
        { error: 'Missing required fields: book_id, test_type, target_url, and at least 2 variants' },
        { status: 400 }
      );
    }

    if (!['cover', 'title', 'description'].includes(test_type)) {
      return NextResponse.json(
        { error: 'Invalid test_type. Must be one of: cover, title, description' },
        { status: 400 }
      );
    }

    // Verify user owns the book
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('id, user_id')
      .eq('id', book_id)
      .eq('user_id', user.id)
      .single();

    if (bookError || !book) {
      return NextResponse.json(
        { error: 'Book not found or access denied' },
        { status: 404 }
      );
    }

    // Create A/B test
    const { data: test, error: testError } = await supabase
      .from('ab_tests')
      .insert({
        book_id,
        test_type,
        target_url,
        status: 'active',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (testError) {
      console.error('Error creating test:', testError);
      return NextResponse.json(
        { error: 'Failed to create test' },
        { status: 500 }
      );
    }

    // Generate short URLs and create variants
    const { generateShortCode, buildRedirectUrl } = await import('@/lib/utils/ab-test');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const createdVariants = [];

    for (const variant of variants) {
      // Generate unique short code
      let shortCode = generateShortCode();
      let attempts = 0;
      const maxAttempts = 10;

      // Ensure short code is unique
      while (attempts < maxAttempts) {
        const { data: existing } = await supabase
          .from('test_variants')
          .select('id')
          .eq('short_url', shortCode)
          .single();

        if (!existing) break;
        shortCode = generateShortCode();
        attempts++;
      }

      if (attempts >= maxAttempts) {
        console.error('Failed to generate unique short code');
        continue;
      }

      const shortUrl = `${appUrl}/r/${shortCode}`;

      // Create variant
      const { data: variantData, error: variantError } = await supabase
        .from('test_variants')
        .insert({
          test_id: test.id,
          variant_name: variant.name,
          image_url: variant.image_url || null,
          text_content: variant.text_content || null,
          short_url: shortCode,
          impressions: 0,
          clicks: 0,
          conversions: 0,
        })
        .select()
        .single();

      if (variantError) {
        console.error('Error creating variant:', variantError);
        continue;
      }

      createdVariants.push({
        ...variantData,
        full_short_url: shortUrl,
        redirect_url: buildRedirectUrl(target_url, test.id, variantData.id, variant.name),
      });
    }

    if (createdVariants.length === 0) {
      // Delete test if no variants were created
      await supabase.from('ab_tests').delete().eq('id', test.id);
      return NextResponse.json(
        { error: 'Failed to create variants' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      test,
      variants: createdVariants,
    });
  } catch (error) {
    console.error('Error in create test:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

