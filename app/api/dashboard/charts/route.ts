import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's books
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id')
      .eq('user_id', user.id);

    if (booksError) throw booksError;

    if (!books || books.length === 0) {
      return NextResponse.json({
        revenueTimeSeries: [],
        unitsTimeSeries: [],
        platformComparison: [],
      });
    }

    const bookIds = books.map((b) => b.id);

    // Get sales data for specified days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: salesData, error: salesError } = await supabase
      .from('sales_data')
      .select('*')
      .in('book_id', bookIds)
      .gte('sale_date', startDate.toISOString().split('T')[0])
      .order('sale_date', { ascending: true });

    if (salesError) throw salesError;

    // Aggregate by date
    const revenueByDate: { [key: string]: number } = {};
    const unitsByDate: { [key: string]: number } = {};
    const revenueByPlatformDate: { [key: string]: { [key: string]: number } } = {};

    salesData?.forEach((sale) => {
      const date = sale.sale_date;

      revenueByDate[date] = (revenueByDate[date] || 0) + (Number(sale.revenue) || 0);
      unitsByDate[date] = (unitsByDate[date] || 0) + (sale.units_sold || 0);

      if (!revenueByPlatformDate[sale.platform]) {
        revenueByPlatformDate[sale.platform] = {};
      }
      revenueByPlatformDate[sale.platform][date] =
        (revenueByPlatformDate[sale.platform][date] || 0) + (Number(sale.revenue) || 0);
    });

    // Format time series
    const revenueTimeSeries = Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue * 100) / 100,
    }));

    const unitsTimeSeries = Object.entries(unitsByDate).map(([date, units]) => ({
      date,
      units,
    }));

    // Format platform comparison
    const platformComparison = Object.entries(revenueByPlatformDate).map(([platform, dates]) => {
      const data = Object.entries(dates).map(([date, revenue]) => ({
        date,
        [platform]: Math.round(revenue * 100) / 100,
      }));
      return {
        platform,
        data,
      };
    });

    return NextResponse.json({
      revenueTimeSeries,
      unitsTimeSeries,
      platformComparison,
    });
  } catch (error) {
    console.error('Dashboard charts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard charts' },
      { status: 500 }
    );
  }
}
