import { createContext, useContext, useState, useCallback } from 'react';

const EditorContext = createContext();

export function EditorProvider({ children }) {
  const [files, setFiles] = useState([]); // Array of { id, file, url, numPages, name }
  
  // groups: Array of { id, title, pages: Array of { id, sourceFileId, pageIndex, rotation, deleted } }
  const [groups, setGroups] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [zoom, setZoom] = useState(100);

  const saveToHistory = useCallback((newGroups) => {
    setHistory(prev => [...prev, groups]);
    setRedoStack([]);
    setGroups(newGroups);
  }, [groups]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack(prev => [groups, ...prev]);
    setHistory(prev => prev.slice(0, -1));
    setGroups(previous);
  }, [history, groups]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory(prev => [...prev, groups]);
    setRedoStack(prev => prev.slice(1));
    setGroups(next);
  }, [redoStack, groups]);

  const addFile = useCallback((file, numPages, fileId) => {
    const newPages = Array.from({ length: numPages }).map((_, i) => ({
      id: `${fileId}-page-${i}`,
      sourceFileId: fileId,
      pageIndex: i,
      rotation: 0,
      deleted: false
    }));

    const newGroup = {
      id: `group-${fileId}`,
      title: file.name,
      pages: newPages
    };

    const newFile = { id: fileId, file, url: URL.createObjectURL(file), numPages, name: file.name };
    
    setFiles(prev => [...prev, newFile]);
    saveToHistory([...groups, newGroup]);
  }, [groups, saveToHistory]);

  const removeFile = useCallback((fileId) => {
    // Remove the file's group completely
    const newGroups = groups.filter(g => g.id !== `group-${fileId}`);
    // Also remove pages from this file that might have been dragged into other groups
    const cleanGroups = newGroups.map(g => ({
      ...g,
      pages: g.pages.filter(p => p.sourceFileId !== fileId)
    }));
    
    setFiles(prev => prev.filter(f => f.id !== fileId));
    saveToHistory(cleanGroups);
  }, [groups, saveToHistory]);

  const updateGroups = useCallback((newGroups) => {
    saveToHistory(newGroups);
  }, [saveToHistory]);
  
  const rotateSelected = useCallback((angle) => {
    if (selectedPages.length === 0) return;
    const newGroups = groups.map(g => ({
      ...g,
      pages: g.pages.map(p =>
        selectedPages.includes(p.id)
          ? { ...p, rotation: ((p.rotation + angle) % 360 + 360) % 360 }
          : p
      )
    }));
    saveToHistory(newGroups);
  }, [groups, selectedPages, saveToHistory]);
  
  const deleteSelected = useCallback(() => {
    if (selectedPages.length === 0) return;
    const newGroups = groups.map(g => ({
      ...g,
      pages: g.pages.map(p => 
        selectedPages.includes(p.id) ? { ...p, deleted: true } : p
      )
    }));
    saveToHistory(newGroups);
    setSelectedPages([]); // clear selection
  }, [groups, selectedPages, saveToHistory]);

  const value = {
    files,
    groups,
    selectedPages,
    setSelectedPages,
    zoom,
    setZoom,
    addFile,
    removeFile,
    updateGroups,
    rotateSelected,
    deleteSelected,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: redoStack.length > 0
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => useContext(EditorContext);
