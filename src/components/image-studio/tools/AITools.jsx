import { useState, useRef, useCallback } from 'react';
import { Eraser, Loader2, PaintBucket, CheckCircle2, ImageOff } from 'lucide-react';
import { useImageStudio } from '../ImageStudioContext';

const PRESET_COLORS = [
  { label: 'Transparent', value: 'transparent' },
  { label: 'White',       value: '#ffffff' },
  { label: 'Black',       value: '#000000' },
  { label: 'Gray',        value: '#808080' },
  { label: 'Red',         value: '#ef4444' },
  { label: 'Blue',        value: '#3b82f6' },
  { label: 'Green',       value: '#22c55e' },
];

export function BackgroundPanel() {
  const { image, applyEdit, addToast, loadImage, edits } = useImageStudio();
  const [removing, setRemoving]     = useState(false);
  const [progress, setProgress]     = useState('');
  const [bgDone, setBgDone]         = useState(false);
  const customColorRef              = useRef(null);

  const handleRemoveBg = useCallback(async () => {
    if (!image) {
      addToast('Please upload an image first.', 'error');
      return;
    }
    setRemoving(true);
    setBgDone(false);
    setProgress('Loading AI model...');

    try {
      // Dynamically import so the heavy WASM bundle is not in the initial chunk
      const { removeBackground } = await import('@imgly/background-removal');

      setProgress('Downloading AI model (first time only)...');

      // image.src is the object URL created by loadImages()
      const response = await fetch(image.src);
      const imageBlob = await response.blob();

      setProgress('Removing background...');

      const resultBlob = await removeBackground(imageBlob, {
        model: 'small',          // 'small' = fastest, ~5MB download
        output: {
          format: 'image/png',
          quality: 1,
        },
        progress: (key, current, total) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 100);
            setProgress(`Downloading model: ${pct}%`);
          }
        },
      });

      // Load the result back as the working image
      const newFile = new File(
        [resultBlob],
        `${image.name}_nobg.png`,
        { type: 'image/png' }
      );
      loadImage(newFile);
      setBgDone(true);
      setProgress('');
      addToast('Background removed!', 'success');
    } catch (err) {
      console.error('[BackgroundPanel] removal failed:', err);
      setProgress('');
      addToast(
        err?.message?.slice(0, 120) || 'Background removal failed. Please try again.',
        'error'
      );
    } finally {
      setRemoving(false);
    }
  }, [image, loadImage, addToast]);

  const applyColor = (color) => {
    applyEdit({ backgroundColor: color }, `Background: ${color}`);
  };

  const currentBg = edits?.backgroundColor ?? 'transparent';

  return (
    <div className="space-y-6">
      {/* ── Remove BG ── */}
      <div className="text-center">
        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-indigo-100">
          <Eraser className="w-7 h-7 text-indigo-500" />
        </div>
        <h4 className="text-sm font-bold text-gray-800 mb-1">AI Background Remover</h4>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          Runs entirely in your browser. No data leaves your device.
        </p>

        {/* Progress indicator */}
        {removing && progress && (
          <div className="mb-3 px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-100 text-xs text-indigo-700 font-medium animate-pulse text-left">
            {progress}
          </div>
        )}

        {/* Success badge */}
        {bgDone && !removing && (
          <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100 text-xs text-green-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            Background removed — apply a color below or export as PNG.
          </div>
        )}

        <button
          id="remove-bg-btn"
          onClick={handleRemoveBg}
          disabled={removing || !image}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
        >
          {removing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Eraser className="w-4 h-4" />
              Remove Background
            </>
          )}
        </button>
      </div>

      {/* ── Replace Background Color ── */}
      <div className="pt-5 border-t border-gray-100">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <PaintBucket className="w-3.5 h-3.5" />
          Replace Background
        </h4>

        <div className="grid grid-cols-7 gap-1.5 mb-3">
          {PRESET_COLORS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => applyColor(value)}
              title={label}
              className={`w-8 h-8 rounded-full border-2 shadow-sm hover:scale-110 transition-transform ${
                currentBg === value ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
              }`}
              style={{
                background:
                  value === 'transparent'
                    ? 'repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 50% / 10px 10px'
                    : value,
              }}
            />
          ))}
        </div>

        {/* Custom color picker */}
        <div className="flex items-center gap-2 mt-2">
          <label
            className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 hover:text-indigo-600 transition-colors font-medium"
            htmlFor="custom-bg-color"
          >
            <span
              className="w-6 h-6 rounded-full border-2 border-gray-300 inline-block overflow-hidden"
              style={{ background: currentBg !== 'transparent' ? currentBg : '#ffffff' }}
            />
            Custom color
          </label>
          <input
            id="custom-bg-color"
            type="color"
            ref={customColorRef}
            defaultValue="#ffffff"
            onChange={(e) => applyColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
          />
        </div>

        <p className="text-[11px] text-gray-400 mt-2">
          Applies color behind a transparent image. Remove background first for best results.
        </p>
      </div>
    </div>
  );
}
