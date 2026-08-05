import { CheckCircle2, Download, RotateCcw, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export function DownloadCard({ result, onReset }) {
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-[#EAEAEA] p-10 md:p-14 shadow-sm text-center animate-in fade-in zoom-in duration-300">
      <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 text-green-600">
        <CheckCircle2 className="h-10 w-10" strokeWidth={1.5} />
      </div>
      
      <h3 className="text-2xl font-bold tracking-tight mb-2 text-[#111111]">Success!</h3>
      <p className="text-muted-foreground mb-8 font-light">
        Your file has been processed successfully.
      </p>

      <div className="max-w-md mx-auto bg-muted/20 rounded-xl p-4 mb-8 flex items-center justify-between border border-[#EAEAEA]">
        <div className="text-left truncate pr-4">
          <p className="text-sm font-medium text-[#111111] truncate">{result?.processedName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{formatSize(result?.sizeBytes)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <a 
          href={result?.downloadUrl} 
          download={result?.processedName}
          className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 shadow-sm"
        >
          <Download className="mr-2 h-4 w-4" />
          Download File
        </a>
        
        <button 
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors bg-white border border-[#EAEAEA] text-[#111111] hover:bg-muted/30 h-12 px-6"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Convert Another File
        </button>
      </div>

      <div className="pt-8 border-t border-[#EAEAEA]">
        <p className="text-sm font-medium text-[#111111] mb-4">Try Another Tool</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/merge-pdf" className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs font-medium transition-colors bg-muted/30 hover:bg-muted text-muted-foreground hover:text-[#111111] h-8 px-4 border border-[#EAEAEA]">
            Merge PDF <ArrowRight className="ml-1.5 h-3 w-3" />
          </Link>
          <Link to="/compress-pdf" className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs font-medium transition-colors bg-muted/30 hover:bg-muted text-muted-foreground hover:text-[#111111] h-8 px-4 border border-[#EAEAEA]">
            Compress PDF <ArrowRight className="ml-1.5 h-3 w-3" />
          </Link>
          <Link to="/word-to-pdf" className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs font-medium transition-colors bg-muted/30 hover:bg-muted text-muted-foreground hover:text-[#111111] h-8 px-4 border border-[#EAEAEA]">
            Word to PDF <ArrowRight className="ml-1.5 h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
