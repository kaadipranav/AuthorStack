/**
 * Unit tests for forecast utilities
 */

import {
  calculateMovingAverage,
  calculateLinearRegressionForecast,
  calculateStandardDeviation,
  calculateConfidenceInterval,
  determineTrend,
  generateForecast,
  aggregateDailyRevenue,
} from '@/lib/utils/forecast';

describe('Forecast Utilities', () => {
  describe('calculateMovingAverage', () => {
    it('should calculate moving average for window size', () => {
      const data = [10, 20, 30, 40, 50];
      const result = calculateMovingAverage(data, 3);
      expect(result).toBe(40); // Average of last 3: (30 + 40 + 50) / 3
    });

    it('should handle data smaller than window', () => {
      const data = [10, 20];
      const result = calculateMovingAverage(data, 5);
      expect(result).toBe(15); // Average of all data
    });

    it('should handle empty array', () => {
      const result = calculateMovingAverage([], 5);
      expect(result).toBe(0);
    });
  });

  describe('calculateLinearRegressionForecast', () => {
    it('should calculate forecast for increasing trend', () => {
      const data = [
        { date: '2024-01-01', revenue: 10 },
        { date: '2024-01-02', revenue: 20 },
        { date: '2024-01-03', revenue: 30 },
        { date: '2024-01-04', revenue: 40 },
        { date: '2024-01-05', revenue: 50 },
      ];

      const result = calculateLinearRegressionForecast(data);
      expect(result.forecast).toBeGreaterThan(50); // Should predict next value
      expect(result.slope).toBeGreaterThan(0); // Positive slope
    });

    it('should handle empty data', () => {
      const result = calculateLinearRegressionForecast([]);
      expect(result.forecast).toBe(0);
      expect(result.slope).toBe(0);
    });
  });

  describe('calculateStandardDeviation', () => {
    it('should calculate standard deviation', () => {
      const data = [10, 20, 30, 40, 50];
      const result = calculateStandardDeviation(data);
      expect(result).toBeGreaterThan(0);
    });

    it('should handle empty array', () => {
      const result = calculateStandardDeviation([]);
      expect(result).toBe(0);
    });
  });

  describe('calculateConfidenceInterval', () => {
    it('should calculate confidence interval', () => {
      const data = [10, 20, 30, 40, 50];
      const forecast = 30;
      const result = calculateConfidenceInterval(data, forecast, 'moving_average', 0.95);

      expect(result.lower).toBeLessThan(forecast);
      expect(result.upper).toBeGreaterThan(forecast);
      expect(result.lower).toBeGreaterThanOrEqual(0);
    });
  });

  describe('determineTrend', () => {
    it('should detect increasing trend', () => {
      const data = [
        { date: '2024-01-01', revenue: 10 },
        { date: '2024-01-02', revenue: 20 },
        { date: '2024-01-03', revenue: 30 },
        { date: '2024-01-04', revenue: 40 },
        { date: '2024-01-05', revenue: 50 },
      ];

      const result = determineTrend(data);
      expect(result).toBe('increasing');
    });

    it('should detect decreasing trend', () => {
      const data = [
        { date: '2024-01-01', revenue: 50 },
        { date: '2024-01-02', revenue: 40 },
        { date: '2024-01-03', revenue: 30 },
        { date: '2024-01-04', revenue: 20 },
        { date: '2024-01-05', revenue: 10 },
      ];

      const result = determineTrend(data);
      expect(result).toBe('decreasing');
    });

    it('should detect stable trend', () => {
      const data = [
        { date: '2024-01-01', revenue: 30 },
        { date: '2024-01-02', revenue: 31 },
        { date: '2024-01-03', revenue: 29 },
        { date: '2024-01-04', revenue: 30 },
        { date: '2024-01-05', revenue: 31 },
      ];

      const result = determineTrend(data);
      expect(result).toBe('stable');
    });
  });

  describe('aggregateDailyRevenue', () => {
    it('should aggregate revenue by date', () => {
      const salesData = [
        { sale_date: '2024-01-01', revenue: 10 },
        { sale_date: '2024-01-01', revenue: 20 },
        { sale_date: '2024-01-02', revenue: 30 },
      ];

      const result = aggregateDailyRevenue(salesData);
      expect(result).toHaveLength(2);
      expect(result[0].revenue).toBe(30); // 10 + 20
      expect(result[1].revenue).toBe(30);
    });

    it('should handle empty data', () => {
      const result = aggregateDailyRevenue([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('generateForecast', () => {
    it('should generate forecast with sufficient data', () => {
      const dailyRevenue: Array<{ date: string; revenue: number }> = [];
      
      // Generate 90 days of data
      for (let i = 0; i < 90; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (90 - i));
        dailyRevenue.push({
          date: date.toISOString().split('T')[0],
          revenue: 20 + i * 0.33, // Increasing trend
        });
      }

      const result = generateForecast(dailyRevenue, 3);
      expect(result.predictedRevenue).toBeGreaterThan(0);
      expect(result.confidenceInterval.lower).toBeGreaterThanOrEqual(0);
      expect(result.confidenceInterval.upper).toBeGreaterThan(result.predictedRevenue);
      expect(['increasing', 'decreasing', 'stable']).toContain(result.trend);
    });

    it('should handle empty data', () => {
      const result = generateForecast([], 3);
      expect(result.predictedRevenue).toBe(0);
      expect(result.dataPoints).toBe(0);
    });
  });
});

