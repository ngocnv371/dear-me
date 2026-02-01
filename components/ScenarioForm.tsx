
import React, { useState, useEffect } from 'react';
import { Relationship, Tone, Scenario } from '../types';
import { X, Save } from 'lucide-react';

interface ScenarioFormProps {
  onSave: (scenario: Partial<Scenario>) => void;
  onCancel: () => void;
  initialData?: Scenario;
}

const ScenarioForm: React.FC<ScenarioFormProps> = ({ onSave, onCancel, initialData }) => {
  const [target, setTarget] = useState(initialData?.target || '');
  const [relationship, setRelationship] = useState<Relationship>(initialData?.relationship || 'neutral');
  const [tone, setTone] = useState<Tone>(initialData?.tone || 'dramatic');
  const [topic, setTopic] = useState(initialData?.topic || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target || !topic) return;
    onSave({ target, relationship, tone, topic });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">{initialData ? 'Edit Letter Scenario' : 'New Letter Scenario'}</h2>
          <button onClick={onCancel} className="p-1 hover:bg-slate-800 rounded-full text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Recipient (Target)</label>
            <input 
              required
              placeholder="e.g. My estranged father, My high school sweetheart..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Relationship</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as Relationship)}
              >
                <option value="beloved">Beloved</option>
                <option value="neutral">Neutral</option>
                <option value="hated">Hated</option>
                <option value="professional">Professional</option>
                <option value="polite">Polite</option>
                <option value="estranged">Estranged</option>
                <option value="secret">Secret</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Tone</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
              >
                <option value="dramatic">Dramatic</option>
                <option value="humor">Humor</option>
                <option value="dry">Dry</option>
                <option value="melancholic">Melancholic</option>
                <option value="angry">Angry</option>
                <option value="hopeful">Hopeful</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">What's the letter about?</label>
            <textarea 
              required
              rows={3}
              placeholder="Describe the situation or specific topic of the letter..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-slate-700 hover:bg-slate-800 rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold transition-colors"
            >
              <Save className="w-5 h-5" />
              {initialData ? 'Save Changes' : 'Save Scenario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScenarioForm;
