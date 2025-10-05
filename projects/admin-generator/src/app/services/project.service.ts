import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private supabaseService: SupabaseService) {}

  async getProjects(): Promise<Project[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getProject(id: string): Promise<Project | null> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createProject(project: Project): Promise<Project> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProject(id: string): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
