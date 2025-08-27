import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

 async create(createDto: CreateFunctionDescriptionDto): Promise<FunctionDescription> {
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
          therapistId: In(therapist_ids),
        });
        functionDescription.therapists = therapists;
      }

      return await this.functionDescriptionRepository.save(functionDescription);
    } catch (error) {
      console.error(error); // Good for debugging
      throw new InternalServerErrorException(EM100);
    }
  }

  async findAll(consultationId?: string): Promise<FunctionDescription[]> {
    if (consultationId) {
      return this.functionDescriptionRepository.find({
        where: {
          consultation: {
            consultation_id: consultationId,
          },
        },
        relations: ['therapists'],
      });
    }
    return this.functionDescriptionRepository.find({ relations: ['therapists'] });
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
        therapistId: In(therapist_ids),
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
