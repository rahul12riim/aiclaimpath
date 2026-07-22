'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function FeedbackModal({ open, onOpenChange }: Props) {
  const [form, setForm] = useState({ name: '', organisation: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setError(null)
    if (!form.message.trim()) {
      setError('Please write your feedback.')
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
  }

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value })

  function close() {
    if (status !== 'sending') {
      onOpenChange(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-navy-900/65" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[100] w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 sm:p-8 shadow-2xl focus:outline-none"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <Dialog.Title className="font-serif text-2xl text-navy-900">Feedback</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-gray-500">
                Share what worked and what we can improve.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={close}
                disabled={status === 'sending'}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60"
              >
                Close
              </button>
            </Dialog.Close>
          </div>

          {status === 'done' && (
            <div className="mb-4 rounded-xl bg-mint-50 px-4 py-3 text-sm text-mint-700">
              Thanks! Your feedback was submitted.
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
            className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-mint-400"
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <button
            type="button"
            onClick={submit}
            disabled={status === 'sending'}
            className="btn-primary mt-4 w-full justify-center disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Submit feedback'}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
