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
};

export function ImageStudioProvider({ children }) {
  const [image, setImage] = useState(null); // { file, src, originalWidth, originalHeight, name }
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
  const loadImage = useCallback((file) => {
    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      addToast(`Unsupported format: ${file.type}`, 'error');
      return;
    }
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      // Revoke any old blob URL
      setImage(prev => {
        if (prev?.src?.startsWith('blob:')) URL.revokeObjectURL(prev.src);
        return {
          file,
          src,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: file.type,
        };
      });
      setEdits({ ...DEFAULT_EDITS, outputWidth: img.naturalWidth, outputHeight: img.naturalHeight });
      setHistory([]);
      setHistoryLabels([]);
      setActiveTool(null);
      setShowBeforeAfter(false);
      addToast('Image loaded', 'success');
    };
    img.onerror = () => addToast('Failed to load image', 'error');
    img.src = src;
  }, [addToast]);

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
  const cssFilter = `brightness(${edits.brightness}%) contrast(${edits.contrast}%) saturate(${edits.saturation}%)`;
  const cssTransform = [
    `rotate(${edits.rotation}deg)`,
    `scaleX(${edits.flipH ? -1 : 1})`,
    `scaleY(${edits.flipV ? -1 : 1})`,
  ].join(' ');

  /* ── Export helpers ──────────────────────────────────────── */
  const exportImage = useCallback(async (overrides = {}) => {
    if (!image) return null;
    const e = { ...edits, ...overrides };

    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((res, rej) => {
      img.onload = res; img.onerror = rej;
      img.src = image.src;
    });

    const isSwapped = e.rotation === 90 || e.rotation === 270;
    const outW = e.outputWidth || image.originalWidth;
    const outH = e.outputHeight || image.originalHeight;
    const canvasW = isSwapped ? outH : outW;
    const canvasH = isSwapped ? outW : outH;

    // Step 1: apply filters to an offscreen canvas
    const filterCanvas = Object.assign(document.createElement('canvas'), {
      width: img.naturalWidth, height: img.naturalHeight,
    });
    const fCtx = filterCanvas.getContext('2d');
    fCtx.filter = `brightness(${e.brightness}%) contrast(${e.contrast}%) saturate(${e.saturation}%)`;
    fCtx.drawImage(img, 0, 0);

    // Step 2: apply transforms
    const out = Object.assign(document.createElement('canvas'), { width: canvasW, height: canvasH });
    const ctx = out.getContext('2d');
    ctx.save();
    ctx.translate(canvasW / 2, canvasH / 2);
    ctx.rotate((e.rotation * Math.PI) / 180);
    ctx.scale(e.flipH ? -1 : 1, e.flipV ? -1 : 1);
    ctx.drawImage(filterCanvas, -outW / 2, -outH / 2, outW, outH);
    ctx.restore();

    return new Promise(resolve => out.toBlob(resolve, e.format, e.quality / 100));
  }, [image, edits]);

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
    image, edits, history, historyLabels,
    activeTool, setActiveTool,
    showBeforeAfter, setShowBeforeAfter,
    showHistory, setShowHistory,
    showExport, setShowExport,
    toasts, addToast, removeToast,
    loadImage, applyEdit, undo, reset,
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
