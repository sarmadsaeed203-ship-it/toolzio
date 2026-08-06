import { useState, useRef } from 'react';
import { Eraser, Loader2, PaintBucket, CheckCircle2 } from 'lucide-react';
import { useImageStudio } from '../ImageStudioContext';

export function BackgroundPanel() {
  const { image, applyEdit, addToast, loadImage } = useImageStudio();
  const [removing, setRemoving] = useState(false);

  const handleRemoveBg = async () => {
    if (!image) return;
    setRemoving(true);
    try {
      const formData = new FormData();
      formData.append('file', image.file);

      // Using the same URL proxy mechanism assuming backend runs on :8000
      const res = await fetch('/api/tools/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errText = 'Failed to remove background';
        try {
          const errData = await res.json();
          errText = errData.detail || errText;
        } catch (e) {
          errText = `HTTP ${res.status}: ${res.statusText}`;
        }
        throw new Error(errText);
      }

      const blob = await res.blob();
      const newFile = new File([blob], `${image.name}_nobg.png`, { type: 'image/png' });
      loadImage(newFile);
      addToast('Background removed successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Error removing background. Please try again.', 'error');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
          <Eraser className="w-8 h-8 text-indigo-500" />
        </div>
        <h4 className="text-sm font-bold text-gray-800 mb-2">AI Background Remover</h4>
        <p className="text-xs text-gray-500 leading-relaxed mb-6">
          Automatically detect and remove the background from your image with professional accuracy.
        </p>

        <button
          onClick={handleRemoveBg}
          disabled={removing}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
        >
          {removing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Removing...
            </>
          ) : (
            <>
              <Eraser className="w-4 h-4" />
              Remove Background
            </>
          )}
        </button>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <PaintBucket className="w-3.5 h-3.5" />
          Background Color
        </h4>
        <div className="flex gap-2 flex-wrap">
          {['transparent', '#ffffff', '#000000', '#ef4444', '#3b82f6', '#22c55e'].map(color => (
            <button
              key={color}
              onClick={() => applyEdit({ type: 'BACKGROUND', value: color })}
              className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm hover:scale-110 transition-transform"
              style={{
                background: color === 'transparent' 
                  ? 'repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 50% / 10px 10px'
                  : color
              }}
              title={color}
            />
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-3">
          Applies a solid background color behind transparent images.
        </p>
      </div>
    </div>
  );
}
