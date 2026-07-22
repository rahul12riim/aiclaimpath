// src/app/feedback/page.tsx
import type { Metadata } from 'next'
import FeedbackClient from '@/components/feedback/FeedbackClient'

export const metadata: Metadata = {
  title: 'Feedback — AIClaimPath',
  description: 'Share your feedback about AIClaimPath and tell us how we can improve.',
}

export default function FeedbackPage() {
  return <FeedbackClient />
}
