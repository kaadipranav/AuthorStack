'use client';

import { Card, CardHeader, CardContent, CardDescription } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
          <div className="flex justify-between items-start">
            <CardDescription>{label}</CardDescription>
            {icon && <div className="text-charcoal opacity-50">{icon}</div>}
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
    );
  }

  const formattedValue = isCurrency
    ? `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : Number(value).toLocaleString('en-US');

  return (
    <Card className="hover:shadow-lg transition-smooth duration-normal">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardDescription>{label}</CardDescription>
          {icon && <div className="text-burgundy">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-4xl font-semibold text-ink mb-2">{formattedValue}</div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-sm">
            {trend >= 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-forest" />
                <span className="text-forest font-medium">+{trend}% from last month</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-danger" />
                <span className="text-danger font-medium">{trend}% from last month</span>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
