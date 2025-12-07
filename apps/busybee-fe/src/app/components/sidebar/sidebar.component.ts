import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, Priority } from '../../models/task.model';

type FilterType = 'all' | 'active' | 'completed';

interface TaskStats {
  total: number;
  active: number;
  completed: number;
  today: number;
  upcoming: number;
  overdue: number;
  highPriority: number;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  // Inputs
  projects = input.required<Project[]>();
  taskStats = input.required<TaskStats>();
  filterType = input.required<FilterType>();
  priorityFilter = input.required<Priority | 'all'>();
  dateFilter = input.required<'all' | 'today' | 'upcoming' | 'overdue'>();
  projectFilter = input.required<string | 'all'>();
  isSidebarOpen = input.required<boolean>();

  // Outputs
  resetFilters = output<void>();
  filterChanged = output<{
    type?: FilterType;
    priority?: Priority | 'all';
    date?: 'all' | 'today' | 'upcoming' | 'overdue';
    project?: string | 'all';
  }>();
  sidebarClosed = output<void>();
  projectModalOpened = output<void>();
  projectDeleted = output<{ project: Project; event: Event }>();
}
