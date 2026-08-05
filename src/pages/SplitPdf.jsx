import { ToolLayout } from "../components/tool/ToolLayout"
import { UploadCard } from "../components/tool/UploadCard"
import { ProcessingCard } from "../components/tool/ProcessingCard"
import { DownloadCard } from "../components/tool/DownloadCard"
import { useToolProcessing } from "../hooks/useToolProcessing"
import { Scissors } from "lucide-react"

export function SplitPdf() {
  const { status, file, result, error, progress, stageMessage, handleFileUpload, resetTool } = useToolProcessing("split-pdf")

  return (
    <ToolLayout 
      ogImage="https://toolzio.com/og-image.jpg"
      title="Split PDF" 
      description="Extract all pages of a PDF into individual files securely."
    >
      <div className="w-full max-w-4xl mx-auto">
        {status === "idle" && (
          <UploadCard 
            title="Upload PDF Document"
            description="Drag and drop your .pdf file here, or click to browse"
            accept=".pdf,application/pdf"
            onUpload={handleFileUpload}
            icon={Scissors}
            accentColor="bg-orange-500"
            maxSize={50}
          />
        )}
        
        {status === "error" && (
          <UploadCard 
            title="Upload PDF Document"
            description="Drag and drop your .pdf file here, or click to browse"
            accept=".pdf,application/pdf"
            onUpload={handleFileUpload}
            icon={Scissors}
            accentColor="bg-orange-500"
            maxSize={50}
            error={error}
          />
        )}
        
        {status === "processing" || status === "uploading" ? (
          <ProcessingCard file={file} progress={progress} status={status} stageMessage={stageMessage} />
        ) : null}
        
        {status === "complete" && (
          <DownloadCard result={result} onReset={resetTool} />
        )}
      </div>
    </ToolLayout>
  )
}
