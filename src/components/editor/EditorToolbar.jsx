import React, { useState } from 'react';
import { useEditor } from './EditorContext';
import { Undo, Redo, ZoomIn, ZoomOut, Trash2, RotateCw, Download, FileUp, Loader2 } from 'lucide-react';
import { Button } from "../ui/button";

export function EditorToolbar({ onAddFiles, isUploading }) {
  const { zoom, setZoom, undo, redo, canUndo, canRedo, rotateSelected, deleteSelected, selectedPages, files, groups } = useEditor();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleZoomIn = () => setZoom(z => Math.min(z + 25, 300));
  const handleZoomOut = () => setZoom(z => Math.max(z - 25, 25));

  const handleDownload = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      // Build the JSON payload
      // Our generic schema requires: { pages: [ { sourceFile: 0, page: 0, rotation: 0, deleted: false, crop: null } ] }
      const payload = {
        pages: []
      };

      // We preserve the order by flattening groups
      groups.forEach(group => {
        group.pages.forEach(p => {
          if (!p.deleted) {
            // Find the index of the source file
            const fileIndex = files.findIndex(f => f.id === p.sourceFileId);
            payload.pages.push({
              sourceFile: fileIndex,
              page: p.pageIndex,
              rotation: p.rotation,
              deleted: p.deleted
            });
          }
        });
      });

      if (payload.pages.length === 0) {
        throw new Error("No pages to export.");
      }

      const formData = new FormData();
      files.forEach(f => {
        formData.append("files", f.file);
      });
      formData.append("operations", JSON.stringify(payload));

      // Use absolute or relative depending on environment
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiUrl}/api/v1/tools/edit-pdf`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to edit PDF");
      }

      // Download the result
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'edited_document.pdf';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 shadow-sm z-10">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} title="Undo" aria-label="Undo">
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} title="Redo" aria-label="Redo">
          <Redo className="w-4 h-4" />
        </Button>
        
        <div className="hidden md:flex w-px h-6 bg-gray-200 mx-2" />
        
        <div className="hidden md:flex items-center">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Zoom Out" aria-label="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium w-12 text-center" aria-live="polite">{zoom}%</span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Zoom In" aria-label="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-2" />
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => rotateSelected(90)} 
          disabled={selectedPages.length === 0}
          title="Rotate Right"
          aria-label="Rotate Right"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={deleteSelected} 
          disabled={selectedPages.length === 0}
          title="Delete Pages"
          aria-label="Delete Pages"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-3">
        {error && <span className="text-sm text-red-500 mr-2">{error}</span>}
        
        <label className="cursor-pointer">
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf,application/pdf" 
            multiple 
            onChange={(e) => {
              if (e.target.files.length > 0) {
                onAddFiles(Array.from(e.target.files));
                e.target.value = null;
              }
            }}
          />
          <div className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            {isUploading ? <Loader2 className="w-4 h-4 md:mr-2 animate-spin" /> : <FileUp className="w-4 h-4 md:mr-2" />}
            <span className="hidden md:inline">Add PDF</span>
          </div>
        </label>
        
        <Button onClick={handleDownload} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          {isProcessing ? <Loader2 className="w-4 h-4 md:mr-2 animate-spin" /> : <Download className="w-4 h-4 md:mr-2" />}
          <span className="hidden md:inline">Download</span>
        </Button>
      </div>
    </div>
  );
}
