// src/modules/staff/staff.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Address } from '../addresses/entities/address.entity';
import { Branch } from '../branches/entities/branch.entity';
import { Role } from '../roles/entities/role.entity';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { Permission } from '../permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Address, Branch, Role, Permission ])],
  providers: [StaffService],
  controllers: [StaffController],
  exports: [StaffService],
})
export class StaffModule {}
