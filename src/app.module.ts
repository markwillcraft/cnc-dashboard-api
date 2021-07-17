import { join } from 'path';
import { Module } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { CLIENT_SECRET } from './constants';
import { get, isEmpty } from 'lodash';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { DeveloperModule } from './developer/developer.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { Developer } from './developer/developer.entity';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { DeveloperService } from './developer/developer.service';
import { UserResolver } from './user/user.resolver';
import { DeveloperResolver } from './developer/developer.resolver';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URL,
      synchronize: true,
      useUnifiedTopology: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      introspection: true,
      installSubscriptionHandlers: true,
      // subscriptions: {
      //   onConnect: (connectionParams) => {
      //     return connectionParams;
      //   },
      // },
      context: async ({
        req,
        connection,
      }: {
        req: Request;
        connection: Connection;
      }) => {
        const authorization: string | null =
          get(req, 'headers.authorization', '') ||
          get(connection, 'context.authorization', '');

        if (!authorization) {
          return null;
        }

        const authArr = authorization.split(' ');
        const token = authArr[1];

        if (!token) {
          return null;
        }

        const user = verify(token, CLIENT_SECRET);

        if (isEmpty(user)) {
          return null;
        }

        return typeof user === 'object' ? { ...user } : { user };
      },
    }),
    TypeOrmModule.forFeature([User, Developer]),
    UserModule,
    DeveloperModule,
    ],
    providers: [
      AppService, 
      AppResolver, 
      UserService, 
      UserResolver,
      DeveloperService,
      DeveloperResolver
    ],
})
export class AppModule {}
