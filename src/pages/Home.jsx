import { useState } from "react"
import { Header } from "../components/layout/Header"
import { Footer } from "../components/layout/Footer"
import { Hero } from "../components/layout/Hero"
import { ToolsSection } from "../components/features/ToolsSection"
import { FeaturesSection } from "../components/features/FeaturesSection"
import { StatsSection } from "../components/features/StatsSection"
import { HowItWorksSection } from "../components/features/HowItWorksSection"
import { FutureSection } from "../components/features/FutureSection"
import { FaqSection } from "../components/features/FaqSection"
import { Helmet } from "react-helmet-async"

export function Home() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-primary/20">
      <Helmet>
        <title>Toolzio | One workspace for every file</title>
        <meta name="description" content="Convert, edit, compress and organize documents and images securely." />
      </Helmet>

      <Header />
      
      <main className="flex-1 flex flex-col animate-in fade-in duration-700">
        <Hero onFileTypeSelect={setActiveCategory} />
        <StatsSection />
        <HowItWorksSection />
        <div id="products" className="scroll-mt-20">
          <ToolsSection activeCategory={activeCategory} />
        </div>
        <div id="features" className="scroll-mt-20">
          <FeaturesSection />
        </div>
        <FutureSection />
        <FaqSection />
      </main>

      <Footer />
    </div>
  )
}
