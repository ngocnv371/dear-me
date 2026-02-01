
import React from 'react';
import { X, ShieldCheck, Zap, Info } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

// Convert to a standard default function export for better reliability and to fix the default export error.
export default function SettingsModal({ onClose }: SettingsModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold">Studio Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-400 bg-emerald-400/5 p-4 rounded-2xl border border-emerald-400/10">
              <ShieldCheck className="w-5 h-5" />
              <p className="text-sm font-semibold uppercase tracking-wider">AI Engine Connected</p>
            </div>
            
            <div className="p-4 bg-slate-800/40 rounded-2xl space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Model</p>
              <p className="text-sm text-slate-200">Gemini 3 Pro (Text/Script)</p>
              <p className="text-sm text-slate-200">Gemini 2.5 Flash (Audio/Image)</p>
            </div>

            <div className="p-4 border border-indigo-500/20 bg-indigo-500/5 rounded-2xl flex gap-3">
              <Info className="w-5 h-5 text-indigo-400 shrink-0" />
              <p className="text-xs text-slate-400 leading-relaxed">
                The API key is securely managed via environment variables. Your studio is fully configured for high-fidelity generation.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-800/30 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
