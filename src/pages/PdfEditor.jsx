import React, { useState } from 'react';
import { ToolLayout } from '../components/tool/ToolLayout';
import { EditorProvider, useEditor } from '../components/editor/EditorContext';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { EditorSidebar } from '../components/editor/EditorSidebar';
import { EditorViewer } from '../components/editor/EditorViewer';
import { EditorProperties } from '../components/editor/EditorProperties';
import { UploadCard } from '../components/tool/UploadCard';
import { FileEdit, Loader2 } from 'lucide-react';
import { pdfjs } from 'react-pdf';

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function EditorCore() {
  const { files, addFile } = useEditor();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  // Properties panel is hidden by default — viewer gets full width until toggled
  const [propertiesOpen, setPropertiesOpen] = useState(false);

  const handleFileUpload = async (uploadedFiles) => {
    setIsUploading(true);
    setUploadError(null);
    for (const file of uploadedFiles) {
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
        const fileId = Math.random().toString(36).substring(7);
        addFile(file, numPages, fileId);
      } catch (err) {
        console.error('Failed to parse PDF', err);
        setUploadError(`Failed to load "${file.name}". The file may be corrupted, encrypted, or not a valid PDF.`);
      }
    }
    setIsUploading(false);
  };

  // Empty state — no files uploaded yet
  if (files.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto h-[70vh] flex flex-col justify-center">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Loading PDFs…</h3>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadCard
              title="Open PDF Studio"
              description="Drag and drop one or more PDF files here to start editing"
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
    /*
     * Editor shell: full viewport height minus the ToolLayout header/footer.
     * Using calc(100vh - 200px) keeps it robust across screen sizes.
     * overflow-hidden on the shell; each panel manages its own scroll.
     */
    <div className="flex flex-col rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-gray-50"
      style={{ height: 'calc(100vh - 220px)', minHeight: '520px' }}
    >
      <EditorToolbar
        onAddFiles={handleFileUpload}
        isUploading={isUploading}
        propertiesOpen={propertiesOpen}
        onToggleProperties={() => setPropertiesOpen(o => !o)}
      />
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left sidebar — fixed width */}
        <EditorSidebar />

        {/* Center viewer — grows to fill all remaining space */}
        <EditorViewer />

        {/* Right panel — collapsible */}
        <EditorProperties
          isOpen={propertiesOpen}
          onClose={() => setPropertiesOpen(false)}
        />
      </div>
    </div>
  );
}

export function PdfEditor() {
  return (
    <ToolLayout
      ogImage="https://toolzio.com/og-image.jpg"
      title="PDF Studio"
      description="Merge, Split, Rotate, Reorder and Organize PDFs in one professional workspace."
      fullWidth={true}
    >
      <EditorProvider>
        <EditorCore />
      </EditorProvider>
    </ToolLayout>
  );
}
