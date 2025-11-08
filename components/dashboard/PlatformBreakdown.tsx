'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PlatformData {
  platform: string;
  revenue: number;
  units: number;
}

interface PlatformBreakdownProps {
  data: PlatformData[];
  isLoading?: boolean;
}

const COLORS = ['#1E40AF', '#F97316', '#10B981', '#F59E0B', '#EF4444'];

export function PlatformBreakdown({ data, isLoading = false }: PlatformBreakdownProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-gray-500">
            No platform data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.platform,
    value: item.revenue,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Platform</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-6 space-y-2">
          {data.map((item, idx) => (
            <div key={item.platform} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="font-medium capitalize">{item.platform}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">${item.revenue.toFixed(2)}</div>
                <div className="text-xs text-gray-600">{item.units} units</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
