/**
 * Tool Registry — Plugin-style architecture
 *
 * Each tool is a self-contained object with:
 *   id:      unique string identifier
 *   label:   user-facing name
 *   icon:    lucide-react component
 *   panel:   React component rendered in the right panel
 *   group:   logical grouping for toolbar display
 *
 * To add a new tool (e.g., Background Removal, Watermark, AI Upscale),
 * simply add a new entry to TOOLS and create the corresponding panel component.
 * The toolbar and panel render automatically — no other code changes needed.
 */

import {
  Maximize2, RotateCw, SlidersHorizontal, Download, Eraser, FileArchive, UserSquare2
} from 'lucide-react';
import { ResizePanel, RotateFlipPanel, AdjustmentsPanel, ExportSettingsPanel } from './ToolPanels';
import { BackgroundPanel } from './AITools';
import { CompressPanel } from './CompressPanel';
import { PassportPanel } from './PassportPanel';

export const TOOLS = [
  {
    id: 'resize',
    label: 'Resize',
    icon: Maximize2,
    panel: ResizePanel,
    group: 'transform',
  },
  {
    id: 'rotate-flip',
    label: 'Rotate & Flip',
    icon: RotateCw,
    panel: RotateFlipPanel,
    group: 'transform',
  },
  {
    id: 'adjustments',
    label: 'Adjustments',
    icon: SlidersHorizontal,
    panel: AdjustmentsPanel,
    group: 'color',
  },
  {
    id: 'export',
    label: 'Export',
    icon: Download,
    panel: ExportSettingsPanel,
    group: 'output',
  },
  {
    id: 'compress',
    label: 'Compress',
    icon: FileArchive,
    panel: CompressPanel,
    group: 'output',
  },
  {
    id: 'background',
    label: 'Remove BG',
    icon: Eraser,
    panel: BackgroundPanel,
    group: 'ai',
  },
  {
    id: 'passport',
    label: 'Passport Maker',
    icon: UserSquare2,
    panel: PassportPanel,
    group: 'ai',
  },
];

export function getToolById(id) {
  return TOOLS.find(t => t.id === id) ?? null;
}
