import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Project {
  @Field(() => ID, { description: 'Unique identifier' })
  id!: string;

  @Field(() => String, { description: 'Project name' })
  name!: string;

  @Field(() => String, {
    description: 'Project color (hex code or color name)',
  })
  color!: string;

  @Field(() => String, { nullable: true, description: 'Project icon' })
  icon?: string | null;

  @Field(() => String, { description: 'User ID who owns this project' })
  userId!: string;

  @Field(() => Date, { description: 'Creation date' })
  createdAt!: Date;

  @Field(() => Date, { description: 'Last update date' })
  updatedAt!: Date;
}
