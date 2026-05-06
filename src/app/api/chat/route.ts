// src/app/api/chat/route.ts
// Streaming chat endpoint. Rate-limited, PII-scrubbed, RAG-grounded.
// This is the most critical endpoint — every user interaction flows through here.

import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { z } from 'zod'
import { buildSystemPrompt, prepareAgentContext } from '@/lib/agents/unemployment-agent'
import { scrubPII } from '@/lib/utils/pii-scrubber'

// Rate limiter: 10 requests per minute per session
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: 'aiworkforce:chat',
})

const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().max(2000), // prevent prompt injection via long inputs
    })
  ).max(50), // cap conversation history
  stateId: z.string().length(2).toUpperCase(),
  sessionId: z.string().uuid(),
})

export async function POST(req: Request) {
  try {
    // 1. Parse and validate input
    const body = await req.json()
    const parsed = ChatRequestSchema.safeParse(body)

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { messages, stateId, sessionId } = parsed.data

    // 2. Rate limiting by session
    const { success, limit, remaining } = await ratelimit.limit(sessionId)
    if (!success) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
        },
      })
    }

    // 3. Scrub PII from ALL message content before it touches Claude
    const cleanMessages = messages.map(m => ({
      ...m,
      content: scrubPII(m.content),
    }))

    // 4. Retrieve RAG context (grounded knowledge)
    const ragContext = await prepareAgentContext({
      messages: cleanMessages,
      stateId,
      sessionId,
    })

    // 5. Build system prompt with state context + RAG
    const systemPrompt = buildSystemPrompt(stateId) + ragContext

    // 6. Stream response from Claude
    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      messages: cleanMessages,
      maxTokens: 1024,
      temperature: 0.3, // lower temp = more consistent, accurate answers
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('[Chat API] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export const runtime = 'edge'
export const dynamic = 'force-dynamic'
