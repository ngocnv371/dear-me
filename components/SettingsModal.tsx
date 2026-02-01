import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Zap, Info, Key, Globe, Server, Save } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [service, setService] = useState<'gemini' | 'openai'>('gemini');
  const [openaiUrl, setOpenaiUrl] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('dear_me_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGeminiApiKey(parsed.geminiApiKey || '');
        setService(parsed.service || 'gemini');
        setOpenaiUrl(parsed.openaiUrl || '');
        setOpenaiKey(parsed.openaiKey || '');
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  const handleSave = () => {
    const settings = { geminiApiKey, service, openaiUrl, openaiKey };
    localStorage.setItem('dear_me_settings', JSON.stringify(settings));
    onClose();
    // Refresh to apply new credentials globally
    window.location.reload(); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl my-auto">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Studio Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Globe className="w-4 h-4" /> Generative Service
            </h3>
            <div className="flex bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setService('gemini')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${service === 'gemini' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Gemini
              </button>
              <button 
                onClick={() => setService('openai')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${service === 'openai' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                OpenAI Compatible
              </button>
            </div>
          </section>

          {service === 'gemini' ? (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Key className="w-4 h-4" /> Gemini API Key
                </h3>
              </div>
              <div className="relative">
                <input 
                  type="password"
                  placeholder="Enter your Gemini API Key..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-600"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                />
                {!geminiApiKey && (
                  <p className="mt-2 text-[10px] text-slate-500 italic">
                    If empty, the studio uses the default environment key.
                  </p>
                )}
              </div>
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex gap-3">
                <Info className="w-5 h-5 text-indigo-400 shrink-0" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The key is stored safely in your browser's local storage and used only for requests to Google's Gemini API.
                </p>
              </div>
            </section>
          ) : (
            <section className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Server className="w-4 h-4" /> Endpoint URL
                </h3>
                <input 
                  type="text"
                  placeholder="https://api.openai.com/v1"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-600"
                  value={openaiUrl}
                  onChange={(e) => setOpenaiUrl(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Key className="w-4 h-4" /> API Key
                </h3>
                <input 
                  type="password"
                  placeholder="Enter service API key..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-600"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                />
              </div>
            </section>
          )}

          <div className="flex items-center gap-3 text-emerald-400 bg-emerald-400/5 p-4 rounded-2xl border border-emerald-400/10">
            <ShieldCheck className="w-5 h-5" />
            <p className="text-[10px] font-bold uppercase tracking-wider">Local Persistence Enabled</p>
          </div>
        </div>

        <div className="p-8 bg-slate-800/30 flex justify-end border-t border-slate-800">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            <Save className="w-4 h-4" />
            Apply & Reload
          </button>
        </div>
      </div>
    </div>
  );
}