
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ScenarioCard from './components/ScenarioCard';
import ScenarioForm from './components/ScenarioForm';
import ScenarioDetail from './components/ScenarioDetail';
import Toast, { ToastType } from './components/Toast';
import SettingsModal from './components/SettingsModal';
import { Scenario } from './types';
import { Plus, Ghost } from 'lucide-react';

const STORAGE_KEY = 'dear_me_scenarios';

const App: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setScenarios(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  }, [scenarios]);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const handleCreateScenario = (data: Partial<Scenario>) => {
    const newScenario: Scenario = {
      id: crypto.randomUUID(),
      target: data.target!,
      relationship: data.relationship!,
      tone: data.tone!,
      topic: data.topic!,
      createdAt: Date.now(),
    };
    setScenarios([newScenario, ...scenarios]);
    setShowForm(false);
    setActiveScenarioId(newScenario.id);
    showToast("Scenario created", "success");
  };

  const handleUpdateScenario = (id: string, updates: Partial<Scenario>) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
    setActiveScenarioId(null);
  };

  const activeScenario = scenarios.find(s => s.id === activeScenarioId);

  return (
    <div className="min-h-screen pb-20 bg-slate-950 text-slate-200">
      <Header 
        onOpenSettings={() => setShowSettings(true)} 
        onNewScenario={() => setShowForm(true)} 
      />

      <main className="container mx-auto mt-8">
        {activeScenario ? (
          <ScenarioDetail 
            scenario={activeScenario}
            onBack={() => setActiveScenarioId(null)}
            onUpdate={handleUpdateScenario}
            onDelete={handleDeleteScenario}
            showToast={showToast}
          />
        ) : (
          <div className="px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold tracking-tight mb-2">Podcast Scripts</h2>
                <p className="text-slate-500 font-medium">Create and manage your dramatic YouTube readings</p>
              </div>
              {scenarios.length > 0 && (
                <div className="hidden sm:block text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-6 py-3 rounded-full border border-indigo-500/20">
                  {scenarios.length} {scenarios.length === 1 ? 'Episode' : 'Episodes'}
                </div>
              )}
            </div>

            {scenarios.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 bg-slate-900/20 border border-slate-800 border-dashed rounded-[3rem] text-center">
                <div className="bg-slate-800/50 p-8 rounded-full mb-8">
                  <Plus className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Your script studio is empty</h3>
                <p className="text-slate-500 mb-10 max-w-sm">
                  Start your next podcast episode by creating a scenario for a dramatic reading.
                </p>
                <button 
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-all px-10 py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-indigo-600/20 active:scale-95"
                >
                  <Plus className="w-6 h-6" />
                  Create Scenario
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {scenarios.map(scenario => (
                  <ScenarioCard 
                    key={scenario.id} 
                    scenario={scenario} 
                    onClick={() => setActiveScenarioId(scenario.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {showForm && (
        <ScenarioForm 
          onSave={handleCreateScenario}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)}
        />
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {!activeScenarioId && scenarios.length > 0 && (
        <div className="fixed bottom-10 right-10 z-40 lg:hidden">
          <button 
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-500 shadow-2xl shadow-indigo-600/40 text-white w-16 h-16 rounded-3xl flex items-center justify-center transition-all hover:rotate-90 active:scale-90"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
