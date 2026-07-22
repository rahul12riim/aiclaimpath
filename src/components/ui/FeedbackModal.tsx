'use client'
// src/components/ui/FeedbackModal.tsx
import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { MessageSquare, X, CheckCircle2 } from 'lucide-react'

const DEPARTMENTS = [
  'General',
  'Technical Support',
  'Claims Assistance',
  'Accessibility',
  'Billing',
  'Other',
] as const

type Department = (typeof DEPARTMENTS)[number]
type Status = 'idle' | 'sending' | 'done' | 'error'
type FormFields = 'name' | 'email' | 'department' | 'message'
type Errors = Partial<Record<FormFields, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputCls =
  'w-full rounded-xl border border-gray-200 px-4 py-2.5 text-navy-900 placeholder-gray-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-mint-400 transition-colors'

const errorInputCls = ' border-red-400'

interface FormState {
  name: string
  email: string
  department: Department | ''
  message: string
}

const INITIAL_FORM: FormState = { name: '', email: '', department: '', message: '' }

export default function FeedbackModal() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<Errors>({})
  const [globalError, setGlobalError] = useState<string | null>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Focus first field when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 50)
    }
  }, [open])

  function reset() {
    setStatus('idle')
    setForm(INITIAL_FORM)
    setErrors({})
    setGlobalError(null)
  }

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setTimeout(reset, 200)
  }

  function validate(): boolean {
    const e: Errors = {}
    if (!form.name.trim()) e.name = 'Please enter your name.'
    if (!form.email.trim()) e.email = 'Please enter your email.'
    else if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.department) e.department = 'Please select a department.'
    if (!form.message.trim()) e.message = 'Please share your feedback.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit() {
    if (!validate()) return
    setStatus('sending')
    setGlobalError(null)

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          department: form.department,
          message: form.message.trim(),
        }),
      })

      const data = (await res.json()) as { success?: boolean; error?: string }

      if (!res.ok) {
        setGlobalError(data.error ?? 'Could not submit — please try again.')
        setStatus('error')
        return
      }

      setStatus('done')
    } catch {
      setGlobalError('Network error — please check your connection and try again.')
      setStatus('error')
    }
  }

  function setField<K extends keyof FormState>(k: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [k]: value }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
    if (globalError) setGlobalError(null)
  }

  const isSubmitting = status === 'sending'

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button
          className="card group inline-flex items-center gap-3 p-4 text-left shadow-sm transition-all
                     duration-200 hover:-translate-y-0.5 hover:border-mint-300 hover:shadow-md
                     focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2"
          aria-haspopup="dialog"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-50 text-mint-500
                           transition-colors group-hover:bg-mint-500 group-hover:text-white">
            <MessageSquare size={20} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-navy-900">Share feedback</span>
            <span className="block text-xs text-gray-500">Tell us how we can improve</span>
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-900/50 backdrop-blur-sm" />
        <Dialog.Content
          className="card fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md
                     -translate-x-1/2 -translate-y-1/2 p-6 shadow-xl focus:outline-none sm:p-7"
          aria-modal="true"
        >
          <Dialog.Close
            aria-label="Close feedback form"
            className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors
                       hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2
                       focus:ring-mint-400"
          >
            <X size={20} aria-hidden="true" />
          </Dialog.Close>

          {status === 'done' ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto text-mint-500" size={48} aria-hidden="true" />
              <Dialog.Title className="mt-4 font-serif text-2xl text-navy-900">
                Thank you!
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-gray-500">
                Your feedback has been received. We read every message.
              </Dialog.Description>
              <button
                onClick={() => onOpenChange(false)}
                className="btn-primary mt-6 justify-center"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <Dialog.Title className="font-serif text-2xl text-navy-900">
                Share your feedback
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-gray-500">
                We&apos;d love to hear what&apos;s working and what isn&apos;t.
              </Dialog.Description>

              {globalError && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
                >
                  {globalError}
                </div>
              )}

              <div className="mt-5 space-y-4">
                <Field id="fb-name" label="Name" error={errors.name}>
                  <input
                    id="fb-name"
                    ref={firstInputRef}
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="Your name"
                    className={inputCls + (errors.name ? errorInputCls : '')}
                    aria-describedby={errors.name ? 'fb-name-error' : undefined}
                    aria-invalid={!!errors.name}
                    maxLength={100}
                    autoComplete="name"
                  />
                </Field>

                <Field id="fb-email" label="Email" error={errors.email}>
                  <input
                    id="fb-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls + (errors.email ? errorInputCls : '')}
                    aria-describedby={errors.email ? 'fb-email-error' : undefined}
                    aria-invalid={!!errors.email}
                    maxLength={254}
                    autoComplete="email"
                  />
                </Field>

                <Field id="fb-department" label="Department" error={errors.department}>
                  <select
                    id="fb-department"
                    value={form.department}
                    onChange={(e) => setField('department', e.target.value as Department | '')}
                    className={inputCls + (errors.department ? errorInputCls : '')}
                    aria-describedby={errors.department ? 'fb-department-error' : undefined}
                    aria-invalid={!!errors.department}
                  >
                    <option value="" disabled>
                      Select a department…
                    </option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="fb-message" label="Feedback" error={errors.message}>
                  <textarea
                    id="fb-message"
                    value={form.message}
                    onChange={(e) => setField('message', e.target.value)}
                    rows={4}
                    maxLength={2000}
                    placeholder="What's on your mind?"
                    className={inputCls + ' resize-none' + (errors.message ? errorInputCls : '')}
                    aria-describedby={errors.message ? 'fb-message-error' : undefined}
                    aria-invalid={!!errors.message}
                  />
                  <span className="mt-1 block text-right text-xs text-gray-400">
                    {form.message.length}/2000
                  </span>
                </Field>

                <button
                  type="button"
                  onClick={submit}
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                        aria-hidden="true"
                      />
                      Sending…
                    </>
                  ) : (
                    'Send feedback'
                  )}
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
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy-900">
        {label}
      </label>
      {children}
      {error && (
        <span id={`${id}-error`} role="alert" className="mt-1 block text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  )
}
