import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../services/project';
import { Project } from '../../models/project.model';
import { ProjectFormDialog } from '../../components/project-form-dialog/project-form-dialog';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements OnInit {
  projects = signal<Project[]>([]);
  loading = signal(true);

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load projects', 'Dismiss', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  openCreateDialog() {
    const ref = this.dialog.open(ProjectFormDialog, { width: '400px', data: null });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Project created', 'Dismiss', { duration: 2000 });
            this.load();
          },
          error: (err) => this.showValidationError(err),
        });
      }
    });
  }

  openEditDialog(project: Project, event: Event) {
    event.stopPropagation();
    const ref = this.dialog.open(ProjectFormDialog, { width: '400px', data: project });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService.update(project.id!, result).subscribe({
          next: () => {
            this.snackBar.open('Project updated', 'Dismiss', { duration: 2000 });
            this.load();
          },
          error: (err) => this.showValidationError(err),
        });
      }
    });
  }

  deleteProject(project: Project, event: Event) {
    event.stopPropagation();
    if (!confirm(`Delete "${project.name}"? This will also delete its tasks.`)) return;
    this.projectService.delete(project.id!).subscribe({
      next: () => {
        this.snackBar.open('Project deleted', 'Dismiss', { duration: 2000 });
        this.load();
      },
      error: () => this.snackBar.open('Failed to delete project', 'Dismiss', { duration: 3000 }),
    });
  }

  viewTasks(project: Project) {
    this.router.navigate(['/projects', project.id, 'tasks']);
  }

  private showValidationError(err: any) {
    const message = err?.error?.errors
      ? Object.values(err.error.errors).flat().join(', ')
      : 'Something went wrong';
    this.snackBar.open(message, 'Dismiss', { duration: 4000 });
  }
}