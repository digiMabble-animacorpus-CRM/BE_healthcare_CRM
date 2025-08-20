// // src/modules/company-profile/company-profile.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { CompanyProfileController } from './company-profile.controller';
// import { CompanyProfileService } from './company-profile.service';
// import User from '../users/entities/user.entity';
// import { Address } from '../addresses/entities/address.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User, Address]),
//   ],
//   controllers: [CompanyProfileController],
//   providers: [CompanyProfileService],
//   exports: [CompanyProfileService],
// })
// export class CompanyProfileModule {}
