import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type FilterType = 'all' | 'active' | 'completed';

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
  priorityFilter = input.required<string>();
  searchQuery = input.required<string>();
  isDarkMode = input.required<boolean>();

  // Outputs
  sidebarToggled = output<void>();
  searchChanged = output<string>();
  themeToggled = output<void>();
  createTask = output<void>();
}
