import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getForProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/projects/${projectId}/tasks`);
  }

  create(projectId: number, task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/projects/${projectId}/tasks`, task);
  }

  update(taskId: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${taskId}`, task);
  }

  delete(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}`);
  }
}