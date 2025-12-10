import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Priority } from '@prisma/client';

// Register the Prisma Priority enum with GraphQL
registerEnumType(Priority, {
  name: 'Priority',
  description: 'Task priority level',
});

@ObjectType()
export class Task {
  @Field(() => String, { description: 'Unique task identifier' })
  id!: string;

  @Field(() => String, { description: 'Task title' })
  title!: string;

  @Field(() => String, { nullable: true, description: 'Task description' })
  description?: string;

  @Field(() => Priority, { description: 'Task priority level' })
  priority!: Priority;

  @Field(() => Date, { nullable: true, description: 'Task due date' })
  dueDate?: Date;

  @Field(() => [String], { description: 'Task tags' })
  tags!: string[];

  @Field(() => Boolean, { description: 'Task completion status' })
  completed!: boolean;

  @Field(() => String, { description: 'Associated project ID' })
  projectId!: string;

  @Field(() => String, { description: 'User ID who owns this task' })
  userId!: string;

  @Field(() => Date, { description: 'Task creation timestamp' })
  createdAt!: Date;

  @Field(() => Date, { description: 'Task last update timestamp' })
  updatedAt!: Date;
}
