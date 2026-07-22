'use client'
// src/components/ui/FeedbackModal.tsx
import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props {
  open: boolean
  onClose: () => void
}

export default function FeedbackModal({ open, onClose }: Props) {
  const [form, setForm] = useState({ name: '', organisation: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Focus first input when modal opens
  useEffect(() => {
    if (open) {
      setForm({ name: '', organisation: '', message: '' })
      setStatus('idle')
      setError(null)
      setTimeout(() => firstInputRef.current?.focus(), 50)
    }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const set =
    (k: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value })

  async function submit() {
    setError(null)
    if (!form.message.trim()) {
      setError('Please write your feedback.')
      return
    }
    setStatus('sending')
    const { error: dbError } = await supabase.from('feedback').insert({
      name: form.name.trim() || null,
      organisation: form.organisation.trim() || null,
      message: form.message.trim(),
    })
    if (dbError) {
      console.error('Submit error:', dbError)
      setError('Could not submit — please try again.')
      setStatus('idle')
      return
    }
    setForm({ name: '', organisation: '', message: '' })
    setStatus('done')
    setTimeout(() => {
      setStatus('idle')
      onClose()
    }, 2500)
  }

  return (
    /* Backdrop */
    <div
      role="presentation"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 sm:p-8 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 id="feedback-modal-title" className="font-serif text-xl text-navy-900">
            Share your feedback
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close feedback"
            className="text-gray-400 hover:text-gray-700 transition-colors rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-mint-400"
          >
            ✕
          </button>
        </div>

        {/* Success state */}
        {status === 'done' ? (
          <div className="rounded-xl bg-mint-50 text-mint-700 px-4 py-6 text-sm text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-semibold">Thanks for your feedback!</p>
            <p className="text-mint-600 mt-1">Closing in a moment…</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                ref={firstInputRef}
                value={form.name}
                onChange={set('name')}
                placeholder="Name (optional)"
                aria-label="Name"
                className="rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-mint-400 text-sm"
              />
              <input
                value={form.organisation}
                onChange={set('organisation')}
                placeholder="Organisation (optional)"
                aria-label="Organisation"
                className="rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-mint-400 text-sm"
              />
            </div>
            <textarea
              value={form.message}
              onChange={set('message')}
              rows={4}
              maxLength={1000}
              placeholder="Your feedback *"
              aria-label="Feedback message"
              aria-required="true"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-mint-400 text-sm"
            />
            {error && (
              <p role="alert" className="text-sm text-red-500">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={submit}
              disabled={status === 'sending'}
              className="w-full text-sm font-semibold text-white bg-mint-500 px-5 py-3 rounded-xl
                         hover:bg-mint-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2"
            >
              {status === 'sending' ? 'Sending…' : 'Submit feedback'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
