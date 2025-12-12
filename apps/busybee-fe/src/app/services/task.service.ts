import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map, filter } from 'rxjs';
import { Task, CreateTaskInput, UpdateTaskInput } from '../models/task.model';

const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      priority
      dueDate
      tags
      completed
      projectId
      createdAt
      updatedAt
    }
  }
`;

const GET_TASK = gql`
  query GetTask($id: String!) {
    task(id: $id) {
      id
      title
      description
      priority
      dueDate
      tags
      completed
      projectId
      createdAt
      updatedAt
    }
  }
`;

const SEARCH_TASKS_BY_TITLE = gql`
  query SearchTasksByTitle($title: String!) {
    searchTasksByTitle(title: $title) {
      id
      title
      description
      priority
      dueDate
      tags
      completed
      projectId
      createdAt
      updatedAt
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($createTaskInput: CreateTaskInput!) {
    createTask(createTaskInput: $createTaskInput) {
      id
      title
      description
      priority
      dueDate
      tags
      completed
      projectId
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($updateTaskInput: UpdateTaskInput!) {
    updateTask(updateTaskInput: $updateTaskInput) {
      id
      title
      description
      priority
      dueDate
      tags
      completed
      projectId
      createdAt
      updatedAt
    }
  }
`;

const DELETE_TASK = gql`
  mutation RemoveTask($id: String!) {
    removeTask(id: $id) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apollo = inject(Apollo);

  getTasks(): Observable<Task[]> {
    return this.apollo
      .watchQuery<{ tasks: Task[] }>({
        query: GET_TASKS,
      })
      .valueChanges.pipe(
        filter((result) => !result.loading),
        map((result) => (result.data?.tasks || []) as Task[])
      );
  }

  getTask(id: string): Observable<Task | undefined> {
    return this.apollo
      .watchQuery<{ task: Task }>({
        query: GET_TASK,
        variables: { id },
      })
      .valueChanges.pipe(
        map((result) => result.data?.task as Task | undefined)
      );
  }

  searchTasksByTitle(title: string): Observable<Task[]> {
    return this.apollo
      .watchQuery<{ searchTasksByTitle: Task[] }>({
        query: SEARCH_TASKS_BY_TITLE,
        variables: { title },
      })
      .valueChanges.pipe(
        map((result) => (result.data?.searchTasksByTitle || []) as Task[])
      );
  }

  createTask(input: CreateTaskInput): Observable<Task> {
    return this.apollo
      .mutate<{ createTask: Task }>({
        mutation: CREATE_TASK,
        variables: { createTaskInput: input },
        refetchQueries: [{ query: GET_TASKS }],
      })
      .pipe(map((result) => result.data!.createTask));
  }

  updateTask(input: UpdateTaskInput): Observable<Task> {
    return this.apollo
      .mutate<{ updateTask: Task }>({
        mutation: UPDATE_TASK,
        variables: { updateTaskInput: input },
        refetchQueries: [{ query: GET_TASKS }],
      })
      .pipe(map((result) => result.data!.updateTask));
  }

  deleteTask(id: string): Observable<Task> {
    return this.apollo
      .mutate<{ removeTask: Task }>({
        mutation: DELETE_TASK,
        variables: { id },
        refetchQueries: [{ query: GET_TASKS }],
      })
      .pipe(map((result) => result.data!.removeTask));
  }

  toggleTaskCompletion(task: Task): Observable<Task> {
    return this.updateTask({
      id: task.id,
      completed: !task.completed,
    });
  }

  getAllTags(): Observable<string[]> {
    return this.getTasks().pipe(
      map((tasks) => {
        const allTags = tasks.flatMap((task) => task.tags || []);
        return [...new Set(allTags)].sort();
      })
    );
  }
}
