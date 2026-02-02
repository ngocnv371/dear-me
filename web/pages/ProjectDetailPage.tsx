import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectDetail from '../components/ProjectDetail';
import { Project } from '../types';

interface ProjectDetailPageProps {
  projects: Project[];
  onUpdateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  showToast: (message: string) => void;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ 
  projects, 
  onUpdateProject, 
  onDeleteProject,
  showToast 
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="px-6 text-center py-32">
        <h2 className="text-2xl font-bold mb-4">Project not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="text-indigo-400 hover:text-indigo-300"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <ProjectDetail 
      project={project}
      onBack={() => navigate('/')}
      onUpdate={onUpdateProject}
      onDelete={onDeleteProject}
      showToast={showToast}
    />
  );
};

export default ProjectDetailPage;
