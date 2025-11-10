import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { generateForecast, aggregateDailyRevenue } from '@/lib/utils/forecast';
import { getCached, setCached, getForecastCacheKey } from '@/lib/cache/redis';

/**
 * Get revenue forecast for next month
 * GET /api/insights/forecast?months=3
 * 
 * Uses last 3 months of sales data to forecast next month's revenue
 * Results are cached for 1 hour
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get months parameter (default: 3)
    const searchParams = request.nextUrl.searchParams;
    const months = parseInt(searchParams.get('months') || '3', 10);

    // Check cache first
    const cacheKey = getForecastCacheKey(user.id);
    const cached = await getCached<any>(cacheKey);

    if (cached) {
      console.log('Returning cached forecast');
      return NextResponse.json(cached);
    }

    // Get user's books
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id')
      .eq('user_id', user.id);

    if (booksError) throw booksError;

    if (!books || books.length === 0) {
      const emptyForecast = {
        predictedRevenue: 0,
        confidenceInterval: { lower: 0, upper: 0 },
        confidenceLevel: 0.95,
        method: 'moving_average',
        dataPoints: 0,
        trend: 'stable',
        cached: false,
      };
      return NextResponse.json(emptyForecast);
    }

    const bookIds = books.map((b) => b.id);

    // Get sales data for last N months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    const startDateStr = startDate.toISOString().split('T')[0];

    const { data: salesData, error: salesError } = await supabase
      .from('sales_data')
      .select('sale_date, revenue')
      .in('book_id', bookIds)
      .gte('sale_date', startDateStr)
      .order('sale_date', { ascending: true });

    if (salesError) throw salesError;

    if (!salesData || salesData.length === 0) {
      const emptyForecast = {
        predictedRevenue: 0,
        confidenceInterval: { lower: 0, upper: 0 },
        confidenceLevel: 0.95,
        method: 'moving_average',
        dataPoints: 0,
        trend: 'stable',
        cached: false,
      };
      return NextResponse.json(emptyForecast);
    }

    // Aggregate daily revenue
    const dailyRevenue = aggregateDailyRevenue(salesData);

    // Generate forecast
    const forecast = generateForecast(dailyRevenue, months);

    // Prepare response
    const response = {
      ...forecast,
      cached: false,
      generatedAt: new Date().toISOString(),
      period: 'month',
      monthsOfData: months,
    };

    // Cache for 1 hour (3600 seconds)
    await setCached(cacheKey, response, 3600);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Forecast error:', error);
    return NextResponse.json(
      { error: 'Failed to generate forecast' },
      { status: 500 }
    );
  }
}

