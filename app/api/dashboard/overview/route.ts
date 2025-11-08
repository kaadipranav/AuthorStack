import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
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
        totalRevenue: 0,
        totalUnits: 0,
        totalPageReads: 0,
        revenueByPlatform: [],
        topBooks: [],
        lastUpdated: new Date().toISOString(),
      });
    }

    const bookIds = books.map((b) => b.id);

    // Get sales data for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: salesData, error: salesError } = await supabase
      .from('sales_data')
      .select('*')
      .in('book_id', bookIds)
      .gte('sale_date', thirtyDaysAgo.toISOString().split('T')[0]);

    if (salesError) throw salesError;

    // Aggregate data
    let totalRevenue = 0;
    let totalUnits = 0;
    let totalPageReads = 0;
    const revenueByPlatform: { [key: string]: number } = {};
    const unitsByPlatform: { [key: string]: number } = {};
    const revenueByBook: { [key: string]: { revenue: number; units: number } } = {};

    salesData?.forEach((sale) => {
      totalRevenue += Number(sale.revenue) || 0;
      totalUnits += sale.units_sold || 0;
      totalPageReads += sale.page_reads || 0;

      // By platform
      revenueByPlatform[sale.platform] = (revenueByPlatform[sale.platform] || 0) + (Number(sale.revenue) || 0);
      unitsByPlatform[sale.platform] = (unitsByPlatform[sale.platform] || 0) + (sale.units_sold || 0);

      // By book
      if (!revenueByBook[sale.book_id]) {
        revenueByBook[sale.book_id] = { revenue: 0, units: 0 };
      }
      revenueByBook[sale.book_id].revenue += Number(sale.revenue) || 0;
      revenueByBook[sale.book_id].units += sale.units_sold || 0;
    });

    // Get book titles for top books
    const { data: bookDetails, error: bookDetailsError } = await supabase
      .from('books')
      .select('id, title')
      .in('id', Object.keys(revenueByBook));

    if (bookDetailsError) throw bookDetailsError;

    const topBooks = (bookDetails || [])
      .map((book) => ({
        id: book.id,
        title: book.title,
        revenue: revenueByBook[book.id]?.revenue || 0,
        units: revenueByBook[book.id]?.units || 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const platformBreakdown = Object.entries(revenueByPlatform).map(([platform, revenue]) => ({
      platform,
      revenue,
      units: unitsByPlatform[platform] || 0,
    }));

    return NextResponse.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalUnits,
      totalPageReads,
      revenueByPlatform: platformBreakdown,
      topBooks,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard overview' },
      { status: 500 }
    );
  }
}
