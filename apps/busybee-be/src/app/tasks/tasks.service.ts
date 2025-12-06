import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '../../generated/prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(createTaskInput: CreateTaskInput) {
    return this.prisma.task.create({
      data: createTaskInput,
    });
  }

  findAll() {
    return this.prisma.task.findMany({
      orderBy: [
        { completed: 'asc' },
        { dueDate: 'asc' },
        { priority: 'desc' },
      ],
    });
  }

  findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  async searchByTitle(title: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
    });
  }

  update(id: string, updateTaskInput: UpdateTaskInput) {
    const { id: _, ...data } = updateTaskInput;
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
