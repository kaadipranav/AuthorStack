/**
 * Forecasting Utilities
 * Simple forecasting using moving average and linear regression
 */

export interface ForecastResult {
  predictedRevenue: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  confidenceLevel: number;
  method: 'moving_average' | 'linear_regression';
  dataPoints: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

/**
 * Calculate simple moving average
 */
export function calculateMovingAverage(data: number[], window: number): number {
  if (data.length === 0) return 0;
  if (data.length < window) {
    // Use all available data if we have less than window size
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
  }
  
  // Use last N values
  const recentData = data.slice(-window);
  const sum = recentData.reduce((acc, val) => acc + val, 0);
  return sum / recentData.length;
}

/**
 * Calculate linear regression forecast
 * Returns predicted value for next period
 */
export function calculateLinearRegressionForecast(
  data: DailyRevenue[]
): { forecast: number; slope: number; intercept: number } {
  if (data.length === 0) {
    return { forecast: 0, slope: 0, intercept: 0 };
  }

  // Convert dates to numeric values (days since first date)
  const firstDate = new Date(data[0].date);
  const numericData = data.map((point, index) => {
    const date = new Date(point.date);
    const daysSinceStart = Math.floor(
      (date.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      x: daysSinceStart,
      y: point.revenue,
    };
  });

  const n = numericData.length;
  const sumX = numericData.reduce((sum, point) => sum + point.x, 0);
  const sumY = numericData.reduce((sum, point) => sum + point.y, 0);
  const sumXY = numericData.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumX2 = numericData.reduce((sum, point) => sum + point.x * point.x, 0);

  // Calculate slope and intercept
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Forecast for next period (next day)
  const lastX = numericData[numericData.length - 1].x;
  const forecast = slope * (lastX + 1) + intercept;

  return { forecast: Math.max(0, forecast), slope, intercept };
}

/**
 * Calculate standard deviation
 */
export function calculateStandardDeviation(data: number[]): number {
  if (data.length === 0) return 0;
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const squaredDiffs = data.map((val) => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
  return Math.sqrt(variance);
}

/**
 * Calculate confidence interval
 * Uses standard error of the mean for moving average
 * Uses prediction interval for linear regression
 */
export function calculateConfidenceInterval(
  data: number[],
  forecast: number,
  method: 'moving_average' | 'linear_regression',
  confidenceLevel: number = 0.95
): { lower: number; upper: number } {
  if (data.length === 0) {
    return { lower: 0, upper: 0 };
  }

  const stdDev = calculateStandardDeviation(data);
  const n = data.length;

  // Z-score for confidence level (95% = 1.96, 90% = 1.645)
  const zScore = confidenceLevel === 0.95 ? 1.96 : confidenceLevel === 0.90 ? 1.645 : 1.96;

  let margin: number;

  if (method === 'moving_average') {
    // Standard error of the mean
    const standardError = stdDev / Math.sqrt(n);
    margin = zScore * standardError;
  } else {
    // For linear regression, use a simplified prediction interval
    // More sophisticated methods would consider the prediction error
    const standardError = stdDev * Math.sqrt(1 + 1 / n);
    margin = zScore * standardError;
  }

  return {
    lower: Math.max(0, forecast - margin),
    upper: forecast + margin,
  };
}

/**
 * Determine trend from data
 */
export function determineTrend(data: DailyRevenue[]): 'increasing' | 'decreasing' | 'stable' {
  if (data.length < 2) return 'stable';

  // Compare first half vs second half
  const midpoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midpoint);
  const secondHalf = data.slice(midpoint);

  const firstHalfAvg =
    firstHalf.reduce((sum, point) => sum + point.revenue, 0) / firstHalf.length;
  const secondHalfAvg =
    secondHalf.reduce((sum, point) => sum + point.revenue, 0) / secondHalf.length;

  const change = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;

  if (change > 5) return 'increasing';
  if (change < -5) return 'decreasing';
  return 'stable';
}

/**
 * Generate forecast for next month
 * Uses last 3 months of data
 */
export function generateForecast(
  dailyRevenue: DailyRevenue[],
  months: number = 3
): ForecastResult {
  if (dailyRevenue.length === 0) {
    return {
      predictedRevenue: 0,
      confidenceInterval: { lower: 0, upper: 0 },
      confidenceLevel: 0.95,
      method: 'moving_average',
      dataPoints: 0,
      trend: 'stable',
    };
  }

  // Filter to last N months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - months);
  
  const filteredData = dailyRevenue.filter((point) => {
    const pointDate = new Date(point.date);
    return pointDate >= threeMonthsAgo;
  });

  if (filteredData.length === 0) {
    // Fallback to all data if no data in last 3 months
    return generateForecastFromData(dailyRevenue);
  }

  return generateForecastFromData(filteredData);
}

/**
 * Generate forecast from data using moving average and linear regression
 */
function generateForecastFromData(data: DailyRevenue[]): ForecastResult {
  const revenues = data.map((point) => point.revenue);
  const trend = determineTrend(data);

  // Try linear regression first (better for trends)
  const linearRegression = calculateLinearRegressionForecast(data);
  
  // Also calculate moving average (better for stable data)
  const movingAverageWindow = Math.min(30, Math.floor(data.length / 2)); // Use last 30 days or half of data
  const movingAverage = calculateMovingAverage(revenues, movingAverageWindow);

  // Choose method based on data characteristics
  // Use linear regression if there's a clear trend, otherwise use moving average
  const useLinearRegression = Math.abs(linearRegression.slope) > 0.1; // Significant slope

  const forecast = useLinearRegression ? linearRegression.forecast : movingAverage;
  const method = useLinearRegression ? 'linear_regression' : 'moving_average';

  // Calculate confidence interval
  const confidenceInterval = calculateConfidenceInterval(revenues, forecast, method, 0.95);

  // Scale forecast to monthly (multiply by ~30 days)
  const dailyForecast = forecast;
  const monthlyForecast = dailyForecast * 30;

  // Scale confidence interval
  const monthlyLower = confidenceInterval.lower * 30;
  const monthlyUpper = confidenceInterval.upper * 30;

  return {
    predictedRevenue: Math.max(0, monthlyForecast),
    confidenceInterval: {
      lower: Math.max(0, monthlyLower),
      upper: monthlyUpper,
    },
    confidenceLevel: 0.95,
    method,
    dataPoints: data.length,
    trend,
  };
}

/**
 * Aggregate daily revenue data
 */
export function aggregateDailyRevenue(salesData: Array<{
  sale_date: string;
  revenue: number;
}>): DailyRevenue[] {
  const revenueByDate: { [key: string]: number } = {};

  salesData.forEach((sale) => {
    const date = sale.sale_date;
    revenueByDate[date] = (revenueByDate[date] || 0) + Number(sale.revenue || 0);
  });

  // Convert to array and sort by date
  return Object.entries(revenueByDate)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

