import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Specialization } from './entities/specialization.entity';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { EM119, EM100 } from 'src/core/constants';

@Injectable()
export class SpecializationService {
  constructor(
    @InjectRepository(Specialization)
    private readonly specializationRepository: Repository<Specialization>,
  ) {}

  async create(
    createDto: CreateSpecializationDto,
  ): Promise<Specialization> {
    try {
      const { consultation_id, ...rest } = createDto;

      const specialization = this.specializationRepository.create({
        ...rest,
        consultation: {
          consultation_id: consultation_id,
        },
      });

      return await this.specializationRepository.save(specialization);
    } catch (error) {
      console.error(error); // Good for debugging
      throw new InternalServerErrorException(EM100);
    }
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
    consultationId?: string,
  ): Promise<{ data: Specialization[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = consultationId
      ? { consultation: { consultation_id: consultationId } }
      : {};

    if (search) {
      where.doctor_name = ILike(`%${search}%`);
    }

    const [data, total] = await this.specializationRepository.findAndCount(
      {
        where,
        skip,
        take: limit,
      },
    );

    return { data, total };
  }

  async findOne(specialization_id: number): Promise<Specialization> {
    const specialization = await this.specializationRepository.findOne({
      where: { specialization_id },
    });
    if (!specialization) {
      throw new NotFoundException(EM119);
    }
    return specialization;
  }

  async update(
    specialization_id: number,
    updateDto: UpdateSpecializationDto,
  ): Promise<Specialization> {
    const specialization = await this.findOne(specialization_id);
    
    this.specializationRepository.merge(specialization, updateDto);
    return this.specializationRepository.save(specialization);
  }

  async remove(specialization_id: number): Promise<void> {
    const specialization = await this.findOne(specialization_id);
    await this.specializationRepository.remove(specialization);
  }
}
