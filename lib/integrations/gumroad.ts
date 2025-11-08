/**
 * Gumroad Integration Service
 * Handles fetching sales data from Gumroad API
 */

export interface GumroadSale {
  id: string;
  product_id: string;
  product_name: string;
  purchaser_email: string;
  price: number;
  currency: string;
  quantity: number;
  created_at: string;
  license_key?: string;
  custom_fields?: Record<string, string>;
}

export interface GumroadResponse {
  success: boolean;
  sales: GumroadSale[];
  next_page_key?: string;
}

export interface NormalizedSale {
  platform: string;
  sale_date: string;
  units_sold: number;
  revenue: number;
  currency: string;
  metadata: {
    gumroad_id: string;
    product_name: string;
    purchaser_email: string;
  };
}

/**
 * Retry with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delayMs = initialDelayMs * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delayMs}ms`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Fetch sales from Gumroad API
 * @param apiKey Gumroad API token
 * @param sinceDate ISO date string to fetch sales since
 * @returns Array of sales from Gumroad
 */
export async function fetchGumroadSales(
  apiKey: string,
  sinceDate?: string
): Promise<GumroadSale[]> {
  const allSales: GumroadSale[] = [];
  let nextPageKey: string | undefined;

  try {
    do {
      const params = new URLSearchParams({
        access_token: apiKey,
      });

      if (sinceDate) {
        params.append('after', sinceDate);
      }

      if (nextPageKey) {
        params.append('page_key', nextPageKey);
      }

      const response = await retryWithBackoff(async () => {
        const res = await fetch(`https://api.gumroad.com/v2/sales?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Invalid Gumroad API key');
          }
          if (res.status === 429) {
            throw new Error('Rate limited by Gumroad API');
          }
          throw new Error(`Gumroad API error: ${res.status} ${res.statusText}`);
        }

        return res.json() as Promise<GumroadResponse>;
      });

      if (!response.success) {
        throw new Error('Gumroad API returned success: false');
      }

      allSales.push(...(response.sales || []));
      nextPageKey = response.next_page_key;

      // Rate limiting: wait between requests
      if (nextPageKey) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } while (nextPageKey);

    return allSales;
  } catch (error) {
    console.error('Error fetching Gumroad sales:', error);
    throw error;
  }
}

/**
 * Normalize Gumroad sales to database format
 * @param sales Array of Gumroad sales
 * @returns Array of normalized sales for database insertion
 */
export function normalizeGumroadSales(sales: GumroadSale[]): NormalizedSale[] {
  return sales.map((sale) => {
    const saleDate = new Date(sale.created_at).toISOString().split('T')[0];

    return {
      platform: 'gumroad',
      sale_date: saleDate,
      units_sold: sale.quantity || 1,
      revenue: sale.price,
      currency: sale.currency || 'USD',
      metadata: {
        gumroad_id: sale.id,
        product_name: sale.product_name,
        purchaser_email: sale.purchaser_email,
      },
    };
  });
}

/**
 * Aggregate normalized sales by date
 * Combines multiple sales on the same day into one record
 */
export function aggregateSalesByDate(sales: NormalizedSale[]): NormalizedSale[] {
  const aggregated: { [key: string]: NormalizedSale } = {};

  sales.forEach((sale) => {
    const key = sale.sale_date;

    if (!aggregated[key]) {
      aggregated[key] = {
        ...sale,
        units_sold: 0,
        revenue: 0,
      };
    }

    aggregated[key].units_sold += sale.units_sold;
    aggregated[key].revenue += sale.revenue;
  });

  return Object.values(aggregated);
}

/**
 * Mock Gumroad API response for testing
 */
export function getMockGumroadResponse(daysBack: number = 14): GumroadResponse {
  const sales: GumroadSale[] = [];
  const now = new Date();

  for (let i = 0; i < daysBack; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // 1-3 sales per day
    const salesPerDay = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < salesPerDay; j++) {
      sales.push({
        id: `gumroad_${date.toISOString().split('T')[0]}_${j}`,
        product_id: `prod_${Math.random().toString(36).substr(2, 9)}`,
        product_name: 'Digital Product',
        purchaser_email: `customer${j}@example.com`,
        price: Math.floor(Math.random() * 50) + 5,
        currency: 'USD',
        quantity: 1,
        created_at: date.toISOString(),
      });
    }
  }

  return {
    success: true,
    sales: sales.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
  };
}
