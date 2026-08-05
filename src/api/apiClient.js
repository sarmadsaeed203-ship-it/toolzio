import axios from "axios"

export async function processFile(toolId, fileOrFiles, onUploadProgress) {
  const formData = new FormData()
  
  if (Array.isArray(fileOrFiles)) {
    fileOrFiles.forEach(f => formData.append("files", f))
  } else {
    formData.append("file", fileOrFiles)
  }

  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "";
    const response = await axios.post(`${baseURL}/api/tools/${toolId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onUploadProgress(percentCompleted)
        }
      },
      responseType: 'blob' // We expect a file back
    })

    // Extract filename from Content-Disposition header if available
    let originalName = Array.isArray(fileOrFiles) ? `${fileOrFiles.length} files` : fileOrFiles.name
    let processedName = Array.isArray(fileOrFiles) ? "merged_document.pdf" : `${fileOrFiles.name.replace(/\.[^/.]+$/, "")}_processed`
    
    const contentDisposition = response.headers['content-disposition']
    if (contentDisposition) {
      const match = contentDisposition.match(/filename\*=UTF-8''(.+)|filename="?([^"]+)"?/)
      if (match) {
        processedName = decodeURIComponent(match[1] || match[2])
      }
    }

    // Create download URL
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)

    return {
      id: `file_${Date.now()}`,
      originalName: originalName,
      processedName: processedName,
      sizeBytes: blob.size,
      downloadUrl: downloadUrl,
    }

  } catch (error) {
    if (error.response && error.response.data instanceof Blob) {
        // Parse blob error to text
        const textError = await error.response.data.text()
        try {
            const jsonError = JSON.parse(textError)
            throw new Error(jsonError.detail || "An error occurred during processing.")
        } catch (e) {
            throw new Error(textError || "Server error")
        }
    }
    
    throw new Error(error.response?.data?.detail || error.message || "Failed to process file.")
  }
}
