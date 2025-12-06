import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

@Component({
  imports: [RouterModule, TaskListComponent, ToastContainerComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected title = 'busybee-fe';
}
