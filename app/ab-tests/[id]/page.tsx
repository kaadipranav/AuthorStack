import { redirect } from 'next/navigation';
import { getCurrentUser, getUserProfile } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import Link from 'next/link';

export const metadata = {
  title: 'A/B Test Stats - AuthorStack',
};

async function getTestData(testId: string, userId: string) {
  const { createRouteHandlerClient } = await import('@supabase/auth-helpers-nextjs');
  const { cookies } = await import('next/headers');
  const { determineWinner, calculateCTR, calculateConversionRate } = await import('@/lib/utils/ab-test');

  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get test with book info
    const { data: test, error: testError } = await supabase
      .from('ab_tests')
      .select('*, books!inner(id, user_id, title)')
      .eq('id', testId)
      .single();

    if (testError || !test) {
      return null;
    }

    // Verify user owns the book
    const book = (test as any).books;
    if (book.user_id !== userId) {
      return null;
    }

    // Get variants with stats
    const { data: variants, error: variantsError } = await supabase
      .from('test_variants')
      .select('*')
      .eq('test_id', testId)
      .order('created_at', { ascending: true });

    if (variantsError) {
      return null;
    }

    // Calculate statistics for each variant
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

    return {
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
    };
  } catch (error) {
    console.error('Error fetching test data:', error);
    return null;
  }
}

export default async function ABTestStatsPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  const profile = await getUserProfile();

  if (!user) {
    redirect('/auth/login');
  }

  if (profile?.subscription_tier === 'free') {
    redirect('/pricing?upgrade=pro');
  }

  const testData = await getTestData(params.id, user.id);

  if (!testData) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-8">Test Not Found</h1>
        <Link href="/ab-tests">
          <Button variant="secondary">Back to Tests</Button>
        </Link>
      </div>
    );
  }

  const { test, variants, winner } = testData;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">A/B Test: {test.book_title}</h1>
          <p className="text-gray-600">
            Type: {test.test_type} | Status: {test.status}
          </p>
        </div>
        <Link href="/ab-tests">
          <Button variant="secondary">Back to Tests</Button>
        </Link>
      </div>

      {/* Winner Banner */}
      {winner && winner.isSignificant && winner.winner && (
        <Card className="mb-6 border-2 border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700">
              🎉 Winner: {winner.winner}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800">
              This variant is performing significantly better with{' '}
              {winner.confidence}% confidence (p-value: {winner.pValue.toFixed(4)}).
            </p>
          </CardContent>
        </Card>
      )}

      {/* Statistical Significance */}
      {winner && variants.length === 2 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Statistical Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Z-Score: {winner.zScore.toFixed(4)}</p>
                <p className="text-sm text-gray-600 mb-2">P-Value: {winner.pValue.toFixed(4)}</p>
                <p className="text-sm text-gray-600 mb-2">
                  Confidence: {winner.confidence}%
                </p>
                <p className={`text-sm font-semibold ${winner.isSignificant ? 'text-green-600' : 'text-yellow-600'}`}>
                  {winner.isSignificant
                    ? `✓ Statistically Significant (p < 0.05)`
                    : `⚠ Not yet statistically significant (need more data)`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variants Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {variants.map((variant: any) => (
          <Card key={variant.id}>
            <CardHeader>
              <CardTitle>{variant.variant_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Impressions</p>
                  <p className="text-2xl font-bold">{variant.impressions || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clicks</p>
                  <p className="text-2xl font-bold">{variant.clicks || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Conversions</p>
                  <p className="text-2xl font-bold">{variant.conversions || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Click-Through Rate (CTR)</p>
                  <p className="text-2xl font-bold">{variant.ctr?.toFixed(2) || '0.00'}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold">
                    {variant.conversion_rate?.toFixed(2) || '0.00'}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Short URL</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                    {variant.short_url}
                  </code>
                  <p className="text-xs text-gray-500 mt-2">
                    Full URL: {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/r/{variant.short_url}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Started:</span>{' '}
              {new Date(test.started_at).toLocaleString()}
            </p>
            {test.ended_at && (
              <p className="text-sm">
                <span className="font-semibold">Ended:</span>{' '}
                {new Date(test.ended_at).toLocaleString()}
              </p>
            )}
            {test.target_url && (
              <p className="text-sm">
                <span className="font-semibold">Target URL:</span>{' '}
                <a
                  href={test.target_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {test.target_url}
                </a>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

