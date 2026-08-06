import { useRef, useState, useCallback } from 'react';
import {
  Undo2, RefreshCcw, ImagePlus, Download,
  SplitSquareHorizontal, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useImageStudio } from './ImageStudioContext';
import { TOOLS, getToolById } from './tools/ToolRegistry';

/**
 * StudioToolbar — Top toolbar
 *
 * When no image: shows only the Upload button.
 * When image loaded: shows all context-aware tools.
 */
export function StudioToolbar({ onNewImage }) {
  const {
    image, canUndo, undo, reset,
    activeTool, setActiveTool,
    showBeforeAfter, setShowBeforeAfter,
    setShowExport,
  } = useImageStudio();

  const fileInputRef = useRef(null);
  const { loadImage } = useImageStudio();

  const toggleTool = (id) => setActiveTool(prev => prev === id ? null : id);

  const IconBtn = ({ icon: Icon, label, onClick, active, danger, disabled, className = '' }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border
        ${disabled ? 'opacity-30 cursor-not-allowed border-transparent text-gray-400' :
          danger   ? 'text-red-600 border-transparent hover:bg-red-50 hover:border-red-200' :
          active   ? 'text-indigo-700 bg-indigo-50 border-indigo-200 shadow-inner' :
                     'text-gray-700 border-transparent hover:bg-gray-100 hover:border-gray-200'}
        ${className}
      `}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="h-12 bg-white border-b border-gray-100 flex items-center px-3 gap-1 shadow-sm z-10 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2 pr-3 border-r border-gray-100 mr-1">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <span className="text-white text-xs font-black">IS</span>
        </div>
        <span className="text-sm font-bold text-gray-800 hidden md:block">Image Studio</span>
      </div>

      {!image ? (
        /* ── No image: only upload ── */
        <>
          <label className="cursor-pointer">
            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity shadow-sm">
              <ImagePlus className="w-3.5 h-3.5" />
              <span>Open Image</span>
            </div>
            <input type="file" className="hidden" accept="image/*"
              onChange={e => e.target.files?.[0] && loadImage(e.target.files[0])} />
          </label>
        </>
      ) : (
        /* ── Image loaded: full toolbar ── */
        <>
          {/* New image */}
          <label className="cursor-pointer" title="Open new image">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
              <ImagePlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New</span>
            </div>
            <input type="file" className="hidden" accept="image/*"
              onChange={e => e.target.files?.[0] && loadImage(e.target.files[0])} />
          </label>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* History */}
          <IconBtn icon={Undo2}      label="Undo"  onClick={undo}  disabled={!canUndo} />
          <IconBtn icon={RefreshCcw} label="Reset" onClick={reset} danger />

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Tool buttons — from registry */}
          {TOOLS.filter(t => t.id !== 'export').map(tool => (
            <IconBtn
              key={tool.id}
              icon={tool.icon}
              label={tool.label}
              onClick={() => toggleTool(tool.id)}
              active={activeTool === tool.id}
            />
          ))}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Before/After toggle */}
          <IconBtn
            icon={SplitSquareHorizontal}
            label="Before/After"
            onClick={() => setShowBeforeAfter(p => !p)}
            active={showBeforeAfter}
          />

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Download */}
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </>
      )}
    </div>
  );
}

/**
 * ToolPanel — Right-side collapsible panel that shows the active tool's UI
 */
export function ToolPanel() {
  const { activeTool, setActiveTool } = useImageStudio();
  const tool = getToolById(activeTool);

  const isOpen = !!tool;

  return (
    <div
      className="bg-white border-l border-gray-100 overflow-y-auto shrink-0 flex flex-col transition-all duration-300 ease-out"
      style={{ width: isOpen ? '280px' : '0px', opacity: isOpen ? 1 : 0 }}
    >
      {tool && (
        <>
          {/* Panel header */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-gray-100 bg-gray-50 shrink-0">
            <div className="flex items-center gap-2">
              <tool.icon className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-gray-800">{tool.label}</h3>
            </div>
            <button
              onClick={() => setActiveTool(null)}
              className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label="Close panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tool content */}
          <div className="p-4 flex-1">
            <tool.panel />
          </div>
        </>
      )}
    </div>
  );
}
