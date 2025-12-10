import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(
    createTaskInput: CreateTaskInput,
    userId: string,
    email?: string,
    name?: string
  ) {
    // Ensure user exists in database, create if not
    await this.ensureUserExists(userId, email, name);

    return this.prisma.task.create({
      data: {
        ...createTaskInput,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: [
        { completed: 'asc' },
        { dueDate: 'asc' },
        { priority: 'desc' },
      ],
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  async searchByTitle(title: string, userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        userId,
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
    });
  }

  async update(id: string, updateTaskInput: UpdateTaskInput, userId: string) {
    // Verify task exists and user owns it
    await this.findOne(id, userId);

    const { id: _, ...data } = updateTaskInput;
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    // Verify task exists and user owns it
    await this.findOne(id, userId);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  private async ensureUserExists(
    userId: string,
    email?: string,
    name?: string
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Create user record if it doesn't exist
      await this.prisma.user.create({
        data: {
          id: userId,
          email: email ?? 'unknown@example.com',
          name: name ?? null,
        },
      });
    } else {
      // Update email and name if they have changed
      const updates: { email?: string; name?: string | null } = {};
      if (email && user.email !== email) {
        updates.email = email;
      }
      if (name !== undefined && user.name !== name) {
        updates.name = name;
      }

      if (Object.keys(updates).length > 0) {
        await this.prisma.user.update({
          where: { id: userId },
          data: updates,
        });
      }
    }
  }
}
