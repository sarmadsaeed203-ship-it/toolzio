import { useImageStudio } from '../ImageStudioContext';

/* ── Generic slider ──────────────────────────────────────────── */
function Slider({ label, value, min, max, step = 1, unit = '', onChange, onCommit }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
        <span className="text-sm font-bold text-gray-800 tabular-nums">{value}{unit}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          onMouseUp={onCommit}
          onTouchEnd={onCommit}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6366f1 ${pct}%, #e5e7eb ${pct}%)`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Resize Panel ────────────────────────────────────────────── */
export function ResizePanel() {
  const { image, edits, applyEdit } = useImageStudio();
  if (!image) return null;

  const w = edits.outputWidth || image.originalWidth;
  const h = edits.outputHeight || image.originalHeight;
  const ratio = image.originalWidth / image.originalHeight;

  const setW = (val) => {
    const newW = Math.max(1, Math.min(val, 8000));
    applyEdit({ outputWidth: newW, outputHeight: Math.round(newW / ratio) }, 'Resize');
  };
  const setH = (val) => {
    const newH = Math.max(1, Math.min(val, 8000));
    applyEdit({ outputWidth: Math.round(newH * ratio), outputHeight: newH }, 'Resize');
  };

  const presets = [
    { label: '1:1',  w: 1080, h: 1080 },
    { label: '16:9', w: 1920, h: 1080 },
    { label: '4:3',  w: 1600, h: 1200 },
    { label: '9:16', w: 1080, h: 1920 },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {/* Width */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Width</label>
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <input
              type="number" min={1} max={8000} value={w}
              onChange={e => setW(Number(e.target.value))}
              className="flex-1 w-0 text-sm font-medium text-gray-800 bg-transparent outline-none"
            />
            <span className="text-xs text-gray-400 font-medium">px</span>
          </div>
        </div>
        {/* Height */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Height</label>
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <input
              type="number" min={1} max={8000} value={h}
              onChange={e => setH(Number(e.target.value))}
              className="flex-1 w-0 text-sm font-medium text-gray-800 bg-transparent outline-none"
            />
            <span className="text-xs text-gray-400 font-medium">px</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center">
        Aspect ratio locked · {image.originalWidth}×{image.originalHeight} original
      </div>

      {/* Presets */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Presets</p>
        <div className="grid grid-cols-2 gap-2">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => applyEdit({ outputWidth: p.w, outputHeight: p.h }, `Resize to ${p.label}`)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            >
              {p.label} · {p.w}×{p.h}
            </button>
          ))}
          <button
            onClick={() => applyEdit({ outputWidth: image.originalWidth, outputHeight: image.originalHeight }, 'Reset Size')}
            className="col-span-2 px-3 py-2 rounded-lg border border-dashed border-gray-200 text-xs font-semibold text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-all"
          >
            Reset to original
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Rotate & Flip Panel ─────────────────────────────────────── */
export function RotateFlipPanel() {
  const { edits, applyEdit } = useImageStudio();

  const rotateCW  = () => applyEdit({ rotation: (edits.rotation + 90)  % 360 }, 'Rotate Right');
  const rotateCCW = () => applyEdit({ rotation: ((edits.rotation - 90) % 360 + 360) % 360 }, 'Rotate Left');
  const rotate180 = () => applyEdit({ rotation: (edits.rotation + 180) % 360 }, 'Rotate 180°');
  const flipH     = () => applyEdit({ flipH: !edits.flipH }, 'Flip Horizontal');
  const flipV     = () => applyEdit({ flipV: !edits.flipV }, 'Flip Vertical');

  const ActionBtn = ({ onClick, label, emoji, active }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
        active
          ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-600'
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Rotate</p>
        <div className="grid grid-cols-3 gap-2">
          <ActionBtn onClick={rotateCCW} label="Left 90°"  emoji="↺" />
          <ActionBtn onClick={rotateCW}  label="Right 90°" emoji="↻" />
          <ActionBtn onClick={rotate180} label="180°"      emoji="⟳" />
        </div>
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-400">Current: <strong className="text-gray-600">{edits.rotation}°</strong></span>
        </div>
      </div>

      <div className="w-full h-px bg-gray-100" />

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Flip</p>
        <div className="grid grid-cols-2 gap-2">
          <ActionBtn onClick={flipH} label="Horizontal" emoji="↔" active={edits.flipH} />
          <ActionBtn onClick={flipV} label="Vertical"   emoji="↕" active={edits.flipV} />
        </div>
      </div>
    </div>
  );
}

/* ── Adjustments Panel ───────────────────────────────────────── */
export function AdjustmentsPanel() {
  const { edits, applyEdit } = useImageStudio();

  // Live update (no history) — commit on release
  const liveUpdate = (key, val) => applyEdit({ [key]: val }, `Adjust ${key}`);

  const resetAdj = () => applyEdit({ brightness: 100, contrast: 100, saturation: 100 }, 'Reset Adjustments');

  return (
    <div className="space-y-5">
      <Slider
        label="Brightness" value={edits.brightness} min={0} max={200} unit="%"
        onChange={val => applyEdit({ brightness: val }, 'Brightness')}
        onCommit={() => {}}
      />
      <Slider
        label="Contrast" value={edits.contrast} min={0} max={200} unit="%"
        onChange={val => applyEdit({ contrast: val }, 'Contrast')}
        onCommit={() => {}}
      />
      <Slider
        label="Saturation" value={edits.saturation} min={0} max={200} unit="%"
        onChange={val => applyEdit({ saturation: val }, 'Saturation')}
        onCommit={() => {}}
      />
      <button
        onClick={resetAdj}
        className="w-full py-2 text-xs font-semibold text-gray-500 border border-dashed border-gray-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-all"
      >
        Reset to default
      </button>
    </div>
  );
}

/* ── Export Panel ────────────────────────────────────────────── */
export function ExportSettingsPanel() {
  const { edits, applyEdit, image, estimatedSize } = useImageStudio();
  if (!image) return null;

  const formats = [
    { value: 'image/png',  label: 'PNG',  desc: 'Lossless' },
    { value: 'image/jpeg', label: 'JPEG', desc: 'Smaller' },
    { value: 'image/webp', label: 'WebP', desc: 'Modern' },
    { value: 'image/bmp',  label: 'BMP',  desc: 'Uncompressed' },
    { value: 'image/tiff', label: 'TIFF', desc: 'Professional' },
  ];

  const size = estimatedSize();
  const sizeLabel = size > 1024 * 1024
    ? `${(size / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(size / 1024)} KB`;

  const needsQuality = edits.format !== 'image/png';

  return (
    <div className="space-y-5">
      {/* Format */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Format</p>
        <div className="grid grid-cols-3 gap-1.5">
          {formats.map(f => (
            <button
              key={f.value}
              onClick={() => applyEdit({ format: f.value }, `Format: ${f.label}`)}
              className={`flex flex-col items-center py-2.5 rounded-lg border text-xs font-bold transition-all ${
                edits.format === f.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              {f.label}
              <span className={`text-[9px] font-normal mt-0.5 ${edits.format === f.value ? 'text-indigo-400' : 'text-gray-400'}`}>
                {f.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quality (only for lossy formats) */}
      {needsQuality && (
        <Slider
          label="Quality"
          value={edits.quality} min={10} max={100} unit="%"
          onChange={val => applyEdit({ quality: val }, 'Quality')}
          onCommit={() => {}}
        />
      )}

      {/* Live estimate */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimated Output</p>
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          <span className="text-gray-500">Dimensions</span>
          <span className="font-bold text-gray-800 text-right">
            {edits.outputWidth || image.originalWidth}×{edits.outputHeight || image.originalHeight}
          </span>
          <span className="text-gray-500">File size</span>
          <span className={`font-bold text-right ${size < 500*1024 ? 'text-emerald-600' : size < 2*1024*1024 ? 'text-amber-600' : 'text-red-500'}`}>
            ~{sizeLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
