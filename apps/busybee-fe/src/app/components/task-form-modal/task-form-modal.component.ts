import {
  Component,
  input,
  output,
  effect,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import {
  Task,
  Priority,
  CreateTaskInput,
  UpdateTaskInput,
  Project,
} from '../../models/task.model';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-task-form-modal',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './task-form-modal.component.html',
  styleUrl: './task-form-modal.component.scss',
})
export class TaskFormModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);

  isOpen = input.required<boolean>();
  task = input<Task | null>(null);
  projectId = input<string>('');

  closed = output<void>();
  taskSubmitted = output<CreateTaskInput | UpdateTaskInput>();

  form: FormGroup;
  readonly priorities = Object.values(Priority);
  tagInput = signal('');
  projects = signal<Project[]>([]);

  constructor() {
    this.form = this.initializeForm();

    effect(() => {
      const currentTask = this.task();
      if (currentTask) {
        this.form.patchValue({
          title: currentTask.title,
          description: currentTask.description || '',
          priority: currentTask.priority,
          dueDate: currentTask.dueDate
            ? this.formatDateForInput(new Date(currentTask.dueDate))
            : '',
          projectId: currentTask.projectId,
        });
        this.form.setControl('tags', this.fb.control(currentTask.tags));
      } else {
        this.resetForm();
      }
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
      },
      error: (err) => {
        console.error('Error loading projects:', err);
      },
    });
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', Validators.maxLength(1000)],
      priority: [Priority.MEDIUM, Validators.required],
      dueDate: [''],
      projectId: [this.projectId(), Validators.required],
      tags: this.fb.control<string[]>([]),
    });
  }

  get tags(): string[] {
    return this.form.get('tags')?.value || [];
  }

  get isEditMode(): boolean {
    return !!this.task();
  }

  get modalTitle(): string {
    return this.isEditMode ? 'Edit Task' : 'Create New Task';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Update Task' : 'Create Task';
  }

  addTag(): void {
    const tag = this.tagInput().trim();
    if (tag && !this.tags.includes(tag)) {
      const currentTags = this.tags;
      this.form.patchValue({ tags: [...currentTags, tag] });
      this.tagInput.set('');
    }
  }

  removeTag(tagToRemove: string): void {
    const updatedTags = this.tags.filter((tag) => tag !== tagToRemove);
    this.form.patchValue({ tags: updatedTags });
  }

  onTagInputKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;

      const taskData = {
        title: formValue.title,
        description: formValue.description || undefined,
        priority: formValue.priority,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
        tags: formValue.tags || [],
        projectId: formValue.projectId,
      };

      if (this.isEditMode) {
        const currentTask = this.task();
        if (currentTask) {
          const updateData: UpdateTaskInput = {
            id: currentTask.id,
            ...taskData,
          };
          this.taskSubmitted.emit(updateData);
        }
      } else {
        const createData: CreateTaskInput = taskData;
        this.taskSubmitted.emit(createData);
      }

      this.close();
    } else {
      this.form.markAllAsTouched();
    }
  }

  close(): void {
    this.closed.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.form.reset({
      title: '',
      description: '',
      priority: Priority.MEDIUM,
      dueDate: '',
      projectId: this.projectId(),
      tags: [],
    });
    this.tagInput.set('');
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getPriorityColor(priority: Priority): string {
    switch (priority) {
      case Priority.HIGH:
        return 'badge-error';
      case Priority.MEDIUM:
        return 'badge-warning';
      case Priority.LOW:
        return 'badge-info';
      default:
        return '';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['maxlength']) {
        return `Maximum length is ${field.errors['maxlength'].requiredLength}`;
      }
    }
    return '';
  }
}
