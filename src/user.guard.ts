import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { verify } from 'jsonwebtoken';
import { get, isEmpty } from 'lodash';
import {
  CLIENT_SECRET,
  HTTP_GQL,
  HTTP_REST,
} from './constants';
import { User } from './user/user.entity';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const ctx = context.getArgByIndex(2);
    const user: User = get(ctx, 'user', null);

    return isEmpty(user) ? false : user.type !== 'admin' ? false : true;
  }
}

@Injectable()
export class UserAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    if (context.getType<GqlContextType>() === HTTP_GQL) {
      const ctx = context.getArgByIndex(2);
      const user: User = get(ctx, 'user', null);
      return isEmpty(user) ? false : true;
    }

    if (context.getType() === HTTP_REST) {
      const req = context.switchToHttp().getRequest();

      const authorization: string | null = get(
        req,
        'headers.authorization',
        '',
      );

      if (!authorization) {
        return false;
      }

      const authArr = authorization.split(' ');
      const token = authArr[1];

      if (!token) {
        return false;
      }

      const user = verify(token, CLIENT_SECRET);

      if (isEmpty(user)) {
        return false;
      }

      req['user'] = user;
      req['user'] = { ...req.user.user };

      return true;
    }
  }
}