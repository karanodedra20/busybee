import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
  @Field(() => String, { description: 'Project name' })
  name!: string;

  @Field(() => String, { description: 'Project color (hex code or color name)' })
  color!: string;

  @Field(() => String, { nullable: true, description: 'Project icon identifier' })
  icon?: string;
}
