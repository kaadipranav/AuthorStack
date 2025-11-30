import { aiRatelimit } from '@/lib/db/redis'
import { openrouter } from '@/lib/ai/openrouter'
import { PROMPTS } from '@/lib/ai/prompts'
import { AppError } from '@/lib/utils/errors'
import type { 
  AIInsight, 
  PricingRecommendation, 
  RevenueForecast,
  Book,
  SalesData 
} from '@/types'

/**
 * AI Service
 * 
 * Handles all AI-powered operations using OpenRouter.
 * Primary model: DeepSeek V3 (~$0.14 per 1M tokens)
 * Backup: Azure OpenAI (if $100 credit remains)
 * 
 * Strategy:
 * - Rate limit AI calls (5/minute/user)
 * - Cache insights for 1 hour
 * - Use streaming for long responses
 */

/**
 * Generate insights for a user's sales data
 */
export async function generateInsights(
  userId: string,
  salesData: SalesData[],
  books: Book[]
): Promise<AIInsight[]> {
  try {
    // Check rate limit
    const { success, remaining } = await aiRatelimit.limit(userId)
    if (!success) {
      throw new AppError(
        `Rate limit exceeded. Try again in a minute. Remaining: ${remaining}`,
        429,
        'AI_RATE_LIMITED'
      )
    }

    const prompt = PROMPTS.generateInsights(salesData, books)
    const response = await openrouter.chat(prompt)

    // Parse the response into structured insights
    const insights = parseInsightsResponse(response)
    return insights
  } catch (error) {
    if (error instanceof AppError) throw error
    console.error('Generate insights error:', error)
    throw new AppError('Failed to generate insights', 500, 'AI_INSIGHTS_FAILED')
  }
}

/**
 * Generate pricing recommendations for a book
 */
export async function generatePricingRecommendation(
  userId: string,
  book: Book,
  competitorPrices: number[],
  salesHistory: SalesData[]
): Promise<PricingRecommendation> {
  try {
    // Check rate limit
    const { success } = await aiRatelimit.limit(userId)
    if (!success) {
      throw new AppError('Rate limit exceeded. Try again in a minute.', 429, 'AI_RATE_LIMITED')
    }

    const prompt = PROMPTS.generatePricingRecommendation(book, competitorPrices, salesHistory)
    const response = await openrouter.chat(prompt)

    // Parse the response
    const recommendation = parsePricingResponse(response)
    return recommendation
  } catch (error) {
    if (error instanceof AppError) throw error
    console.error('Generate pricing error:', error)
    throw new AppError('Failed to generate pricing recommendation', 500, 'AI_PRICING_FAILED')
  }
}

/**
 * Generate revenue forecast
 */
export async function generateForecast(
  userId: string,
  salesHistory: SalesData[],
  daysToForecast: number = 30
): Promise<RevenueForecast> {
  try {
    // Check rate limit
    const { success } = await aiRatelimit.limit(userId)
    if (!success) {
      throw new AppError('Rate limit exceeded. Try again in a minute.', 429, 'AI_RATE_LIMITED')
    }

    // Require at least 30 days of data
    if (salesHistory.length < 30) {
      throw new AppError(
        'Need at least 30 days of sales data for forecasting',
        400,
        'INSUFFICIENT_DATA'
      )
    }

    const prompt = PROMPTS.generateForecast(salesHistory, daysToForecast)
    const response = await openrouter.chat(prompt)

    // Parse the response
    const forecast = parseForecastResponse(response)
    return forecast
  } catch (error) {
    if (error instanceof AppError) throw error
    console.error('Generate forecast error:', error)
    throw new AppError('Failed to generate forecast', 500, 'AI_FORECAST_FAILED')
  }
}

/**
 * Parse AI response into structured insights
 */
function parseInsightsResponse(response: string): AIInsight[] {
  try {
    // Attempt to parse JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback: return a single insight with the raw response
    return [{
      id: `insight-${Date.now()}`,
      type: 'general',
      title: 'AI Analysis',
      description: response,
      confidence: 0.7,
      createdAt: new Date(),
    }]
  } catch {
    return [{
      id: `insight-${Date.now()}`,
      type: 'general',
      title: 'AI Analysis',
      description: response,
      confidence: 0.5,
      createdAt: new Date(),
    }]
  }
}

/**
 * Parse AI response into pricing recommendation
 */
function parsePricingResponse(response: string): PricingRecommendation {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback
    return {
      recommendedPrice: 0,
      confidence: 0.5,
      reasoning: response,
      alternatives: [],
    }
  } catch {
    return {
      recommendedPrice: 0,
      confidence: 0.5,
      reasoning: response,
      alternatives: [],
    }
  }
}

/**
 * Parse AI response into revenue forecast
 */
function parseForecastResponse(response: string): RevenueForecast {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback
    return {
      predictedRevenue: 0,
      confidence: 0.5,
      factors: [],
      dailyPredictions: [],
    }
  } catch {
    return {
      predictedRevenue: 0,
      confidence: 0.5,
      factors: response,
      dailyPredictions: [],
    }
  }
}
