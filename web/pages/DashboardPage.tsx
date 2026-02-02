import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import { Project } from '../types';
import { Plus } from 'lucide-react';

interface DashboardPageProps {
  projects: Project[];
  onCreateProject: (data: Partial<Project>) => Promise<void>;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ projects, onCreateProject }) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const handleCreateProject = async (data: Partial<Project>) => {
    await onCreateProject(data);
    setShowForm(false);
  };

  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Podcast Scripts</h2>
          <p className="text-slate-500 font-medium">Create and manage your dramatic YouTube readings</p>
        </div>
        {projects.length > 0 && (
          <div className="hidden sm:block text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-6 py-3 rounded-full border border-indigo-500/20">
            {projects.length} {projects.length === 1 ? 'Episode' : 'Episodes'}
          </div>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-900/20 border border-slate-800 border-dashed rounded-[3rem] text-center">
          <div className="bg-slate-800/50 p-8 rounded-full mb-8">
            <Plus className="w-12 h-12 text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Your script studio is empty</h3>
          <p className="text-slate-500 mb-10 max-w-sm">
            Start your next podcast episode by creating a project for a dramatic reading.
          </p>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-all px-10 py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-6 h-6" />
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => navigate(`/project/${project.id}`)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <ProjectForm 
          onSave={handleCreateProject}
          onCancel={() => setShowForm(false)}
        />
      )}

      {projects.length > 0 && (
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

export default DashboardPage;
