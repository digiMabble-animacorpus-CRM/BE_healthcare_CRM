import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Specialization } from './entities/specialization.entity';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';
import { EM119, EM100 } from 'src/core/constants';
import { Department } from '../Department/entities/department.entity';
import { Therapist } from '../therapist/entities/therapist.entity';
import { Patient } from '../customers/entities/patient.entity';

@Injectable()
export class SpecializationService {
  constructor(
    @InjectRepository(Specialization)
    private readonly specializationRepository: Repository<Specialization>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Therapist)
    private readonly therapistRepository: Repository<Therapist>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(
    createDto: CreateSpecializationDto,
  ): Promise<Specialization> {
    try {
      const { consultation_id, department_id, doctor_id, patient_id, ...rest } = createDto;

      const department = await this.departmentRepository.findOne({where: {id: department_id}});
      if (!department) {
        throw new BadRequestException(`Department with ID ${department_id} not found`);
      }

      const doctor = await this.therapistRepository.findOne({where: {_key: doctor_id}});
      if (!doctor) {
        throw new BadRequestException(`Doctor with ID ${doctor_id} not found`);
      }

      const patient = await this.patientRepository.findOne({where: {id: patient_id}});
      if (!patient) {
        throw new BadRequestException(`Patient with ID ${patient_id} not found`);
      }

      const specialization = this.specializationRepository.create({
        ...rest,
        consultation: {
          consultation_id: consultation_id,
        },
        department,
        doctor,
        patient,
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
      where.doctor = { firstName: ILike(`%${search}%`) };
    }

    const [data, total] = await this.specializationRepository.findAndCount(
      {
        where,
        skip,
        take: limit,
        relations: ['department', 'doctor', 'patient'],
      },
    );

    return { data, total };
  }

  async findOne(specialization_id: number): Promise<Specialization> {
    const specialization = await this.specializationRepository.findOne({
      where: { specialization_id },
      relations: ['department', 'doctor', 'patient'],
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
