import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';

export const metadata = {
  title: 'Insights - AuthorStack',
};

export default async function InsightsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Insights</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Analyze your sales trends and patterns over time.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reader Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Understand your reader base and audience insights.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Track key performance indicators for your books.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
