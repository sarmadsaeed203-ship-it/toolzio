import React from 'react';
import { useEditor } from './EditorContext';
import { FileText, Maximize, RotateCw } from 'lucide-react';

export function EditorProperties() {
  const { groups, files, selectedPages } = useEditor();

  // Find the first selected page to display its properties
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
  }

  if (!displayPage) {
    return (
      <div className="w-64 bg-white border-l border-gray-200 flex flex-col hidden lg:flex p-4 text-sm text-gray-500">
        Select a page to view its properties.
      </div>
    );
  }

  const file = files.find(f => f.id === displayPage.sourceFileId);

  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col hidden lg:flex">
      <div className="p-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">Properties</h3>
      </div>
      
      <div className="p-4 space-y-6">
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Selection Info</h4>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-700">
              <FileText className="w-4 h-4 mr-2 text-gray-400" />
              <span className="truncate" title={file?.name}>{file?.name}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <span className="w-4 h-4 mr-2 text-gray-400 font-bold text-center">#</span>
              Original Page {displayPage.pageIndex + 1}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Transform</h4>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-700">
              <RotateCw className="w-4 h-4 mr-2 text-gray-400" />
              Rotation: {displayPage.rotation}°
            </div>
            {/* Dimensions would be extracted from PDF.js if needed, stubbing for now */}
            <div className="flex items-center text-sm text-gray-700">
              <Maximize className="w-4 h-4 mr-2 text-gray-400" />
              Crop: Original
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
