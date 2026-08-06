import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useImageStudio } from './ImageStudioContext';

const TYPE_CONFIG = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon_color: 'text-emerald-500' },
  error:   { icon: AlertCircle,  bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-800',     icon_color: 'text-red-500'     },
  info:    { icon: Info,         bg: 'bg-indigo-50',  border: 'border-indigo-200',  text: 'text-indigo-800',  icon_color: 'text-indigo-500'  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useImageStudio();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => {
        const cfg = TYPE_CONFIG[toast.type] ?? TYPE_CONFIG.info;
        const Icon = cfg.icon;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300 ${cfg.bg} ${cfg.border}`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${cfg.icon_color}`} />
            <span className={`text-sm font-medium flex-1 ${cfg.text}`}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className={`p-0.5 rounded ${cfg.text} opacity-60 hover:opacity-100 transition-opacity`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
