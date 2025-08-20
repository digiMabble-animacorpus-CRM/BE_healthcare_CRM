// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import User from '../users/entities/user.entity';
// import { Address } from '../addresses/entities/address.entity';
// import { UpdateCompanyProfileDto } from './dto/company-profile.dto';

// @Injectable()
// export class CompanyProfileService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     @InjectRepository(Address)
//     private addressRepository: Repository<Address>,
//   ) { }

//   async getCompanyProfile(req: any): Promise<User> {
//     const userId = req.user.user_id;
//     const companyProfile = await this.userRepository.findOne({
//       where: { id: userId },
//       relations: ['address'],
//     });

//     if (!companyProfile) {
//       throw new NotFoundException(`Company profile for user ID ${userId} not found`);
//     }

//     return companyProfile;
//   }

//   async updateCompanyProfile(req: any, updateCompanyProfileDto: UpdateCompanyProfileDto): Promise<User> {
//     try {
//       const userId = req.user.user_id;
//       const companyProfile = await this.userRepository.findOne({
//         where: { id: userId },
//         relations: ['address'],
//       });

//       if (!companyProfile) {
//         throw new NotFoundException(`No user found for user ID ${userId}`);
//       }

//       const { address, ...userFields } = updateCompanyProfileDto;
//       Object.assign(companyProfile, userFields);

//       if (companyProfile.address) {
//         // Update existing address
//         Object.assign(companyProfile.address, address);
//         await this.addressRepository.save(companyProfile.address);
//       } else if (address) {
//         // Create new address if provided
//         const newAddress = this.addressRepository.create(address);
//         const savedAddress = await this.addressRepository.save(newAddress);
//         companyProfile.address = savedAddress;
//       }

//       return this.userRepository.save(companyProfile);
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new Error(`Failed to update company profile: ${error.message}`);
//     }
//   }
// }
