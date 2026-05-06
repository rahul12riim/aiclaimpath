// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-[#060F1A] pt-16 pb-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="font-serif text-2xl text-white mb-3">AIWorkforce</div>
            <p className="text-sm text-white/35 leading-relaxed max-w-xs">
              Helping people navigate unemployment filing with clarity, confidence, and care. Free, always.
            </p>
          </div>
          {[
            { title: 'Product', links: ['How it works', 'State coverage', 'AI Q&A agent', 'Appeal generator'] },
            { title: 'Resources', links: ['Eligibility guide', 'Weekly certification', 'Appeal process', 'FAQ'] },
          ].map(col => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">{col.title}</div>
              <div className="space-y-3">
                {col.links.map(link => (
                  <a key={link} href="#" className="block text-sm text-white/50 hover:text-white transition-colors">{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/25">© 2026 AIWorkforce. Not affiliated with any government agency.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Accessibility'].map(link => (
              <a key={link} href="#" className="text-xs text-white/25 hover:text-white/60 transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
