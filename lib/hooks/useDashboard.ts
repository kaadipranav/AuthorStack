'use client';

import { useQuery } from '@tanstack/react-query';

export interface DashboardOverview {
  totalRevenue: number;
  totalUnits: number;
  totalPageReads: number;
  revenueByPlatform: Array<{
    platform: string;
    revenue: number;
    units: number;
  }>;
  topBooks: Array<{
    id: string;
    title: string;
    revenue: number;
    units: number;
  }>;
  lastUpdated: string;
}

export interface ChartData {
  revenueTimeSeries: Array<{
    date: string;
    revenue: number;
  }>;
  unitsTimeSeries: Array<{
    date: string;
    units: number;
  }>;
  platformComparison: Array<{
    platform: string;
    data: Array<{
      date: string;
      [key: string]: string | number;
    }>;
  }>;
}

export function useDashboardOverview() {
  return useQuery<DashboardOverview>({
    queryKey: ['dashboard', 'overview'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/overview');
      if (!response.ok) throw new Error('Failed to fetch overview');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useDashboardCharts(days: number = 30) {
  return useQuery<ChartData>({
    queryKey: ['dashboard', 'charts', days],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/charts?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch charts');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
