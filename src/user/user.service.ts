import { Injectable } from '@nestjs/common';
import bcrypt = require('bcryptjs');
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common.service';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from './user.entity';
import { Pagination } from '../common.type';
import { escapeRegExp, omit, isEmpty } from 'lodash'
import jwt = require('jsonwebtoken');
import { ADMIN_EMAIL, ADMIN_PASSWORD, CLIENT_SECRET, DEVELOPER } from 'src/constants';
import {
    UserDeveloperType,
    UserDeveloperCreate,
} from './user.type';
import { Developer } from 'src/developer/developer.entity';

@Injectable()
export class UserService extends CommonService {
    constructor(
        @InjectRepository(User) private UserRepo: Repository<User>,
        @InjectRepository(Developer) private DeveloperRepo: Repository<Developer>,
    ) {
        super({ context: 'User' });
    }
    async getByUserId(userId: string): Promise<User | null> {
        return this.UserRepo.findOne(userId);
    }
    
    async getPagination(args: Pagination): Promise<User[]> {
        const {
            page = 1,
            count = 10,
            sortDirection = 'ASC',
            sortBy = 'updatedAt',
            q = '',
        } = args;

        const conditions: FindManyOptions<User> = {
            skip: page > 0 ? (page - 1) * count : 0,
            take: count,
            order: { [sortBy || 'updatedAt']: sortDirection || 'DESC' },
            where: {},
        };

        if (q) {
            const escaped = escapeRegExp(q);
            conditions.where['$or'] = [
            { email: { $regex: escaped, $options: 'i' } },
            { type: { $regex: escaped, $options: 'i' } },
            ];
        }

        return this.UserRepo.find(conditions);
    }

    async createAdmin(): Promise<string> {
      const salt = await bcrypt.genSalt(3);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
  
      const newAdminUser = this.UserRepo.create({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        type: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      const adminCreated = await newAdminUser.save();
      const cleanAdmin = omit(adminCreated, ['password']);
      const token = jwt.sign({ user: cleanAdmin }, CLIENT_SECRET);
  
      return token;
    }

    async createUserAsDeveloper(args: UserDeveloperCreate): Promise<UserDeveloperType> {
      const { email, firstName, familyName } = args;
      const userFound = await this.UserRepo.findOne({ where: { email } });
  
      if (!isEmpty(userFound)) {
        this.throwStringError('Email already exist');
      }
  
      const generatedPassword = this.makeId(10);
  
      const salt = await bcrypt.genSalt(3);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);
  
      const newUser = this.UserRepo.create({
        email,
        password: hashedPassword,
        type: DEVELOPER,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      const newUserCreated = await newUser.save();
      newUserCreated.password = generatedPassword;
  
      const newDeveloper = this.DeveloperRepo.create({
        firstName,
        familyName,
        userId: newUserCreated._id.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      await newDeveloper.save();
  
      return newUserCreated;
    }

    async getAdminUser(): Promise<User> {
      return this.UserRepo.findOne({ email: ADMIN_EMAIL });
    }

    async signin(email: string, password: string): Promise<string> {
      const userFound = await this.UserRepo.findOne({ where: { email } });
  
      if (isEmpty(userFound)) {
        this.throwStringError('User not found');
      }
  
      const isMatch = await bcrypt.compare(password, userFound.password);
  
      if (!isMatch) {
        this.throwStringError('Incorrect password');
      }
  
      const cleanUser = omit(userFound, ['password']);
      const token = jwt.sign({ user: cleanUser }, CLIENT_SECRET);
  
      return token;
    }

}
