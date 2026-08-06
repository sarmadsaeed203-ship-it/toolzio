import React from 'react';
import { useEditor } from './EditorContext';
import { FileText, RotateCw, X } from 'lucide-react';

export function EditorProperties({ isOpen, onClose }) {
  const { groups, files, selectedPages } = useEditor();

  // Find all selected pages
  const selectedPageData = [];
  for (const group of groups) {
    for (const page of group.pages) {
      if (selectedPages.includes(page.id)) {
        const file = files.find(f => f.id === page.sourceFileId);
        selectedPageData.push({ page, file, group });
      }
    }
  }

  const displayPage = selectedPageData[0];

  if (!isOpen) return null;

  return (
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto shrink-0">
      {/* Header */}
      <div className="h-12 px-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between sticky top-0 z-10">
        <h3 className="text-sm font-semibold text-gray-700">Properties</h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors"
          aria-label="Close Properties"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!displayPage ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <FileText className="w-8 h-8 text-gray-300 mb-3" />
          <p className="text-sm text-gray-400 font-medium">No page selected</p>
          <p className="text-xs text-gray-300 mt-1">Click a thumbnail to view its properties</p>
        </div>
      ) : (
        <div className="p-4 space-y-5">
          {/* Selection count */}
          {selectedPageData.length > 1 && (
            <div className="text-xs font-semibold text-blue-600 bg-blue-50 rounded px-2 py-1">
              {selectedPageData.length} pages selected
            </div>
          )}

          {/* Source file */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Source
            </h4>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span className="break-all">{displayPage.file?.name ?? 'Unknown'}</span>
            </div>
          </div>

          {/* Page info */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Page Info
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Original page</span>
                <span className="font-medium">{displayPage.page.pageIndex + 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Group</span>
                <span className="font-medium truncate ml-2 max-w-[120px]" title={displayPage.group.title}>
                  {displayPage.group.title}
                </span>
              </div>
            </div>
          </div>

          {/* Transform */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Transform
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <RotateCw className="w-4 h-4" />
                  Rotation
                </div>
                <span className="font-medium">{displayPage.page.rotation}°</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
