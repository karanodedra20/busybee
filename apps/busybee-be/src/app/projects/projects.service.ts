import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async create(createProjectInput: CreateProjectInput): Promise<Project> {
    return this.prisma.project.create({
      data: {
        name: createProjectInput.name,
        color: createProjectInput.color,
        icon: createProjectInput.icon,
      },
    });
  }

  async delete(id: string): Promise<Project> {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
