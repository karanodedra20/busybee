import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, Priority } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  task = input.required<Task>();

  taskToggled = output<Task>();
  taskEdited = output<Task>();
  taskDeleted = output<Task>();

  readonly Priority = Priority;

  get isOverdue(): boolean {
    const task = this.task();
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }

  get priorityColor(): string {
    const priority = this.task().priority;
    switch (priority) {
      case Priority.HIGH:
        return 'error';
      case Priority.MEDIUM:
        return 'warning';
      case Priority.LOW:
        return 'info';
      default:
        return 'neutral';
    }
  }

  onToggleComplete(): void {
    this.taskToggled.emit(this.task());
  }

  onEdit(): void {
    this.taskEdited.emit(this.task());
  }

  onDelete(): void {
    this.taskDeleted.emit(this.task());
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
}
