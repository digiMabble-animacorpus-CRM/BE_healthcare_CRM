// // src/modules/agents/agents.service.ts

// import { ConflictException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, Like } from 'typeorm';
// import User from '../users/entities/user.entity';
// import { logger } from 'src/core/utils/logger';
// import Property from '../properties/entities/property.entity';
// import { SocialLinks } from '../social-links/entities/social-links.entity';
// import { AuthService } from '../auth/auth.service';
// import { CreateAgentDto } from './dto/create-agent.dto';
// import { Errors } from 'src/core/constants/error_enums';
// import { AddressesService } from '../addresses/addresses.service';
// import { AgentQueryDto } from './dto/agent-query.dto';
// import { AgentResponseDto } from './dto/agent-response.dto';
// import { UpdateAgentDto } from './dto/update-agent.dto';

// @Injectable()
// export class AgentsService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//     @InjectRepository(SocialLinks)
//     private readonly socialLinksRepository: Repository<SocialLinks>,
//     @InjectRepository(Property)
//     private readonly propertyRepository: Repository<Property>,
//     private readonly addressesService: AddressesService,
//     @Inject(forwardRef(() => AuthService))
//     private readonly authService: AuthService,
//   ) { }

//   async createAgent(dto: CreateAgentDto) {
//     const { name, email_id, password, mobile_no, profile_url, social_links, address: addressDto } = dto;
//     logger.info(`Agent_Create_Entry: Email=${email_id}`);

//     const existingUser = await this.userRepository.findOne({ where: { email_id } });
//     if (existingUser) {
//       logger.warn(`Agent_Create_Failure: Email=${email_id} | Reason=EmailAlreadyExists`);
//       throw new ConflictException(Errors.EMAIL_ID_ALREADY_EXISTS);
//     }

//     try {
//       const savedAddress = await this.addressesService.create(addressDto);
//       const newUser = this.userRepository.create({
//         name,
//         email_id,
//         password,
//         mobile_no,
//         profile_url,
//         user_type: 'agent',
//         address: savedAddress,
//       });
//       const savedUser = await this.userRepository.save(newUser);

//       if (social_links) {
//         const savedSocialLinks = await this.socialLinksRepository.save(
//           this.socialLinksRepository.create({ ...social_links, user: savedUser }),
//         );
//         savedUser.social_links = savedSocialLinks;
//         await this.userRepository.save(savedUser);
//       }

//       const payload = { user_id: savedUser.id, user_type: savedUser.user_type, email: savedUser.email_id };
//       const access_token = await this.authService.generateToken(payload);
//       const refresh_token = await this.authService.generateToken(payload, true);

//       const { password: _, ...userResponse } = savedUser;
//       logger.info(`Agent_Create_Success: Email=${email_id} | UserId=${savedUser.id}`);

//       return { ...userResponse, access_token, refresh_token };
//     } catch (error) {
//       logger.error(`Agent_Create_Error: Email=${email_id} | Error=${error.message}`);
//       throw error;
//     }
//   }

//   async getAllAgents(queryDto: AgentQueryDto) {
//     logger.info(`Agents_GetAll_Entry: ${JSON.stringify(queryDto)}`);
//     const { search, page, limit, sort_by, order } = queryDto;
//     const skip = (page - 1) * limit;
//     const baseWhere = { user_type: 'agent', is_deleted: false };

//     let agents: User[];
//     let total: number;

//     if (search) {
//       const qb = this.userRepository.createQueryBuilder('user')
//         .leftJoinAndSelect('user.address', 'address')
//         .leftJoinAndSelect('user.social_links', 'social_links')
//         .where('user.user_type = :userType', { userType: 'agent' })
//         .andWhere('user.is_deleted = false')
//         .andWhere('(user.name ILIKE :search OR user.email_id ILIKE :search OR address.city ILIKE :search)', { search: `%${search}%` })
//         .orderBy(`user.${sort_by}`, order.toUpperCase() as 'ASC' | 'DESC')
//         .skip(skip)
//         .take(limit);

//       agents = await qb.getMany();
//       total = await qb.getCount();
//     } else {
//       agents = await this.userRepository.find({
//         where: baseWhere,
//         relations: ['address', 'social_links'],
//         skip,
//         take: limit,
//         order: { [sort_by]: order.toUpperCase() as 'ASC' | 'DESC' },
//       });
//       total = await this.userRepository.count({ where: baseWhere });
//     }

//     const counts = await this.getPropertyCountsForAgents(agents.map(a => a.id));

//     const data: AgentResponseDto[] = agents.map(agent => {
//       const { id, name, email_id, mobile_no, created_at, address, social_links } = agent;
//       return {
//         id,
//         name,
//         email_id,
//         mobile_no,
//         properties_count: counts[id] || 0,
//         city: address?.city ?? '',
//         country: address?.country ?? '',
//         social_links: {
//           facebook: social_links?.facebook ?? null,
//           instagram: social_links?.instagram ?? null,
//           twitter: social_links?.twitter ?? null,
//         },
//         created_at,
//       };
//     });

//     const totalPages = Math.ceil(total / limit);
//     logger.info(`Agents_GetAll_Exit: Found ${total} agents`);
//     return { data, total, page, limit, totalPages };
//   }

//   async getAgentById(id: number) {
//     logger.info(`Agents_GetById_Entry: id=${id}`);
//     const agent = await this.userRepository.findOne({
//       where: { id, user_type: 'agent', is_deleted: false },
//       relations: ['address', 'social_links'],
//     });
//     if (!agent) throw new NotFoundException('Agent not found');

//     const counts = await this.getPropertyCountsForAgents([id]);
//     const { password: _, address, social_links, ...rest } = agent;
//     logger.info(`Agents_GetById_Exit: Agent found`);
//     return {
//       ...rest,
//       properties_count: counts[id] || 0,
//       city: address?.city ?? '',
//       country: address?.country ?? '',
//       social_links: {
//         facebook: social_links?.facebook ?? null,
//         instagram: social_links?.instagram ?? null,
//         twitter: social_links?.twitter ?? null,
//       },
//     };
//   }

//   async updateAgent(id: number, dto: UpdateAgentDto) {
//     logger.info(`Agents_Update_Entry: id=${id}, data=${JSON.stringify(dto)}`);
//     const agent = await this.userRepository.findOne({
//       where: { id, user_type: 'agent', is_deleted: false },
//       relations: ['address', 'social_links'],
//     });
//     if (!agent) throw new NotFoundException('Agent not found');

//     Object.assign(agent, dto);
//     if (dto.social_links) agent.social_links = await this.socialLinksRepository.save({ user: agent, ...dto.social_links });

//     await this.userRepository.save(agent);
//     logger.info(`Agents_Update_Exit: Agent updated successfully`);
//     return this.getAgentById(id);
//   }

//   async removeAgent(id: number) {
//     logger.info(`Agents_Remove_Entry: id=${id}`);
//     const agent = await this.userRepository.findOne({ where: { id, user_type: 'agent', is_deleted: false } });
//     if (!agent) throw new NotFoundException('Agent not found');

//     await this.userRepository.save({ ...agent, is_deleted: true, is_active: false });
//     logger.info(`Agents_Remove_Exit: Agent with id=${id} soft-deleted`);
//   }

//   private async getPropertyCountsForAgents(agentIds: number[]) {
//     if (!agentIds.length) return {};
//     return Object.fromEntries(agentIds.map(id => [id, 0]));
//   }
// }
