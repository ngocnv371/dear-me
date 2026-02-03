import { supabase } from '../lib/supabaseClient';
import { Project } from '../types';

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

    return (data || []).map(dbProject => dbProject as Project);
  },

  // Create a new project
  async createProject(project: Partial<Project>): Promise<Project> {
    const profileId = await this.getProfileId();
    if (!profileId) {
      throw new Error('User not authenticated or profile not found');
    }

    const projectData = project as Project

    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }

    return data as Project;
  },

  // Update a project
  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const profileId = await this.getProfileId();
    if (!profileId) {
      throw new Error('User not authenticated or profile not found');
    }

    const projectData = { id, ...updates } as Project;
    // Remove profile_id from updates since we're not changing it

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
