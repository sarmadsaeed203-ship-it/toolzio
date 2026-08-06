import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ImageStudioProvider, useImageStudio } from '../components/image-studio/ImageStudioContext';
import { EmptyState } from '../components/image-studio/EmptyState';
import { StudioCanvas } from '../components/image-studio/StudioCanvas';
import { StudioToolbar, ToolPanel } from '../components/image-studio/StudioToolbar';
import { HistoryPanel } from '../components/image-studio/HistoryPanel';
import { StatusBar } from '../components/image-studio/StatusBar';
import { ExportDialog } from '../components/image-studio/ExportDialog';
import { ToastContainer } from '../components/image-studio/ToastContainer';

/**
 * ImageStudioShell
 * Assembled the full editor layout once an image is loaded.
 * Uses Helmet for SEO, keyboard shortcuts, and the 3-panel layout.
 */
function ImageStudioShell() {
  const { image, undo, canUndo, setShowExport } = useImageStudio();

  /* Keyboard shortcuts */
  useEffect(() => {
    const handler = (e) => {
      const active = document.activeElement;
      const isInput = active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA';
      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (canUndo) undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'e')) {
        e.preventDefault();
        if (image) setShowExport(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, canUndo, image, setShowExport]);

  return (
    <>
      <Helmet>
        <title>Image Studio — Toolzio</title>
        <meta name="description" content="Professional browser-based image editor. Crop, resize, rotate, flip, adjust brightness, convert formats and more." />
        <meta property="og:title" content="Image Studio — Toolzio" />
        <meta property="og:description" content="Professional image editing in your browser. No uploads. No sign-in." />
      </Helmet>

      {/* Full-screen editor — no header/footer to maximize canvas space */}
      <div className="fixed inset-0 flex flex-col bg-white font-sans" style={{ zIndex: 0 }}>
        {/* Top toolbar */}
        <StudioToolbar />

        {/* Middle: sidebar + canvas + tool panel */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Canvas area */}
          <StudioCanvas />

          {/* Right: Tool panel (slides in/out) */}
          <ToolPanel />

          {/* History panel (only on wide screens) */}
          <HistoryPanel />
        </div>

        {/* Bottom status bar */}
        <StatusBar />

        {/* Modals */}
        <ExportDialog />

        {/* Toasts */}
        <ToastContainer />
      </div>

      {/* Empty state overlays the editor when no image is loaded */}
      {!image && (
        <div className="fixed inset-0 z-10">
          {/* Toolbar still accessible */}
          <StudioToolbar />
          <div style={{ height: 'calc(100vh - 80px)' }}>
            <EmptyState />
          </div>
        </div>
      )}
    </>
  );
}

export function ImageStudio() {
  return (
    <ImageStudioProvider>
      <ImageStudioShell />
    </ImageStudioProvider>
  );
}
