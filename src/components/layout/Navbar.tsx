'use client'
// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Props = {
  onOpenFeedback?: () => void
}

export default function Navbar({ onOpenFeedback }: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

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
        {onOpenFeedback && (
          <button type="button" onClick={onOpenFeedback} className="nav-link text-sm">
            Feedback
          </button>
        )}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-2">
        {onOpenFeedback && (
          <button
            type="button"
            onClick={onOpenFeedback}
            className="text-sm font-semibold text-white border border-white/25 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            Feedback
          </button>
        )}
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
