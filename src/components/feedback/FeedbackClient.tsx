'use client'
// src/components/feedback/FeedbackClient.tsx
import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

type Feedback = {
  id: string
  name: string | null
  organisation: string | null
  message: string
  created_at: string
}

/** Returns a Supabase client only when env vars are present, otherwise null. */
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  const { createClient } = require('@supabase/supabase-js') as typeof import('@supabase/supabase-js')
  return createClient(url, key)
}

type FetchState =
  | { status: 'loading' }
  | { status: 'done'; list: Feedback[]; error: string | null }

export default function FeedbackClient() {
  const [supabase] = useState(() => getSupabaseClient())
  const [fetchState, setFetchState] = useState<FetchState>({ status: 'loading' })
  const [form, setForm] = useState({ name: '', organisation: '', message: '' })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)

  const refreshList = useCallback(() => setRefreshTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false

    if (!supabase) {
      Promise.resolve().then(() => {
        if (!cancelled) setFetchState({ status: 'done', list: [], error: null })
      })
      return () => {
        cancelled = true
      }
    }

    const query = supabase
      .from('feedback')
      .select('id, name, organisation, message, created_at')
      .order('created_at', { ascending: false })
      .limit(100)

    Promise.resolve(query)
      .then(({ data, error: sbError }: { data: Feedback[] | null; error: { message: string } | null }) => {
        if (cancelled) return
        if (sbError) {
          console.error('Supabase error:', sbError)
          setFetchState({ status: 'done', list: [], error: 'Could not load feedback.' })
        } else {
          setFetchState({ status: 'done', list: data ?? [], error: null })
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return
        console.error('Load error:', err)
        setFetchState({ status: 'done', list: [], error: 'Failed to load feedback.' })
      })

    return () => {
      cancelled = true
    }
  }, [supabase, refreshTick])

  async function submit() {
    setSubmitError(null)
    if (!form.message.trim()) return setSubmitError('Please write your feedback.')
    if (!supabase) return setSubmitError('Feedback submission is not available right now.')
    setSubmitStatus('sending')
    const { error: sbError } = await supabase.from('feedback').insert({
      name: form.name.trim() || null,
      organisation: form.organisation.trim() || null,
      message: form.message.trim(),
    })
    if (sbError) {
      console.error('Submit error:', sbError)
      setSubmitError('Could not submit — please try again.')
      setSubmitStatus('idle')
      return
    }
    setForm({ name: '', organisation: '', message: '' })
    setSubmitStatus('done')
    refreshList()
    setTimeout(() => setSubmitStatus('idle'), 3000)
  }

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value })

  const loading = fetchState.status === 'loading'
  const list = fetchState.status === 'done' ? fetchState.list : []
  const loadError = fetchState.status === 'done' ? fetchState.error : null

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-navy-900 pt-28 pb-20 px-6 text-center">
        <p className="section-label mb-3" style={{ color: '#0EA572' }}>Your voice</p>
        <h1 className="font-serif text-4xl lg:text-5xl text-white mb-4">Share your feedback</h1>
        <p className="text-white/60 max-w-lg mx-auto">
          Tell us how AIClaimPath helped, or what we can do better.
        </p>
      </section>

      <section className="px-6 -mt-12">
        <div className="max-w-2xl mx-auto card p-6 sm:p-8 shadow-xl space-y-4">
          {submitStatus === 'done' && (
            <div className="rounded-xl bg-mint-50 text-mint-700 px-4 py-3 text-sm">
              Thanks! Your feedback is now live below.
            </div>
          )}
          {!supabase && (
            <div className="rounded-xl bg-amber-50 text-amber-700 px-4 py-3 text-sm">
              Feedback submission is temporarily unavailable. Please check back later.
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={set('name')}
              placeholder="Name"
              disabled={!supabase}
              className="rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-mint-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <input
              value={form.organisation}
              onChange={set('organisation')}
              placeholder="Organisation"
              disabled={!supabase}
              className="rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-mint-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <textarea
            value={form.message}
            onChange={set('message')}
            rows={4}
            maxLength={1000}
            placeholder="Your feedback"
            disabled={!supabase}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-mint-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {submitError && <p className="text-sm text-red-500">{submitError}</p>}
          <button
            type="button"
            onClick={submit}
            disabled={submitStatus === 'sending' || !supabase}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {submitStatus === 'sending' ? 'Sending…' : 'Submit feedback'}
          </button>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl text-navy-900 mb-6">What people are saying</h2>
          {loadError && (
            <p className="text-red-500 text-center py-4 text-sm bg-red-50 rounded-lg p-3">{loadError}</p>
          )}
          {loading ? (
            <p className="text-gray-400 text-center py-12">Loading…</p>
          ) : list.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No feedback yet — be the first!</p>
          ) : (
            <div className="space-y-4">
              {list.map((f) => (
                <div key={f.id} className="card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center text-sm font-semibold">
                      {(f.name?.trim()?.[0] ?? '?').toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{f.name?.trim() || 'Anonymous'}</p>
                      {f.organisation?.trim() && (
                        <p className="text-xs text-gray-400">{f.organisation}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{f.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
