import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  start() {
    return 'Moon Aligner System GraphQL API';
  }
}
