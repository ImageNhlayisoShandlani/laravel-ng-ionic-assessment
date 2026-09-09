import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ModalController, AlertController, ToastController,
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonSelect, IonSelectOption,
  IonButton, IonIcon, IonSpinner, IonList, IonItemSliding, IonLabel, IonBadge,
  IonItemOptions, IonItemOption,
} from '@ionic/angular';
import { ProjectService } from '../services/project';
import { TaskService } from '../services/task';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { TaskFormModalComponent } from '../components/task-form-modal/task-form-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonSelect, IonSelectOption,
    IonButton, IonIcon, IonSpinner, IonList, IonItemSliding, IonLabel, IonBadge,
    IonItemOptions, IonItemOption,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  projects = signal<Project[]>([]);
  selectedProjectId: number | null = null;
  tasks = signal<Task[]>([]);
  loadingTasks = signal(false);

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.projectService.getAll().subscribe((data) => this.projects.set(data));
  }

  onProjectChange() {
    if (this.selectedProjectId == null) {
      this.tasks.set([]);
      return;
    }
    this.loadTasks();
  }

  loadTasks() {
    if (this.selectedProjectId == null) return;
    this.loadingTasks.set(true);
    this.taskService.getForProject(this.selectedProjectId).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loadingTasks.set(false);
      },
      error: () => {
        this.loadingTasks.set(false);
        this.showToast('Failed to load tasks', 'danger');
      },
    });
  }

  async openCreateModal() {
    const modal = await this.modalCtrl.create({
      component: TaskFormModalComponent,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'save' && data) {
      this.taskService.create(this.selectedProjectId!, data).subscribe({
        next: () => {
          this.showToast('Task created', 'success');
          this.loadTasks();
        },
        error: (err) => this.showValidationError(err),
      });
    }
  }

  async openEditModal(task: Task) {
    const modal = await this.modalCtrl.create({
      component: TaskFormModalComponent,
      componentProps: { task },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'save' && data) {
      this.taskService.update(task.id!, data).subscribe({
        next: () => {
          this.showToast('Task updated', 'success');
          this.loadTasks();
        },
        error: (err) => this.showValidationError(err),
      });
    }
  }

  async confirmDelete(task: Task) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Task',
      message: `Delete "${task.title}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.taskService.delete(task.id!).subscribe({
              next: () => {
                this.showToast('Task deleted', 'success');
                this.loadTasks();
              },
              error: () => this.showToast('Failed to delete task', 'danger'),
            });
          },
        },
      ],
    });
    await alert.present();
  }

  statusColor(status: string): string {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      default: return 'warning';
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color, position: 'bottom' });
    await toast.present();
  }

  private showValidationError(err: any) {
    const message = err?.error?.errors
      ? Object.values(err.error.errors).flat().join(', ')
      : 'Something went wrong';
    this.showToast(message, 'danger');
  }
}