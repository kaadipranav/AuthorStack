import { redirect } from 'next/navigation';
import { getCurrentUser, getUserProfile } from '@/lib/auth';
import { BillingGate } from '@/components/billing/BillingGate';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { CreateTestForm } from '@/components/ab-tests/CreateTestForm';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'A/B Tests - AuthorStack',
};

async function getBooks(userId: string) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: books } = await supabase
    .from('books')
    .select('id, title')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return books || [];
}

async function getTests(userId: string) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get all tests for user's books
    const { data: tests, error: testsError } = await supabase
      .from('ab_tests')
      .select('*, books!inner(id, user_id, title)')
      .eq('books.user_id', userId)
      .order('created_at', { ascending: false });

    if (testsError) {
      return [];
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

    return testsWithCounts;
  } catch (error) {
    console.error('Error fetching tests:', error);
    return [];
  }
}

export default async function ABTestsPage() {
  const user = await getCurrentUser();
  const profile = await getUserProfile();

  if (!user) {
    redirect('/auth/login');
  }

  const books = await getBooks(user.id);
  const tests = await getTests(user.id);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">A/B Testing</h1>

      <BillingGate
        requiredTier="pro"
        userTier={profile?.subscription_tier || 'free'}
        featureName="A/B Testing"
      >
        <div className="space-y-8">
          {/* Create Test Form */}
          {books.length > 0 && <CreateTestForm books={books} />}

          {/* Tests List */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Tests</h2>
            {tests.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-600 mb-4">No tests yet. Create one to get started!</p>
                  {books.length === 0 && (
                    <p className="text-sm text-gray-500">
                      You need to create a book first before creating A/B tests.
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {tests.map((test: any) => (
                  <Card key={test.id}>
                    <CardHeader>
                      <CardTitle>{test.book_title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Type: <span className="capitalize">{test.test_type}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: <span className="capitalize">{test.status}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Variants: {test.variant_count}
                        </p>
                        <p className="text-sm text-gray-600">
                          Started: {new Date(test.started_at).toLocaleDateString()}
                        </p>
                        <Link href={`/ab-tests/${test.id}`}>
                          <Button variant="primary" size="sm" className="mt-4 w-full">
                            View Stats
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </BillingGate>
    </div>
  );
}
