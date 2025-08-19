// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { StaffRole } from './entities/staff-role.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class StaffRoleService {
//   constructor(
//     @InjectRepository(StaffRole)
//     private readonly staffRoleRepo: Repository<StaffRole>,
//   ) {}

//   async findByTag(tag: string): Promise<StaffRole[]> {
//     return this.staffRoleRepo.find({
//       where: { tag, is_active: true },
//     });
//   }
// }
