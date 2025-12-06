import { InputType, Field } from '@nestjs/graphql';
import { Priority } from '../../../generated/prisma/client';

@InputType()
export class CreateTaskInput {
  @Field(() => String, { description: 'Task title' })
  title!: string;

  @Field(() => String, { nullable: true, description: 'Task description' })
  description?: string;

  @Field(() => Priority, { defaultValue: Priority.LOW, description: 'Task priority level' })
  priority!: Priority;

  @Field(() => Date, { nullable: true, description: 'Task due date' })
  dueDate?: Date;

  @Field(() => [String], { defaultValue: [], description: 'Task tags' })
  tags!: string[];

  @Field(() => String, { description: 'Associated project ID' })
  projectId!: string;
}
