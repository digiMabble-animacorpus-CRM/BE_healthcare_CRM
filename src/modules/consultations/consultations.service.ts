import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Consultation } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';

import { EM119, EM100 } from 'src/core/constants';
import { UpdateConsultationDto } from './dto/update-function-description.dto';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
  ) {}

  async create(
    createConsultationDto: CreateConsultationDto,
  ): Promise<Consultation> {
    try {
      const { branch_id, ...restOfDto } = createConsultationDto;

      const consultation = this.consultationRepository.create({
        ...restOfDto,
        branch: {
          branch_id: branch_id,
        },
      });

      return await this.consultationRepository.save(consultation);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(EM100);
    }
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
    branchId?: number,
  ): Promise<{ data: Consultation[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = branchId ? { branch: { branch_id: branchId } } : {};

    if (search) {
      where.our_consultations = ILike(`%${search}%`);
    }

    const [data, total] = await this.consultationRepository.findAndCount({
      where,
      skip,
      take: limit,
    });

    return { data, total };
  }

  async findOne(consultation_id: string): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOne({
      where: { consultation_id },
      relations: ['function_descriptions'], // Eagerly load related services
    });
    if (!consultation) {
      throw new NotFoundException(EM119);
    }
    return consultation;
  }

  async update(
    consultation_id: string,
    updateConsultationDto: UpdateConsultationDto,
  ): Promise<Consultation> {
    const consultation = await this.findOne(consultation_id);
    this.consultationRepository.merge(consultation, updateConsultationDto);
    return this.consultationRepository.save(consultation);
  }

  async remove(consultation_id: string): Promise<void> {
    const consultation = await this.findOne(consultation_id);
    await this.consultationRepository.remove(consultation);
  }
}
