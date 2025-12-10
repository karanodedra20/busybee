import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { AuthGuard } from '../auth/auth.guard';

@Resolver(() => Task)
@UseGuards(AuthGuard)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => Task)
  createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
    @Context()
    context: { req: { user: { uid: string; email?: string; name?: string } } }
  ) {
    return this.tasksService.create(
      createTaskInput,
      context.req.user.uid,
      context.req.user.email,
      context.req.user.name
    );
  }

  @Query(() => [Task], { name: 'tasks' })
  findAll(@Context() context: { req: { user: { uid: string } } }) {
    return this.tasksService.findAll(context.req.user.uid);
  }

  @Query(() => Task, { name: 'task' })
  findOne(
    @Args('id', { type: () => String }) id: string,
    @Context() context: { req: { user: { uid: string } } }
  ) {
    return this.tasksService.findOne(id, context.req.user.uid);
  }

  @Query(() => [Task], { name: 'searchTasksByTitle' })
  searchTasksByTitle(
    @Args('title', { type: () => String }) title: string,
    @Context() context: { req: { user: { uid: string } } }
  ) {
    return this.tasksService.searchByTitle(title, context.req.user.uid);
  }

  @Mutation(() => Task)
  updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
    @Context() context: { req: { user: { uid: string } } }
  ) {
    return this.tasksService.update(
      updateTaskInput.id,
      updateTaskInput,
      context.req.user.uid
    );
  }

  @Mutation(() => Task)
  removeTask(
    @Args('id', { type: () => String }) id: string,
    @Context() context: { req: { user: { uid: string } } }
  ) {
    return this.tasksService.remove(id, context.req.user.uid);
  }
}
