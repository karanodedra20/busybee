import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { Project } from '../models/task.model';

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      color
      icon
      createdAt
      updatedAt
    }
  }
`;

const GET_PROJECT = gql`
  query GetProject($id: String!) {
    project(id: $id) {
      id
      name
      color
      icon
      createdAt
      updatedAt
    }
  }
`;

const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      color
      icon
      createdAt
      updatedAt
    }
  }
`;

const DELETE_PROJECT = gql`
  mutation DeleteProject($id: String!) {
    deleteProject(id: $id) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apollo = inject(Apollo);

  getProjects(): Observable<Project[]> {
    return this.apollo
      .watchQuery<{ projects: Project[] }>({
        query: GET_PROJECTS,
      })
      .valueChanges.pipe(
        map((result) => {
          if (!result.data?.projects) return [];
          return result.data.projects as Project[];
        })
      );
  }

  getProject(id: string): Observable<Project | undefined> {
    return this.apollo
      .watchQuery<{ project: Project }>({
        query: GET_PROJECT,
        variables: { id },
      })
      .valueChanges.pipe(
        map((result) => {
          if (!result.data?.project) return undefined;
          return result.data.project as Project;
        })
      );
  }

  createProject(input: {
    name: string;
    color: string;
    icon?: string;
  }): Observable<Project> {
    return this.apollo
      .mutate<{ createProject: Project }>({
        mutation: CREATE_PROJECT,
        variables: { input },
        refetchQueries: [{ query: GET_PROJECTS }],
      })
      .pipe(
        map((result) => {
          if (!result.data?.createProject) {
            throw new Error('Failed to create project');
          }
          return result.data.createProject as Project;
        })
      );
  }

  deleteProject(id: string): Observable<{ id: string }> {
    return this.apollo
      .mutate<{ deleteProject: { id: string } }>({
        mutation: DELETE_PROJECT,
        variables: { id },
        refetchQueries: [{ query: GET_PROJECTS }],
      })
      .pipe(
        map((result) => {
          if (!result.data?.deleteProject) {
            throw new Error('Failed to delete project');
          }
          return result.data.deleteProject;
        })
      );
  }
}
