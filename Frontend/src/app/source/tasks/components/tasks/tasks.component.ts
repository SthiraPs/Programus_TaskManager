import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { TaskModel } from '../../models/task.model';


const TaskList: TaskModel[] = [
  { id: 1, taskName: 'Hydrogen', description: 'asdsddas', dueDate: 'xwsxswx' },
];

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<TaskModel>(TaskList);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router) {}

  async ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onClickCreateTask() {
    try {
      this.router.navigate([`/create-task`]);
    } catch (error) {}
  }
}
