import { ToolLayout } from "../components/tool/ToolLayout"
import { UploadCard } from "../components/tool/UploadCard"
import { ProcessingCard } from "../components/tool/ProcessingCard"
import { DownloadCard } from "../components/tool/DownloadCard"
import { useToolProcessing } from "../hooks/useToolProcessing"
import { FaqSection } from "../components/features/FaqSection"
import { FileText, ArrowRight } from "lucide-react"

export function PdfToWord() {
  const { status, file, result, error, progress, stageMessage, handleFileUpload, resetTool } = useToolProcessing("pdf-to-word")

  return (
    <ToolLayout 
      ogImage="https://toolzio.com/og-image.jpg"
      title="Convert PDF to Word Online Free - Toolzio" 
      description="Easily convert your PDF files to editable Word documents (DOCX) online for free. No registration required."
      canonical="https://toolzio.com/pdf-to-word"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center space-x-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
            <span className="font-bold">PDF</span>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <FileText className="h-6 w-6" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#111111]">
          PDF to Word Converter
        </h1>
        <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
          Convert your PDF documents into perfectly formatted, editable Word files in seconds. 100% free and secure.
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto mb-20">
        {status === "idle" && (
          <UploadCard 
            title="Upload your PDF"
            description="Drag and drop your PDF here or click to browse."
            acceptedFormats=".pdf,application/pdf"
            maxSize="50MB"
            onUpload={handleFileUpload}
          />
        )}
        
        {status === "processing" || status === "uploading" ? (
          <ProcessingCard file={file} progress={progress} status={status} stageMessage={stageMessage} />
        ) : null}
        
        {status === "complete" && (
          <DownloadCard result={result} onReset={resetTool} />
        )}

        {status === "error" && (
          <div className="w-full bg-red-500/5 rounded-2xl border border-red-500/20 p-10 text-center animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl font-semibold mb-2 text-red-600">Processing Failed</h3>
            <p className="text-sm text-red-600/80 mb-6">{error}</p>
            <button 
              onClick={resetTool}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors bg-white border border-[#EAEAEA] text-[#111111] hover:bg-muted/30 h-10 px-6 shadow-sm"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Reused FAQ Section - we could componentize this further to take custom FAQs per tool */}
      <div className="mt-20 pt-20 border-t border-[#EAEAEA] -mx-4 px-4 sm:mx-0 sm:px-0">
        <FaqSection />
      </div>
      
    </ToolLayout>
  )
}
