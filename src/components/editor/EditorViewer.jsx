import React, { useRef, useEffect, useState } from 'react';
import { useEditor } from './EditorContext';
import { Document, Page } from 'react-pdf';
import { FileText } from 'lucide-react';

export function EditorViewer() {
  const { groups, files, selectedPages, zoom } = useEditor();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Track container width for responsive page sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    setContainerWidth(containerRef.current.offsetWidth);
    return () => observer.disconnect();
  }, []);

  // Find the first selected page to display
  let displayPage = null;
  if (selectedPages.length > 0) {
    const selectedId = selectedPages[0];
    for (const group of groups) {
      const page = group.pages.find(p => p.id === selectedId);
      if (page) {
        displayPage = page;
        break;
      }
    }
  } else {
    // Default to first non-deleted page of first group
    for (const group of groups) {
      const page = group.pages.find(p => !p.deleted);
      if (page) {
        displayPage = page;
        break;
      }
    }
  }

  if (!displayPage) {
    return (
      <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center text-center p-8">
        <div className="flex flex-col items-center gap-4 opacity-50">
          <FileText className="w-16 h-16 text-gray-400" />
          <p className="text-gray-500 font-medium">No pages available</p>
          <p className="text-gray-400 text-sm">Upload a PDF to start editing</p>
        </div>
      </div>
    );
  }

  const file = files.find(f => f.id === displayPage.sourceFileId);
  const fileUrl = file ? file.url : null;

  // Calculate display width: container minus padding, then apply zoom
  const padding = 64; // 32px on each side
  const baseWidth = Math.max(containerWidth - padding, 100);
  const displayWidth = Math.round((baseWidth * zoom) / 100);

  const isRotated90 = displayPage.rotation === 90 || displayPage.rotation === 270;

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-[#525659] overflow-auto flex items-start justify-center p-8"
      style={{ minWidth: 0 }}
    >
      <div
        className="flex flex-col items-center"
        style={{ minWidth: `${displayWidth}px` }}
      >
        {/* Page wrapper — rotation applied here, viewer width drives the size */}
        <div
          style={{
            transform: `rotate(${displayPage.rotation}deg)`,
            transition: 'transform 0.25s ease',
            // When rotated 90/270, the visual width becomes the page height.
            // We swap width/height so the rotated page still fits the container.
            width: isRotated90 ? 'auto' : `${displayWidth}px`,
          }}
        >
          <Document file={fileUrl}>
            <Page
              pageIndex={displayPage.pageIndex}
              width={isRotated90 ? undefined : displayWidth}
              height={isRotated90 ? displayWidth : undefined}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-2xl"
            />
          </Document>
        </div>

        {/* Page indicator */}
        <div className="mt-4 px-3 py-1 bg-black/40 rounded-full text-white text-xs font-medium">
          Page {displayPage.pageIndex + 1}
          {displayPage.rotation !== 0 && ` · ${displayPage.rotation}°`}
        </div>
      </div>
    </div>
  );
}
