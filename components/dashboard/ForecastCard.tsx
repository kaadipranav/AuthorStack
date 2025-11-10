'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

export interface ForecastData {
  predictedRevenue: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  confidenceLevel: number;
  method: 'moving_average' | 'linear_regression';
  dataPoints: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  cached?: boolean;
  generatedAt?: string;
  period?: string;
  monthsOfData?: number;
}

interface ForecastCardProps {
  data: ForecastData | null;
  isLoading?: boolean;
}

export function ForecastCard({ data, isLoading }: ForecastCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Revenue Forecast (Next Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-4 w-40" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.predictedRevenue === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Revenue Forecast (Next Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">
            Not enough data to generate forecast. Need at least 3 months of sales data.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formattedRevenue = `$${data.predictedRevenue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedLower = `$${data.confidenceInterval.lower.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedUpper = `$${data.confidenceInterval.upper.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const trendIcon =
    data.trend === 'increasing' ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : data.trend === 'decreasing' ? (
      <TrendingDown className="w-4 h-4 text-red-600" />
    ) : (
      <Minus className="w-4 h-4 text-gray-600" />
    );

  const trendColor =
    data.trend === 'increasing'
      ? 'text-green-600'
      : data.trend === 'decreasing'
        ? 'text-red-600'
        : 'text-gray-600';

  const methodLabel =
    data.method === 'linear_regression' ? 'Linear Regression' : 'Moving Average';

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Revenue Forecast (Next Month)
          </CardTitle>
          {data.cached && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Cached
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Predicted Revenue */}
          <div>
            <div className="text-3xl font-bold mb-1">{formattedRevenue}</div>
            <p className="text-xs text-gray-500">
              {data.confidenceLevel * 100}% confidence interval
            </p>
          </div>

          {/* Confidence Interval */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Confidence Interval:</p>
            <p className="text-sm font-semibold text-blue-900">
              {formattedLower} - {formattedUpper}
            </p>
          </div>

          {/* Trend */}
          <div className="flex items-center gap-2">
            {trendIcon}
            <span className={`text-sm font-medium capitalize ${trendColor}`}>
              {data.trend} trend
            </span>
          </div>

          {/* Method and Data Points */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <span>Method: {methodLabel}</span>
            <span>{data.dataPoints} data points</span>
          </div>

          {/* Generated At */}
          {data.generatedAt && (
            <p className="text-xs text-gray-400">
              Generated: {new Date(data.generatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

