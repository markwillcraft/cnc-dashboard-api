import { ContextType, UseGuards } from '@nestjs/common';
import {
  PaginationInput
} from '../common.type';
import {
  Args,
  Context,
  Query,
  Mutation,
  Parent,
  Resolver,
  ResolveField,
} from '@nestjs/graphql';
import { get, isEmpty } from 'lodash';
// User
import { UserAuthGuard } from 'src/user.guard';
import { User } from 'src/user/user.entity';
// Developer
import { DeveloperService } from './developer.service';
import { DeveloperType } from './developer.type';

@Resolver(() => DeveloperType)
export class DeveloperResolver {
  constructor(
    private developerService: DeveloperService,
  ) {}

  // Queries
  @Query(() => DeveloperType, { nullable: null })
  @UseGuards(UserAuthGuard)
  async developer(@Context() ctx: ContextType) {
    const client: User = get(ctx, 'user', {});

    return this.developerService.getByUserId(client._id.toString());
  }

  @Query(() => [DeveloperType], { nullable: 'itemsAndList' })
  @UseGuards(UserAuthGuard)
  async developers(
    @Args('data', { nullable: true, defaultValue: {} }) data: PaginationInput,
  ) {
    return this.developerService.getPagination(data);
  }
}