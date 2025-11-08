'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { TrendingUp } from 'lucide-react';

interface RevenueCardProps {
  label: string;
  value: number | string;
  isLoading?: boolean;
  isCurrency?: boolean;
  icon?: React.ReactNode;
  trend?: number;
}

export function RevenueCard({
  label,
  value,
  isLoading = false,
  isCurrency = false,
  icon,
  trend,
}: RevenueCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-16" />
        </CardContent>
      </Card>
    );
  }

  const formattedValue = isCurrency
    ? `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : Number(value).toLocaleString('en-US');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm">{label}</CardTitle>
          {icon && <div className="text-accent">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">{formattedValue}</div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-success">+{trend}% from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
