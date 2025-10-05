import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Module } from '../models/module.model';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  constructor(private supabaseService: SupabaseService) {}

  async getModules(projectId?: string, name?: string): Promise<Module[]> {
    const supabase = this.supabaseService.getClient();
    let query = supabase
      .from('modules')
      .select('*, project:projects(id, name)')
      .order('menu_order', { ascending: true });

    if (projectId) query = query.eq('project_id', projectId);
    if (name) query = query.ilike('name', `%${name}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createModule(module: Module): Promise<Module> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('modules')
      .insert([module])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateModule(id: string, module: Partial<Module>): Promise<Module> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('modules')
      .update(module)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteModule(id: string): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async updateModuleOrder(updates: { id: string; menu_order: number }[]): Promise<void> {
    const supabase = this.supabaseService.getClient();
    for (const update of updates) {
      const { error } = await supabase
        .from('modules')
        .update({ menu_order: update.menu_order })
        .eq('id', update.id);
      if (error) throw error;
    }
  }
}
