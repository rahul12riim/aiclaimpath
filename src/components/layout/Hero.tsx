'use client'
// src/components/layout/Hero.tsx
interface Props { onGetStarted: () => void }

export default function Hero({ onGetStarted }: Props) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16"
      style={{ background: 'linear-gradient(160deg, #0B1829 0%, #1A3A5C 50%, #0B1829 100%)' }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(14,165,114,0.15) 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl animate-fade-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-mint-500/10 border border-mint-500/25 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-mint-500 pulse-dot" />
          <span className="text-sm text-mint-400 font-medium">AI-powered · All 50 states · Always free</span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6">
          File unemployment<br />
          <em className="text-blue-400">the easy way</em>
        </h1>

        <p className="text-xl text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
          Answer a few questions. Get your personalized checklist. File with confidence — in under 10 minutes.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <button onClick={onGetStarted} className="btn-primary text-base px-8 py-4">
            Check my eligibility →
          </button>
          <a href="#features" className="btn-secondary text-base px-8 py-4">
            ▶ See how it works
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 divide-x divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-white/3">
          {[
            { n: '50', l: 'States covered' },
            { n: '94%', l: 'Completion rate' },
            { n: '< 10min', l: 'Time to ready' },
            { n: 'Free', l: 'Always' },
          ].map(({ n, l }) => (
            <div key={l} className="py-5 px-4 text-center">
              <div className="text-2xl font-semibold text-white">{n}</div>
              <div className="text-xs text-white/45 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <span className="text-white/30 text-xs">Scroll</span>
        <span className="text-white/30 text-lg">↓</span>
      </div>
    </section>
  )
}
