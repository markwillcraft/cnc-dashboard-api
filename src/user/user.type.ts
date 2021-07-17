import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';

// types
export type UserDeveloperCreate = {
    email: string;
    firstName: string;
    familyName: string;
};

// graphql types
@ObjectType('User')
export class UserType {
  @Field(() => ID)
  _id: string;

  @Field()
  email: string;

  @Field()
  type: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType('UserDeveloper')
export class UserDeveloperType {
  @Field(() => ID)
  _id: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  type: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class UserDeveloperCreateInput {
  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  familyName: string;
}
