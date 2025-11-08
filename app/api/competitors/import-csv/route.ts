import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface CSVRow {
  asin: string;
  title: string;
  author?: string;
  genre?: string;
  price?: string;
  currency?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { csv } = body;

    if (!csv) {
      return NextResponse.json({ error: 'CSV content required' }, { status: 400 });
    }

    // Parse CSV
    const rows = parseCSV(csv);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No valid rows in CSV' }, { status: 400 });
    }

    // Insert competitors
    const competitors = rows.map((row) => ({
      user_id: user.id,
      book_asin: row.asin,
      title: row.title,
      author: row.author || null,
      genre: row.genre || null,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from('tracked_competitors')
      .insert(competitors)
      .select();

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to import competitors' },
        { status: 500 }
      );
    }

    // Insert initial prices if provided
    let pricesInserted = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const competitor = inserted?.[i];

      if (row.price && competitor) {
        const { error: priceError } = await supabase
          .from('price_history')
          .insert([
            {
              competitor_id: competitor.id,
              platform: 'amazon',
              price: parseFloat(row.price),
              currency: row.currency || 'USD',
              checked_at: new Date().toISOString(),
            },
          ]);

        if (!priceError) {
          pricesInserted++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      competitorsImported: inserted?.length || 0,
      pricesImported: pricesInserted,
    });
  } catch (error) {
    console.error('CSV import error:', error);
    return NextResponse.json(
      { error: 'Failed to import CSV' },
      { status: 500 }
    );
  }
}

/**
 * Parse CSV string to objects
 * Expected format:
 * asin,title,author,genre,price,currency
 * B0ABC123DEF,Book Title,Author Name,Fiction,14.99,USD
 */
function parseCSV(csv: string): CSVRow[] {
  const lines = csv.trim().split('\n');

  if (lines.length < 2) {
    return [];
  }

  // Parse header
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

  const asinIndex = headers.indexOf('asin');
  const titleIndex = headers.indexOf('title');
  const authorIndex = headers.indexOf('author');
  const genreIndex = headers.indexOf('genre');
  const priceIndex = headers.indexOf('price');
  const currencyIndex = headers.indexOf('currency');

  if (asinIndex === -1 || titleIndex === -1) {
    return [];
  }

  // Parse rows
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    const values = line.split(',').map((v) => v.trim());

    rows.push({
      asin: values[asinIndex],
      title: values[titleIndex],
      author: authorIndex !== -1 ? values[authorIndex] : undefined,
      genre: genreIndex !== -1 ? values[genreIndex] : undefined,
      price: priceIndex !== -1 ? values[priceIndex] : undefined,
      currency: currencyIndex !== -1 ? values[currencyIndex] : 'USD',
    });
  }

  return rows;
}
