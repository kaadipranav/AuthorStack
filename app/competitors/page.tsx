import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';

export const metadata = {
  title: 'Competitors - AuthorStack',
};

export default async function CompetitorsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Competitor Tracking</h1>
        <Button variant="primary">Track Competitor</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tracked Competitors</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No competitors tracked yet. Add one to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
}
