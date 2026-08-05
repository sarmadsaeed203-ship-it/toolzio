import React, { useState } from 'react';
import { useEditor } from './EditorContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Document, Page } from 'react-pdf';
import { Trash2, RotateCw, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

function Thumbnail({ page, fileUrl, isSelected, onClick, onRotate, onDelete }) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  if (page.deleted) return null;

  return (
    <div 
      className={clsx(
        "relative group flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all border-2",
        isSelected ? "border-blue-500 bg-blue-50" : "border-transparent hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      <div ref={observerRef} className="relative shadow-sm bg-white overflow-hidden flex items-center justify-center" style={{ minHeight: '120px', minWidth: '90px' }}>
        {isVisible ? (
          <div style={{ transform: `rotate(${page.rotation}deg)`, transition: 'transform 0.2s ease' }}>
            <Document file={fileUrl}>
              <Page 
                pageIndex={page.pageIndex} 
                width={100}
                renderTextLayer={false} 
                renderAnnotationLayer={false} 
                loading={<div className="flex items-center justify-center h-[120px]"><Loader2 className="w-4 h-4 animate-spin text-gray-300" /></div>}
              />
            </Document>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-50">
            <Loader2 className="w-4 h-4 animate-spin text-gray-300" />
          </div>
        )}
        
        {/* Hover Actions */}
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition-opacity">
          <button 
            className="p-1 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600"
            onClick={(e) => { e.stopPropagation(); onRotate(); }}
          >
            <RotateCw className="w-3 h-3" />
          </button>
          <button 
            className="p-1 bg-white rounded-full shadow hover:bg-red-50 text-red-500"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-500 mt-2">{page.pageIndex + 1}</span>
    </div>
  );
}

export function EditorSidebar() {
  const { groups, updateGroups, files, selectedPages, setSelectedPages, rotateSelected, deleteSelected } = useEditor();

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newGroups = [...groups];
    
    // Find source and dest groups
    const sourceGroupIndex = newGroups.findIndex(g => g.id === source.droppableId);
    const destGroupIndex = newGroups.findIndex(g => g.id === destination.droppableId);
    
    const sourceGroup = { ...newGroups[sourceGroupIndex] };
    const destGroup = sourceGroupIndex === destGroupIndex ? sourceGroup : { ...newGroups[destGroupIndex] };
    
    const sourcePages = [...sourceGroup.pages];
    const destPages = sourceGroupIndex === destGroupIndex ? sourcePages : [...destGroup.pages];
    
    // Remove from source
    const [movedPage] = sourcePages.splice(source.index, 1);
    
    // Add to dest
    destPages.splice(destination.index, 0, movedPage);
    
    sourceGroup.pages = sourcePages;
    destGroup.pages = destPages;
    
    newGroups[sourceGroupIndex] = sourceGroup;
    if (sourceGroupIndex !== destGroupIndex) {
      newGroups[destGroupIndex] = destGroup;
    }
    
    updateGroups(newGroups);
  };

  const toggleSelection = (pageId, multi) => {
    if (multi) {
      setSelectedPages(prev => 
        prev.includes(pageId) ? prev.filter(id => id !== pageId) : [...prev, pageId]
      );
    } else {
      setSelectedPages([pageId]);
    }
  };

  const getFileUrl = (fileId) => {
    const file = files.find(f => f.id === fileId);
    return file ? file.url : null;
  };

  return (
    <div className="w-32 md:w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
      <div className="p-3 border-b border-gray-100 bg-gray-50 sticky top-0 z-10 hidden md:block">
        <h3 className="text-sm font-semibold text-gray-700">Pages</h3>
      </div>
      
      <div className="flex-1 p-2">
        <DragDropContext onDragEnd={handleDragEnd}>
          {groups.map((group) => (
            <div key={group.id} className="mb-6">
              <div className="px-2 py-1 mb-2 bg-gray-100 rounded text-xs font-semibold text-gray-600 truncate" title={group.title}>
                {group.title}
              </div>
              
              <Droppable droppableId={group.id}>
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                  >
                    {group.pages.map((page, index) => (
                      page.deleted ? null : (
                        <Draggable key={page.id} draggableId={page.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.8 : 1,
                              }}
                            >
                              <Thumbnail 
                                page={page} 
                                fileUrl={getFileUrl(page.sourceFileId)}
                                isSelected={selectedPages.includes(page.id)}
                                onClick={(e) => toggleSelection(page.id, e.ctrlKey || e.metaKey || e.shiftKey)}
                                onRotate={() => {
                                  if (!selectedPages.includes(page.id)) setSelectedPages([page.id]);
                                  rotateSelected(90);
                                }}
                                onDelete={() => {
                                  if (!selectedPages.includes(page.id)) setSelectedPages([page.id]);
                                  deleteSelected();
                                }}
                              />
                            </div>
                          )}
                        </Draggable>
                      )
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
