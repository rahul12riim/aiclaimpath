'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

type Feedback = {
  id: string
  name: string | null
  organisation: string | null
  message: string
  created_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default function FeedbackPage() {
  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return null
    }

    return createClient(supabaseUrl, supabaseAnonKey)
  }, [])
  const [list, setList] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', organisation: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!supabase) {
      setLoadError('Feedback is temporarily unavailable.')
      setLoading(false)
      return
    }

    try {
      setLoadError(null)
      const { data, error } = await supabase
        .from('feedback')
        .select('id, name, organisation, message, created_at')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Supabase error:', error)
        setLoadError('Could not load feedback. Please check console.')
        setList([])
      } else {
        setList(data ?? [])
      }
    } catch (err) {
      console.error('Load error:', err)
      setLoadError('Failed to load feedback')
      setList([])
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    load()
  }, [load])

  async function submit() {
    setError(null)

    if (!form.message.trim()) {
      setError('Please write your feedback.')
      return
    }

    if (!supabase) {
      setError('Feedback is temporarily unavailable.')
      return
    }

    setStatus('sending')
    const { error } = await supabase.from('feedback').insert({
      name: form.name.trim() || null,
      organisation: form.organisation.trim() || null,
      message: form.message.trim(),
    })

    if (error) {
      console.error('Submit error:', error)
      setError('Could not submit — please try again.')
      setStatus('idle')
      return
    }

    setForm({ name: '', organisation: '', message: '' })
    setStatus('done')
    load()
    setTimeout(() => setStatus('idle'), 3000)
  }

  const set =
    (k: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value })

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
          {status === 'done' && (
            <div className="rounded-xl bg-mint-50 text-mint-700 px-4 py-3 text-sm">
              Thanks! Your feedback is now live below.
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={form.name}
              onChange={set('name')}
              placeholder="Name"
              className="rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-mint-400"
            />
            <input
              value={form.organisation}
              onChange={set('organisation')}
              placeholder="Organisation"
              className="rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-mint-400"
            />
          </div>
          <textarea
            value={form.message}
            onChange={set('message')}
            rows={4}
            maxLength={1000}
            placeholder="Your feedback"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-mint-400"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="button"
            onClick={submit}
            disabled={status === 'sending'}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Submit feedback'}
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
