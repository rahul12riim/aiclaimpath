'use client'
// src/components/ui/EligibilityChecker.tsx
import { useState } from 'react'
import { STATES } from '@/lib/states-data'

interface Props { preselectedState?: string | null }

type Verdict = 'likely' | 'possible' | 'unlikely' | 'more_info_needed'

interface Result {
  verdict: Verdict
  confidence: number
  reason: string
  nextSteps: string[]
  estimatedWeeklyBenefit?: string
}

const VERDICT_CONFIG: Record<Verdict, { icon: string; label: string; classes: string }> = {
  likely: { icon: '✅', label: 'You very likely qualify!', classes: 'bg-mint-50 border-mint-200 text-mint-800' },
  possible: { icon: '⚠️', label: 'You may qualify — let\'s dig deeper', classes: 'bg-amber-50 border-amber-200 text-amber-800' },
  unlikely: { icon: '❌', label: 'This situation may not qualify', classes: 'bg-red-50 border-red-200 text-red-800' },
  more_info_needed: { icon: '🤔', label: 'Needs more context — file anyway', classes: 'bg-blue-50 border-blue-200 text-blue-800' },
}

export default function EligibilityChecker({ preselectedState }: Props) {
  const [stateId, setStateId] = useState(preselectedState ?? '')
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState('')
  const [available, setAvailable] = useState(true)
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)

  const check = async () => {
    if (!stateId || !reason || !duration) return
    setLoading(true)
    try {
      const res = await fetch('/api/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stateId,
          separationReason: reason,
          employmentDuration: duration,
          availableForWork: available,
        }),
      })
      setResult(await res.json())
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const config = result ? VERDICT_CONFIG[result.verdict] : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      {/* Form */}
      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
        <h3 className="font-semibold text-lg text-navy-900 mb-1">Quick eligibility check</h3>
        <p className="text-sm text-gray-400 mb-6">Takes 60 seconds · No personal info required</p>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Your state</label>
            <select
              value={stateId}
              onChange={e => setStateId(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm
                         text-gray-900 focus:outline-none focus:border-blue-400 transition-colors appearance-none"
            >
              <option value="">Select your state...</option>
              {STATES.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Why did you leave?</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm
                         text-gray-900 focus:outline-none focus:border-blue-400 transition-colors appearance-none"
            >
              <option value="">Select the main reason...</option>
              <option value="layoff">I was laid off / let go</option>
              <option value="reduced_hours">My hours were significantly reduced</option>
              <option value="company_closed">My company closed</option>
              <option value="contract_ended">My contract / seasonal work ended</option>
              <option value="quit_good_cause">I quit for a serious reason</option>
              <option value="fired">I was fired</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">How long at your last job?</label>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm
                         text-gray-900 focus:outline-none focus:border-blue-400 transition-colors appearance-none"
            >
              <option value="">Select duration...</option>
              <option value="less_than_3_months">Less than 3 months</option>
              <option value="3_to_12_months">3–12 months</option>
              <option value="over_12_months">More than 1 year</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="available"
              checked={available}
              onChange={e => setAvailable(e.target.checked)}
              className="w-4 h-4 accent-mint-500"
            />
            <label htmlFor="available" className="text-sm text-gray-700">
              I&apos;m available and actively looking for work
            </label>
          </div>

          <button
            onClick={check}
            disabled={loading || !stateId || !reason || !duration}
            className="w-full py-4 bg-mint-500 text-white font-semibold rounded-xl text-base
                       hover:bg-mint-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking...' : 'Check my eligibility →'}
          </button>
        </div>
      </div>

      {/* Result or info */}
      <div>
        {result && config ? (
          <div className={`rounded-3xl border-2 p-8 ${config.classes}`}>
            <div className="text-4xl mb-4">{config.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{config.label}</h3>
            <p className="text-sm leading-relaxed mb-5 opacity-80">{result.reason}</p>
            {result.estimatedWeeklyBenefit && (
              <div className="bg-white/50 rounded-xl p-4 mb-5">
                <div className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">Estimated weekly benefit</div>
                <div className="text-2xl font-semibold">{result.estimatedWeeklyBenefit}</div>
              </div>
            )}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-3">Next steps</div>
              <ol className="space-y-2">
                {result.nextSteps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-white/40 flex-shrink-0 flex items-center justify-center text-xs font-semibold">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <button
              onClick={() => setResult(null)}
              className="mt-6 text-xs opacity-50 hover:opacity-100 transition-opacity"
            >
              ← Check again
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {[
              { icon: '🔒', title: 'Private & secure', text: 'We never store or transmit SSNs, names, or personal data. This check runs without any identifying information.' },
              { icon: '⚡', title: 'Instant result', text: 'AI analyzes your situation against your state\'s current rules and gives a plain-language verdict in seconds.' },
              { icon: '📋', title: 'Personalized next steps', text: 'If you qualify, you get a custom checklist of exactly what to gather before filing — specific to your state.' },
            ].map(({ icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                <div>
                  <div className="font-semibold text-sm text-navy-900 mb-1">{title}</div>
                  <div className="text-sm text-gray-500 leading-relaxed">{text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
