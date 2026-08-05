import { Header } from "../layout/Header"
import { Footer } from "../layout/Footer"
import { Helmet } from "react-helmet-async"

export function ToolLayout({ title, description, canonical, ogImage, children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title,
    "description": description,
    "url": canonical,
    "applicationCategory": "Utility",
    "operatingSystem": "All"
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-primary/20">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {canonical && <link rel="canonical" href={canonical} />}
        
        {/* OpenGraph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {canonical && <meta property="og:url" content={canonical} />}
        <meta property="og:type" content="website" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <Header />
      
      <main className="flex-1 flex flex-col pt-12 pb-24 md:pt-16 md:pb-32 animate-in fade-in duration-500">
        <div className="container px-4 max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}
