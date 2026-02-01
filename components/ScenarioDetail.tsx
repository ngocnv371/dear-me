
import React, { useState, useRef } from 'react';
import { Scenario } from '../types';
import { generateLetterPackage, generateCoverPhoto, generateAudio } from '../services/geminiService';
import { 
  ArrowLeft, Sparkles, Copy, RefreshCw, Trash2, 
  Mic, Play, Pause, Edit3, Hash, Quote
} from 'lucide-react';
import ScenarioForm from './ScenarioForm';
import ConfirmModal from './ConfirmModal';

interface ScenarioDetailProps {
  scenario: Scenario;
  onBack: () => void;
  onUpdate: (id: string, updates: Partial<Scenario>) => void;
  onDelete: (id: string) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

// Implement base64 decoding manually following the provided examples.
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Implement PCM decoding following the provided examples.
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const ScenarioDetail: React.FC<ScenarioDetailProps> = ({ scenario, onBack, onUpdate, onDelete, showToast }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    showToast("Starting generation... this may take a moment.", "info");
    try {
      const [{ script, tagline, tags }, cover] = await Promise.all([
        generateLetterPackage(scenario),
        generateCoverPhoto(scenario)
      ]);
      onUpdate(scenario.id, { script, tagline, tags, coverImageUrl: cover });
      showToast("Episode generated successfully!", "success");
    } catch (err) {
      console.error('Generation Error:', err);
      showToast("Failed to generate content. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!scenario.script) return;
    setIsGeneratingAudio(true);
    showToast("Synthesizing audio reading...", "info");
    try {
      const audioData = await generateAudio(scenario.script, scenario.tone);
      onUpdate(scenario.id, { audioData });
      showToast("Audio reading is ready!", "success");
    } catch (err) {
      console.error('Audio Generation Error:', err);
      showToast("Could not generate audio. Text might be too long.", "error");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const playAudio = async () => {
    if (!scenario.audioData) return;
    
    if (isPlaying) {
      sourceNodeRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      console.log('[Playback] Processing audio stream...');
      const bytes = decode(scenario.audioData);
      const buffer = await decodeAudioData(bytes, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => {
        setIsPlaying(false);
      };
      source.start(0);
      
      sourceNodeRef.current = source;
      setIsPlaying(true);
    } catch (err) {
      console.error('[Playback] Failed:', err);
      showToast("Failed to play audio reading.", "error");
    }
  };

  const copyToClipboard = () => {
    if (scenario.script) {
      const fullText = `Title: ${scenario.tagline}\n\n${scenario.script}\n\nTags: ${scenario.tags?.join(', ')}`;
      navigator.clipboard.writeText(fullText).then(() => {
        showToast("Copied transcript to clipboard", "success");
      }).catch(() => {
        showToast("Failed to copy transcript", "error");
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group font-semibold"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Dashboard
        </button>
        <button 
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 text-indigo-400 hover:bg-indigo-500/10 px-4 py-2 rounded-xl transition-all font-bold"
        >
          <Edit3 className="w-4 h-4" />
          Edit Scenario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="aspect-square bg-slate-900 relative">
              {scenario.coverImageUrl ? (
                <img src={scenario.coverImageUrl} className="w-full h-full object-cover" alt="Cover Art" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 italic text-sm p-8 text-center">
                  Waiting for cover art...
                </div>
              )}
              {isGenerating && (
                <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-sm flex items-center justify-center">
                  <RefreshCw className="w-10 h-10 text-white animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 bg-slate-800/20 p-6 rounded-3xl border border-slate-800/50">
            <h1 className="text-3xl font-bold tracking-tight">Dear {scenario.target}</h1>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                {scenario.relationship}
              </span>
              <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-bold uppercase tracking-widest text-amber-400">
                {scenario.tone}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-indigo-500/30 pl-4 italic">
              {scenario.topic}
            </p>
          </div>

          <div className="space-y-3">
            <button 
              disabled={isGenerating}
              onClick={handleGenerate}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
                scenario.script 
                ? 'bg-slate-800 border border-indigo-500/50 hover:bg-slate-700 text-indigo-400' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              }`}
            >
              <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              {scenario.script ? 'Regenerate Content' : 'Generate Full Episode'}
            </button>
            
            {scenario.script && (
              <button 
                disabled={isGeneratingAudio}
                onClick={scenario.audioData ? playAudio : handleGenerateAudio}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
                  scenario.audioData 
                  ? 'bg-amber-600/20 border border-amber-600/50 text-amber-400 hover:bg-amber-600/30' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isGeneratingAudio ? <RefreshCw className="w-5 h-5 animate-spin" /> : scenario.audioData ? (isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />) : <Mic className="w-5 h-5" />}
                {isGeneratingAudio ? 'Synthesizing...' : scenario.audioData ? (isPlaying ? 'Stop' : 'Listen') : 'Generate Audio Reading'}
              </button>
            )}
            
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-red-500 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all text-sm font-semibold"
            >
              <Trash2 className="w-4 h-4" />
              Delete Scenario
            </button>
          </div>
        </div>

        <div className="md:col-span-8 space-y-8">
          {!scenario.script ? (
            <div className="h-full min-h-[500px] border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center text-slate-500 bg-slate-900/20">
              <Sparkles className="w-16 h-16 mb-6 opacity-10" />
              <h3 className="text-xl font-bold text-slate-300 mb-2">Ready to script?</h3>
              <p className="max-w-xs text-slate-500">The script, tagline, tags, and cover art will all be created with a single click.</p>
            </div>
          ) : (
            <>
              <div className="bg-slate-800/20 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Quote className="w-5 h-5" />
                  <h4 className="text-xs font-bold uppercase tracking-widest">YouTube Tagline</h4>
                </div>
                <h2 className="text-2xl font-bold text-slate-100">{scenario.tagline}</h2>
                
                <div className="pt-6 border-t border-slate-800/50">
                  <div className="flex items-center gap-2 text-indigo-400 mb-4">
                    <Hash className="w-5 h-5" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Recommended Tags</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {scenario.tags?.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/20 border border-slate-800 rounded-[2.5rem] p-8 md:p-14 relative group">
                <div className="absolute top-8 right-8">
                  <button 
                    onClick={copyToClipboard}
                    className="p-3 bg-slate-950/80 border border-slate-700 hover:border-indigo-500/50 rounded-2xl text-slate-400 hover:text-white transition-all flex items-center gap-2 text-xs font-bold backdrop-blur-md"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Transcript
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-slate-500 mb-10">
                  <div className="h-[1px] w-8 bg-slate-800"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Script Transcript</span>
                </div>

                <div className="serif text-xl md:text-2xl leading-[1.8] text-slate-200 whitespace-pre-wrap selection:bg-indigo-500/30 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-indigo-500">
                  {scenario.script}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <ScenarioForm 
          initialData={scenario}
          onSave={(data) => {
            onUpdate(scenario.id, data);
            setIsEditing(false);
            showToast("Scenario updated", "success");
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal 
          title="Delete Script?"
          message={`Are you sure you want to delete the script for "Dear ${scenario.target}"? This action cannot be undone.`}
          confirmLabel="Delete Forever"
          onConfirm={() => {
            onDelete(scenario.id);
            setShowDeleteConfirm(false);
            showToast("Script deleted", "info");
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default ScenarioDetail;
