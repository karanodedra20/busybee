import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/task.model';
import {
  FilterType,
  DateFilterType,
  PriorityFilterType,
  ProjectFilterType,
  TaskStats,
  FilterChangeEvent,
} from '../../models/filter.types';

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
  priorityFilter = input.required<PriorityFilterType>();
  dateFilter = input.required<DateFilterType>();
  projectFilter = input.required<ProjectFilterType>();
  isSidebarOpen = input.required<boolean>();

  // Outputs
  resetFilters = output<void>();
  filterChanged = output<FilterChangeEvent>();
  sidebarClosed = output<void>();
  projectModalOpened = output<void>();
  projectDeleted = output<{ project: Project; event: Event }>();
}
