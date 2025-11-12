import { redirect } from 'next/navigation';
import { getCurrentUser, getUserProfile } from '@/lib/auth';
import { BillingGate } from '@/components/billing/BillingGate';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';

export const metadata = {
  title: 'Marketing Calendar - AuthorStack',
};

export default async function CalendarPage() {
  const user = await getCurrentUser();
  const profile = await getUserProfile();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Marketing Calendar</h1>

      <BillingGate
        requiredTier="pro"
        userTier={profile?.subscription_tier || 'free'}
        featureName="Marketing Calendar"
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Marketing Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Plan and schedule your marketing activities. No events yet.
            </p>
          </CardContent>
        </Card>
      </BillingGate>
    </div>
  );
}
