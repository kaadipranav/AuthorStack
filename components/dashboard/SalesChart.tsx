'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SalesChartProps {
  data: Array<{
    date: string;
    revenue: number;
  }>;
  isLoading?: boolean;
  title?: string;
}

export function SalesChart({ data, isLoading = false, title = 'Revenue Over Time' }: SalesChartProps) {
  // Ensure data is properly formatted and sorted by date
  const formattedData = data && Array.isArray(data) 
    ? [...data]
        .filter(item => item && item.date)
        .map(item => ({
          ...item,
          // Ensure revenue is a number
          revenue: typeof item.revenue === 'string' ? parseFloat(item.revenue) : item.revenue
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!formattedData || formattedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex flex-col items-center justify-center text-charcoal/60">
            <BookOpen className="w-12 h-12 mb-4 text-charcoal/30" />
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm mt-1">Sales data will appear here once available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate min and max for y-axis domain
  const allValues = formattedData.map(item => item.revenue).filter(Number.isFinite);
  const minValue = Math.min(0, ...allValues);
  const maxValue = Math.max(...allValues, 0);
  const padding = (maxValue - minValue) * 0.1; // 10% padding

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="w-full h-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={formattedData} 
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                domain={[minValue - padding, maxValue + padding]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-stroke">
                        <p className="text-sm text-charcoal/80 mb-1">
                          {new Date(label).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-sm font-medium text-ink">
                          ${Number(payload[0].value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: '#8B5CF6',
                  strokeWidth: 2,
                  fill: '#fff',
                }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
