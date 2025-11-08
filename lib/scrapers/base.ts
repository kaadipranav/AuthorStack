/**
 * Base Scraper Interface
 * All platform scrapers implement this interface
 */

export interface ScrapedPrice {
  platform: string;
  price: number;
  currency: string;
  checked_at: string;
  title?: string;
  author?: string;
  error?: string;
}

export interface ScraperOptions {
  timeout?: number;
  headless?: boolean;
  proxy?: string;
  userAgent?: string;
}

export abstract class BaseScraper {
  protected platform: string;
  protected options: ScraperOptions;

  constructor(platform: string, options: ScraperOptions = {}) {
    this.platform = platform;
    this.options = {
      timeout: 30000,
      headless: true,
      ...options,
    };
  }

  abstract scrapePrice(asin: string): Promise<ScrapedPrice>;

  protected formatPrice(price: string): number {
    // Remove currency symbols and commas
    const cleaned = price.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  }

  protected getTimestamp(): string {
    return new Date().toISOString();
  }

  protected createErrorResponse(asin: string, error: string): ScrapedPrice {
    return {
      platform: this.platform,
      price: 0,
      currency: 'USD',
      checked_at: this.getTimestamp(),
      error,
    };
  }
}
