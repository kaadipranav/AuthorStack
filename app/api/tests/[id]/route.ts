import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { determineWinner } from '@/lib/utils/ab-test';

/**
 * Get A/B test with stats
 * GET /api/tests/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: testId } = params;

    // Get test with book info
    const { data: test, error: testError } = await supabase
      .from('ab_tests')
      .select('*, books!inner(id, user_id, title, target_url)')
      .eq('id', testId)
      .single();

    if (testError || !test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Verify user owns the book
    const book = (test as any).books;
    if (book.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get variants with stats
    const { data: variants, error: variantsError } = await supabase
      .from('test_variants')
      .select('*')
      .eq('test_id', testId)
      .order('created_at', { ascending: true });

    if (variantsError) {
      return NextResponse.json(
        { error: 'Failed to fetch variants' },
        { status: 500 }
      );
    }

    // Calculate statistics for each variant
    const { calculateCTR, calculateConversionRate } = await import('@/lib/utils/ab-test');
    
    const variantsWithStats = variants.map((variant) => {
      const ctr = calculateCTR(variant.impressions, variant.clicks);
      const conversionRate = calculateConversionRate(variant.clicks, variant.conversions);

      return {
        ...variant,
        ctr,
        conversion_rate: conversionRate,
      };
    });

    // Determine winner if we have 2 variants
    let winnerAnalysis = null;
    if (variantsWithStats.length === 2) {
      const variant1 = variantsWithStats[0];
      const variant2 = variantsWithStats[1];

      winnerAnalysis = determineWinner(
        {
          name: variant1.variant_name,
          clicks: variant1.clicks,
          conversions: variant1.conversions,
        },
        {
          name: variant2.variant_name,
          clicks: variant2.clicks,
          conversions: variant2.conversions,
        }
      );
    }

    return NextResponse.json({
      test: {
        id: test.id,
        book_id: test.book_id,
        test_type: test.test_type,
        status: test.status,
        started_at: test.started_at,
        ended_at: test.ended_at,
        target_url: test.target_url,
        book_title: book.title,
      },
      variants: variantsWithStats,
      winner: winnerAnalysis,
    });
  } catch (error) {
    console.error('Error in get test:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

