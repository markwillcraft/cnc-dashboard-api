import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { escapeRegExp, isEmpty } from 'lodash';
import { CommonService } from 'src/common.service';
import { Pagination } from '../common.type';
import { FindManyOptions, Repository } from 'typeorm';
import { Developer } from './developer.entity';

const mongoose = require('mongoose');

@Injectable()
export class DeveloperService extends CommonService {
  constructor(
    @InjectRepository(Developer) private DeveloperRepo: Repository<Developer>,
  ) {
    super({ context: 'Developer' });
  }

  async getByDeveloperId(developerId: string): Promise<Developer | null> {
    return this.DeveloperRepo.findOne(developerId);
  }

  async getByUserId(userId: string): Promise<Developer> {
    return this.DeveloperRepo.findOne({ userId });
  }

  async getPagination(args: Pagination): Promise<Developer[]> {
    const {
      page = 1,
      count = 10,
      sortDirection = 'ASC',
      sortBy = 'updatedAt',
      q = '',
    } = args;

    const conditions: FindManyOptions<Developer> = {
      skip: page > 0 ? (page - 1) * count : 0,
      take: count,
      order: { [sortBy || 'updatedAt']: sortDirection || 'DESC' },
      where: {},
    };

    if (q) {
      const escaped = escapeRegExp(q);
      conditions.where['$or'] = [
        { firstName: { $regex: escaped, $options: 'i' } },
        { familyName: { $regex: escaped, $options: 'i' } },
      ];
    }

    return this.DeveloperRepo.find(conditions);
  }

}