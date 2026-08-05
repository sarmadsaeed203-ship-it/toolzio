import React, { useState } from 'react';
import { ToolLayout } from "../components/tool/ToolLayout";
import { EditorProvider, useEditor } from "../components/editor/EditorContext";
import { EditorToolbar } from "../components/editor/EditorToolbar";
import { EditorSidebar } from "../components/editor/EditorSidebar";
import { EditorViewer } from "../components/editor/EditorViewer";
import { EditorProperties } from "../components/editor/EditorProperties";
import { UploadCard } from "../components/tool/UploadCard";
import { FileEdit, Loader2 } from "lucide-react";

// In a real implementation we would import react-pdf's Document to get numPages on upload
import { pdfjs } from 'react-pdf';

// Make sure worker is configured
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function EditorCore() {
  const { files, addFile } = useEditor();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileUpload = async (uploadedFiles) => {
    setIsUploading(true);
    setUploadError(null);
    for (const file of uploadedFiles) {
      // Read the PDF to get the number of pages
      try {
        const fileReader = new FileReader();
        const arrayBuffer = await new Promise((resolve, reject) => {
          fileReader.onload = () => resolve(fileReader.result);
          fileReader.onerror = reject;
          fileReader.readAsArrayBuffer(file);
        });

        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        
        // Generate a random ID for this file
        const fileId = Math.random().toString(36).substring(7);
        addFile(file, numPages, fileId);
      } catch (err) {
        console.error("Failed to parse PDF", err);
        setUploadError(`Failed to load "${file.name}". The file may be corrupted, encrypted, or not a valid PDF.`);
      }
    }
    setIsUploading(false);
  };

  if (files.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto h-[70vh] flex flex-col justify-center">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Loading PDFs...</h3>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadCard 
              title="Open PDF Studio"
              description="Drag and drop your .pdf files here to start editing"
              accept=".pdf,application/pdf"
              onUpload={handleFileUpload}
              icon={FileEdit}
              accentColor="bg-blue-600"
              maxSize={50}
              multiple={true}
            />
            {uploadError && (
              <div className="mt-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm max-w-md text-center shadow-sm">
                {uploadError}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] bg-gray-50 rounded-xl overflow-hidden shadow-xl border border-gray-200">
      <EditorToolbar onAddFiles={handleFileUpload} isUploading={isUploading} />
      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar />
        <EditorViewer />
        <EditorProperties />
      </div>
    </div>
  );
}

export function PdfEditor() {
  return (
    <ToolLayout 
      ogImage="https://toolzio.com/og-image.jpg"
      title="⭐ PDF Studio" 
      description="Merge, Split, Rotate, Reorder and Organize PDFs in one professional workspace."
    >
      <EditorProvider>
        <EditorCore />
      </EditorProvider>
    </ToolLayout>
  );
}
