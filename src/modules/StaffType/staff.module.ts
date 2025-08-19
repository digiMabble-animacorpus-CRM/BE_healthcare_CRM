// // src/modules/staff/staff.module.ts

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Staff } from './entities/staff.entity';
// import { Address } from '../addresses/entities/address.entity';
// import { Branch } from '../branches/entities/branch.entity';
// import { Role } from '../roles/entities/role.entity';
// import { StaffService } from './staff.service';
// import { StaffController } from './staff.controller';
// import { Permission } from '../permissions/entities/permission.entity';
// import  { Token }  from 'src/modules/users/entities/token.entity'; // Adjust the import path as necessary
// import { MailUtils } from 'src/core/utils/mailUtils';
// import { UsersModule } from '../users/users.module';
// import User from '../users/entities/user.entity'; // Import User entity if needed
// @Module({
//   imports: [TypeOrmModule.forFeature([Staff, Address, Branch, Role, Permission, Token, User])
// , UsersModule], // Import UsersModule if you need to access User entity
//   providers: [StaffService , MailUtils],
//   controllers: [StaffController],
//   exports: [StaffService],
// })
// export class StaffModule {}
