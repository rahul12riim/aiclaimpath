import FeedbackModal from '@/components/ui/FeedbackModal'

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center rounded-2xl bg-white p-10 text-center shadow-sm">
        <h1 className="font-serif text-3xl text-navy-900">We&apos;d love your feedback</h1>
        <p className="mt-3 max-w-xl text-gray-500">
          Share your experience so we can keep improving the filing journey for everyone.
        </p>
        <div className="mt-8">
          <FeedbackModal />
        </div>
      </div>
    </main>
  )
}
