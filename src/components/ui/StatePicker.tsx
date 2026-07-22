'use client'
// src/components/ui/StatePicker.tsx
import { useState, useMemo } from 'react'
import { STATES, getState } from '@/lib/states-data'

interface Props {
  selected: string | null
  onSelect: (stateId: string) => void
  onStartChat: () => void
}

export default function StatePicker({ selected, onSelect, onStartChat }: Props) {
  const [query, setQuery] = useState('')
  const state = selected ? getState(selected) : null

  const filtered = useMemo(() => {
    if (!query.trim()) return STATES
    return STATES.filter(s =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.abbr.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* State list */}
      <div className="card overflow-hidden">
        <div className="bg-navy-900 px-6 py-5">
          <h3 className="text-white font-semibold text-base">Select your state</h3>
          <p className="text-white/50 text-sm mt-1">Benefits, deadlines & portal links</p>
        </div>
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search states..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5
                         text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none
                         focus:border-blue-400 transition-colors"
            />
          </div>
        </div>
        <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-100">
          {filtered.map(s => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`w-full flex items-center justify-between px-6 py-3.5 text-left transition-colors
                ${selected === s.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <div className={`text-sm font-medium ${selected === s.id ? 'text-blue-700' : 'text-navy-900'}`}>
                    {s.name}
                  </div>
                  <div className="text-xs text-gray-400">{s.agency}</div>
                </div>
              </div>
              <div className={`text-sm font-semibold ${selected === s.id ? 'text-blue-600' : 'text-mint-500'}`}>
                ${s.maxWeeklyBenefit}/wk
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">
              No states found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>

      {/* State detail */}
      <div>
        {state ? (
          <div className="space-y-5">
            {/* Header */}
            <div className="rounded-2xl overflow-hidden">
              <div className="bg-blue-600 px-6 py-5 text-white">
                <div className="text-sm text-blue-200 mb-1">{state.agencyFull}</div>
                <h3 className="font-serif text-3xl mb-4">{state.name}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { n: `$${state.maxWeeklyBenefit}`, l: 'Max/week' },
                    { n: `${state.maxDurationWeeks}wk`, l: 'Max duration' },
                    { n: `${state.processingWeeks}wk`, l: 'Processing' },
                  ].map(({ n, l }) => (
                    <div key={l} className="bg-white/10 rounded-xl py-3 text-center">
                      <div className="font-semibold text-lg">{n}</div>
                      <div className="text-xs text-blue-200 mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="card p-5">
              <h4 className="font-semibold text-sm text-gray-700 mb-3">What you&apos;ll need</h4>
              <div className="space-y-2">
                {state.requiredDocs.slice(0, 5).map(doc => (
                  <div key={doc} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded bg-mint-50 border border-mint-300 flex items-center justify-center text-mint-600 text-xs flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-sm text-gray-600">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key rule */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <span className="text-xl flex-shrink-0">⏰</span>
              <p className="text-sm text-amber-800">
                <strong>File within {state.filingDeadlineDays} days</strong> of your last day of work — missing this deadline can delay or reduce your benefits.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onStartChat}
                className="btn-primary justify-center py-4 text-base"
                style={{ background: '#0EA572' }}
              >
                Start my application prep →
              </button>
              <a
                href={state.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-gray-600 border border-gray-200
                           rounded-xl py-3 hover:bg-gray-50 transition-colors"
              >
                Go directly to {state.agency} portal ↗
              </a>
            </div>
          </div>
        ) : (
          <div className="card p-10 text-center text-gray-400">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="text-base font-medium text-gray-500">Select a state to see details</p>
            <p className="text-sm mt-1">Benefit amounts, deadlines, and what to gather</p>
          </div>
        )}
      </div>
    </div>
  )
}
