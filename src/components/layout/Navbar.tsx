'use client'
// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', organisation: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value })

  async function submit() {
    setError(null)
    if (!form.message.trim()) return setError('Please write your feedback.')
    setStatus('sending')
    const { error: sbError } = await supabase.from('feedback').insert({
      name: form.name.trim() || null,
      organisation: form.organisation.trim() || null,
      message: form.message.trim(),
    })
    if (sbError) {
      setError('Could not submit — please try again.')
      setStatus('idle')
      return
    }
    setForm({ name: '', organisation: '', message: '' })
    setStatus('done')
    setTimeout(() => {
      setStatus('idle')
      setOpen(false)
    }, 2000)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 h-16 flex items-center justify-between
        transition-all duration-300 ${scrolled ? 'bg-navy-900/95 backdrop-blur-lg shadow-xl' : 'bg-transparent'}`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <span className="w-2 h-2 rounded-full bg-mint-500 group-hover:scale-125 transition-transform" />
        <span className="font-serif text-xl text-white">AIWorkforce</span>
      </Link>

      {/* Nav links - desktop */}
      <div className="hidden md:flex items-center gap-8">
        {[
          { href: '#states', label: 'By state' },
          { href: '#chat', label: 'AI guide' },
          { href: '#eligibility', label: 'Check eligibility' },
          { href: '#features', label: 'Features' },
        ].map(({ href, label }) => (
          <a key={href} href={href} className="nav-link text-sm">
            {label}
          </a>
        ))}
      </div>

      {/* Right side: Feedback + CTA */}
      <div className="flex items-center gap-3">
        <Dialog.Root open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setStatus('idle'); setError(null) } }}>
          <Dialog.Trigger asChild>
            <button
              className="text-sm font-medium text-white/75 hover:text-white border border-white/20 px-4 py-2 rounded-xl
                         hover:border-white/40 transition-colors duration-200"
            >
              Feedback
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2
                         bg-white rounded-2xl shadow-2xl p-6 space-y-4"
            >
              <Dialog.Title className="font-serif text-xl text-navy-900">Share your feedback</Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500">
                Tell us how AIClaimPath helped, or what we can do better.
              </Dialog.Description>

              {status === 'done' ? (
                <div className="rounded-xl bg-mint-50 text-mint-700 px-4 py-3 text-sm text-center">
                  Thanks for your feedback! 🎉
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      value={form.name}
                      onChange={set('name')}
                      placeholder="Name (optional)"
                      className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint-400"
                    />
                    <input
                      value={form.organisation}
                      onChange={set('organisation')}
                      placeholder="Organisation (optional)"
                      className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint-400"
                    />
                  </div>
                  <textarea
                    value={form.message}
                    onChange={set('message')}
                    rows={4}
                    maxLength={1000}
                    placeholder="Your feedback"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-mint-400"
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={submit}
                      disabled={status === 'sending'}
                      className="btn-primary flex-1 justify-center disabled:opacity-60"
                    >
                      {status === 'sending' ? 'Sending…' : 'Submit'}
                    </button>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                  </div>
                </>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* CTA */}
        <a
          href="#eligibility"
          className="text-sm font-semibold text-white bg-mint-500 px-5 py-2 rounded-xl
                     hover:bg-mint-600 transition-colors hover:-translate-y-0.5 transform duration-200"
        >
          Check eligibility →
        </a>
      </div>
    </nav>
  )
}
