import { Loader2 } from "lucide-react"

export function ProcessingCard({ file, progress, status, stageMessage }) {
  const isUploading = status === "uploading"

  return (
    <div className="w-full bg-white rounded-2xl border border-[#EAEAEA] p-10 md:p-14 shadow-sm text-center animate-in fade-in zoom-in duration-300">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 text-primary">
        <Loader2 className="h-10 w-10 animate-spin" strokeWidth={1.5} />
      </div>
      
      <h3 className="text-2xl font-bold tracking-tight mb-3 text-[#111111]">
        {isUploading ? "Uploading..." : "Processing..."}
      </h3>
      <p className="text-muted-foreground mb-8 font-light">
        {stageMessage}{" "}
        <span className="font-medium text-[#111111]">
          {Array.isArray(file) ? `${file.length} files` : file?.name}
        </span>
      </p>

      <div className="max-w-md mx-auto">
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden relative">
          {isUploading ? (
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          ) : (
            <div className="absolute top-0 left-0 h-full w-1/3 bg-primary rounded-full animate-[progress_1.5s_ease-in-out_infinite]" />
          )}
        </div>
        {isUploading && (
          <p className="text-xs text-muted-foreground mt-3 text-right font-medium">
            {progress}%
          </p>
        )}
      </div>
    </div>
  )
}
