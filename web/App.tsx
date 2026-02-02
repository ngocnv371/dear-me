
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Toast, { ToastType } from './components/Toast';
import SettingsModal from './components/SettingsModal';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import { AISettings, Project } from './types';
import { loadSettings, saveSettings } from './services/settingService';
import { useAuth } from './contexts/AuthContext';
import { projectService } from './services/projectService';

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const savedSettings = useMemo(() => {
    return loadSettings();
  }, []);
  const [settings, setAiSettings] = useState<AISettings>(savedSettings);

  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Load projects from Supabase when user is authenticated
  useEffect(() => {
    const loadProjects = async () => {
      if (!user) {
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        const data = await projectService.fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
        showToast('Failed to load projects', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadProjects();
    }
  }, [user, authLoading]);

  // Persist settings
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const handleCreateProject = async (data: Partial<Project>) => {
    try {
      const newProject = await projectService.createProject(data);
      setProjects(prev => [newProject, ...prev]);
      showToast("Project created", "success");
    } catch (error) {
      console.error('Error creating project:', error);
      showToast('Failed to create project', 'error');
    }
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await projectService.updateProject(id, updates);
      setProjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    } catch (error) {
      console.error('Error updating project:', error);
      showToast('Failed to update project', 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      showToast('Failed to delete project', 'error');
    }
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth prompt if not logged in
  if (!user) {
    return (
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen pb-20 bg-slate-950 text-slate-200">
        <Header 
          onOpenSettings={() => setShowSettings(true)}
        />

        <main className="container mx-auto mt-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <DashboardPage 
                  projects={projects}
                  onCreateProject={handleCreateProject}
                />
              } 
            />
            <Route 
              path="/project/:id" 
              element={
                <ProjectDetailPage 
                  projects={projects}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                  showToast={showToast}
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {showSettings && (
          <SettingsModal 
            settings={settings} 
            onUpdate={setAiSettings} 
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
      </div>
    </BrowserRouter>
  );
};

export default App;
