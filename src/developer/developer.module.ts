import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeveloperService } from './developer.service';
import { DeveloperResolver } from './developer.resolver';
import { Developer } from './developer.entity';
import { UserResolver } from 'src/user/user.resolver';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Developer, User])],
  providers: [
    DeveloperResolver, 
    DeveloperService,
    UserResolver,
    UserService
  ]
})
export class DeveloperModule {}
