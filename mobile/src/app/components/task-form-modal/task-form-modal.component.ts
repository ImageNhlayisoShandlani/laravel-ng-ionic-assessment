import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ModalController,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonText,
} from '@ionic/angular';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonText,
  ],
  templateUrl: './task-form-modal.component.html',
})
export class TaskFormModalComponent implements OnInit {
  @Input() task: Task | null = null;
  form: FormGroup;
  statuses = ['Pending', 'In Progress', 'Completed'];

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      status: ['Pending', Validators.required],
      due_date: [null],
    });
  }

  ngOnInit() {
    if (this.task) {
      this.form.patchValue({
        title: this.task.title,
        status: this.task.status,
        due_date: this.task.due_date,
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.modalCtrl.dismiss(this.form.value, 'save');
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}