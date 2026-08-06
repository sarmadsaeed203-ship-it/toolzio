import { useImageStudio } from './ImageStudioContext';
import { Clock, RotateCcw } from 'lucide-react';

const ENTRY_LABELS = {
  'Resize':        '↔ Resize',
  'Rotate Right':  '↻ Rotate Right',
  'Rotate Left':   '↺ Rotate Left',
  'Rotate 180°':   '⟳ Rotate 180°',
  'Flip Horizontal': '↔ Flip H',
  'Flip Vertical':   '↕ Flip V',
  'Brightness':    '☀ Brightness',
  'Contrast':      '◑ Contrast',
  'Saturation':    '🎨 Saturation',
  'Reset Adjustments': '↩ Reset Adj.',
  'Format: PNG':   '📄 PNG',
  'Format: JPEG':  '📄 JPEG',
  'Format: WebP':  '📄 WebP',
  'Quality':       '⚙ Quality',
};

function getLabel(raw) {
  if (ENTRY_LABELS[raw]) return ENTRY_LABELS[raw];
  if (raw?.startsWith('Resize to')) return `↔ ${raw}`;
  if (raw?.startsWith('Reset')) return `↩ ${raw}`;
  return raw || 'Edit';
}

export function HistoryPanel() {
  const { history, historyLabels, undo, canUndo } = useImageStudio();

  return (
    <div className="w-56 bg-white border-l border-gray-100 flex flex-col shrink-0 hidden xl:flex">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">History</h3>
        </div>
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Undo"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 opacity-50">
            <Clock className="w-6 h-6 text-gray-300 mb-2" />
            <p className="text-xs text-gray-400">No edits yet</p>
          </div>
        ) : (
          <>
            {/* Current state at top */}
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border-l-2 border-indigo-500 mx-2 rounded-r-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="text-xs font-semibold text-indigo-700">Current</span>
            </div>

            {/* History entries in reverse (newest first) */}
            {[...historyLabels].reverse().map((label, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 mx-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                <span className="text-xs truncate">{getLabel(label)}</span>
              </div>
            ))}

            {/* Original at bottom */}
            <div className="flex items-center gap-2 px-3 py-2 mx-2 rounded-lg text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-200 shrink-0" />
              <span className="text-xs italic">Imported</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
