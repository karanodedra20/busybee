import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [TasksResolver, TasksService],
  imports: [PrismaModule],
})
export class TasksModule {}
