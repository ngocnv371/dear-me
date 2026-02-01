import React from "react";
import { AISettings, AIProvider } from "../types";
import { X, Settings2, Cpu, Globe, BookText } from "lucide-react";

interface SettingsModalProps {
  settings: AISettings;
  onUpdate: (settings: AISettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdate,
  onClose,
}) => {
  const handleChange = (key: keyof AISettings, value: string) => {
    onUpdate({ ...settings, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md flex flex-col my-8"
      >
        <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
              <Settings2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Project Settings</h3>
              <p className="text-xs text-slate-400">
                Configure AI behavior
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* AI Provider Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Active Provider
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleChange("provider", AIProvider.GEMINI)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  settings.provider === AIProvider.GEMINI
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600"
                }`}
              >
                <Cpu size={24} />
                <span className="text-sm font-bold">Google Gemini</span>
              </button>
              <button
                type="button"
                onClick={() => handleChange("provider", AIProvider.OPENAI)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  settings.provider === AIProvider.OPENAI
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600"
                }`}
              >
                <Cpu size={24} />
                <span className="text-sm font-bold">OpenAI</span>
              </button>
              <button
                type="button"
                onClick={() => handleChange("provider", AIProvider.OLLAMA)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  settings.provider === AIProvider.OLLAMA
                    ? "border-blue-500 bg-blue-500/10 text-white"
                    : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600"
                }`}
              >
                <Globe size={24} />
                <span className="text-sm font-bold">Local Ollama</span>
              </button>
            </div>
          </div>

          {settings.provider === AIProvider.OPENAI && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={settings.openaiApiKey || ""}
                  onChange={(e) => handleChange("openaiApiKey", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Model Name
                </label>
                <input
                  type="text"
                  placeholder="gpt-4o-mini, gpt-4, gpt-3.5-turbo"
                  value={settings.openaiModel || ""}
                  onChange={(e) => handleChange("openaiModel", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Endpoint URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://api.openai.com/v1"
                  value={settings.openaiEndpoint || ""}
                  onChange={(e) =>
                    handleChange("openaiEndpoint", e.target.value)
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {settings.provider === AIProvider.OLLAMA && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Endpoint URL
                </label>
                <input
                  type="text"
                  placeholder="http://localhost:11434"
                  value={settings.ollamaEndpoint || ""}
                  onChange={(e) =>
                    handleChange("ollamaEndpoint", e.target.value)
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Model Name
                </label>
                <input
                  type="text"
                  placeholder="llama3, mistral, etc."
                  value={settings.ollamaModel || ""}
                  onChange={(e) => handleChange("ollamaModel", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  API Key (Optional)
                </label>
                <input
                  type="password"
                  placeholder="For proxies or secure endpoints"
                  value={settings.ollamaApiKey || ""}
                  onChange={(e) => handleChange("ollamaApiKey", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {settings.provider === AIProvider.GEMINI && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
              <p className="text-xs text-blue-200/70 leading-relaxed">
                Using <strong>gemini-3-flash-preview</strong>. Ideal for rapid
                interactive narrative drafting.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-900/50 border-t border-slate-700 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
          >
            Save & Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsModal;
