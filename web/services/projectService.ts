import { supabase } from '../lib/supabaseClient';
import { Project } from '../types';

export interface DatabaseScenario {
  id: string;
  profile_id: number;
  title: string;
  tags?: string[];
  tone?: string;
  theme?: string;
  summary?: string;
  transcript?: string;
  created_at: string;
  updated_at: string;
}

// Map database project to Project
const mapDatabaseToProject = (dbProject: DatabaseScenario, target?: string, relationship?: string): Project => {
  return {
    id: dbProject.id,
    target: target || 'Unknown',
    relationship: (relationship as any) || 'neutral',
    tone: (dbProject.tone as any) || 'dramatic',
    topic: dbProject.theme || '',
    script: dbProject.transcript,
    tagline: dbProject.summary,
    tags: dbProject.tags,
    createdAt: new Date(dbProject.created_at).getTime(),
  };
};

// Map Project to database project
const mapProjectToDatabase = (project: Project, profileId: number): Partial<DatabaseScenario> => {
  return {
    title: project.target,
    tone: project.tone,
    theme: project.topic,
    summary: project.tagline,
    transcript: project.script,
    tags: project.tags,
    profile_id: profileId,
  };
};

export const projectService = {
  // Get current user's profile ID
  async getProfileId(): Promise<number | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data?.id || null;
  },

  // Fetch all projects for the current user
  async fetchProjects(): Promise<Project[]> {
    const profileId = await this.getProfileId();
    if (!profileId) return [];

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }

    return (data || []).map(dbProject => mapDatabaseToProject(dbProject as DatabaseScenario));
  },

  // Create a new project
  async createProject(project: Partial<Project>): Promise<Project> {
    const profileId = await this.getProfileId();
    if (!profileId) {
      throw new Error('User not authenticated or profile not found');
    }

    const projectData = mapProjectToDatabase(project as Project, profileId);

    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }

    return mapDatabaseToProject(data as DatabaseScenario, project.target, project.relationship);
  },

  // Update a project
  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const profileId = await this.getProfileId();
    if (!profileId) {
      throw new Error('User not authenticated or profile not found');
    }

    const projectData = mapProjectToDatabase({ id, ...updates } as Project, profileId);
    // Remove profile_id from updates since we're not changing it
    delete projectData.profile_id;

    const { error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .eq('profile_id', profileId);

    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete a project
  async deleteProject(id: string): Promise<void> {
    const profileId = await this.getProfileId();
    if (!profileId) {
      throw new Error('User not authenticated or profile not found');
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('profile_id', profileId);

    if (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },
};
