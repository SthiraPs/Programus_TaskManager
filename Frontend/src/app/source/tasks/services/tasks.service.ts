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
  success: boolean = true;
  message: string = '';
  error: string = '';
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(public http: HttpClient, private router: Router) {}

  getTaskList(): Observable<TaskModel[]> {
    //Get All
    return this.http
      .get<TaskModel[]>(`${environment.apiUrl}/Task`)
      .pipe(catchError(this.handleError));
  }

  getTaskById(taskId: number): Observable<TaskModel> {
    //Get by Id
    return this.http
      .get<TaskModel>(`${environment.apiUrl}/Task/${taskId}`)
      .pipe(catchError(this.handleError));
  }

  postTask(updatedTask: TaskModel) {
    //Post
    return this.http
      .post<ResObj>(`${environment.apiUrl}/Task`, updatedTask)
      .pipe(catchError(this.handleError));
  }

  updateTaskById(updatedTask: TaskModel) {
    //Update
    return this.http
      .put<ResObj>(`${environment.apiUrl}/Task/${updatedTask.id}`, updatedTask)
      .pipe(catchError(this.handleError));
  }

  deleteTaskById(taskId: number) {
    //Delete
    return this.http
      .delete<ResObj>(`${environment.apiUrl}/Task/${taskId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.error);
    return throwError(
      () => new Error('Could not complete the request. Please try again later.')
    );
  }
}
