import { redirect } from 'next/navigation';
import { getCurrentUser, getUserProfile } from '@/lib/auth';
import { BillingGate } from '@/components/billing/BillingGate';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';

export const metadata = {
  title: 'A/B Tests - AuthorStack',
};

export default async function ABTestsPage() {
  const user = await getCurrentUser();
  const profile = await getUserProfile();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">A/B Testing</h1>

      <BillingGate
        requiredTier="pro"
        userTier={profile?.subscription_tier || 'free'}
        featureName="A/B Testing"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Active Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No active tests yet. Create one to get started.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Your test results will appear here.</p>
            </CardContent>
          </Card>
        </div>
      </BillingGate>
    </div>
  );
}
