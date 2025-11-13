'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Dynamic import for PieChart to ensure it's only loaded on client-side
const PieChart = dynamic(
  () => import('recharts').then((mod) => mod.PieChart),
  { ssr: false }
);

interface PlatformData {
  platform: string;
  revenue: number;
  units: number;
}

interface PlatformBreakdownProps {
  data: PlatformData[];
  isLoading?: boolean;
}

const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];

export function PlatformBreakdown({ data, isLoading = false }: PlatformBreakdownProps) {
  const [isClient, setIsClient] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 300 });

  useEffect(() => {
    setIsClient(true);
    // Set initial container size
    updateContainerSize();
    // Update on window resize
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, []);

  const updateContainerSize = () => {
    if (typeof window !== 'undefined') {
      const width = Math.min(600, window.innerWidth - 40); // 20px padding on each side
      setContainerSize({ width, height: 300 });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Revenue by Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Revenue by Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center text-charcoal/60">
            <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <p className="text-lg font-medium">No platform data</p>
            <p className="text-sm mt-1">Platform data will appear here once available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.platform,
    value: Math.round(item.revenue * 100) / 100,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Revenue by Platform</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height: '400px' }}>
          {isClient && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

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
                <div className="font-semibold">${item.revenue.toLocaleString()}</div>
                <div className="text-xs text-gray-600">{item.units} units</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
