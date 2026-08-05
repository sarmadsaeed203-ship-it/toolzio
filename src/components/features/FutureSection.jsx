import { Sparkles, Key, Layers, Cloud, ArrowRight } from "lucide-react"

export function FutureSection() {
  const upcoming = [
    { title: "OCR Engine", description: "Extract text from scanned documents accurately.", icon: Sparkles },
    { title: "AI Extraction", description: "Structured data extraction from invoices and receipts.", icon: Sparkles },
    { title: "Cloud Workspace", description: "Save and organize your files securely in the cloud.", icon: Cloud },
    { title: "Batch Processing", description: "Process hundreds of files simultaneously.", icon: Layers },
    { title: "Developer API", description: "Integrate Toolzio directly into your applications.", icon: Key }
  ]

  return (
    <section className="py-24 md:py-32 bg-[#111111] text-white">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight mb-6">Built for the future.</h2>
            <p className="text-lg text-white/60 font-light leading-relaxed">
              We are continuously expanding our platform to provide a complete workspace for all your file needs. Here is a glimpse of what's coming next.
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors group">
            View Roadmap <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {upcoming.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 group">
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/10 text-white/70 text-[10px] font-bold tracking-widest uppercase">
                  Soon
                </div>
                <Icon className="h-6 w-6 text-white/50 mb-5 group-hover:text-white transition-colors" strokeWidth={1.5} />
                <h3 className="text-base font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
