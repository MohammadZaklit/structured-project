import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  displayDialog = false;
  project: Project = { name: '' };
  isEditMode = false;
  loading = false;

  constructor(
    private projectService: ProjectService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  async loadProjects(): Promise<void> {
    try {
      this.loading = true;
      this.projects = await this.projectService.getProjects();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load projects'
      });
    } finally {
      this.loading = false;
    }
  }

  showAddDialog(): void {
    this.project = { name: '' };
    this.isEditMode = false;
    this.displayDialog = true;
  }

  showEditDialog(project: Project): void {
    this.project = { ...project };
    this.isEditMode = true;
    this.displayDialog = true;
  }

  async saveProject(): Promise<void> {
    if (!this.project.name.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Project name is required'
      });
      return;
    }

    try {
      this.loading = true;
      if (this.isEditMode && this.project.id) {
        await this.projectService.updateProject(this.project.id, this.project);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Project updated successfully'
        });
      } else {
        await this.projectService.createProject(this.project);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Project created successfully'
        });
      }
      this.displayDialog = false;
      await this.loadProjects();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save project'
      });
    } finally {
      this.loading = false;
    }
  }

  confirmDelete(project: Project): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the project "${project.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProject(project.id!);
      }
    });
  }

  async deleteProject(id: string): Promise<void> {
    try {
      this.loading = true;
      await this.projectService.deleteProject(id);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Project deleted successfully'
      });
      await this.loadProjects();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete project'
      });
    } finally {
      this.loading = false;
    }
  }

  hideDialog(): void {
    this.displayDialog = false;
  }
}
