// import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Staff } from './entities/staff.entity';
// import { CreateStaffDto } from './dto/create-staff.dto';
// import { UpdateStaffDto } from './dto/update-staff.dto';

// @Injectable()
// export class StaffService {
//   constructor(
//     @InjectRepository(Staff)
//     private staffRepository: Repository<Staff>,
//   ) {}

//   // CREATE
// async create(dto: CreateStaffDto): Promise<Staff> {
//   console.log('DTO Received:', dto);   // check values coming from frontend
//   const staff = this.staffRepository.create(dto);
//   console.log('Entity Before Save:', staff);  // check if mapped correctly
//   return this.staffRepository.save(staff);
// }



//   // GET ALL
//   async findAll(): Promise<Staff[]> {
//     return this.staffRepository.find();
//   }

//   // GET BY ID
//   async findOne(key: number): Promise<Staff> {
//     const staff = await this.staffRepository.findOneBy({ _key: key });
//     if (!staff) throw new NotFoundException(`Staff with key ${key} not found`);
//     return staff;
//   }

//   // PATCH / UPDATE
//   async update(key: number, dto: UpdateStaffDto): Promise<Staff> {
//     const staff = await this.findOne(key);
//     Object.assign(staff, dto);
//     return this.staffRepository.save(staff);
//   }

//   // DELETE
//   async remove(key: number): Promise<{ deleted: boolean }> {
//     const staff = await this.findOne(key);
//     await this.staffRepository.remove(staff);
//     return { deleted: true };
//   }
//   // DELETE ALL
//   async removeAll(): Promise<{ deleted: boolean }> {
//     await this.staffRepository.clear();
//     return { deleted: true };
//   }



//    async findOneByEmail(email: string): Promise<Staff> {
//   const staff = await this.staffRepository.findOne({
//     // where: { email },
//     // relations: ['selected_branch'], // include relations if needed
//   });

//   if (!staff) throw new NotFoundException(`Staff with email ${email} not found`);
//   return staff;
// }
// }
