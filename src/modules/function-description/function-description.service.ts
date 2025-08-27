import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, ILike, Repository } from 'typeorm';
import { FunctionDescription } from './entities/function-description.entity';
import { CreateFunctionDescriptionDto } from './dto/create-function-description.dto';
import { UpdateFunctionDescriptionDto } from './dto/update-function-description.dto';
import { Therapist } from 'src/modules/therapist/entities/therapist.entity';
import { EM119, EM100 } from 'src/core/constants';

@Injectable()
export class FunctionDescriptionService {
  constructor(
    @InjectRepository(FunctionDescription)
    private readonly functionDescriptionRepository: Repository<FunctionDescription>,
    @InjectRepository(Therapist)
    private readonly therapistRepository: Repository<Therapist>,
  ) {}

  async create(
    createDto: CreateFunctionDescriptionDto,
  ): Promise<FunctionDescription> {
    try {
      const { consultation_id, therapist_ids, ...rest } = createDto;

      const functionDescription = this.functionDescriptionRepository.create({
        ...rest,
        consultation: {
          consultation_id: consultation_id,
        },
      });

      if (therapist_ids && therapist_ids.length > 0) {
        const therapists = await this.therapistRepository.findBy({
          _key: In(therapist_ids),
        });
        functionDescription.therapists = therapists;
      }

      return await this.functionDescriptionRepository.save(functionDescription);
    } catch (error) {
      console.error(error); // Good for debugging
      throw new InternalServerErrorException(EM100);
    }
  }

  async findAll(
    page: number,
    limit?: number,
    search?: string,
    consultationId?: string,
  ): Promise<{ data: FunctionDescription[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = consultationId
      ? { consultation: { consultation_id: consultationId } }
      : {};

    if (search) {
      where.fonction = ILike(`%${search}%`);
    }

    const [data, total] = await this.functionDescriptionRepository.findAndCount(
      {
        where,
        skip,
        take: limit,
        relations: ['therapists'],
      },
    );

    return { data, total };
  }

  async findOne(function_id: string): Promise<FunctionDescription> {
    const service = await this.functionDescriptionRepository.findOne({
      where: { function_id },
      relations: ['therapists'],
    });
    if (!service) {
      throw new NotFoundException(EM119);
    }
    return service;
  }

  async update(
    function_id: string,
    updateDto: UpdateFunctionDescriptionDto,
  ): Promise<FunctionDescription> {
    const service = await this.findOne(function_id);
    const { therapist_ids, ...rest } = updateDto;

    if (therapist_ids) {
      const therapists = await this.therapistRepository.findBy({
        _key: In(therapist_ids),
      });
      service.therapists = therapists;
    }

    this.functionDescriptionRepository.merge(service, rest);
    return this.functionDescriptionRepository.save(service);
  }

  async remove(function_id: string): Promise<void> {
    const service = await this.findOne(function_id);
    await this.functionDescriptionRepository.remove(service);
  }
}
