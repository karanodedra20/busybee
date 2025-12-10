import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async create(
    createProjectInput: CreateProjectInput,
    userId: string,
    email?: string,
    name?: string
  ): Promise<Project> {
    // Ensure user exists in database
    await this.ensureUserExists(userId, email, name);

    return this.prisma.project.create({
      data: {
        name: createProjectInput.name,
        color: createProjectInput.color,
        icon: createProjectInput.icon,
        userId,
      },
    });
  }

  async delete(id: string, userId: string): Promise<Project> {
    // Verify project exists and user owns it
    await this.findOne(id, userId);

    return this.prisma.project.delete({
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
