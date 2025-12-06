export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: Date;
  tags: string[];
  completed: boolean;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: Date;
  tags?: string[];
  projectId: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
  tags?: string[];
  completed?: boolean;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}
