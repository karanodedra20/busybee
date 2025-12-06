import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [Project], { name: 'projects', description: 'Get all projects' })
  findAll(): Promise<Project[]> {
    return this.projectsService.findAll();
  }

  @Query(() => Project, {
    name: 'project',
    nullable: true,
    description: 'Get a project by ID',
  })
  findOne(
    @Args('id', { type: () => String }) id: string
  ): Promise<Project | null> {
    return this.projectsService.findOne(id);
  }

  @Mutation(() => Project, {
    name: 'createProject',
    description: 'Create a new project',
  })
  create(
    @Args('input') createProjectInput: CreateProjectInput
  ): Promise<Project> {
    return this.projectsService.create(createProjectInput);
  }

  @Mutation(() => Project, {
    name: 'deleteProject',
    description: 'Delete a project by ID',
  })
  delete(@Args('id', { type: () => String }) id: string): Promise<Project> {
    return this.projectsService.delete(id);
  }
}
