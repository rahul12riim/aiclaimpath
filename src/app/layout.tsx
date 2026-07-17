// src/app/layout.tsx
import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AIWorkforce — File Unemployment the Easy Way',
  description: 'AI-powered guide to filing unemployment insurance in all 50 states. Get personalized help, eligibility checks, and direct links to your state portal.',
  keywords: ['unemployment', 'unemployment insurance', 'file unemployment', 'unemployment help', 'AI unemployment guide'],
  openGraph: {
    title: 'AIWorkforce — File Unemployment the Easy Way',
    description: 'AI-powered unemployment filing guide for all 50 states. Free, private, no account needed.',
    type: 'website',
    url: 'https://aiworkforce.com',
  },
  twitter: { card: 'summary_large_image', title: 'AIWorkforce', description: 'File unemployment with AI guidance. Free, private, fast.' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
      <GoogleAnalytics gaId="G-RTPFY49N0F" />
    </html>
  )
}
