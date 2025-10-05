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
import { ModuleService } from '../../services/module.service';
import { ProjectService } from '../../services/project.service';
import { Module } from '../../models/module.model';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule, ToastModule, ConfirmDialogModule, TooltipModule],
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ModulesComponent implements OnInit {
  modules: Module[] = [];
  projects: Project[] = [];
  displayDialog = false;
  module: Module = { name: '', path: '', project_id: '' };
  isEditMode = false;
  loading = false;
  filterProjectId = '';
  filterName = '';

  constructor(private moduleService: ModuleService, private projectService: ProjectService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit(): void { this.loadProjects(); this.loadModules(); }

  async loadProjects(): Promise<void> {
    try { this.projects = await this.projectService.getProjects(); }
    catch (e) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load projects' }); }
  }

  async loadModules(): Promise<void> {
    try {
      this.loading = true;
      this.modules = await this.moduleService.getModules(this.filterProjectId || undefined, this.filterName || undefined);
    } catch (e) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load modules' }); }
    finally { this.loading = false; }
  }

  applyFilters(): void { this.loadModules(); }
  clearFilters(): void { this.filterProjectId = ''; this.filterName = ''; this.loadModules(); }
  showAddDialog(): void { this.module = { name: '', path: '', project_id: '' }; this.isEditMode = false; this.displayDialog = true; }
  showEditDialog(module: Module): void { this.module = { ...module }; this.isEditMode = true; this.displayDialog = true; }

  async saveModule(): Promise<void> {
    if (!this.module.name.trim() || !this.module.path.trim() || !this.module.project_id) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'All fields required' });
      return;
    }
    try {
      this.loading = true;
      if (this.isEditMode && this.module.id) {
        await this.moduleService.updateModule(this.module.id, this.module);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Module updated' });
      } else {
        await this.moduleService.createModule(this.module);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Module created' });
      }
      this.displayDialog = false;
      await this.loadModules();
    } catch (e) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save' }); }
    finally { this.loading = false; }
  }

  confirmDelete(module: Module): void {
    this.confirmationService.confirm({
      message: `Delete "${module.name}"?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteModule(module.id!)
    });
  }

  async deleteModule(id: string): Promise<void> {
    try {
      this.loading = true;
      await this.moduleService.deleteModule(id);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Module deleted' });
      await this.loadModules();
    } catch (e) { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete' }); }
    finally { this.loading = false; }
  }

  async onRowReorder(event: any): Promise<void> {
    const updates = event.value.map((m: Module, i: number) => ({ id: m.id!, menu_order: i }));
    try {
      await this.moduleService.updateModuleOrder(updates);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order updated' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update order' });
      await this.loadModules();
    }
  }

  hideDialog(): void { this.displayDialog = false; }
}
