import { useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { useImageStudio } from './ImageStudioContext';

function fmt(bytes) {
  if (!bytes) return '--';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const FORMAT_EXT = {
  'image/png':  'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

const FORMATS = [
  { value: 'image/png',  label: 'PNG',  desc: 'Best for transparency & crisp graphics' },
  { value: 'image/jpeg', label: 'JPEG', desc: 'Best for photos (smaller file size)' },
  { value: 'image/webp', label: 'WebP', desc: 'Modern format, best compression' },
];

export function ExportDialog() {
  const { image, edits, showExport, setShowExport, exportImage, estimatedSize, addToast } = useImageStudio();
  const [filename, setFilename] = useState(image?.name ?? 'image');
  const [format, setFormat] = useState(edits.format);
  const [quality, setQuality] = useState(edits.quality);
  const [exporting, setExporting] = useState(false);

  if (!showExport || !image) return null;

  const estSize = estimatedSize({ format, quality });
  const needsQuality = format !== 'image/png';
  const ext = FORMAT_EXT[format] ?? 'png';

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportImage({ format, quality });
      if (!blob) throw new Error('Export failed');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename || 'image'}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowExport(false);
      addToast('Image exported successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Export failed. Please try again.', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setShowExport(false)}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Export Image</h2>
            </div>
            <button
              onClick={() => setShowExport(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Filename */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Filename
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <input
                  type="text"
                  value={filename}
                  onChange={e => setFilename(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-800 bg-gray-50 outline-none"
                  placeholder="my-image"
                />
                <span className="px-3 py-2.5 text-sm text-gray-400 bg-gray-100 border-l border-gray-200 font-medium">
                  .{ext}
                </span>
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Format
              </label>
              <div className="space-y-2">
                {FORMATS.map(f => (
                  <label
                    key={f.value}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      format === f.value
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio" name="format" value={f.value}
                      checked={format === f.value}
                      onChange={() => setFormat(f.value)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-800">{f.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Quality slider */}
            {needsQuality && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quality</label>
                  <span className="text-sm font-bold text-gray-800">{quality}%</span>
                </div>
                <input
                  type="range" min={10} max={100} value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #6366f1 ${quality}%, #e5e7eb ${quality}%)`,
                  }}
                />
              </div>
            )}

            {/* Estimated output */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
              <div className="grid grid-cols-2 gap-y-1 text-sm">
                <span className="text-gray-500">Dimensions</span>
                <span className="font-bold text-gray-800 text-right">
                  {edits.outputWidth || image.originalWidth}×{edits.outputHeight || image.originalHeight} px
                </span>
                <span className="text-gray-500">Estimated size</span>
                <span className={`font-bold text-right ${estSize < 500*1024 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  ~{fmt(estSize)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setShowExport(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporting…
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
