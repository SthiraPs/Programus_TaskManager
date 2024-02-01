import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { TaskModel } from '../models/task.model';
import { environment } from 'src/environment';
import { Observable, catchError, throwError } from 'rxjs';


export class ResObj {
  message: string = '';
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(public http: HttpClient, private router: Router) {}

  getTaskList(): Observable<TaskModel[]> {
    return this.http
      .get<TaskModel[]>(`${environment.apiUrl}/Task`)
      .pipe(catchError(this.handleError));
  }

  getTaskById(taskId : number): Observable<TaskModel> {
    return this.http
      .get<TaskModel>(`${environment.apiUrl}/Task/${taskId}`)
      .pipe(catchError(this.handleError));
  }

  postTask(updatedTask: TaskModel): Observable<TaskModel[]> {
    return this.http
      .post<TaskModel[]>(`${environment.apiUrl}/Task`, updatedTask)
      .pipe(catchError(this.handleError));
  }

  updateTaskById(updatedTask: TaskModel) {
    return this.http
      .put<ResObj>(`${environment.apiUrl}/Task/${updatedTask.id}`, updatedTask)
      .pipe(catchError(this.handleError));
  }

  deleteTaskById(taskId : number): Observable<TaskModel[]> {
    return this.http
      .delete<TaskModel[]>(`${environment.apiUrl}/Task/${taskId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.error);
    return throwError(
      () => new Error('Could not complete the request. Please try again later.')
    );
  }
}
