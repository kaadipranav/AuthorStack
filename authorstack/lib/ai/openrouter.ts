import axios from 'axios'
import { AppError } from '@/lib/utils/errors'
import { logger } from '@/lib/utils/logger'

/**
 * OpenRouter Client
 * 
 * Primary AI provider using DeepSeek V3 (~$0.14 per 1M tokens).
 * Backup: Azure OpenAI if OpenRouter is unavailable.
 * 
 * Strategy:
 * - Use DeepSeek V3 for cost efficiency
 * - Fall back to GPT-4 for complex tasks
 * - Stream responses for better UX
 */

if (!process.env.OPENROUTER_API_KEY) {
  console.warn('OPENROUTER_API_KEY not set - AI features will be disabled')
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1'
const DEFAULT_MODEL = 'deepseek/deepseek-chat' // DeepSeek V3
const FALLBACK_MODEL = 'openai/gpt-4-turbo-preview'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatOptions {
  model?: string
  maxTokens?: number
  temperature?: number
  stream?: boolean
}

interface ChatResponse {
  id: string
  choices: {
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * OpenRouter client class
 */
class OpenRouterClient {
  private apiKey: string | undefined
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY
    this.baseUrl = OPENROUTER_API_URL
  }

  /**
   * Check if client is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Send a chat completion request
   */
  async chat(
    prompt: string | ChatMessage[],
    options: ChatOptions = {}
  ): Promise<string> {
    if (!this.apiKey) {
      throw new AppError('AI service not configured', 503, 'AI_NOT_CONFIGURED')
    }

    const {
      model = DEFAULT_MODEL,
      maxTokens = 2000,
      temperature = 0.7,
    } = options

    const messages: ChatMessage[] = Array.isArray(prompt)
      ? prompt
      : [{ role: 'user', content: prompt }]

    const startTime = Date.now()

    try {
      const response = await axios.post<ChatResponse>(
        `${this.baseUrl}/chat/completions`,
        {
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'AuthorStack',
          },
        }
      )

      const duration = Date.now() - startTime
      logger.external('openrouter', 'chat', duration, {
        model,
        tokens: response.data.usage?.total_tokens,
      })

      return response.data.choices[0]?.message?.content || ''
    } catch (error) {
      const duration = Date.now() - startTime
      logger.error('OpenRouter API error', error as Error, { model, duration })

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new AppError('AI rate limit exceeded', 429, 'AI_RATE_LIMITED')
        }
        if (error.response?.status === 401) {
          throw new AppError('AI service authentication failed', 500, 'AI_AUTH_FAILED')
        }
      }

      throw new AppError('AI service error', 500, 'AI_ERROR')
    }
  }

  /**
   * Chat with structured JSON output
   */
  async chatJSON<T>(
    prompt: string | ChatMessage[],
    options: ChatOptions = {}
  ): Promise<T> {
    const systemPrompt: ChatMessage = {
      role: 'system',
      content: 'You are a helpful assistant. Always respond with valid JSON only, no additional text or markdown.',
    }

    const messages: ChatMessage[] = Array.isArray(prompt)
      ? [systemPrompt, ...prompt]
      : [systemPrompt, { role: 'user', content: prompt }]

    const response = await this.chat(messages, {
      ...options,
      temperature: 0.3, // Lower temperature for structured output
    })

    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as T
      }
      return JSON.parse(response) as T
    } catch {
      logger.warn('Failed to parse AI JSON response', { response: response.substring(0, 200) })
      throw new AppError('Invalid AI response format', 500, 'AI_PARSE_ERROR')
    }
  }

  /**
   * Get available models
   */
  async getModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })
      return response.data.data.map((m: { id: string }) => m.id)
    } catch {
      return [DEFAULT_MODEL, FALLBACK_MODEL]
    }
  }
}

/**
 * Singleton instance
 */
export const openrouter = new OpenRouterClient()

/**
 * Helper to create chat messages
 */
export function createMessages(
  systemPrompt: string,
  userPrompt: string
): ChatMessage[] {
  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]
}

export default openrouter
