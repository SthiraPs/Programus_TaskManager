import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TasksService } from '../../services/tasks.service';
import { FormMode } from 'src/app/source/common/models/form-mode.model';
import { TaskModel } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  taskDetails!: TaskModel;
  taskDetails2!: TaskModel;
  private subscriptions = new Subscription();
  selectedTaskId: number = 0;
  mode: FormMode = FormMode.ADD;
  buttonCaption: string = 'Create';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private taskService: TasksService,
    private route: ActivatedRoute
  ) {
    const rowId = this.route.snapshot.paramMap.get('taskId') || 0;
    this.selectedTaskId = Number(rowId);

    this.taskDetails = new TaskModel();
    this.taskDetails2 = new TaskModel();

    if (this.selectedTaskId > 0) {
      this.mode = FormMode.VIEW;
      this.buttonCaption = 'Update';
    }
  }

  async ngOnInit() {
    //this.initializeForm();
    if (this.mode == FormMode.VIEW) {
      await this.loadTaskById();
    }
  }

  loadTaskById() {
    this.subscriptions.add(
      this.taskService.getTaskById(this.selectedTaskId).subscribe({
        next: (res) => {
          this.taskDetails = res;
        },
        error: (error) => {
          console.error(error);
        },
      })
    );
  }
  initializeForm(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      duedate: [new Date(), Validators.required],
      description: [''],
    });
  }

  onClickSubmit() {
    if (this.mode == FormMode.ADD) {
      this.subscriptions.add(
        this.taskService.postTask(this.taskDetails).subscribe({
          next: (res) => {
            this.router.navigate([`/tasks`]);
          },
          error: (error) => {
            console.error(error);
          },
        })
      );
    } else if (this.mode == FormMode.VIEW) {
      this.subscriptions.add(
        this.taskService.updateTaskById(this.taskDetails).subscribe({
          next: (res) => {
            this.router.navigate([`/tasks`]);
          },
          error: (error) => {
            console.error(error);
          },
        })
      );
    }
  }

  onClickCancel() {
    this.router.navigate([`/tasks`]);
  }
}
