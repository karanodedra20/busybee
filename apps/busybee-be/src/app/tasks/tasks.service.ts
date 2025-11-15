import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(createTaskInput: CreateTaskInput) {
    return 'This action adds a new task';
  }

  findAll() {
    return this.prisma.task.findMany();
  }

  findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  update(id: number, updateTaskInput: UpdateTaskInput) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
