import type { Book, SalesData } from '@/types'

/**
 * AI Prompt Templates
 * 
 * Centralized prompt templates for AI operations.
 * All prompts are designed to work with DeepSeek V3.
 */

/**
 * System prompts for different AI tasks
 */
export const SYSTEM_PROMPTS = {
  INSIGHTS_ANALYST: `You are an expert book publishing analyst specializing in indie author sales data. 
Your role is to analyze sales patterns, identify trends, and provide actionable insights.
Always be specific with numbers and percentages. Focus on actionable recommendations.
When analyzing data, consider seasonality, platform differences, and genre trends.`,

  PRICING_ADVISOR: `You are a pricing strategy expert for self-published books.
Your role is to recommend optimal pricing based on market data, competitor analysis, and sales history.
Consider factors like: genre norms, page count, series position, author platform size, and market conditions.
Always explain your reasoning and provide confidence levels.`,

  FORECASTER: `You are a revenue forecasting specialist for indie publishers.
Your role is to predict future sales based on historical patterns, trends, and external factors.
Be realistic in your predictions and always provide confidence intervals.
Consider: seasonality, launch effects, marketing campaigns, and market trends.`,

  GENERAL: `You are AuthorStack AI, a helpful assistant for indie authors.
You help with sales analysis, marketing strategies, and publishing decisions.
Be friendly but professional. Always back up advice with data when available.`,
}

/**
 * Generate insights prompt
 */
export function generateInsights(salesData: SalesData[], books: Book[]): string {
  const salesSummary = summarizeSalesData(salesData)
  const booksSummary = books.map(b => `- ${b.title} (${b.genres?.join(', ') || 'No genre'})`).join('\n')

  return `${SYSTEM_PROMPTS.INSIGHTS_ANALYST}

Analyze the following sales data and provide 3-5 actionable insights:

BOOKS:
${booksSummary}

SALES SUMMARY:
${salesSummary}

Respond with a JSON array of insights:
[
  {
    "id": "unique-id",
    "type": "trend|opportunity|warning|recommendation",
    "title": "Brief title",
    "description": "Detailed description with specific numbers",
    "confidence": 0.0-1.0,
    "action": "Specific action to take"
  }
]`
}

/**
 * Generate pricing recommendation prompt
 */
export function generatePricingRecommendation(
  book: Book,
  competitorPrices: number[],
  salesHistory: SalesData[]
): string {
  const avgCompetitorPrice = competitorPrices.length > 0
    ? (competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length).toFixed(2)
    : 'N/A'

  const salesSummary = summarizeSalesData(salesHistory)

  return `${SYSTEM_PROMPTS.PRICING_ADVISOR}

Recommend optimal pricing for this book:

BOOK:
- Title: ${book.title}
- Author: ${book.author}
- Genres: ${book.genres?.join(', ') || 'Not specified'}
- Current platforms: ${book.platforms?.join(', ') || 'Not specified'}

COMPETITOR PRICING:
- Average: $${avgCompetitorPrice}
- Range: $${Math.min(...competitorPrices).toFixed(2)} - $${Math.max(...competitorPrices).toFixed(2)}
- Sample prices: ${competitorPrices.slice(0, 5).map(p => `$${p.toFixed(2)}`).join(', ')}

SALES HISTORY:
${salesSummary}

Respond with JSON:
{
  "recommendedPrice": 0.00,
  "confidence": 0.0-1.0,
  "reasoning": "Explanation of recommendation",
  "alternatives": [
    { "price": 0.00, "scenario": "description" }
  ],
  "factors": ["factor1", "factor2"]
}`
}

/**
 * Generate forecast prompt
 */
export function generateForecast(salesHistory: SalesData[], daysToForecast: number): string {
  const salesSummary = summarizeSalesData(salesHistory)
  const trends = analyzeTrends(salesHistory)

  return `${SYSTEM_PROMPTS.FORECASTER}

Generate a ${daysToForecast}-day revenue forecast based on this data:

HISTORICAL DATA:
${salesSummary}

IDENTIFIED TRENDS:
${trends}

Respond with JSON:
{
  "predictedRevenue": 0.00,
  "confidence": 0.0-1.0,
  "factors": ["key factor 1", "key factor 2"],
  "risks": ["potential risk 1"],
  "dailyPredictions": [
    { "date": "YYYY-MM-DD", "revenue": 0.00, "confidence": 0.0-1.0 }
  ]
}`
}

/**
 * Helper: Summarize sales data for prompts
 */
function summarizeSalesData(data: SalesData[]): string {
  if (data.length === 0) {
    return 'No sales data available.'
  }

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
  const totalUnits = data.reduce((sum, d) => sum + d.units, 0)
  const platforms = [...new Set(data.map(d => d.platform))]
  
  const dateRange = data.length > 0
    ? `${data[data.length - 1].date} to ${data[0].date}`
    : 'N/A'

  // Calculate by platform
  const byPlatform = platforms.map(platform => {
    const platformData = data.filter(d => d.platform === platform)
    const revenue = platformData.reduce((sum, d) => sum + d.revenue, 0)
    const units = platformData.reduce((sum, d) => sum + d.units, 0)
    return `  - ${platform}: $${revenue.toFixed(2)} (${units} units)`
  }).join('\n')

  return `
- Date Range: ${dateRange}
- Total Revenue: $${totalRevenue.toFixed(2)}
- Total Units: ${totalUnits}
- Days of Data: ${data.length}
- Avg Daily Revenue: $${(totalRevenue / data.length).toFixed(2)}

By Platform:
${byPlatform}`
}

/**
 * Helper: Analyze trends in sales data
 */
function analyzeTrends(data: SalesData[]): string {
  if (data.length < 7) {
    return 'Insufficient data for trend analysis (need at least 7 days).'
  }

  // Simple trend calculation
  const recentWeek = data.slice(0, 7)
  const previousWeek = data.slice(7, 14)

  const recentRevenue = recentWeek.reduce((sum, d) => sum + d.revenue, 0)
  const previousRevenue = previousWeek.reduce((sum, d) => sum + d.revenue, 0)

  const trend = previousRevenue > 0
    ? ((recentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
    : 'N/A'

  return `
- Week-over-week change: ${trend}%
- Recent week revenue: $${recentRevenue.toFixed(2)}
- Previous week revenue: $${previousRevenue.toFixed(2)}`
}

/**
 * Export all prompts
 */
export const PROMPTS = {
  generateInsights,
  generatePricingRecommendation,
  generateForecast,
  SYSTEM_PROMPTS,
}

export default PROMPTS
