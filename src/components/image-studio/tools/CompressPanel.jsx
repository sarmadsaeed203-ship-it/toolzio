import { useState, useEffect } from 'react';
import { Download, Minimize, Settings2 } from 'lucide-react';
import { useImageStudio } from '../ImageStudioContext';

export function CompressPanel() {
  const { image, edits, applyEdit, estimatedSize, handleExport } = useImageStudio();
  const [level, setLevel] = useState('medium'); // low, medium, high, custom

  // Original size
  const origSize = image?.file?.size || 0;
  const origSizeLabel = origSize > 1024 * 1024
    ? `${(origSize / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(origSize / 1024)} KB`;

  // Apply default compression on mount if not set
  useEffect(() => {
    if (edits.format === 'image/png') {
      applyEdit({ format: 'image/jpeg', quality: 70 }, 'Compress: Medium');
    }
  }, []);

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    if (newLevel === 'low') applyEdit({ format: 'image/jpeg', quality: 90 }, 'Compress: Low');
    else if (newLevel === 'medium') applyEdit({ format: 'image/jpeg', quality: 70 }, 'Compress: Medium');
    else if (newLevel === 'high') applyEdit({ format: 'image/jpeg', quality: 40 }, 'Compress: High');
  };

  const currentSize = estimatedSize();
  const compSizeLabel = currentSize > 1024 * 1024
    ? `${(currentSize / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(currentSize / 1024)} KB`;

  const reduction = origSize ? Math.round(((origSize - currentSize) / origSize) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Compression Level</p>
        <div className="grid grid-cols-3 gap-2">
          {['low', 'medium', 'high'].map((l) => (
            <button
              key={l}
              onClick={() => handleLevelChange(l)}
              className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all capitalize ${
                level === l
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Original Size</span>
          <span className="font-semibold text-gray-800">{origSizeLabel}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Compressed Size</span>
          <span className="font-bold text-emerald-600">{compSizeLabel}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500" style={{ width: `${Math.max(0, 100 - reduction)}%` }} />
          <div className="h-full bg-gray-300" style={{ width: `${Math.max(0, reduction)}%` }} />
        </div>
        <p className="text-xs text-right text-emerald-600 font-semibold">
          {reduction > 0 ? `Reduced by ${reduction}%` : 'No reduction'}
        </p>
      </div>

      <button
        onClick={handleExport}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
      >
        <Download className="w-4 h-4" />
        Download Compressed
      </button>
    </div>
  );
}
