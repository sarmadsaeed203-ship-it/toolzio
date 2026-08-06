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
  Maximize2, RotateCw, SlidersHorizontal, Download,
} from 'lucide-react';
import { ResizePanel, RotateFlipPanel, AdjustmentsPanel, ExportSettingsPanel } from './ToolPanels';

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
  // FUTURE TOOLS — uncomment and add panel component when ready:
  // { id: 'crop',             label: 'Crop',             icon: Crop,         panel: CropPanel,             group: 'transform' },
  // { id: 'background',       label: 'Remove BG',        icon: Eraser,       panel: BackgroundPanel,       group: 'ai'        },
  // { id: 'upscale',          label: 'AI Upscale',       icon: Sparkles,     panel: UpscalePanel,          group: 'ai'        },
  // { id: 'blur',             label: 'Blur',             icon: Blend,        panel: BlurPanel,             group: 'effects'   },
  // { id: 'watermark',        label: 'Watermark',        icon: Type,         panel: WatermarkPanel,        group: 'output'    },
];

export function getToolById(id) {
  return TOOLS.find(t => t.id === id) ?? null;
}
