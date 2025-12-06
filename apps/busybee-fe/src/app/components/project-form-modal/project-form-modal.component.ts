import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-form-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form-modal.component.html',
  styleUrl: './project-form-modal.component.scss',
})
export class ProjectFormModalComponent {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);

  isOpen = input.required<boolean>();
  closed = output<void>();
  projectCreated = output<void>();

  form: FormGroup;
  isSubmitting = signal(false);

  // Predefined color options
  colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Teal', value: '#14B8A6' },
  ];

  // Predefined icon options
  iconOptions = ['📁', '💼', '🏠', '🛒', '💡', '🎯', '📚', '🎨', '🔧', '⚡'];

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      color: [this.colorOptions[0].value, Validators.required],
      icon: ['📁'],
    });
  }

  close(): void {
    this.resetForm();
    this.closed.emit();
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.form.value;

    this.projectService
      .createProject({
        name: formValue.name,
        color: formValue.color,
        icon: formValue.icon || undefined,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.projectCreated.emit();
          this.close();
        },
        error: (error) => {
          console.error('Error creating project:', error);
          this.isSubmitting.set(false);
        },
      });
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      color: this.colorOptions[0].value,
      icon: '📁',
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('minlength')) {
      return 'Name must be at least 1 character';
    }
    return '';
  }
}
