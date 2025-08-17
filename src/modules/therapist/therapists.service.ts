import { Injectable, NotFoundException, ConflictException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Therapist } from './entities/therapist.entity';
import { CreateTherapistDto } from './dto/create-therapist.dto';
import { UpdateTherapistDto } from './dto/update-therapist.dto';
import { Address } from '../addresses/entities/address.entity';
import { BaseService } from 'src/base.service';
import { logger } from 'src/core/utils/logger';
import { EC404, EC409, EC500, EM100, EM119 } from 'src/core/constants';
import { Errors } from 'src/core/constants/error_enums';
import { TherapistFilterDto } from './dto/therapist-filter.dto';

@Injectable()
export class TherapistsService extends BaseService<Therapist> {
  protected repository: Repository<Therapist>;

  constructor(
    @InjectRepository(Therapist)
    private readonly therapistRepository: Repository<Therapist>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {
    super(therapistRepository.manager);
    this.repository = therapistRepository;
  }

  async create(dto: CreateTherapistDto): Promise<Therapist> {
    try {
      logger.info(`Therapist_Create_Entry: ${JSON.stringify(dto)}`);

      const existing = await this.therapistRepository.findOne({
        where: { email: dto.email },
      });

      if (existing) {
        logger.error(`Therapist_Create_Error: Email already exists - ${dto.email}`);
        throw new ConflictException(Errors.EMAIL_ID_ALREADY_EXISTS);
      }

      const address = this.addressRepository.create(dto.address);
      const savedAddress = await this.addressRepository.save(address);

      const therapist = this.therapistRepository.create({
        ...dto,
        status: dto.status ?? 'active',
        address: savedAddress,
      });

      const savedTherapist = await this.therapistRepository.save(therapist);

      const result = await this.therapistRepository.findOne({
        where: { id: savedTherapist.id },
        relations: ['address'],
      });

      logger.info(`Therapist_Create_Exit: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      logger.error(`Therapist_Create_Error: ${JSON.stringify(error?.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }

  async findAll(options?: FindManyOptions<Therapist>): Promise<Therapist[]> {
    try {
      logger.info('Therapist_FindAll_Entry');
      const therapists = await this.therapistRepository.find({
        where: {
          ...(options?.where || {}),
          is_deleted: false,
        },
        relations: ['address'],
        order: { created_at: 'DESC' },
        ...options,
      });
      logger.info(`Therapist_FindAll_Exit: Found ${therapists.length} therapists`);
      return therapists;
    } catch (error) {
      logger.error(`Therapist_FindAll_Error: ${JSON.stringify(error?.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }

  async searchWithFilters(dto: TherapistFilterDto): Promise<{ data: Therapist[]; total: number }> {
    const { page = '1', limit = '10', searchText, branch, fromDate, toDate } = dto;

    try {
      const query = this.therapistRepository
        .createQueryBuilder('therapist')
        .leftJoinAndSelect('therapist.address', 'address')
        .where('therapist.is_deleted = :isDeleted', { isDeleted: false });

      if (searchText) {
        query.andWhere(
          `(therapist.name ILIKE :search OR therapist.email ILIKE :search OR therapist.number ILIKE :search)`,
          { search: `%${searchText}%` },
        );
      }

      if (branch) {
        query.andWhere('therapist.branch = :branch', { branch });
      }

      if (fromDate && toDate) {
        query.andWhere('DATE(therapist.created_at) BETWEEN :fromDate AND :toDate', {
          fromDate,
          toDate,
        });
      }

      const [data, total] = await query
        .orderBy('therapist.created_at', 'DESC')
        .skip((+page - 1) * +limit)
        .take(+limit)
        .getManyAndCount();

      return { data, total };
    } catch (error) {
      logger.error(`Therapist_Pagination_Error: ${JSON.stringify(error?.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }

  async findOne(id: number): Promise<Therapist> {
    try {
      logger.info(`Therapist_FindOne_Entry: id=${id}`);
      const therapist = await this.therapistRepository.findOne({
        where: {
          id,
          is_deleted: false, // ✅ Only fetch if not deleted
        },
        relations: ['address'],
      });

      if (!therapist) {
        logger.error(`Therapist_FindOne_Error: No record found for ID ${id}`);
        throw new NotFoundException(Errors.NO_RECORD_FOUND);
      }

      logger.info(`Therapist_FindOne_Exit: ${JSON.stringify(therapist)}`);
      return therapist;
    } catch (error) {
      logger.error(`Therapist_FindOne_Error: ${JSON.stringify(error?.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }

  async updateTherapist(id: number, dto: UpdateTherapistDto): Promise<Therapist> {
    try {
      logger.info(`Therapist_Update_Entry: id=${id}, data=${JSON.stringify(dto)}`);

      // Load therapist with address
      const therapist = await this.therapistRepository.findOne({
        where: { id },
        relations: ['address'],
      });

      if (!therapist) throw new NotFoundException('Therapist not found');

      // Update therapist fields (excluding address)
      Object.assign(therapist, { ...dto, address: therapist.address });

      // Update nested address if present
      if (dto.address) {
        Object.assign(therapist.address, dto.address);
      }

      // Save full entity with nested update
      const updated = await this.therapistRepository.save(therapist);

      logger.info(`Therapist_Update_Exit: ${JSON.stringify(updated)}`);
      return updated;
    } catch (error) {
      logger.error(`Therapist_Update_Error: ${JSON.stringify(error?.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }

  async removeTherapist(id: number): Promise<void> {
    try {
      logger.info(`Therapist_Remove_Entry: id=${id}`);
      const therapist = await this.findOne(id);

      await this.therapistRepository.update(id, {
        is_deleted: true,
        is_active: false,
      });

      logger.info('Therapist_Remove_Exit: Successfully soft deleted');
    } catch (error) {
      logger.error(`Therapist_Remove_Error: ${JSON.stringify(error?.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }
}
