import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {
  constructor(private router: Router) {}

  async ngOnInit() {}

  onClickCreateTask() {
    this.router.navigate([`/create-task`]);
  }
}
