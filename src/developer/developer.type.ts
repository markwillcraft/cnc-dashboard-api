import { Field, ID, ObjectType } from '@nestjs/graphql';

// types

// graphql types
@ObjectType('Developer')
export class DeveloperType {
  @Field(() => ID)
  _id: string;

  @Field()
  userId: string;

  @Field()
  familyName: string;

  @Field()
  firstName: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}