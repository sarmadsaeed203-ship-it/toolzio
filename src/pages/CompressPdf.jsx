import { ToolLayout } from "../components/tool/ToolLayout"
import { UploadCard } from "../components/tool/UploadCard"
import { ProcessingCard } from "../components/tool/ProcessingCard"
import { DownloadCard } from "../components/tool/DownloadCard"
import { useToolProcessing } from "../hooks/useToolProcessing"
import { Minimize } from "lucide-react"

export function CompressPdf() {
  const { status, file, result, error, progress, stageMessage, handleFileUpload, resetTool } = useToolProcessing("compress-pdf")

  return (
    <ToolLayout 
      ogImage="https://toolzio.com/og-image.jpg"
      title="Compress PDF" 
      description="Reduce the file size of your PDF while maintaining optimal quality."
    >
      <div className="w-full max-w-4xl mx-auto">
        {status === "idle" && (
          <UploadCard 
            title="Upload PDF Document"
            description="Drag and drop your .pdf file here, or click to browse"
            accept=".pdf,application/pdf"
            onUpload={handleFileUpload}
            icon={Minimize}
            accentColor="bg-green-600"
            maxSize={50}
          />
        )}
        
        {status === "error" && (
          <UploadCard 
            title="Upload PDF Document"
            description="Drag and drop your .pdf file here, or click to browse"
            accept=".pdf,application/pdf"
            onUpload={handleFileUpload}
            icon={Minimize}
            accentColor="bg-green-600"
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
