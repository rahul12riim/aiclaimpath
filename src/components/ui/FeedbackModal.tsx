'use client'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { MessageSquare, X, CheckCircle2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'sending' | 'done'
type Errors = Partial<Record<'name' | 'email' | 'message', string>>

const inputCls =
  'w-full rounded-xl border border-gray-200 px-4 py-2.5 text-navy-900 placeholder-gray-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-mint-400'

export default function FeedbackModal() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})

  function reset() {
    setStatus('idle')
    setForm({ name: '', email: '', message: '' })
    setErrors({})
  }

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setTimeout(reset, 200) // reset after close animation
  }

  function validate(): boolean {
    const e: Errors = {}
    if (!form.name.trim()) e.name = 'Please enter your name.'
    if (!form.email.trim()) e.email = 'Please enter your email.'
    else if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.message.trim()) e.message = 'Please share your feedback.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit() {
    if (!validate()) return
    setStatus('sending')
    const { error } = await supabase.from('feedback').insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    })
    if (error) {
      console.error('Feedback submit error:', error)
      setErrors({ message: 'Could not submit — please try again.' })
      setStatus('idle')
      return
    }
    setStatus('done')
  }

  const set =
    (k: keyof typeof form) =>
    (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: ev.target.value }))
      if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
    }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {/* ── Trigger box (place anywhere on the page) ── */}
      <Dialog.Trigger asChild>
        <button className="card group inline-flex items-center gap-3 p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-mint-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-50 text-mint-500 transition-colors group-hover:bg-mint-500 group-hover:text-white">
            <MessageSquare size={20} />
          </span>
          <span>
            <span className="block text-sm font-semibold text-navy-900">Share feedback</span>
            <span className="block text-xs text-gray-500">Tell us how we can improve</span>
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-900/50 backdrop-blur-sm data-[state=open]:animate-fade-up" />
        <Dialog.Content className="card fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 p-6 shadow-xl focus:outline-none sm:p-7">
          <Dialog.Close
            aria-label="Close"
            className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </Dialog.Close>

          {status === 'done' ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto text-mint-500" size={48} />
              <Dialog.Title className="mt-4 font-serif text-2xl text-navy-900">Thank you</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-gray-500">
                Your feedback has been received. We read every message.
              </Dialog.Description>
              <button onClick={() => onOpenChange(false)} className="btn-primary mt-6 justify-center">
                Done
              </button>
            </div>
          ) : (
            <>
              <Dialog.Title className="font-serif text-2xl text-navy-900">Share your feedback</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-gray-500">
                We&apos;d love to hear what&apos;s working and what isn&apos;t.
              </Dialog.Description>

              <div className="mt-5 space-y-4">
                <Field label="Name" error={errors.name}>
                  <input value={form.name} onChange={set('name')} placeholder="Your name" className={inputCls} />
                </Field>

                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </Field>

                <Field label="Feedback" error={errors.message}>
                  <textarea
                    value={form.message}
                    onChange={set('message')}
                    rows={4}
                    maxLength={1000}
                    placeholder="What's on your mind?"
                    className={inputCls + ' resize-none'}
                  />
                </Field>

                <button
                  type="button"
                  onClick={submit}
                  disabled={status === 'sending'}
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending…' : 'Send feedback'}
                </button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-900">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}
