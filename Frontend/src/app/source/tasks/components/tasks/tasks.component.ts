import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TaskModel } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {
  displayedColumns: string[] = [
    'Id',
    'TaskName',
    'DueDate',
    'TaskDescription',
    'Edit',
    'Delete',
  ];
  dataSource = new MatTableDataSource<TaskModel>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private subscriptions = new Subscription();

  taskList: TaskModel[] = [];

  constructor(
    private router: Router,
    private taskService: TasksService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.loadTaskList();
    //await this.loadTaskById();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onClickCreateTask() {
    try {
      this.router.navigate([`/create-task`]);
    } catch (error) {}
  }

  async loadTaskList() {
    this.subscriptions.add(
      this.taskService.getTaskList().subscribe({
        next: (tasks) => {
          this.taskList = tasks;
          this.dataSource = new MatTableDataSource<TaskModel>(this.taskList);
          this.dataSource.paginator = this.paginator;
        },
        error: (error) => {
          console.error(error);
        },
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // Clean up subscriptions
  }

  onClickEdit(taskId: number) {
    this.router.navigate([`/create-task/${taskId}`]);
  }

  onClickDelete(taskId: number) {
    this.subscriptions.add(
      this.taskService.deleteTaskById(taskId).subscribe({
        next: (res) => {
          this.loadTaskList();
          this.snackBar.open(res.message, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snack-bar-error'],
          });
        },
        error: (error) => {
          this.snackBar.open('Error :' + error, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snack-bar-error'],
          });
        },
      })
    );
  }
}
