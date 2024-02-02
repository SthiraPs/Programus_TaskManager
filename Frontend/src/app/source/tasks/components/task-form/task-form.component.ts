import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TasksService } from '../../services/tasks.service';
import { FormMode } from 'src/app/source/common/models/form-mode.model';
import { TaskModel } from '../../models/task.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  private subscriptions = new Subscription();
  selectedTaskId: number = 0;
  mode: FormMode = FormMode.ADD;
  buttonCaption: string = 'Create';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private taskService: TasksService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    const rowId = this.route.snapshot.paramMap.get('taskId') || 0;
    this.selectedTaskId = Number(rowId);

    if (this.selectedTaskId > 0) {
      this.mode = FormMode.VIEW;
      this.buttonCaption = 'Update';
    }
  }

  async ngOnInit() {
    this.initializeForm();
    if (this.mode == FormMode.VIEW) {
      await this.loadTaskById();
    }
  }

  loadTaskById() {
    this.subscriptions.add(
      this.taskService.getTaskById(this.selectedTaskId).subscribe({
        next: (task) => {
          this.taskForm.patchValue(task);
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

  initializeForm(): void {
    this.taskForm = this.formBuilder.group({
      id: [0],
      title: ['', Validators.required],
      dueDate: ['', Validators.required],
      description: [''],
    });
  }

  onClickSubmit() {
    if (this.taskForm.valid) {
      if (this.mode == FormMode.ADD) {
        this.subscriptions.add(
          this.taskService.postTask(this.taskForm.value).subscribe({
            next: (res) => {
              if (res.success) {
                this.router.navigate([`/tasks`]);
                this.snackBar.open(res.message, 'Close', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center',
                  panelClass: ['snack-bar-success'],
                });
              }
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
      } else if (this.mode == FormMode.VIEW) {
        this.subscriptions.add(
          this.taskService.updateTaskById(this.taskForm.value).subscribe({
            next: (res) => {
              if (res.success) {
                this.router.navigate([`/tasks`]);
                this.snackBar.open(res.message, 'Close', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'center',
                  panelClass: ['snack-bar-success'],
                });
              }
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
    } else {
      this.snackBar.open('Please fill the requred fields', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snack-bar-error'],
      });
    }
  }

  onClickCancel() {
    this.router.navigate([`/tasks`]);
  }
}
