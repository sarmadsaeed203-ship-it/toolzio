import { useState, useRef, useCallback } from 'react';
import { Upload, ImagePlus, Crop, Maximize2, RotateCw, FlipHorizontal2, SlidersHorizontal, Zap, CheckCircle2 } from 'lucide-react';
import { useImageStudio } from './ImageStudioContext';

const FORMATS = ['PNG', 'JPG', 'JPEG', 'WEBP', 'BMP'];

const FEATURES = [
  { icon: Crop,              label: 'Crop' },
  { icon: Maximize2,         label: 'Resize' },
  { icon: RotateCw,          label: 'Rotate' },
  { icon: FlipHorizontal2,   label: 'Flip' },
  { icon: SlidersHorizontal, label: 'Adjust' },
  { icon: Zap,               label: 'Export' },
];

export function EmptyState() {
  const { loadImages } = useImageStudio();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback((files) => {
    if (files.length) loadImages(files);
  }, [loadImages]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
      style={{ background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #faf8ff 100%)' }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-10 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }} />
      </div>

      {/* Full-page drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.08)', backdropFilter: 'blur(2px)' }}>
          <div className="flex flex-col items-center gap-4 px-12 py-10 rounded-3xl border-2 border-dashed border-indigo-400 bg-white/80 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center">
              <Upload className="w-10 h-10 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-indigo-700">Drop your image here</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full px-6 text-center">
        {/* Logo / App name */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <ImagePlus className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-semibold text-indigo-600 tracking-widest uppercase">Image Studio</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight mb-3">
          Professional<br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Image Editor
          </span>
        </h1>
        <p className="text-lg text-gray-500 font-light mb-10 max-w-md leading-relaxed">
          Edit, Crop, Resize, Convert, Compress and Optimize images — directly in your browser. No uploads. No waiting.
        </p>

        {/* Upload zone */}
        <div
          className="w-full mb-8 rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-5 cursor-pointer transition-all duration-300 group"
          style={{
            borderColor: isDragging ? '#6366f1' : '#d1d5db',
            background: isDragging ? 'rgba(99,102,241,0.04)' : 'rgba(255,255,255,0.7)',
            boxShadow: isDragging ? '0 0 0 4px rgba(99,102,241,0.12)' : 'none',
            backdropFilter: 'blur(12px)',
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload image"
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800 mb-1">Drag & Drop your image here</p>
            <p className="text-sm text-gray-400">or click to browse from your device</p>
          </div>
          <button
            className="px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 active:scale-95 hover:shadow-xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
            onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            Upload Image
          </button>
          <input ref={inputRef} type="file" className="hidden" accept="image/*" multiple
            onChange={e => e.target.files?.[0] && handleFiles(e.target.files)} />
        </div>

        {/* Supported formats */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-10">
          <span className="text-xs text-gray-400 font-medium mr-1">Supports</span>
          {FORMATS.map(f => (
            <span key={f} className="px-3 py-1 text-xs font-bold rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm">
              {f}
            </span>
          ))}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 w-full">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 px-3 py-4 rounded-xl bg-white/70 border border-white shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Icon className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-xs font-semibold text-gray-600">{label}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-gray-300 font-medium">
          100% browser-based · No sign-up required · Files never leave your device
        </p>
      </div>
    </div>
  );
}
