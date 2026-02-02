import React, { useState } from "react";
import { AISettings, AIProvider, VoiceProvider } from "../types";
import { X, Settings2, Cpu, Globe, BookText, Mic, FileText, Volume2 } from "lucide-react";

interface SettingsModalProps {
  settings: AISettings;
  onUpdate: (settings: AISettings) => void;
  onClose: () => void;
}

type TabType = "text" | "audio";

const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdate,
  onClose,
}: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("text");

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
            type="button"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700 bg-slate-900/30">
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-bold text-sm transition-all ${
              activeTab === "text"
                ? "text-blue-400 border-b-2 border-blue-500 bg-blue-500/5"
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
            }`}
          >
            <FileText size={18} />
            Text Gen
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("audio")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-bold text-sm transition-all ${
              activeTab === "audio"
                ? "text-purple-400 border-b-2 border-purple-500 bg-purple-500/5"
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
            }`}
          >
            <Volume2 size={18} />
            Audio Gen
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {activeTab === "text" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* AI Provider Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Active Provider
                </label>
                <div className="grid grid-cols-2 gap-3">
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

              {settings.provider === AIProvider.GEMINI && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      API Key
                    </label>
                    <input
                      type="password"
                      placeholder="sk-..."
                      value={settings.geminiApiKey || ""}
                      onChange={(e) => handleChange("geminiApiKey", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Model Name
                    </label>
                    <input
                      type="text"
                      placeholder="gemini-3-flash-preview"
                      value={settings.geminiModel || ""}
                      onChange={(e) => handleChange("geminiModel", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "audio" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Voice Provider Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Mic size={14} />
                  Voice Provider
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange("voiceProvider", VoiceProvider.GEMINI)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      settings.voiceProvider === VoiceProvider.GEMINI
                        ? "border-purple-500 bg-purple-500/10 text-white"
                        : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <Cpu size={24} />
                    <span className="text-sm font-bold">Gemini TTS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("voiceProvider", VoiceProvider.KOKORO)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      settings.voiceProvider === VoiceProvider.KOKORO
                        ? "border-purple-500 bg-purple-500/10 text-white"
                        : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <Mic size={24} />
                    <span className="text-sm font-bold">Kokoro TTS</span>
                  </button>
                </div>
              </div>

              {settings.voiceProvider === VoiceProvider.KOKORO && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Endpoint URL
                    </label>
                    <input
                      type="text"
                      placeholder="http://localhost:5000"
                      value={settings.kokoroEndpoint || ""}
                      onChange={(e) => handleChange("kokoroEndpoint", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Voice
                    </label>
                    <select
                      value={settings.kokoroVoice || "af_bella"}
                      onChange={(e) => handleChange("kokoroVoice", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <optgroup label="American Female">
                        <option value="af_alloy">Alloy</option>
                        <option value="af_aoede">Aoede</option>
                        <option value="af_bella">Bella</option>
                        <option value="af_jessica">Jessica</option>
                        <option value="af_kore">Kore</option>
                        <option value="af_nicole">Nicole</option>
                        <option value="af_nova">Nova</option>
                        <option value="af_river">River</option>
                        <option value="af_sarah">Sarah</option>
                        <option value="af_sky">Sky</option>
                      </optgroup>
                      <optgroup label="American Male">
                        <option value="am_adam">Adam</option>
                        <option value="am_echo">Echo</option>
                        <option value="am_eric">Eric</option>
                        <option value="am_fenrir">Fenrir</option>
                        <option value="am_liam">Liam</option>
                        <option value="am_michael">Michael</option>
                        <option value="am_onyx">Onyx</option>
                        <option value="am_puck">Puck</option>
                      </optgroup>
                      <optgroup label="British Female">
                        <option value="bf_alice">Alice</option>
                        <option value="bf_emma">Emma</option>
                        <option value="bf_isabella">Isabella</option>
                        <option value="bf_lily">Lily</option>
                      </optgroup>
                      <optgroup label="British Male">
                        <option value="bm_daniel">Daniel</option>
                        <option value="bm_fable">Fable</option>
                        <option value="bm_george">George</option>
                        <option value="bm_lewis">Lewis</option>
                      </optgroup>
                      <optgroup label="Other Languages">
                        <option value="ff_siwis">Siwis (French Female)</option>
                        <option value="hf_alpha">Alpha (Hindi Female)</option>
                        <option value="hf_beta">Beta (Hindi Female)</option>
                        <option value="hm_omega">Omega (Hindi Male)</option>
                        <option value="hm_psi">Psi (Hindi Male)</option>
                        <option value="if_sara">Sara (Italian Female)</option>
                        <option value="im_nicola">Nicola (Italian Male)</option>
                        <option value="jf_alpha">Alpha (Japanese Female)</option>
                        <option value="jf_gongitsune">Gongitsune (Japanese Female)</option>
                        <option value="jf_nezumi">Nezumi (Japanese Female)</option>
                        <option value="jf_tebukuro">Tebukuro (Japanese Female)</option>
                        <option value="jm_kumo">Kumo (Japanese Male)</option>
                        <option value="zf_xiaobei">Xiaobei (Chinese Female)</option>
                        <option value="zf_xiaoni">Xiaoni (Chinese Female)</option>
                        <option value="zf_xiaoxiao">Xiaoxiao (Chinese Female)</option>
                        <option value="zf_xiaoyi">Xiaoyi (Chinese Female)</option>
                        <option value="zm_yunjian">Yunjian (Chinese Male)</option>
                        <option value="zm_yunxi">Yunxi (Chinese Male)</option>
                        <option value="zm_yunxia">Yunxia (Chinese Male)</option>
                        <option value="zm_yunyang">Yunyang (Chinese Male)</option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Speed: {settings.kokoroSpeed || 1.0}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={settings.kokoroSpeed || 1.0}
                      onChange={(e) => handleChange("kokoroSpeed", e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
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
