import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(): void {
    this.taskForm = this.formBuilder.group({
      taskName: ['', Validators.required],
      date: [new Date(), Validators.required],
      taskDescription: [''],
    });
  }

  onClickCreate() {
    if (this.taskForm.valid) {
      console.log(this.taskForm.value);
    } else {
      console.error('Form is not valid');
    }
  }

  onClickCancel() {
    this.router.navigate([`/tasks`]);

  }


}
