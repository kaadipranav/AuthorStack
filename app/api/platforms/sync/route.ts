import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  fetchGumroadSales,
  normalizeGumroadSales,
  aggregateSalesByDate,
  getMockGumroadResponse,
} from '@/lib/integrations/gumroad';

interface SyncLog {
  timestamp: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export async function POST(request: NextRequest) {
  const logs: SyncLog[] = [];

  function addLog(message: string, status: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const log = {
      timestamp: new Date().toISOString(),
      message,
      status,
    };
    logs.push(log);
    console.log(`[${status.toUpperCase()}] ${message}`);
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      addLog('Unauthorized: No user found', 'error');
      return NextResponse.json({ error: 'Unauthorized', logs }, { status: 401 });
    }

    addLog(`Starting sync for user: ${user.id}`);

    // Get request body
    const body = await request.json();
    const { platform = 'gumroad', useMockData = false } = body;

    addLog(`Syncing platform: ${platform}`);

    if (platform !== 'gumroad') {
      addLog(`Platform ${platform} not supported yet`, 'warning');
      return NextResponse.json(
        { error: 'Platform not supported', logs },
        { status: 400 }
      );
    }

    // Get platform connection
    const { data: connection, error: connError } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform_name', 'gumroad')
      .single();

    if (connError || !connection) {
      addLog('Gumroad not connected', 'warning');
      return NextResponse.json(
        { error: 'Gumroad not connected', logs },
        { status: 400 }
      );
    }

    if (!connection.is_active) {
      addLog('Gumroad connection is inactive', 'warning');
      return NextResponse.json(
        { error: 'Gumroad connection is inactive', logs },
        { status: 400 }
      );
    }

    addLog('Found Gumroad connection');

    // Get user's books
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id')
      .eq('user_id', user.id);

    if (booksError || !books || books.length === 0) {
      addLog('No books found for user', 'warning');
      return NextResponse.json(
        { error: 'No books found', logs },
        { status: 400 }
      );
    }

    addLog(`Found ${books.length} book(s)`);
    const bookId = books[0].id; // Use first book for now

    // Fetch sales from Gumroad
    addLog('Fetching sales from Gumroad...');

    let gumroadSales;

    if (useMockData) {
      addLog('Using mock data for testing', 'info');
      const mockResponse = getMockGumroadResponse(14);
      gumroadSales = mockResponse.sales;
    } else {
      // Decrypt API key from credentials
      const credentials = connection.credentials as { api_key?: string };
      const apiKey = credentials?.api_key;

      if (!apiKey) {
        addLog('Gumroad API key not found', 'error');
        return NextResponse.json(
          { error: 'Gumroad API key not found', logs },
          { status: 400 }
        );
      }

      // Get last sync date
      const { data: lastSale } = await supabase
        .from('sales_data')
        .select('sale_date')
        .eq('book_id', bookId)
        .eq('platform', 'gumroad')
        .order('sale_date', { ascending: false })
        .limit(1)
        .single();

      const sinceDate = lastSale
        ? new Date(lastSale.sale_date).toISOString()
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      addLog(`Fetching sales since: ${sinceDate}`);

      gumroadSales = await fetchGumroadSales(apiKey, sinceDate);
    }

    addLog(`Fetched ${gumroadSales.length} sales from Gumroad`, 'success');

    if (gumroadSales.length === 0) {
      addLog('No new sales to sync');
      // Update last_synced_at
      await supabase
        .from('platform_connections')
        .update({ last_synced_at: new Date().toISOString() })
        .eq('id', connection.id);

      return NextResponse.json({
        success: true,
        salesCount: 0,
        logs,
      });
    }

    // Normalize sales
    addLog('Normalizing sales data...');
    const normalizedSales = normalizeGumroadSales(gumroadSales);
    const aggregatedSales = aggregateSalesByDate(normalizedSales);

    addLog(`Aggregated to ${aggregatedSales.length} daily records`);

    // Insert/update sales data
    addLog('Inserting sales into database...');

    const salesToInsert = aggregatedSales.map((sale) => ({
      book_id: bookId,
      platform: sale.platform,
      sale_date: sale.sale_date,
      units_sold: sale.units_sold,
      revenue: sale.revenue,
      currency: sale.currency,
      created_at: new Date().toISOString(),
    }));

    const { error: insertError, data: inserted } = await supabase
      .from('sales_data')
      .upsert(salesToInsert, {
        onConflict: 'book_id,platform,sale_date',
      })
      .select();

    if (insertError) {
      addLog(`Database error: ${insertError.message}`, 'error');
      return NextResponse.json(
        { error: 'Failed to insert sales data', logs },
        { status: 500 }
      );
    }

    addLog(`Successfully inserted ${inserted?.length || 0} records`, 'success');

    // Update last_synced_at
    await supabase
      .from('platform_connections')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', connection.id);

    addLog('Sync completed successfully', 'success');

    return NextResponse.json({
      success: true,
      salesCount: aggregatedSales.length,
      logs,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    addLog(`Sync failed: ${errorMessage}`, 'error');

    return NextResponse.json(
      {
        error: 'Sync failed',
        message: errorMessage,
        logs,
      },
      { status: 500 }
    );
  }
}
