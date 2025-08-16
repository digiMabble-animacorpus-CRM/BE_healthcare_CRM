import { Module } from '@nestjs/common';

import { UsersService } from './users.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Token } from './entities/token.entity';
import { Address } from '../addresses/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token, Address])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
