'use client'
// src/app/page.tsx
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/layout/Hero'
import StatePicker from '@/components/ui/StatePicker'
import EligibilityChecker from '@/components/ui/EligibilityChecker'
import ChatWindow from '@/components/chat/ChatWindow'
import FeatureGrid from '@/components/ui/FeatureGrid'
import Footer from '@/components/layout/Footer'
import FeedbackModal from '@/app/feedback/page'

// Stable session ID for rate limiting (not stored, not linked to identity)
const SESSION_ID = uuidv4()

export default function Home() {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)

  const handleStateSelect = (stateId: string) => {
    setSelectedState(stateId)
    setShowChat(false) // reset chat on state change
  }

  const handleStartChat = () => {
    if (selectedState) setShowChat(true)
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero onGetStarted={() => document.getElementById('states')?.scrollIntoView({ behavior: 'smooth' })} />

      {/* State Picker */}
      <section id="states" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Step 1</p>
            <h2 className="section-h2 mb-4">Select your state</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              We&apos;ll show your exact benefit amount, deadlines, and direct portal link.
            </p>
          </div>
          <StatePicker selected={selectedState} onSelect={handleStateSelect} onStartChat={handleStartChat} />
        </div>
      </section>

      {/* AI Chat */}
      {showChat && selectedState && (
        <section id="chat" className="py-20 px-6 bg-navy-900">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="section-label mb-3" style={{ color: '#0EA572' }}>Step 2</p>
              <h2 className="font-serif text-4xl text-white mb-4">
                Chat with your AI guide
              </h2>
              <p className="text-white/60 max-w-lg mx-auto">
                I&apos;ll walk you through everything — what to gather, what each question means, and when you&apos;re ready to file.
              </p>
            </div>
            <ChatWindow stateId={selectedState} sessionId={SESSION_ID} />
          </div>
        </section>
      )}

      {/* Eligibility Checker */}
      <section id="eligibility" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Quick check</p>
            <h2 className="section-h2 mb-4">Do you qualify?</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Answer 3 quick questions. No account needed, no personal info required.
            </p>
          </div>
          <EligibilityChecker preselectedState={selectedState} />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Everything you need</p>
            <h2 className="section-h2 mb-4">
              The only platform built<br />
              <em className="text-blue-600">specifically for filers</em>
            </h2>
          </div>
          <FeatureGrid />
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <p className="section-label mb-3">Help us improve</p>
          <FeedbackModal />
        </div>
      </section>

      <Footer />
    </main>
  )
}
