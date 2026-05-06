// src/components/ui/FeatureGrid.tsx
export default function FeatureGrid() {
  const features = [
    { icon: '💬', title: 'AI Q&A agent', desc: 'Conversational guide that explains every question in plain English and adapts to your state and situation.', badge: 'Core' },
    { icon: '🗺️', title: 'All 50 states', desc: 'State-specific rules, deadlines, weekly benefit ranges, and direct portal links — all verified and current.', badge: 'Core' },
    { icon: '📋', title: 'Document checklist', desc: 'Before you start, we generate a custom list of exactly what documents to gather for your situation.', badge: 'Core' },
    { icon: '📝', title: 'Appeal letter generator', desc: 'If your claim is denied, our AI drafts a formal, personalized appeal letter based on your denial reason.', badge: 'Differentiator' },
    { icon: '🔔', title: 'Deadline reminders', desc: 'Email and SMS alerts for weekly certification deadlines so you never miss a payment.', badge: 'Differentiator' },
    { icon: '🌐', title: 'Multilingual support', desc: 'Available in English and Spanish. No one should miss benefits because of a language barrier.', badge: 'Differentiator' },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {features.map(f => (
        <div key={f.title} className="card p-7 group hover:-translate-y-1 transition-transform duration-200 hover:shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl mb-5">{f.icon}</div>
          <h3 className="font-semibold text-navy-900 mb-2">{f.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          <span className="inline-block mt-4 text-xs font-semibold text-mint-600 bg-mint-50 px-3 py-1 rounded-full">{f.badge}</span>
        </div>
      ))}
    </div>
  )
}
