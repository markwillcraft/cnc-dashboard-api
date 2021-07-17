import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { DeveloperService } from 'src/developer/developer.service';
import { DeveloperResolver } from 'src/developer/developer.resolver';
import { Developer } from 'src/developer/developer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Developer])],
  providers: [
    UserService,
    UserResolver,
    DeveloperService,
    DeveloperResolver
  ],
})
export class UserModule {}
