/**
 * A/B Test Utilities
 * Functions for generating short URLs, calculating statistics, etc.
 */

/**
 * Generate a short URL code (8 characters, alphanumeric)
 */
export function generateShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(clicks: number, conversions: number): number {
  if (clicks === 0) return 0;
  return (conversions / clicks) * 100;
}

/**
 * Calculate click-through rate (CTR)
 */
export function calculateCTR(impressions: number, clicks: number): number {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
}

/**
 * Calculate z-score for two-proportion z-test
 * Used to determine statistical significance between two variants
 * 
 * @param n1 - Sample size for variant 1 (clicks)
 * @param x1 - Conversions for variant 1
 * @param n2 - Sample size for variant 2 (clicks)
 * @param x2 - Conversions for variant 2
 * @returns z-score
 */
export function calculateZScore(
  n1: number,
  x1: number,
  n2: number,
  x2: number
): number {
  if (n1 === 0 || n2 === 0) return 0;

  const p1 = x1 / n1;
  const p2 = x2 / n2;

  // Pooled proportion
  const p = (x1 + x2) / (n1 + n2);
  const q = 1 - p;

  // Standard error
  const se = Math.sqrt(p * q * (1 / n1 + 1 / n2));

  if (se === 0) return 0;

  // Z-score
  const z = (p1 - p2) / se;

  return z;
}

/**
 * Get p-value from z-score (two-tailed test)
 * Uses standard normal distribution approximation
 */
export function zScoreToPValue(z: number): number {
  // Absolute value for two-tailed test
  const absZ = Math.abs(z);

  // Approximation using error function
  // For z > 3, p-value is very small
  if (absZ > 3) return 0.001;

  // Simplified approximation (more accurate methods exist, but this works for MVP)
  // Using erf approximation: p = 2 * (1 - Φ(|z|))
  // Where Φ is the cumulative distribution function of standard normal distribution
  
  // Taylor series approximation for small z
  if (absZ < 1.96) {
    // For z < 1.96, p > 0.05
    return 1 - (absZ / 1.96) * 0.05;
  }

  // For larger z values
  if (absZ < 2.58) {
    return 0.01 + (2.58 - absZ) / (2.58 - 1.96) * 0.04;
  }

  return 0.01;
}

/**
 * Check if test result is statistically significant
 * @param zScore - Z-score from z-test
 * @param confidenceLevel - Confidence level (default: 0.95 for 95%)
 * @returns Object with isSignificant, pValue, and confidence
 */
export function isStatisticallySignificant(
  zScore: number,
  confidenceLevel: number = 0.95
): { isSignificant: boolean; pValue: number; confidence: number } {
  const pValue = zScoreToPValue(zScore);
  const alpha = 1 - confidenceLevel;
  const isSignificant = pValue < alpha;

  return {
    isSignificant,
    pValue,
    confidence: confidenceLevel * 100,
  };
}

/**
 * Determine winner between two variants
 * @param variant1 - First variant stats
 * @param variant2 - Second variant stats
 * @param confidenceLevel - Confidence level (default: 0.95)
 * @returns Winner information or null if not significant
 */
export function determineWinner(
  variant1: { clicks: number; conversions: number; name: string },
  variant2: { clicks: number; conversions: number; name: string },
  confidenceLevel: number = 0.95
): {
  winner: string | null;
  zScore: number;
  pValue: number;
  isSignificant: boolean;
  confidence: number;
  conversionRate1: number;
  conversionRate2: number;
} {
  const zScore = calculateZScore(
    variant1.clicks,
    variant1.conversions,
    variant2.clicks,
    variant2.conversions
  );

  const { isSignificant, pValue, confidence } = isStatisticallySignificant(
    zScore,
    confidenceLevel
  );

  const conversionRate1 = calculateConversionRate(
    variant1.clicks,
    variant1.conversions
  );
  const conversionRate2 = calculateConversionRate(
    variant2.clicks,
    variant2.conversions
  );

  let winner: string | null = null;
  if (isSignificant) {
    winner = zScore > 0 ? variant1.name : variant2.name;
  }

  return {
    winner,
    zScore,
    pValue,
    isSignificant,
    confidence,
    conversionRate1,
    conversionRate2,
  };
}

/**
 * Build redirect URL with UTM parameters
 */
export function buildRedirectUrl(
  targetUrl: string,
  testId: string,
  variantId: string,
  variantName: string
): string {
  try {
    const url = new URL(targetUrl);
    
    // Add UTM parameters
    url.searchParams.set('utm_source', 'authorstack');
    url.searchParams.set('utm_medium', 'ab_test');
    url.searchParams.set('utm_campaign', `test_${testId}`);
    url.searchParams.set('utm_content', variantName);
    url.searchParams.set('variant_id', variantId);

    return url.toString();
  } catch (error) {
    // If targetUrl is not a valid URL, return as-is
    return targetUrl;
  }
}

