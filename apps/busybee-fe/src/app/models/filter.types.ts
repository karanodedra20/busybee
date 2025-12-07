import { Priority } from './task.model';

export type FilterType = 'all' | 'active' | 'completed';
export type DateFilterType = 'all' | 'today' | 'upcoming' | 'overdue';
export type PriorityFilterType = Priority | 'all';
export type ProjectFilterType = string | 'all';

export interface FilterChangeEvent {
  type?: FilterType;
  priority?: PriorityFilterType;
  date?: DateFilterType;
  project?: ProjectFilterType;
}

export interface TaskStats {
  total: number;
  active: number;
  completed: number;
  today: number;
  upcoming: number;
  overdue: number;
  highPriority: number;
}
