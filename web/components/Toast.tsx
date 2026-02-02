
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: { icon: CheckCircle, bg: 'bg-emerald-950/90', border: 'border-emerald-500/50', text: 'text-emerald-400' },
    error: { icon: AlertCircle, bg: 'bg-red-950/90', border: 'border-red-500/50', text: 'text-red-400' },
    info: { icon: Info, bg: 'bg-slate-900/90', border: 'border-indigo-500/50', text: 'text-indigo-400' },
  }[type];

  const Icon = config.icon;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className={`${config.bg} ${config.border} border backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px]`}>
        <Icon className={`w-5 h-5 ${config.text}`} />
        <p className="text-sm font-medium text-slate-100 flex-1">{message}</p>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
