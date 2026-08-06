import { useRef, useState, useCallback } from 'react';
import { useImageStudio } from './ImageStudioContext';

/**
 * BeforeAfterSlider
 * Renders the original image behind a draggable divider.
 * The edited image (with CSS filters + transform) is clipped on the right side.
 */
export function BeforeAfterSlider({ imgStyle = {}, imgClass = '' }) {
  const { image, cssFilter, cssTransform } = useImageStudio();
  const [pos, setPos] = useState(50); // percentage 0-100
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setPos(p);
  }, []);

  const onMouseDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    updatePos(e.clientX);
    const onMove = (mv) => { if (dragging.current) updatePos(mv.clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp, { once: true });
  };

  const onTouchStart = (e) => {
    const onMove = (mv) => updatePos(mv.touches[0].clientX);
    const onEnd = () => {};
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd, { once: true });
  };

  if (!image) return null;

  const sharedImg = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    display: 'block',
    userSelect: 'none',
    pointerEvents: 'none',
    ...imgStyle,
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg shadow-2xl cursor-col-resize"
      style={{ userSelect: 'none', touchAction: 'none' }}
    >
      {/* BEFORE — original, no filter */}
      <img
        src={image.src}
        alt="Before"
        style={{ ...sharedImg, transform: cssTransform }}
        className={imgClass}
        draggable={false}
      />

      {/* AFTER — edited, clipped from left */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={image.src}
          alt="After"
          style={{ ...sharedImg, filter: cssFilter, transform: cssTransform }}
          className={imgClass}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)]"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      />

      {/* Drag handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center"
        style={{ left: `${pos}%`, cursor: 'col-resize' }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center gap-0.5 select-none">
          <div className="flex gap-0.5">
            {[0,1,2].map(i => (
              <span key={i} className="w-0.5 h-4 rounded-full bg-gray-400" />
            ))}
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3">
        <span className="text-xs font-bold text-white px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm">Before</span>
      </div>
      <div className="absolute top-3 right-3">
        <span className="text-xs font-bold text-white px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm">After</span>
      </div>
    </div>
  );
}
