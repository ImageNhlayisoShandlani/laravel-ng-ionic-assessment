import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule,
  ],
  templateUrl: './task-form-dialog.html',
})
export class TaskFormDialogComponent {
  form: FormGroup;
  statuses = ['Pending', 'In Progress', 'Completed'];
  minDate = new Date(); // used to restrict the picker to future dates on create

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {
    this.form = this.fb.group({
      title: [this.data?.title ?? '', [Validators.required, Validators.maxLength(255)]],
      status: [this.data?.status ?? 'Pending', Validators.required],
      due_date: [this.data?.due_date ?? null],
    });
  }

  save() {
    if (this.form.invalid) return;
    const value = { ...this.form.value };
    if (value.due_date instanceof Date) {
      value.due_date = value.due_date.toISOString().split('T')[0]; // format as YYYY-MM-DD for Laravel
    }
    this.dialogRef.close(value);
  }

  cancel() {
    this.dialogRef.close();
  }
}