import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';

export const metadata = {
  title: 'Books - AuthorStack',
};

export default async function BooksPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Books</h1>
        <Button variant="primary">Add Book</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Books</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No books added yet. Click "Add Book" to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
}
