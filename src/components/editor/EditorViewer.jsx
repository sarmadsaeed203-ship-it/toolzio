import React from 'react';
import { useEditor } from './EditorContext';
import { Document, Page } from 'react-pdf';

export function EditorViewer() {
  const { groups, files, selectedPages, zoom } = useEditor();

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
    // Default to first page of first group
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
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No pages available.</p>
      </div>
    );
  }

  const file = files.find(f => f.id === displayPage.sourceFileId);
  const fileUrl = file ? file.url : null;

  return (
    <div className="flex-1 bg-gray-200/50 overflow-auto flex items-center justify-center p-8 relative">
      <div 
        className="bg-white shadow-2xl transition-transform"
        style={{ 
          transform: `scale(${zoom / 100})`, 
          transformOrigin: 'center center'
        }}
      >
        <div style={{ transform: `rotate(${displayPage.rotation}deg)`, transition: 'transform 0.3s ease' }}>
          <Document file={fileUrl}>
            <Page 
              pageIndex={displayPage.pageIndex} 
              renderTextLayer={true} 
              renderAnnotationLayer={true} 
              className="shadow-md"
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
