import { createContext, useContext, useState, useCallback } from 'react';

const ImageStudioContext = createContext(null);

export const DEFAULT_EDITS = {
  rotation: 0,    // 0 | 90 | 180 | 270
  flipH: false,
  flipV: false,
  brightness: 100,    // 0-200, 100 = normal
  contrast: 100,
  saturation: 100,
  outputWidth: null,  // null = original
  outputHeight: null,
  crop: null,         // { x, y, w, h } px — null = no crop
  format: 'image/png',
  quality: 92,        // 0-100, for jpeg/webp
  backgroundColor: 'transparent', // Added for background changer
};

import JSZip from 'jszip';

export function ImageStudioProvider({ children }) {
  const [image, setImage] = useState(null); // { file, src, originalWidth, originalHeight, name, type }
  const [batchFiles, setBatchFiles] = useState([]); // Array of File objects if batch mode
  const [edits, setEdits] = useState(DEFAULT_EDITS);
  const [history, setHistory] = useState([]);        // array of edits snapshots
  const [historyLabels, setHistoryLabels] = useState([]);
  const [activeTool, setActiveTool] = useState(null); // string ID of open panel
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [toasts, setToasts] = useState([]);

  /* ── Toasts ─────────────────────────────────────────────── */
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  /* ── Image Loading ───────────────────────────────────────── */
  const loadImages = useCallback((files) => {
    const validFiles = Array.from(files).filter(f => ['image/png', 'image/jpeg', 'image/webp', 'image/bmp', 'image/gif'].includes(f.type));
    
    if (validFiles.length === 0) {
      addToast('No supported images found', 'error');
      return;
    }

    if (validFiles.length > 1) {
      setBatchFiles(validFiles);
      addToast(`Batch mode: ${validFiles.length} images loaded`, 'success');
    } else {
      setBatchFiles([]);
    }

    const firstFile = validFiles[0];
    const src = URL.createObjectURL(firstFile);
    const img = new Image();
    img.onload = () => {
      setImage(prev => {
        if (prev?.src?.startsWith('blob:')) URL.revokeObjectURL(prev.src);
        return {
          file: firstFile,
          src,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
          name: firstFile.name.replace(/\.[^/.]+$/, ''),
          type: firstFile.type,
        };
      });
      setEdits({ ...DEFAULT_EDITS, outputWidth: img.naturalWidth, outputHeight: img.naturalHeight });
      setHistory([]);
      setHistoryLabels([]);
      setActiveTool(null);
      setShowBeforeAfter(false);
      if (validFiles.length === 1) addToast('Image loaded', 'success');
    };
    img.onerror = () => addToast('Failed to load image', 'error');
    img.src = src;
  }, [addToast]);

  const loadImage = useCallback((file) => loadImages([file]), [loadImages]);

  /* ── Edit Application ────────────────────────────────────── */
  const applyEdit = useCallback((newEdits, label = 'Edit') => {
    setHistory(prev => [...prev.slice(-19), edits]);
    setHistoryLabels(prev => [...prev.slice(-19), label]);
    setEdits(prev => ({ ...prev, ...newEdits }));
  }, [edits]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setEdits(prev);
    setHistory(h => h.slice(0, -1));
    setHistoryLabels(l => l.slice(0, -1));
    addToast('Undone', 'info');
  }, [history, addToast]);

  const reset = useCallback(() => {
    if (!image) return;
    setEdits({ ...DEFAULT_EDITS, outputWidth: image.originalWidth, outputHeight: image.originalHeight });
    setHistory([]);
    setHistoryLabels([]);
    addToast('Reset to original', 'info');
  }, [image, addToast]);

  /* ── CSS shorthands for the canvas display ───────────────── */
  const cssFilter = `brightness(${edits.brightness}%) contrast(${edits.contrast}%) saturate(${edits.saturation}%) drop-shadow(0 0 0 ${edits.backgroundColor === 'transparent' ? 'rgba(0,0,0,0)' : edits.backgroundColor})`;
  const cssTransform = [
    `rotate(${edits.rotation}deg)`,
    `scaleX(${edits.flipH ? -1 : 1})`,
    `scaleY(${edits.flipV ? -1 : 1})`,
  ].join(' ');

  /* ── Export helpers ──────────────────────────────────────── */
  const processSingleImage = async (imgFile, e) => {
    const src = URL.createObjectURL(imgFile);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((res, rej) => {
      img.onload = res; img.onerror = rej;
      img.src = src;
    });

    const isSwapped = e.rotation === 90 || e.rotation === 270;
    
    // Use the original aspect ratio to compute new dimensions if outputWidth/Height is missing
    const origW = img.naturalWidth;
    const origH = img.naturalHeight;
    let outW = e.outputWidth || origW;
    let outH = e.outputHeight || origH;

    // For batch mode, if outputWidth/Height was changed, we need to respect it, but we might want to scale proportionally
    // For simplicity, we assume outputWidth/Height are absolute targets if set.

    const canvasW = isSwapped ? outH : outW;
    const canvasH = isSwapped ? outW : outH;

    // Step 1: apply filters to an offscreen canvas
    const filterCanvas = Object.assign(document.createElement('canvas'), {
      width: img.naturalWidth, height: img.naturalHeight,
    });
    const fCtx = filterCanvas.getContext('2d');
    fCtx.filter = `brightness(${e.brightness}%) contrast(${e.contrast}%) saturate(${e.saturation}%)`;
    fCtx.drawImage(img, 0, 0);

    // Step 2: apply transforms and background
    const out = Object.assign(document.createElement('canvas'), { width: canvasW, height: canvasH });
    const ctx = out.getContext('2d');
    
    if (e.backgroundColor !== 'transparent') {
      ctx.fillStyle = e.backgroundColor;
      ctx.fillRect(0, 0, canvasW, canvasH);
    }

    ctx.save();
    ctx.translate(canvasW / 2, canvasH / 2);
    ctx.rotate((e.rotation * Math.PI) / 180);
    ctx.scale(e.flipH ? -1 : 1, e.flipV ? -1 : 1);
    ctx.drawImage(filterCanvas, -outW / 2, -outH / 2, outW, outH);
    ctx.restore();
    URL.revokeObjectURL(src);

    return new Promise(resolve => out.toBlob(resolve, e.format, e.quality / 100));
  };

  const exportImage = useCallback(async (overrides = {}) => {
    if (!image) return null;
    const e = { ...edits, ...overrides };

    if (batchFiles.length > 1) {
      addToast('Processing batch...', 'info');
      const zip = new JSZip();
      
      const ext = e.format === 'image/jpeg' ? 'jpg' : e.format.split('/')[1] || 'png';
      
      for (let i = 0; i < batchFiles.length; i++) {
        const file = batchFiles[i];
        const blob = await processSingleImage(file, e);
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        zip.file(`${baseName}_edited.${ext}`, blob);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      addToast('Batch complete!', 'success');
      return zipBlob;
    } else {
      return await processSingleImage(image.file, e);
    }
  }, [image, edits, batchFiles, addToast]);


  /* ── Estimated file size ─────────────────────────────────── */
  const estimatedSize = useCallback((overrides = {}) => {
    if (!image) return null;
    const e = { ...edits, ...overrides };
    const w = e.outputWidth || image.originalWidth;
    const h = e.outputHeight || image.originalHeight;
    const pixels = w * h;
    let bytes;
    if (e.format === 'image/png') bytes = pixels * 2.5;         // rough
    else if (e.format === 'image/jpeg') bytes = pixels * (e.quality / 100) * 0.3;
    else if (e.format === 'image/webp') bytes = pixels * (e.quality / 100) * 0.2;
    else bytes = pixels * 3;
    return Math.round(bytes);
  }, [image, edits]);

  const value = {
    image, edits, history, historyLabels, batchFiles,
    activeTool, setActiveTool,
    showBeforeAfter, setShowBeforeAfter,
    showHistory, setShowHistory,
    showExport, setShowExport,
    toasts, addToast, removeToast,
    loadImage, loadImages, applyEdit, undo, reset,
    cssFilter, cssTransform,
    canUndo: history.length > 0,
    exportImage, estimatedSize,
  };

  return (
    <ImageStudioContext.Provider value={value}>
      {children}
    </ImageStudioContext.Provider>
  );
}

export const useImageStudio = () => {
  const ctx = useContext(ImageStudioContext);
  if (!ctx) throw new Error('useImageStudio must be used within ImageStudioProvider');
  return ctx;
};
