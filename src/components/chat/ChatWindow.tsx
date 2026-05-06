'use client'
// src/components/chat/ChatWindow.tsx
import { useChat } from 'ai/react'
import { useEffect, useRef, useState } from 'react'
import { getState } from '@/lib/states-data'

interface Props {
  stateId: string
  sessionId: string
}

const QUICK_REPLIES: Record<string, string[]> = {
  initial: [
    'I was laid off',
    'My hours were reduced',
    'My company closed',
    'I quit — here\'s why',
    'I was fired',
  ],
  afterReason: [
    'This week',
    'Last week',
    '2–3 weeks ago',
    'More than a month ago',
  ],
  afterDate: [
    'Under $500/week',
    '$500–$1,000/week',
    '$1,000–$2,000/week',
    'Over $2,000/week',
  ],
}

export default function ChatWindow({ stateId, sessionId }: Props) {
  const state = getState(stateId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [quickReplies, setQuickReplies] = useState(QUICK_REPLIES.initial)
  const [progress, setProgress] = useState(0)

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    body: { stateId, sessionId },
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hi! I'm your AI guide for filing unemployment in **${state?.name ?? 'your state'}**.

I'm here to walk you through everything — what to gather, what each question means, and how to file correctly.

Let's start with something easy: **What was the main reason you left your last job?**`,
      },
    ],
    onFinish: () => {
      const userMsgCount = messages.filter(m => m.role === 'user').length
      setProgress(Math.min(100, (userMsgCount / 7) * 100))
      // Rotate quick replies based on conversation progress
      if (userMsgCount === 1) setQuickReplies(QUICK_REPLIES.afterReason)
      else if (userMsgCount === 2) setQuickReplies(QUICK_REPLIES.afterDate)
      else setQuickReplies([])
    },
  })

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleQuickReply = (text: string) => {
    append({ role: 'user', content: text })
  }

  const userCount = messages.filter(m => m.role === 'user').length

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-navy-900 border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-mint-500 flex items-center justify-center text-xl">🤖</div>
        <div>
          <div className="text-white font-semibold text-sm">ClaimPath AI</div>
          <div className="flex items-center gap-1.5 text-xs text-mint-400">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-400 pulse-dot" />
            Online · {state?.name} expert
          </div>
        </div>
        {state && (
          <div className="ml-auto text-right">
            <div className="text-white/40 text-xs">Filing portal</div>
            <a
              href={state.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mint-400 text-xs hover:text-mint-300 transition-colors"
            >
              {state.agency} →
            </a>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="bg-navy-800/50 px-6 py-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-white/40">Prep progress</span>
          <span className="text-mint-400 font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Messages */}
      <div className="bg-gray-50 px-6 py-6 space-y-5 min-h-[360px] max-h-[480px] overflow-y-auto">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm
              ${m.role === 'assistant' ? 'bg-navy-900 text-white' : 'bg-blue-100 text-blue-600'}`}
            >
              {m.role === 'assistant' ? '🤖' : '👤'}
            </div>
            <div
              className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed chat-content
              ${m.role === 'assistant' ? 'bubble-ai' : 'bubble-user'}`}
              dangerouslySetInnerHTML={{
                __html: m.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br/>'),
              }}
            />
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-navy-900 flex-shrink-0 flex items-center justify-center text-sm">🤖</div>
            <div className="bubble-ai px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      {quickReplies.length > 0 && !isLoading && (
        <div className="px-6 py-3 bg-white border-t border-gray-100 flex flex-wrap gap-2">
          {quickReplies.map(reply => (
            <button
              key={reply}
              onClick={() => handleQuickReply(reply)}
              className="text-xs text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full
                         hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-150"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Or type your answer..."
            className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                       text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400
                       focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white
                       hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ↑
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Never share your SSN, bank account, or password in this chat.
        </p>
      </div>
    </div>
  )
}
