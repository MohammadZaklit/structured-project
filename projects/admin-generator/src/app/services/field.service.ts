import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Field } from '../models/field.model';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  constructor(private supabaseService: SupabaseService) {}

  async getFields(moduleId?: string, referenceModuleId?: string, name?: string): Promise<Field[]> {
    const supabase = this.supabaseService.getClient();
    let query = supabase
      .from('fields')
      .select('*, module:modules!fields_module_id_fkey(id, name), reference_module:modules!fields_reference_module_id_fkey(id, name)')
      .order('display_order', { ascending: true });

    if (moduleId) query = query.eq('module_id', moduleId);
    if (referenceModuleId) query = query.eq('reference_module_id', referenceModuleId);
    if (name) query = query.ilike('name', `%${name}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createField(field: Field): Promise<Field> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('fields')
      .insert([field])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateField(id: string, field: Partial<Field>): Promise<Field> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('fields')
      .update(field)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteField(id: string): Promise<void> {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('fields')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async updateFieldOrder(updates: { id: string; display_order: number }[]): Promise<void> {
    const supabase = this.supabaseService.getClient();
    for (const update of updates) {
      const { error } = await supabase
        .from('fields')
        .update({ display_order: update.display_order })
        .eq('id', update.id);
      if (error) throw error;
    }
  }

  async getFieldTypes(): Promise<{ name: string; label: string }[]> {
    return [
      { name: 'string', label: 'String' },
      { name: 'text', label: 'Text' },
      { name: 'number', label: 'Number' },
      { name: 'boolean', label: 'Boolean' },
      { name: 'date', label: 'Date' },
      { name: 'datetime', label: 'Date Time' },
      { name: 'email', label: 'Email' },
      { name: 'phone', label: 'Phone' },
      { name: 'url', label: 'URL' },
      { name: 'select', label: 'Select' },
      { name: 'multiselect', label: 'Multi Select' },
      { name: 'file', label: 'File' },
      { name: 'image', label: 'Image' },
      { name: 'reference', label: 'Reference' }
    ];
  }
}
