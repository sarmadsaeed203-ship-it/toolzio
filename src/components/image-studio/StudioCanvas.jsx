import { useRef, useCallback, useState } from 'react';
import { useImageStudio } from './ImageStudioContext';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

/**
 * StudioCanvas
 * The central viewer area. Shows the edited image with CSS filters/transforms.
 * Supports zoom, before/after mode, and drag-to-scroll.
 */
export function StudioCanvas() {
  const { image, edits, cssFilter, cssTransform, showBeforeAfter, loadImage } = useImageStudio();
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const zoomIn  = () => setZoom(z => Math.min(z + 10, 400));
  const zoomOut = () => setZoom(z => Math.max(z - 10, 20));
  const zoomReset = () => setZoom(100);

  /* Drop to replace image */
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = Array.from(e.dataTransfer.files).find(f => f.type.startsWith('image/'));
    if (file) loadImage(file);
  }, [loadImage]);

  /* Zoom with wheel */
  const onWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom(z => Math.max(20, Math.min(400, z - e.deltaY * 0.3)));
    }
  };

  const isSwapped = edits.rotation === 90 || edits.rotation === 270;

  return (
    <div
      ref={containerRef}
      className="flex-1 relative flex flex-col overflow-hidden"
      style={{ background: '#1a1a2e', minWidth: 0 }}
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onWheel={onWheel}
    >
      {/* Drop overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-20 flex items-center justify-center border-4 border-dashed border-indigo-400 bg-indigo-500/10 rounded-lg m-4 transition-all">
          <p className="text-indigo-300 text-xl font-bold">Drop to replace image</p>
        </div>
      )}

      {/* Canvas area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-12"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#334 #111' }}
      >
        {image ? (
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {showBeforeAfter ? (
              <BeforeAfterSlider />
            ) : (
              /* Single edited image */
              <div
                className="relative"
                style={{
                  transition: 'box-shadow 0.3s ease',
                  borderRadius: '4px',
                  overflow: isSwapped ? 'visible' : 'hidden',
                }}
              >
                <img
                  src={image.src}
                  alt="Editing preview"
                  style={{
                    filter: cssFilter,
                    transform: cssTransform,
                    transition: 'filter 0.15s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    display: 'block',
                    maxWidth: 'none',
                    width: edits.outputWidth ? `${edits.outputWidth}px` : undefined,
                    height: edits.outputHeight ? `${edits.outputHeight}px` : undefined,
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    borderRadius: '4px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                  }}
                  draggable={false}
                />
              </div>
            )}
          </div>
        ) : (
          /* No image placeholder */
          <div className="text-center opacity-30">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🖼</span>
            </div>
            <p className="text-gray-400 font-medium">No image loaded</p>
          </div>
        )}
      </div>

      {/* Zoom controls */}
      {image && (
        <div className="absolute bottom-5 right-5 flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl px-2 py-1.5 shadow-xl">
          <button
            onClick={zoomOut}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={zoomReset}
            className="w-14 text-center text-xs font-bold text-gray-300 hover:text-white transition-colors tabular-nums"
          >
            {zoom}%
          </button>
          <button
            onClick={zoomIn}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Ctrl+scroll hint */}
      {image && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-600 pointer-events-none">
          Ctrl + scroll to zoom
        </div>
      )}
    </div>
  );
}
