
import React from 'react';
import { Mail, Settings as SettingsIcon, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onOpenSettings: () => void;
  onNewScenario: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, onNewScenario }) => {
  const { signOut, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = '#'}>
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Dear Me</h1>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Script Studio</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
            <span>{user.email}</span>
          </div>
        )}
        <button 
          onClick={onNewScenario}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2 rounded-full font-semibold text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Letter</span>
        </button>
        <button 
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
        >
          <SettingsIcon className="w-6 h-6" />
        </button>
        {user && (
          <button 
            onClick={signOut}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-full transition-all"
            title="Sign Out"
          >
            <LogOut className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
