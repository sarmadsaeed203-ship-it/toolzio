import { useState, useCallback, useRef, useEffect } from "react"
import { processFile } from "../api/apiClient"

const PROCESSING_STAGES = [
  "Reading file...",
  "Analyzing content...",
  "Converting document...",
  "Generating final file...",
  "Preparing download..."
]

export function useToolProcessing(toolId) {
  const [status, setStatus] = useState("idle") // idle | uploading | processing | complete | error
  const [file, setFile] = useState(null) // Can be single file or array of files
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0) // 0-100 for upload
  const [stageMessage, setStageMessage] = useState("Uploading file...")
  
  const stageIntervalRef = useRef(null)
  const lastProgressUpdateRef = useRef(0)

  const stopStageCycling = () => {
    if (stageIntervalRef.current) {
      clearInterval(stageIntervalRef.current)
      stageIntervalRef.current = null
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return stopStageCycling
  }, [])

  const handleFileUpload = useCallback(async (uploadedFileOrFiles) => {
    setFile(uploadedFileOrFiles)
    setStatus("uploading")
    setError(null)
    setProgress(0)
    setStageMessage("Uploading file...")
    lastProgressUpdateRef.current = Date.now()

    try {
      // Call real backend API with upload progress tracking
      const response = await processFile(toolId, uploadedFileOrFiles, (percentCompleted) => {
        const now = Date.now()
        // Throttle progress updates to ~150ms to prevent excessive parent re-renders
        if (now - lastProgressUpdateRef.current >= 150 || percentCompleted >= 100) {
          setProgress(percentCompleted)
          lastProgressUpdateRef.current = now
        }
        
        // Once upload is complete, switch to processing status and start cycling messages
        if (percentCompleted >= 100 && status !== "processing") {
          setStatus("processing")
          let stageIndex = 0
          setStageMessage(PROCESSING_STAGES[0])
          
          stageIntervalRef.current = setInterval(() => {
            stageIndex = (stageIndex + 1) % PROCESSING_STAGES.length
            setStageMessage(PROCESSING_STAGES[stageIndex])
          }, 3500)
        }
      })
      
      stopStageCycling()
      setResult(response)
      setStatus("complete")
      
    } catch (err) {
      stopStageCycling()
      setError(err.message || "An error occurred during processing.")
      setStatus("error")
    }
  }, [toolId, status])

  const resetTool = useCallback(() => {
    stopStageCycling()
    setStatus("idle")
    setFile(null)
    setResult(null)
    setError(null)
    setProgress(0)
    setStageMessage("Uploading file...")
  }, [])

  return {
    status,
    file,
    result,
    error,
    progress,
    stageMessage,
    handleFileUpload,
    resetTool
  }
}
