import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Get all A/B tests for current user
 * GET /api/tests
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all tests for user's books
    const { data: tests, error: testsError } = await supabase
      .from('ab_tests')
      .select('*, books!inner(id, user_id, title)')
      .eq('books.user_id', user.id)
      .order('created_at', { ascending: false });

    if (testsError) {
      return NextResponse.json(
        { error: 'Failed to fetch tests' },
        { status: 500 }
      );
    }

    // Get variant counts for each test
    const testsWithCounts = await Promise.all(
      (tests || []).map(async (test) => {
        const { data: variants } = await supabase
          .from('test_variants')
          .select('id')
          .eq('test_id', test.id);

        const book = (test as any).books;

        return {
          id: test.id,
          book_id: test.book_id,
          book_title: book.title,
          test_type: test.test_type,
          status: test.status,
          started_at: test.started_at,
          ended_at: test.ended_at,
          variant_count: variants?.length || 0,
        };
      })
    );

    return NextResponse.json({ tests: testsWithCounts });
  } catch (error) {
    console.error('Error in get tests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

