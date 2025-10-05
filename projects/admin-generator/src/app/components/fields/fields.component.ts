import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FieldService } from '../../services/field.service';
import { ModuleService } from '../../services/module.service';
import { Field } from '../../models/field.model';
import { Module } from '../../models/module.model';

@Component({
  selector: 'app-fields',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule, ToastModule, ConfirmDialogModule, TooltipModule],
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class FieldsComponent implements OnInit {
  fields: Field[] = [];
  modules: Module[] = [];
  fieldTypes: { name: string; label: string }[] = [];
  displayDialog = false;
  field: Field = { name: '', label: '', module_id: '', type: '' };
  isEditMode = false;
  loading = false;
  filterModuleId = '';
  filterReferenceModuleId = '';
  filterName = '';

  constructor(private fieldService: FieldService, private moduleService: ModuleService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

  async ngOnInit(): Promise<void> {
    await this.loadModules();
    await this.loadFieldTypes();
    await this.loadFields();
  }

  async loadModules(): Promise<void> {
    try { this.modules = await this.moduleService.getModules(); }
    catch (e) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load modules' }); }
  }

  async loadFieldTypes(): Promise<void> { this.fieldTypes = await this.fieldService.getFieldTypes(); }

  async loadFields(): Promise<void> {
    try {
      this.loading = true;
      this.fields = await this.fieldService.getFields(this.filterModuleId || undefined, this.filterReferenceModuleId || undefined, this.filterName || undefined);
    } catch (e) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load fields' }); }
    finally { this.loading = false; }
  }

  applyFilters(): void { this.loadFields(); }
  clearFilters(): void { this.filterModuleId = ''; this.filterReferenceModuleId = ''; this.filterName = ''; this.loadFields(); }
  showAddDialog(): void { this.field = { name: '', label: '', module_id: '', type: '', reference_module_id: null }; this.isEditMode = false; this.displayDialog = true; }
  showEditDialog(field: Field): void { this.field = { ...field }; this.isEditMode = true; this.displayDialog = true; }

  async saveField(): Promise<void> {
    if (!this.field.name.trim() || !this.field.label.trim() || !this.field.module_id || !this.field.type) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Required fields missing' });
      return;
    }
    try {
      this.loading = true;
      if (this.isEditMode && this.field.id) {
        await this.fieldService.updateField(this.field.id, this.field);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Field updated' });
      } else {
        await this.fieldService.createField(this.field);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Field created' });
      }
      this.displayDialog = false;
      await this.loadFields();
    } catch (e) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save' }); }
    finally { this.loading = false; }
  }

  confirmDelete(field: Field): void {
    this.confirmationService.confirm({
      message: `Delete "${field.name}"?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteField(field.id!)
    });
  }

  async deleteField(id: string): Promise<void> {
    try {
      this.loading = true;
      await this.fieldService.deleteField(id);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Field deleted' });
      await this.loadFields();
    } catch (e) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete' }); }
    finally { this.loading = false; }
  }

  async onRowReorder(event: any): Promise<void> {
    const updates = event.value.map((f: Field, i: number) => ({ id: f.id!, display_order: i }));
    try {
      await this.fieldService.updateFieldOrder(updates);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order updated' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update order' });
      await this.loadFields();
    }
  }

  hideDialog(): void { this.displayDialog = false; }
}
