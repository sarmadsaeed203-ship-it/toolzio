import { ToolLayout } from "../components/tool/ToolLayout"
import { UploadCard } from "../components/tool/UploadCard"
import { ProcessingCard } from "../components/tool/ProcessingCard"
import { DownloadCard } from "../components/tool/DownloadCard"
import { useToolProcessing } from "../hooks/useToolProcessing"
import { FileType } from "lucide-react"

export function WordToPdf() {
  const { status, file, result, error, progress, stageMessage, handleFileUpload, resetTool } = useToolProcessing("word-to-pdf")

  return (
    <ToolLayout 
      ogImage="https://toolzio.com/og-image.jpg"
      title="Word to PDF" 
      description="Convert your DOCX files into PDF format seamlessly. Retain layout and formatting."
    >
      <div className="w-full max-w-4xl mx-auto">
        {status === "idle" && (
          <UploadCard 
            title="Upload Word Document"
            description="Drag and drop your .docx file here, or click to browse"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onUpload={handleFileUpload}
            icon={FileType}
            accentColor="bg-blue-600"
            maxSize={50}
          />
        )}
        
        {status === "error" && (
          <UploadCard 
            title="Upload Word Document"
            description="Drag and drop your .docx file here, or click to browse"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onUpload={handleFileUpload}
            icon={FileType}
            accentColor="bg-blue-600"
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
