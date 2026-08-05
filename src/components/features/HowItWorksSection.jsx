import { UploadCloud, Settings2, DownloadCloud } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Upload",
      description: "Drag and drop your file securely into our workspace.",
      icon: UploadCloud
    },
    {
      num: "02",
      title: "Choose Tool",
      description: "Select from our suite of premium conversion and editing tools.",
      icon: Settings2
    },
    {
      num: "03",
      title: "Download",
      description: "Get your processed file instantly, with zero quality loss.",
      icon: DownloadCloud
    }
  ]

  return (
    <section className="py-24 md:py-32 border-t border-[#EAEAEA] bg-white">
      <div className="container px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold tracking-tight mb-6 text-[#111111]">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            A seamless workflow designed to save you time.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center max-w-5xl mx-auto gap-12 md:gap-8 relative">
          
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-[#EAEAEA] -translate-y-1/2 z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center flex-1 w-full bg-white px-6">
                <div className="mb-6 flex items-center justify-center h-20 w-20 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-8 ring-white">
                  <Icon className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-bold text-primary mb-2 tracking-widest">{step.num}</div>
                <h3 className="text-xl font-semibold mb-3 text-[#111111]">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light max-w-[250px]">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
