import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Track events for A/B test variants
 * POST /api/tests/:id/track
 * Body: { variant_id, event_type: 'click' | 'conversion' }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { id: testId } = params;
    const body = await request.json();
    const { variant_id, event_type } = body;

    // Validate input
    if (!variant_id || !event_type) {
      return NextResponse.json(
        { error: 'Missing required fields: variant_id, event_type' },
        { status: 400 }
      );
    }

    if (!['click', 'conversion'].includes(event_type)) {
      return NextResponse.json(
        { error: 'Invalid event_type. Must be "click" or "conversion"' },
        { status: 400 }
      );
    }

    // Verify variant belongs to test
    const { data: variant, error: variantError } = await supabase
      .from('test_variants')
      .select('*, ab_tests!inner(id)')
      .eq('id', variant_id)
      .eq('test_id', testId)
      .single();

    if (variantError || !variant) {
      return NextResponse.json(
        { error: 'Variant not found or does not belong to test' },
        { status: 404 }
      );
    }

    // Increment the appropriate metric
    const currentClicks = variant.clicks || 0;
    const currentConversions = variant.conversions || 0;

    const updateData: any = {};

    if (event_type === 'click') {
      updateData.clicks = currentClicks + 1;
    } else if (event_type === 'conversion') {
      updateData.conversions = currentConversions + 1;
      // Conversions also count as clicks if not already tracked
      if (currentClicks === 0) {
        updateData.clicks = 1;
      }
    }

    // Update variant
    const { error: updateError } = await supabase
      .from('test_variants')
      .update(updateData)
      .eq('id', variant_id);

    if (updateError) {
      console.error('Error updating variant:', updateError);
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      event_type,
      variant_id,
    });
  } catch (error) {
    console.error('Error in track endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

