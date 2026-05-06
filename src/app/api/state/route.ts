// src/app/api/state/route.ts
import { getState } from '@/lib/states-data'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return Response.json({ error: 'State ID required' }, { status: 400 })

  const state = getState(id)
  if (!state) return Response.json({ error: 'State not found' }, { status: 404 })

  return Response.json(state)
}

export const runtime = 'edge'
