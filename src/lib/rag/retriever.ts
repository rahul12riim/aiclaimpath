// src/lib/rag/retriever.ts
// Retrieves verified state unemployment rules from Pinecone vector DB.
// This is what makes the AI accurate — it answers from sources, not memory.

import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export interface RetrievedChunk {
  text: string
  source: string
  stateId: string
  topic: string
  score: number
  lastVerified: string
}

export async function retrieveKnowledge(
  query: string,
  stateId: string,
  topK: number = 5
): Promise<RetrievedChunk[]> {
  try {
    // 1. Embed the user query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    })
    const queryVector = embeddingResponse.data[0].embedding

    // 2. Search Pinecone filtered to user's state
    const index = pinecone.index(process.env.PINECONE_INDEX!)
    const results = await index.query({
      vector: queryVector,
      topK,
      filter: { stateId: stateId.toUpperCase() },
      includeMetadata: true,
    })

    // 3. Map to typed chunks
    return results.matches
      .filter(m => m.score && m.score > 0.7) // only high-confidence matches
      .map(m => ({
        text: String(m.metadata?.text ?? ''),
        source: String(m.metadata?.source ?? ''),
        stateId: String(m.metadata?.stateId ?? stateId),
        topic: String(m.metadata?.topic ?? 'general'),
        score: m.score ?? 0,
        lastVerified: String(m.metadata?.lastVerified ?? 'unknown'),
      }))
  } catch (error) {
    console.error('[RAG] Retrieval failed:', error)
    return [] // graceful fallback — agent will use built-in knowledge
  }
}

// Format retrieved chunks as context for Claude
export function formatContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return ''

  const formatted = chunks
    .map((c, i) => `[Source ${i + 1}: ${c.source} | Topic: ${c.topic} | Verified: ${c.lastVerified}]\n${c.text}`)
    .join('\n\n---\n\n')

  return `\n\n<verified_sources>\n${formatted}\n</verified_sources>`
}
