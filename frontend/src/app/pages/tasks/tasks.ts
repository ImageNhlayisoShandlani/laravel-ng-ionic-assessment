import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task';
import { ProjectService } from '../../services/project';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
import { TaskFormDialogComponent } from '../../components/task-form-dialog/task-form-dialog';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatDialogModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks implements OnInit {
  project = signal<Project | null>(null);
  tasks = signal<Task[]>([]);
  loading = signal(true);
  displayedColumns = ['title', 'status', 'due_date', 'actions'];
  private projectId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.projectService.getOne(this.projectId).subscribe((p) => this.project.set(p));
    this.load();
  }

  load() {
    this.loading.set(true);
    this.taskService.getForProject(this.projectId).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load tasks', 'Dismiss', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  openCreateDialog() {
    const ref = this.dialog.open(TaskFormDialogComponent, { width: '400px', data: null });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.create(this.projectId, result).subscribe({
          next: () => {
            this.snackBar.open('Task created', 'Dismiss', { duration: 2000 });
            this.load();
          },
          error: (err) => this.showValidationError(err),
        });
      }
    });
  }

  openEditDialog(task: Task) {
    const ref = this.dialog.open(TaskFormDialogComponent, { width: '400px', data: task });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.update(task.id!, result).subscribe({
          next: () => {
            this.snackBar.open('Task updated', 'Dismiss', { duration: 2000 });
            this.load();
          },
          error: (err) => this.showValidationError(err),
        });
      }
    });
  }

  deleteTask(task: Task) {
    if (!confirm(`Delete task "${task.title}"?`)) return;
    this.taskService.delete(task.id!).subscribe({
      next: () => {
        this.snackBar.open('Task deleted', 'Dismiss', { duration: 2000 });
        this.load();
      },
      error: () => this.snackBar.open('Failed to delete task', 'Dismiss', { duration: 3000 }),
    });
  }

  backToProjects() {
    this.router.navigate(['/projects']);
  }

  statusColor(status: string): string {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-progress';
      default: return 'status-pending';
    }
  }

  private showValidationError(err: any) {
    const message = err?.error?.errors
      ? Object.values(err.error.errors).flat().join(', ')
      : 'Something went wrong';
    this.snackBar.open(message, 'Dismiss', { duration: 4000 });
  }
}