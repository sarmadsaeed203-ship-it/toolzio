import { useState } from "react"
import { UploadCloud, AlertCircle } from "lucide-react"

export function UploadCard({ 
  onUpload, 
  title, 
  description, 
  accept, 
  maxSize, 
  icon: Icon = UploadCloud, 
  accentColor = "bg-primary",
  multiple = false,
  error = null
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (multiple) {
        onUpload(Array.from(e.dataTransfer.files))
      } else {
        onUpload(e.dataTransfer.files[0])
      }
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        onUpload(Array.from(e.target.files))
      } else {
        onUpload(e.target.files[0])
      }
    }
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-[#EAEAEA] p-6 md:p-14 shadow-sm text-center">
      <h2 className="text-3xl font-bold tracking-tight mb-4 text-[#111111]">{title}</h2>
      <p className="text-lg text-muted-foreground mb-10 font-light">{description}</p>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 flex items-center justify-center gap-2 border border-red-100">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div 
        role="button"
        tabIndex={0}
        aria-label="Upload file area"
        className={`relative border-2 border-dashed rounded-xl p-10 md:p-16 transition-all duration-300 ease-out bg-card flex flex-col items-center justify-center cursor-pointer group
          ${isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-[#EAEAEA] hover:border-primary hover:bg-primary/5 hover:shadow-md"}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
        onKeyDown={(e) => { 
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            document.getElementById('file-upload').click();
          }
        }}
      >
        <div className={`h-20 w-20 rounded-full flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 ease-out ${accentColor}`}>
          <Icon className="h-10 w-10" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-[#111111]">{multiple ? "Drag & drop your files here" : "Drag & drop your file here"}</h3>
        <p className="text-sm text-muted-foreground mb-8">
          Max size: {maxSize}MB
        </p>
        
        <label className="cursor-pointer relative z-10">
          <div className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors bg-[#111111] text-white hover:bg-[#111111]/90 h-12 px-8 shadow-sm group-hover:shadow-md">
            Browse {multiple ? "Files" : "File"}
          </div>
          <input 
            id="file-upload"
            type="file" 
            className="hidden" 
            accept={accept}
            multiple={multiple}
            onChange={handleChange} 
          />
        </label>
      </div>
    </div>
  )
}
