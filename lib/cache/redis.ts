/**
 * Cache implementation with Upstash Redis and in-memory fallback
 */

interface CacheClient {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, ttl?: number) => Promise<void>;
  del: (key: string) => Promise<void>;
}

/**
 * In-memory cache fallback
 */
class InMemoryCache implements CacheClient {
  private cache: Map<string, { value: string; expiry: number }> = new Map();

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    const expiry = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expiry });

    // Clean up expired items periodically
    if (this.cache.size > 1000) {
      this.cleanup();
    }
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Upstash Redis client
 */
class UpstashRedisCache implements CacheClient {
  private url: string;
  private token: string;

  constructor(url: string, token: string) {
    this.url = url;
    this.token = token;
  }

  async get(key: string): Promise<string | null> {
    try {
      // Upstash Redis REST API uses POST with command in body
      const response = await fetch(`${this.url}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['GET', key]),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      // Upstash returns { result: "value" } format
      // Handle both string and null results
      if (data.result === null || data.result === undefined) {
        return null;
      }
      return String(data.result);
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    try {
      // Upstash Redis REST API: SET key value EX ttl
      const response = await fetch(`${this.url}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['SET', key, value, 'EX', ttl.toString()]),
      });

      if (!response.ok) {
        console.error('Redis set failed:', response.statusText);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      const response = await fetch(`${this.url}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['DEL', key]),
      });

      if (!response.ok) {
        console.error('Redis del failed:', response.statusText);
      }
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }
}

/**
 * Get cache client (Upstash Redis or in-memory fallback)
 */
let cacheClient: CacheClient | null = null;

export function getCacheClient(): CacheClient {
  if (cacheClient) {
    return cacheClient;
  }

  // Try to use Upstash Redis if credentials are available
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    console.log('Using Upstash Redis for caching');
    cacheClient = new UpstashRedisCache(upstashUrl, upstashToken);
  } else {
    console.log('Using in-memory cache (Upstash Redis not configured)');
    cacheClient = new InMemoryCache();
  }

  return cacheClient;
}

/**
 * Cache helper functions
 */
export async function getCached<T>(key: string): Promise<T | null> {
  const client = getCacheClient();
  const value = await client.get(key);
  
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Cache parse error:', error);
    return null;
  }
}

export async function setCached<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
  const client = getCacheClient();
  const serialized = JSON.stringify(value);
  await client.set(key, serialized, ttl);
}

export async function deleteCached(key: string): Promise<void> {
  const client = getCacheClient();
  await client.del(key);
}

/**
 * Generate cache key for forecast
 */
export function getForecastCacheKey(userId: string): string {
  return `forecast:${userId}`;
}

