'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { SkeletonTable } from '@/components/Skeleton';

interface BookData {
  id: string;
  title: string;
  revenue: number;
  units: number;
}

interface BookPerformanceTableProps {
  data: BookData[];
  isLoading?: boolean;
}

export function BookPerformanceTable({ data, isLoading = false }: BookPerformanceTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Books</CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonTable />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-gray-500">
            <p>No books with sales data yet.</p>
            <p className="text-sm mt-2">Add a book and connect a sales platform to see data here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Books</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Book Title</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Units Sold</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((book, idx) => (
                <tr key={book.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-3 px-4 text-gray-900 font-medium">{book.title}</td>
                  <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                    ${book.revenue.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">{book.units}</td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    ${book.units > 0 ? (book.revenue / book.units).toFixed(2) : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
