import { useImageStudio } from './ImageStudioContext';

function fmt(bytes) {
  if (!bytes || bytes === 0) return '--';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const FORMAT_LABEL = {
  'image/png':  'PNG',
  'image/jpeg': 'JPEG',
  'image/webp': 'WebP',
  'image/bmp':  'BMP',
  'image/gif':  'GIF',
};

export function StatusBar() {
  const { image, edits, estimatedSize } = useImageStudio();

  if (!image) {
    return (
      <div className="h-8 bg-gray-50 border-t border-gray-100 flex items-center px-4 shrink-0">
        <span className="text-xs text-gray-400">Ready</span>
      </div>
    );
  }

  const w = edits.outputWidth || image.originalWidth;
  const h = edits.outputHeight || image.originalHeight;
  const originalFmt = FORMAT_LABEL[image.type] || image.type;
  const outputFmt   = FORMAT_LABEL[edits.format] || edits.format;
  const estSize = estimatedSize();

  const Pill = ({ children, accent }) => (
    <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${accent ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
      {children}
    </div>
  );

  return (
    <div className="h-8 bg-gray-50 border-t border-gray-100 flex items-center px-4 gap-3 shrink-0 overflow-hidden">
      <Pill accent>{outputFmt}</Pill>
      <span className="text-xs text-gray-500 font-medium tabular-nums">{w}×{h} px</span>
      <span className="text-gray-300 text-xs">·</span>
      <span className="text-xs text-gray-500">~{fmt(estSize)}</span>
      {edits.rotation !== 0 && (
        <>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-500">{edits.rotation}°</span>
        </>
      )}
      {(edits.flipH || edits.flipV) && (
        <>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-500">
            {edits.flipH && edits.flipV ? 'Flip H+V' : edits.flipH ? 'Flip H' : 'Flip V'}
          </span>
        </>
      )}
      {(edits.brightness !== 100 || edits.contrast !== 100 || edits.saturation !== 100) && (
        <>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-500">
            Adjusted
          </span>
        </>
      )}
      <div className="flex-1" />
      <span className="text-xs text-gray-400">{image.name}</span>
      <span className="text-gray-300 text-xs">·</span>
      <span className="text-xs text-gray-400">{image.originalWidth}×{image.originalHeight} original</span>
    </div>
  );
}
