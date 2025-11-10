'use client';

import { useDashboardOverview, useDashboardCharts } from '@/lib/hooks/useDashboard';
import { useForecast } from '@/lib/hooks/useForecast';
import { RevenueCard } from '@/components/dashboard/RevenueCard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { PlatformBreakdown } from '@/components/dashboard/PlatformBreakdown';
import { BookPerformanceTable } from '@/components/dashboard/BookPerformanceTable';
import { ForecastCard } from '@/components/dashboard/ForecastCard';
import { DollarSign, ShoppingCart, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const { data: overview, isLoading: overviewLoading } = useDashboardOverview();
  const { data: charts, isLoading: chartsLoading } = useDashboardCharts(30);
  const { data: forecast, isLoading: forecastLoading } = useForecast(3);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Sales Dashboard</h1>
        <p className="text-gray-600">
          Last updated: {overview?.lastUpdated ? new Date(overview.lastUpdated).toLocaleString() : 'Loading...'}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <RevenueCard
          label="Total Revenue"
          value={overview?.totalRevenue || 0}
          isCurrency
          isLoading={overviewLoading}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <RevenueCard
          label="Units Sold"
          value={overview?.totalUnits || 0}
          isLoading={overviewLoading}
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <RevenueCard
          label="Page Reads (KDP)"
          value={overview?.totalPageReads || 0}
          isLoading={overviewLoading}
          icon={<BookOpen className="w-5 h-5" />}
        />
      </div>

      {/* Forecast */}
      <div className="mb-8">
        <ForecastCard data={forecast || null} isLoading={forecastLoading} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <SalesChart
            data={charts?.revenueTimeSeries || []}
            isLoading={chartsLoading}
            title="Revenue Over Last 30 Days"
          />
        </div>
        <PlatformBreakdown
          data={overview?.revenueByPlatform || []}
          isLoading={overviewLoading}
        />
      </div>

      {/* Top Books */}
      <BookPerformanceTable
        data={overview?.topBooks || []}
        isLoading={overviewLoading}
      />
    </div>
  );
}
