'use client'
// src/app/feedback/page.tsx — public feedback listing page (review style)
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import FeedbackModal from '@/components/ui/FeedbackModal'

interface FeedbackItem {
  id: string
  name: string
  department: string
  message: string
  created_at: string
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function InitialAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  const colors = [
    'bg-mint-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
  ]
  const color = colors[name.charCodeAt(0) % colors.length]

  return (
    <div
      className={`${color} flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white`}
      aria-hidden="true"
    >
      {initials || '?'}
    </div>
  )
}

function FeedbackCard({ item }: { item: FeedbackItem }) {
  return (
    <article className="card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <InitialAvatar name={item.name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-navy-900">{item.name}</span>
            <span className="inline-block rounded-full bg-mint-50 px-2.5 py-0.5 text-xs font-medium text-mint-600">
              {item.department}
            </span>
          </div>
          <time
            dateTime={item.created_at}
            className="mt-0.5 block text-xs text-gray-400"
          >
            {formatDate(item.created_at)}
          </time>
        </div>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
        {item.message}
      </p>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-3 w-1/4 rounded bg-gray-100" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-5/6 rounded bg-gray-100" />
        <div className="h-3 w-4/6 rounded bg-gray-100" />
      </div>
    </div>
  )
}

export default function FeedbackPage() {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/feedback')
        if (!res.ok) {
          const data = (await res.json()) as { error?: string }
          setError(data.error ?? 'Failed to load feedback.')
          return
        }
        const data = (await res.json()) as { feedback: FeedbackItem[] }
        setItems(data.feedback)
      } catch {
        setError('Network error — please check your connection.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#060F1A] px-6 py-5 shadow-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back home
          </Link>
          <div className="font-serif text-xl text-white">AIWorkforce</div>
          <FeedbackModal />
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#060F1A] px-6 pb-16 pt-8 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-mint-500/10 border border-mint-500/25 px-4 py-1.5">
            <MessageSquare size={14} className="text-mint-400" aria-hidden="true" />
            <span className="text-sm text-mint-400 font-medium">Community feedback</span>
          </div>
          <h1 className="font-serif text-4xl text-white mb-3">What our users say</h1>
          <p className="text-white/55 text-lg">
            Real feedback from people who used AIWorkforce to file their unemployment claims.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2" aria-busy="true" aria-label="Loading feedback">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center" role="alert">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mt-4 justify-center"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <MessageSquare size={40} className="mx-auto text-gray-300 mb-4" aria-hidden="true" />
            <h2 className="font-serif text-2xl text-navy-900 mb-2">No feedback yet</h2>
            <p className="text-gray-500 mb-6">Be the first to share your experience.</p>
            <FeedbackModal />
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <p className="mb-6 text-sm text-gray-500">
              {items.length} {items.length === 1 ? 'review' : 'reviews'} · sorted by newest first
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <FeedbackCard key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <FeedbackModal />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
