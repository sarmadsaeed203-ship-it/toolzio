import { useState } from "react"
import { UploadCloud, FileType2, FileImage, FileText, Lock, Zap, Globe, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero({ onFileTypeSelect }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      if (file.type.includes("pdf")) onFileTypeSelect("pdf")
      else if (file.type.includes("image")) onFileTypeSelect("image")
      else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) onFileTypeSelect("document")
      else onFileTypeSelect("all")
    }
  }

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden">
      <div className="container px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="flex-1 w-full max-w-2xl text-left">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-[#111111]">
              Everything your files need.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl font-light">
              Convert, edit, compress and organize documents and images from one beautiful workspace.
            </p>

            <div 
              className={`relative border border-dashed rounded-2xl p-10 md:p-14 transition-all duration-300 ease-out bg-card flex flex-col items-center justify-center min-h-[320px] cursor-pointer group shadow-sm
                ${isDragging ? "border-primary bg-primary/5 scale-[1.02] shadow-md" : "border-[#EAEAEA] hover:border-primary/50 hover:shadow-md hover:-translate-y-1"}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/[0.01] rounded-2xl pointer-events-none" />
              
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300 ease-out">
                <UploadCloud className="h-10 w-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#111111]">Drag & Drop your files here</h3>
              <p className="text-sm text-muted-foreground mb-8 text-center max-w-xs">
                Supports PDF, DOCX, PPT, JPG, PNG, WEBP
              </p>
              
              <label className="cursor-pointer relative z-10">
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-[#111111] text-white hover:bg-[#111111]/90 h-12 px-8 shadow-sm group-hover:shadow-md">
                  Browse Files
                </div>
                <input type="file" className="hidden" onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    if (file.type.includes("pdf")) onFileTypeSelect("pdf")
                    else if (file.type.includes("image")) onFileTypeSelect("image")
                    else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) onFileTypeSelect("document")
                    else onFileTypeSelect("all")
                  }
                }} />
              </label>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span>Files deleted automatically</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span>Trusted Worldwide</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span>No Signup Required</span>
              </div>
            </div>
          </div>

          <div className="flex-1 hidden lg:flex items-center justify-center relative w-full max-w-xl h-[600px]">
            {/* Abstract Premium SVG Illustration */}
            <svg viewBox="0 0 400 400" className="w-full h-full opacity-90" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#EAEAEA" strokeWidth="1" />
                </pattern>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8f9fa" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#e9ecef" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <rect width="400" height="400" fill="url(#grid)" className="opacity-50" />
              <rect x="50" y="50" width="120" height="160" rx="16" fill="url(#grad)" stroke="#EAEAEA" strokeWidth="1" className="animate-in slide-in-from-bottom-8 duration-1000 delay-100" />
              <rect x="190" y="100" width="160" height="120" rx="16" fill="url(#grad)" stroke="#EAEAEA" strokeWidth="1" className="animate-in slide-in-from-bottom-8 duration-1000 delay-200" />
              <rect x="90" y="230" width="220" height="120" rx="16" fill="#2563EB" fillOpacity="0.05" stroke="#2563EB" strokeOpacity="0.2" strokeWidth="1" className="animate-in slide-in-from-bottom-8 duration-1000 delay-300" />
              <circle cx="270" cy="160" r="30" fill="#2563EB" fillOpacity="0.1" className="animate-in zoom-in duration-1000 delay-500" />
              <path d="M120 100 L120 150 L90 150" stroke="#111111" strokeOpacity="0.1" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

        </div>
      </div>
    </section>
  )
}
