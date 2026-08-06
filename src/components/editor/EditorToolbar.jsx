import React, { useState } from 'react';
import { useEditor } from './EditorContext';
import {
  Undo, Redo, ZoomIn, ZoomOut, Trash2, RotateCw, RotateCcw,
  Download, FileUp, Loader2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '../ui/button';

// Vertical separator helper
function Sep() {
  return <div className="w-px h-5 bg-gray-200 mx-1 shrink-0" />;
}

export function EditorToolbar({ onAddFiles, isUploading, onToggleProperties, propertiesOpen }) {
  const {
    zoom, setZoom,
    undo, redo, canUndo, canRedo,
    rotateSelected, deleteSelected,
    selectedPages, files, groups,
  } = useEditor();

  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const handleZoomIn  = () => setZoom(z => Math.min(z + 10, 300));
  const handleZoomOut = () => setZoom(z => Math.max(z - 10, 25));
  const handleFitWidth = () => setZoom(100);

  const handleDownload = async () => {
    setIsProcessing(true);
    setDownloadError(null);
    try {
      const payload = { pages: [] };

      groups.forEach(group => {
        group.pages.forEach(p => {
          if (!p.deleted) {
            const fileIndex = files.findIndex(f => f.id === p.sourceFileId);
            payload.pages.push({
              sourceFile: fileIndex,
              page: p.pageIndex,
              rotation: p.rotation,
              deleted: false,
            });
          }
        });
      });

      if (payload.pages.length === 0) throw new Error('No pages to export.');

      const formData = new FormData();
      files.forEach(f => formData.append('files', f.file));
      formData.append('operations', JSON.stringify(payload));

      // API_V1_STR in config.py is "/api", so route is /api/tools/edit-pdf
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiBase}/api/tools/edit-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let detail = 'Failed to edit PDF.';
        try {
          const errJson = await response.json();
          detail = errJson.detail || detail;
        } catch (_e) { /* ignore parse error — use default message */ }
        throw new Error(detail);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'edited_document.pdf';
      if (contentDisposition) {
        const m = contentDisposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?(.*?)(?:['"]|$)/i);
        if (m?.[1]) filename = decodeURIComponent(m[1]);
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
      setDownloadError(err.message);
      // Auto-clear after 6 s
      setTimeout(() => setDownloadError(null), 6000);
    } finally {
      setIsProcessing(false);
    }
  };

  const hasSelection = selectedPages.length > 0;

  return (
    <div className="relative">
      {/* Main toolbar row */}
      <div className="h-12 border-b border-gray-200 bg-white flex items-center px-3 gap-1 shadow-sm z-10 flex-wrap">

        {/* ── Group 1: History ── */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost" size="icon" onClick={undo} disabled={!canUndo}
            title="Undo (Ctrl+Z)" aria-label="Undo"
            className="h-8 w-8"
          >
            <Undo className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost" size="icon" onClick={redo} disabled={!canRedo}
            title="Redo (Ctrl+Y)" aria-label="Redo"
            className="h-8 w-8"
          >
            <Redo className="w-3.5 h-3.5" />
          </Button>
        </div>

        <Sep />

        {/* ── Group 2: Zoom ── */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost" size="icon" onClick={handleZoomOut}
            title="Zoom Out" aria-label="Zoom Out"
            className="h-8 w-8"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <button
            onClick={handleFitWidth}
            className="w-14 text-center text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded px-1 py-1 transition-colors"
            title="Click to reset to Fit Width"
            aria-live="polite"
          >
            {zoom}%
          </button>
          <Button
            variant="ghost" size="icon" onClick={handleZoomIn}
            title="Zoom In" aria-label="Zoom In"
            className="h-8 w-8"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
        </div>

        <Sep />

        {/* ── Group 3: Rotate ── */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost" size="icon"
            onClick={() => rotateSelected(-90)}
            disabled={!hasSelection}
            title="Rotate Left 90°" aria-label="Rotate Left"
            className="h-8 w-8"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost" size="icon"
            onClick={() => rotateSelected(90)}
            disabled={!hasSelection}
            title="Rotate Right 90°" aria-label="Rotate Right"
            className="h-8 w-8"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </Button>
        </div>

        <Sep />

        {/* ── Group 4: Delete ── */}
        <Button
          variant="ghost" size="icon"
          onClick={deleteSelected}
          disabled={!hasSelection}
          title="Delete Selected Pages" aria-label="Delete Pages"
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Group 5: File Actions ── */}
        <div className="flex items-center gap-2">
          {/* Add PDF */}
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".pdf,application/pdf"
              multiple
              onChange={e => {
                if (e.target.files.length > 0) {
                  onAddFiles(Array.from(e.target.files));
                  e.target.value = null;
                }
              }}
            />
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors h-8">
              {isUploading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <FileUp className="w-3.5 h-3.5" />
              }
              <span className="hidden sm:inline text-xs">Add PDF</span>
            </div>
          </label>

          {/* Download */}
          <Button
            onClick={handleDownload}
            disabled={isProcessing}
            className="h-8 bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-xs gap-1.5"
          >
            {isProcessing
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Download className="w-3.5 h-3.5" />
            }
            <span className="hidden sm:inline">Download</span>
          </Button>

          {/* Toggle Properties Panel */}
          <Button
            variant="ghost" size="icon"
            onClick={onToggleProperties}
            title={propertiesOpen ? 'Hide Properties' : 'Show Properties'}
            aria-label="Toggle Properties"
            className="h-8 w-8 hidden lg:flex"
          >
            {propertiesOpen
              ? <ChevronRight className="w-3.5 h-3.5" />
              : <ChevronLeft className="w-3.5 h-3.5" />
            }
          </Button>
        </div>
      </div>

      {/* Error Toast */}
      {downloadError && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-red-600 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg max-w-sm text-center animate-in fade-in slide-in-from-top-2">
          ⚠ {downloadError}
        </div>
      )}
    </div>
  );
}
