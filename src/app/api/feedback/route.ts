// src/app/api/feedback/route.ts
// Feedback submission and listing endpoint.
// Server-side only — uses SUPABASE_SERVICE_ROLE_KEY (never exposed to client).

import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { NextRequest } from 'next/server'

const DEPARTMENTS = [
  'General',
  'Technical Support',
  'Claims Assistance',
  'Accessibility',
  'Billing',
  'Other',
] as const

const FeedbackSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).trim(),
  email: z
    .string()
    .email('Enter a valid email address')
    .max(254)
    .trim()
    .toLowerCase(),
  department: z.enum(DEPARTMENTS, { errorMap: () => ({ message: 'Select a valid department' }) }),
  message: z
    .string()
    .min(1, 'Feedback message is required')
    .max(2000)
    .trim(),
})

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase environment variables not configured')
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

// ── POST /api/feedback — submit feedback ─────────────────────────
export async function POST(req: NextRequest) {
  try {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const parsed = FeedbackSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]
      return Response.json({ error: firstError.message }, { status: 422 })
    }

    const supabase = getSupabase()
    const { error } = await supabase.from('feedback').insert({
      name: parsed.data.name,
      email: parsed.data.email,
      department: parsed.data.department,
      message: parsed.data.message,
    })

    if (error) {
      console.error('[Feedback API] Supabase insert error:', error)
      return Response.json(
        { error: 'Could not save feedback. Please try again.' },
        { status: 500 },
      )
    }

    return Response.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[Feedback API] Unexpected error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── GET /api/feedback — list all feedback (newest first) ─────────
export async function GET() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('feedback')
      .select('id, name, department, message, created_at')
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) {
      console.error('[Feedback API] Supabase select error:', error)
      return Response.json(
        { error: 'Could not load feedback. Please try again.' },
        { status: 500 },
      )
    }

    return Response.json({ feedback: data ?? [] })
  } catch (err) {
    console.error('[Feedback API] Unexpected error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
