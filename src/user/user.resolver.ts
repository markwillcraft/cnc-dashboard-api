import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PaginationInput } from '../common.type';
import { UserService } from './user.service';
import {
    UserDeveloperCreateInput,
    UserDeveloperType,
    UserType,
} from './user.type';
import { DeveloperService } from 'src/developer/developer.service';
import { DeveloperType } from 'src/developer/developer.type';
import { AdminAuthGuard, UserAuthGuard } from 'src/user.guard';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private userService: UserService,
    private developerService: DeveloperService,
  ) {}

  // Queries
  @Query(() => UserType)
  @UseGuards(UserAuthGuard)
  async user(@Args('userId') userId: string) {
    return this.userService.getByUserId(userId);
  }

  @Query(() => [UserType], { nullable: 'itemsAndList' })
  @UseGuards(UserAuthGuard)
  async users(
    @Args('data', { nullable: true, defaultValue: {} }) data: PaginationInput,
  ) {
    return this.userService.getPagination(data);
  }

  // Mutations
  @Mutation(() => String)
  async signin(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.userService.signin(email, password);
  }

  @Mutation(() => UserDeveloperType)
  @UseGuards(AdminAuthGuard)
  async createUserAsDeveloper(@Args('data') data: UserDeveloperCreateInput) {
    return this.userService.createUserAsDeveloper(data);
  }

  // Resolved Fields
}