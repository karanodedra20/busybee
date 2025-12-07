import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FilterType,
  DateFilterType,
  PriorityFilterType,
} from '../../models/filter.types';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  // Inputs
  filterType = input.required<FilterType>();
  priorityFilter = input.required<PriorityFilterType>();
  dateFilter = input.required<DateFilterType>();
  searchQuery = input.required<string>();
  isDarkMode = input.required<boolean>();

  // Outputs
  sidebarToggled = output<void>();
  searchChanged = output<string>();
  themeToggled = output<void>();
  createTask = output<void>();

  // Computed
  pageTitle = computed(() => {
    const dateFilter = this.dateFilter();
    const filterType = this.filterType();
    const priorityFilter = this.priorityFilter();

    if (dateFilter === 'today') return 'Today';
    if (dateFilter === 'overdue') return 'Overdue';
    if (dateFilter === 'upcoming') return 'Upcoming';
    if (filterType === 'completed') return 'Completed';
    if (filterType === 'active') return 'Active';
    if (priorityFilter !== 'all') return 'Filtered';
    return 'All Tasks';
  });

  themeToggleTitle = computed(() =>
    this.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'
  );
}
