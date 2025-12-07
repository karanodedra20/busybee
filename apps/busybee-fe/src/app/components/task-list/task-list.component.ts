import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  effect,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';
import { ProjectFormModalComponent } from '../project-form-modal/project-form-modal.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { ToastService } from '../../services/toast.service';
import {
  Task,
  Priority,
  CreateTaskInput,
  UpdateTaskInput,
  Project,
} from '../../models/task.model';

type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    FormsModule,
    TaskCardComponent,
    TaskFormModalComponent,
    ProjectFormModalComponent,
    SidebarComponent,
    HeaderComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  tasks = signal<Task[]>([]);
  projects = signal<Project[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  searchQuery = signal('');
  filterType = signal<FilterType>('all');
  priorityFilter = signal<Priority | 'all'>('all');
  projectFilter = signal<string | 'all'>('all');
  dateFilter = signal<'all' | 'today' | 'upcoming' | 'overdue'>('all');

  isModalOpen = signal(false);
  isProjectModalOpen = signal(false);
  isDeleteProjectModalOpen = signal(false);
  editingTask = signal<Task | null>(null);
  projectToDelete = signal<Project | null>(null);
  defaultProjectId = signal('default-project');

  // Delete Confirmation State
  isDeleteModalOpen = signal(false);
  taskToDelete = signal<Task | null>(null);

  isDarkMode = signal(true); // Default to dark mode

  // Sidebar State
  isSidebarOpen = signal(false);

  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    if (this.isBrowser) {
      // Load theme preference from localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode.set(savedTheme === 'dark');
      } else {
        // Check system preference
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        this.isDarkMode.set(prefersDark);
      }

      // Apply theme whenever it changes
      effect(() => {
        const theme = this.isDarkMode() ? 'dark' : 'light';
        this.document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      });
    }
  }

  filteredTasks = computed(() => {
    let result = this.tasks();

    // Apply search filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    const filter = this.filterType();
    if (filter === 'active') {
      result = result.filter((task) => !task.completed);
    } else if (filter === 'completed') {
      result = result.filter((task) => task.completed);
    }

    // Apply priority filter
    const priority = this.priorityFilter();
    if (priority !== 'all') {
      result = result.filter((task) => task.priority === priority);
    }

    // Apply project filter
    const project = this.projectFilter();
    if (project !== 'all') {
      result = result.filter((task) => task.projectId === project);
    }

    // Apply date filter
    const dateFilterValue = this.dateFilter();
    if (dateFilterValue !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (dateFilterValue === 'today') {
        // Tasks due today
        result = result.filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      } else if (dateFilterValue === 'overdue') {
        result = result.filter((task) => {
          if (!task.dueDate || task.completed) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() < today.getTime();
        });
      } else if (dateFilterValue === 'upcoming') {
        // Tasks due in the future (after today)
        result = result.filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() >= tomorrow.getTime();
        });
      }
    }

    return result;
  });

  taskStats = computed(() => {
    const allTasks = this.tasks();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      total: allTasks.length,
      active: allTasks.filter((t) => !t.completed).length,
      completed: allTasks.filter((t) => t.completed).length,
      today: allTasks.filter((t) => {
        if (!t.dueDate || t.completed) return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      }).length,
      overdue: allTasks.filter((t) => {
        if (!t.dueDate || t.completed) return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() < today.getTime();
      }).length,
      upcoming: allTasks.filter((t) => {
        if (!t.dueDate || t.completed) return false;
        const dueDate = new Date(t.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() >= tomorrow.getTime();
      }).length,
      highPriority: allTasks.filter(
        (t) => !t.completed && t.priority === Priority.HIGH
      ).length,
    };
  });

  readonly Priority = Priority;

  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private toastService = inject(ToastService);

  ngOnInit(): void {
    this.loadTasks();
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.toastService.error('Failed to load projects');
      },
    });
  }

  loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load tasks. Please try again.');
        this.loading.set(false);
        console.error('Error loading tasks:', err);
      },
    });
  }

  onTaskToggled(task: Task): void {
    this.taskService.toggleTaskCompletion(task).subscribe({
      next: (updatedTask) => {
        this.tasks.update((tasks) =>
          tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
        this.toastService.success(
          updatedTask.completed ? 'Task completed!' : 'Task marked as active'
        );
      },
      error: (err) => {
        console.error('Error toggling task:', err);
        this.toastService.error('Failed to update task');
      },
    });
  }

  onTaskEdited(task: Task): void {
    this.editingTask.set(task);
    this.isModalOpen.set(true);
  }

  onTaskDeleted(task: Task): void {
    this.taskToDelete.set(task);
    this.isDeleteModalOpen.set(true);
  }

  confirmDelete(): void {
    const task = this.taskToDelete();
    if (!task) return;

    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks.update((tasks) => tasks.filter((t) => t.id !== task.id));
        this.toastService.success('Task deleted successfully');
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        this.toastService.error('Failed to delete task');
        this.closeDeleteModal();
      },
    });
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.taskToDelete.set(null);
  }

  onCreateTask(): void {
    this.editingTask.set(null);
    this.isModalOpen.set(true);
  }

  onModalClosed(): void {
    this.isModalOpen.set(false);
    this.editingTask.set(null);
  }

  onTaskSubmitted(taskData: CreateTaskInput | UpdateTaskInput): void {
    if ('id' in taskData) {
      // Update existing task
      this.taskService.updateTask(taskData as UpdateTaskInput).subscribe({
        next: (updatedTask) => {
          this.tasks.update((tasks) =>
            tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
          );
          this.toastService.success('Task updated successfully');
        },
        error: (err) => {
          console.error('Error updating task:', err);
          this.toastService.error('Failed to update task');
        },
      });
    } else {
      // Create new task
      this.taskService.createTask(taskData as CreateTaskInput).subscribe({
        next: (newTask) => {
          this.tasks.update((tasks) => [newTask, ...tasks]);
          this.toastService.success('Task created successfully');
        },
        error: (err) => {
          console.error('Error creating task:', err);
          this.toastService.error('Failed to create task');
        },
      });
    }
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  setFilter(filter: FilterType): void {
    this.filterType.set(filter);
  }

  setPriorityFilter(priority: Priority | 'all'): void {
    this.priorityFilter.set(priority);
  }

  setProjectFilter(projectId: string | 'all'): void {
    this.projectFilter.set(projectId);
  }

  setDateFilter(dateFilter: 'all' | 'today' | 'upcoming' | 'overdue'): void {
    this.dateFilter.set(dateFilter);
  }

  resetAllFilters(): void {
    this.filterType.set('all');
    this.priorityFilter.set('all');
    this.projectFilter.set('all');
    this.dateFilter.set('all');
  }

  onFilterChanged(filters: {
    type?: FilterType;
    priority?: Priority | 'all';
    date?: 'all' | 'today' | 'upcoming' | 'overdue';
    project?: string | 'all';
  }): void {
    if (filters.type !== undefined) this.filterType.set(filters.type);
    if (filters.priority !== undefined)
      this.priorityFilter.set(filters.priority);
    if (filters.date !== undefined) this.dateFilter.set(filters.date);
    if (filters.project !== undefined) this.projectFilter.set(filters.project);
  }

  trackByTaskId(_index: number, task: Task): string {
    return task.id;
  }

  toggleTheme(): void {
    this.isDarkMode.update((isDark) => !isDark);
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  openProjectModal(): void {
    this.isProjectModalOpen.set(true);
  }

  onProjectModalClosed(): void {
    this.isProjectModalOpen.set(false);
  }

  onProjectCreated(): void {
    this.loadProjects();
    this.toastService.success('Project created successfully');
  }

  onDeleteProject(project: Project, event: Event): void {
    event.stopPropagation();
    this.projectToDelete.set(project);
    this.isDeleteProjectModalOpen.set(true);
  }

  closeDeleteProjectModal(): void {
    this.isDeleteProjectModalOpen.set(false);
    this.projectToDelete.set(null);
  }

  confirmDeleteProject(): void {
    const project = this.projectToDelete();
    if (!project) return;

    this.projectService.deleteProject(project.id).subscribe({
      next: () => {
        this.projects.update((projects) =>
          projects.filter((p) => p.id !== project.id)
        );
        // Reset project filter if the deleted project was selected
        if (this.projectFilter() === project.id) {
          this.projectFilter.set('all');
        }
        this.toastService.success('Project deleted successfully');
        this.closeDeleteProjectModal();
        // Reload tasks to ensure consistency
        this.loadTasks();
      },
      error: (err) => {
        console.error('Error deleting project:', err);
        this.toastService.error('Failed to delete project');
        this.closeDeleteProjectModal();
      },
    });
  }
}
