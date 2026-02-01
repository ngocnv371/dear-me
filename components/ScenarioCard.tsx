
import React from 'react';
import { Scenario } from '../types';
import { Calendar, MessageSquare, Image as ImageIcon, ChevronRight } from 'lucide-react';

interface ScenarioCardProps {
  scenario: Scenario;
  onClick: () => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onClick }) => {
  const dateStr = new Date(scenario.createdAt).toLocaleDateString();
  
  return (
    <div 
      onClick={onClick}
      className="group bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="aspect-square relative overflow-hidden bg-slate-900">
        {scenario.coverImageUrl ? (
          <img 
            src={scenario.coverImageUrl} 
            alt={`Cover for ${scenario.target}`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2">
            <ImageIcon className="w-12 h-12 opacity-20" />
            <span className="text-xs uppercase tracking-widest font-semibold">No Cover Art</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
            scenario.script ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {scenario.script ? 'Complete' : 'Draft'}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
            Dear {scenario.target}
          </h3>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transform translate-x-0 group-hover:translate-x-1 transition-all" />
        </div>
        
        <p className="text-slate-400 text-sm line-clamp-2 mb-4 italic">
          "{scenario.topic}"
        </p>
        
        <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {dateStr}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MessageSquare className={`w-3 h-3 ${scenario.script ? 'text-indigo-400' : ''}`} />
              {scenario.script ? 'Script' : 'None'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;
