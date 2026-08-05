import { Zap, ShieldCheck, ImageOff, Globe } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      title: "Fast Processing",
      description: "Optimized engines process your files in seconds, not minutes. Built for speed and reliability.",
      icon: Zap
    },
    {
      title: "Secure Files",
      description: "All files are encrypted with 256-bit AES and automatically deleted after 2 hours.",
      icon: ShieldCheck
    },
    {
      title: "No Watermarks",
      description: "We never add watermarks to your processed documents or images, even on free plans.",
      icon: ImageOff
    },
    {
      title: "Works Everywhere",
      description: "Access from your desktop, tablet, or mobile device seamlessly. No installation required.",
      icon: Globe
    }
  ]

  return (
    <section className="py-24 md:py-32 border-t border-[#EAEAEA] bg-white">
      <div className="container px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold tracking-tight mb-6 text-[#111111]">Why Toolzio</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Built for professionals who value privacy, speed, and clean design. Experience the difference.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="flex flex-col items-start p-8 rounded-2xl bg-white border border-[#EAEAEA] shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="h-14 w-14 rounded-xl bg-primary/5 flex items-center justify-center mb-8 text-primary">
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#111111]">{feature.title}</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
