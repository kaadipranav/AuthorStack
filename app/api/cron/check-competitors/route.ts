import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { AmazonScraper } from '@/lib/scrapers/amazon';

interface CronLog {
  timestamp: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export async function GET(request: NextRequest) {
  const logs: CronLog[] = [];

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
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      addLog('Unauthorized cron request', 'error');
      return NextResponse.json({ error: 'Unauthorized', logs }, { status: 401 });
    }

    addLog('Starting competitor price check cron job');

    const supabase = createRouteHandlerClient({ cookies });

    // Get all tracked competitors
    const { data: competitors, error: competitorsError } = await supabase
      .from('tracked_competitors')
      .select('*');

    if (competitorsError) {
      addLog(`Database error: ${competitorsError.message}`, 'error');
      return NextResponse.json({ error: 'Database error', logs }, { status: 500 });
    }

    if (!competitors || competitors.length === 0) {
      addLog('No competitors tracked');
      return NextResponse.json({ success: true, pricesChecked: 0, logs });
    }

    addLog(`Found ${competitors.length} tracked competitor(s)`);

    let pricesChecked = 0;
    let pricesUpdated = 0;
    let alertsTriggered = 0;

    // Check price for each competitor
    for (const competitor of competitors) {
      try {
        addLog(`Checking price for: ${competitor.title || competitor.book_asin}`);

        // Use Amazon scraper
        const scraper = new AmazonScraper({
          timeout: 30000,
          headless: true,
        });

        const scrapedPrice = await scraper.scrapePrice(competitor.book_asin);

        if (scrapedPrice.error) {
          addLog(`Failed to scrape ${competitor.book_asin}: ${scrapedPrice.error}`, 'warning');
          continue;
        }

        pricesChecked++;

        // Get last price
        const { data: lastPrice } = await supabase
          .from('price_history')
          .select('price')
          .eq('competitor_id', competitor.id)
          .order('checked_at', { ascending: false })
          .limit(1)
          .single();

        // Save to price history
        const { error: insertError } = await supabase
          .from('price_history')
          .insert([
            {
              competitor_id: competitor.id,
              platform: scrapedPrice.platform,
              price: scrapedPrice.price,
              currency: scrapedPrice.currency,
              checked_at: scrapedPrice.checked_at,
            },
          ]);

        if (insertError) {
          addLog(`Failed to save price for ${competitor.book_asin}: ${insertError.message}`, 'warning');
          continue;
        }

        pricesUpdated++;

        // Check if price changed
        if (lastPrice && lastPrice.price !== scrapedPrice.price) {
          const priceChange = scrapedPrice.price - lastPrice.price;
          const percentChange = ((priceChange / lastPrice.price) * 100).toFixed(2);

          addLog(
            `Price changed for ${competitor.title}: $${lastPrice.price} → $${scrapedPrice.price} (${percentChange}%)`,
            'success'
          );

          alertsTriggered++;

          // TODO: Trigger price alert notification
          // await sendPriceAlert(competitor, lastPrice.price, scrapedPrice.price);
        } else {
          addLog(`Price unchanged for ${competitor.title}: $${scrapedPrice.price}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        addLog(`Error checking competitor ${competitor.book_asin}: ${errorMessage}`, 'error');
      }
    }

    addLog(
      `Cron job completed. Checked: ${pricesChecked}, Updated: ${pricesUpdated}, Alerts: ${alertsTriggered}`,
      'success'
    );

    return NextResponse.json({
      success: true,
      pricesChecked,
      pricesUpdated,
      alertsTriggered,
      logs,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    addLog(`Cron job failed: ${errorMessage}`, 'error');

    return NextResponse.json(
      {
        error: 'Cron job failed',
        message: errorMessage,
        logs,
      },
      { status: 500 }
    );
  }
}
