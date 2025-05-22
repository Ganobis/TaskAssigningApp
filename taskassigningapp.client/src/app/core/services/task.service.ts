import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TaskDto } from "../models/task/task.model";

@Injectable({providedIn: 'root'})
export class TaskService {
  private readonly baseUrl = 'https://localhost:7046/api/tasks';

  constructor(private readonly http: HttpClient) {

  }

  getAssignedTasks(userId: string): Observable<TaskDto[]>{
    return this.http.get<TaskDto[]>(`${this.baseUrl}/assigned/${userId}`);
  }

  getUnassignedTask(): Observable<TaskDto[]>{
    return this.http.get<TaskDto[]>(`${this.baseUrl}/available`);
  }

  assignTaskToUser(userId: string, taskIds: string[]): Observable<void>{
    return this.http.post<void>(`${this.baseUrl}/assign/${userId}`, taskIds);
  }
}