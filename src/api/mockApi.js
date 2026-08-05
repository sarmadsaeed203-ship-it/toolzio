export async function processFileMock(toolId, file) {
  // Simulate network latency (2-4 seconds)
  const delay = Math.floor(Math.random() * 2000) + 2000;
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 1% chance of random failure
      if (Math.random() < 0.01) {
        reject(new Error("Server timeout. Please try again."))
      } else {
        // Return mock success data
        resolve({
          id: `file_${Math.random().toString(36).substring(2, 9)}`,
          originalName: file.name,
          processedName: file.name.replace(/\.[^/.]+$/, "") + `_processed_${toolId}.docx`,
          sizeBytes: Math.floor(file.size * 0.8), // Assume processing reduced size or changed format
          downloadUrl: "#", // Placeholder for actual download URL
        })
      }
    }, delay)
  })
}
