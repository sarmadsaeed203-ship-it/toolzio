import { useState } from 'react';
import { UserSquare2, Download, Printer } from 'lucide-react';
import { useImageStudio } from '../ImageStudioContext';
import { jsPDF } from 'jspdf';

const PASSPORT_SIZES = {
  'USA': { w: 2, h: 2, unit: 'in', label: 'USA (2 x 2 inch)' },
  'UK': { w: 35, h: 45, unit: 'mm', label: 'UK (35 x 45 mm)' },
  'Canada': { w: 50, h: 70, unit: 'mm', label: 'Canada (50 x 70 mm)' },
  'Australia': { w: 35, h: 45, unit: 'mm', label: 'Australia (35 x 45 mm)' },
  'EU': { w: 35, h: 45, unit: 'mm', label: 'EU (35 x 45 mm)' },
  'Pakistan': { w: 1.5, h: 2, unit: 'in', label: 'Pakistan (1.5 x 2 inch)' },
};

export function PassportPanel() {
  const { image, applyEdit, exportImage, addToast } = useImageStudio();
  const [country, setCountry] = useState('USA');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [layout, setLayout] = useState('single'); // single, print

  const handleCountryChange = (c) => {
    setCountry(c);
    // Ideally we would apply a crop here, but for simplicity we will just resize the canvas to this aspect ratio
    // A real passport maker requires face detection, but we'll center crop it based on the aspect ratio.
    const size = PASSPORT_SIZES[c];
    const ratio = size.w / size.h;
    
    // Set output aspect ratio to match the passport
    const outH = image.originalHeight;
    const outW = Math.round(outH * ratio);
    
    applyEdit({ outputWidth: outW, outputHeight: outH }, `Passport: ${c}`);
  };

  const generatePDF = async () => {
    if (!image) return;
    
    addToast('Generating PDF...', 'info');

    // Get the edited image as a blob
    const blob = await exportImage({ format: 'image/jpeg', quality: 100 });
    if (!blob) return;

    // Convert blob to DataURL for jsPDF
    const imgData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    // A4 paper is 210 x 297 mm
    // US Letter is 8.5 x 11 inch (215.9 x 279.4 mm)
    // Let's use 4x6 inch photo paper as default for printing (101.6 x 152.4 mm)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [101.6, 152.4] // 4x6 inch
    });
    const spec = PASSPORT_SIZES[country];
    
    let w_mm = spec.w;
    let h_mm = spec.h;
    
    if (spec.unit === 'in') {
      w_mm = spec.w * 25.4;
      h_mm = spec.h * 25.4;
    }

    if (layout === 'single') {
      // Center single photo on 4x6
      const x = (152.4 - w_mm) / 2;
      const y = (101.6 - h_mm) / 2;
      pdf.addImage(imgData, 'JPEG', x, y, w_mm, h_mm);
    } else {
      // Grid layout
      const cols = Math.floor(152.4 / (w_mm + 5));
      const rows = Math.floor(101.6 / (h_mm + 5));
      
      const startX = (152.4 - (cols * w_mm + (cols - 1) * 5)) / 2;
      const startY = (101.6 - (rows * h_mm + (rows - 1) * 5)) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * (w_mm + 5);
          const y = startY + r * (h_mm + 5);
          pdf.addImage(imgData, 'JPEG', x, y, w_mm, h_mm);
        }
      }
    }

    pdf.save(`passport_${country}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Country Size</label>
        <select
          value={country}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
        >
          {Object.entries(PASSPORT_SIZES).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Background Color</label>
        <div className="flex gap-2">
          {['#ffffff', '#3b82f6'].map(color => (
            <button
              key={color}
              onClick={() => {
                setBgColor(color);
                applyEdit({ type: 'BACKGROUND', value: color }, 'Background Color');
              }}
              className={`w-10 h-10 rounded-full border-2 shadow-sm transition-all ${bgColor === color ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}`}
              style={{ background: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Print Layout</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setLayout('single')}
            className={`py-2 text-xs font-bold rounded-lg border transition-all ${
              layout === 'single' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'
            }`}
          >
            Single Photo
          </button>
          <button
            onClick={() => setLayout('print')}
            className={`py-2 text-xs font-bold rounded-lg border transition-all ${
              layout === 'print' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'
            }`}
          >
            Grid (4x6 paper)
          </button>
        </div>
      </div>

      <button
        onClick={generatePDF}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
      >
        <Printer className="w-4 h-4" />
        Download PDF for Print
      </button>
    </div>
  );
}
