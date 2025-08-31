import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, Repository } from 'typeorm';
import { Specialization } from './entities/specialization.entity';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { EM119, EM100 } from 'src/core/constants';
import { Department } from '../Department/entities/department.entity';

@Injectable()
export class SpecializationService {
  constructor(
    @InjectRepository(Specialization)
    private readonly specializationRepository: Repository<Specialization>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(
    createDto: CreateSpecializationDto,
  ): Promise<Specialization> {
    try {
      const { department_id, ...rest } = createDto;

      const department = await this.departmentRepository.findOne({
        where: { id: department_id },
      });
      if (!department) {
        throw new BadRequestException(
          `Department with ID ${department_id} not found`,
        );
      }

      const specialization = this.specializationRepository.create({
        ...rest,
        department,
      });

      return await this.specializationRepository.save(specialization);
    } catch (error) {
      console.error(error); // Good for debugging
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(EM100);
    }
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
    departmentId?: string,
  ): Promise<{ data: Specialization[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = this.specializationRepository.createQueryBuilder('specialization')
      .leftJoinAndSelect('specialization.department', 'department');

    if (search) {
      query.andWhere(new Brackets(qb => {
        qb.where('specialization.specialization_type::text ILIKE :search', { search: `%${search}%` })
          .orWhere('specialization.description ILIKE :search', { search: `%${search}%` })
          .orWhere('department.name ILIKE :search', { search: `%${search}%` });
      }));
    }

    if (departmentId) {
      query.andWhere('department.id = :departmentId', { departmentId });
    }

    const [data, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(specialization_id: number): Promise<Specialization> {
    const specialization = await this.specializationRepository.findOne({
      where: { specialization_id },
      relations: ['department'],
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
    const { department_id, ...rest } = updateDto;

    if (department_id && department_id !== specialization.department.id) {
        const department = await this.departmentRepository.findOne({where: {id: department_id}});
        if (!department) {
            throw new BadRequestException(`Department with ID ${department_id} not found`);
        }
        specialization.department = department;
    }

    this.specializationRepository.merge(specialization, rest);
    return this.specializationRepository.save(specialization);
  }

  async remove(specialization_id: number): Promise<void> {
    const specialization = await this.findOne(specialization_id);
    await this.specializationRepository.remove(specialization);
  }
}
