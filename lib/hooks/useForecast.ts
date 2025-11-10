'use client';

import { useQuery } from '@tanstack/react-query';
import { ForecastData } from '@/components/dashboard/ForecastCard';

export function useForecast(months: number = 3) {
  return useQuery<ForecastData>({
    queryKey: ['forecast', months],
    queryFn: async () => {
      const response = await fetch(`/api/insights/forecast?months=${months}`);
      if (!response.ok) {
        throw new Error('Failed to fetch forecast');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hour (matches cache TTL)
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
}

