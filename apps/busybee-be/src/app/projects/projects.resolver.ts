import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { AuthGuard } from '../auth/auth.guard';

@Resolver(() => Project)
@UseGuards(AuthGuard)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [Project], { name: 'projects', description: 'Get all projects' })
  findAll(@Context() context: { req: { user: { uid: string } } }): Promise<Project[]> {
    return this.projectsService.findAll(context.req.user.uid);
  }

  @Query(() => Project, {
    name: 'project',
    nullable: true,
    description: 'Get a project by ID',
  })
  findOne(
    @Args('id', { type: () => String }) id: string,
    @Context() context: { req: { user: { uid: string } } }
  ): Promise<Project | null> {
    return this.projectsService.findOne(id, context.req.user.uid);
  }

  @Mutation(() => Project, {
    name: 'createProject',
    description: 'Create a new project',
  })
  create(
    @Args('input') createProjectInput: CreateProjectInput,
    @Context()
    context: { req: { user: { uid: string; email?: string; name?: string } } }
  ): Promise<Project> {
    return this.projectsService.create(
      createProjectInput,
      context.req.user.uid,
      context.req.user.email,
      context.req.user.name
    );
  }

  @Mutation(() => Project, {
    name: 'deleteProject',
    description: 'Delete a project by ID',
  })
  delete(
    @Args('id', { type: () => String }) id: string,
    @Context() context: { req: { user: { uid: string } } }
  ): Promise<Project> {
    return this.projectsService.delete(id, context.req.user.uid);
  }
}
