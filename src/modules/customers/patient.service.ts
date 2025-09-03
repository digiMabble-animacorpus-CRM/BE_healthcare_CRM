import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { BaseService } from 'src/base.service';
import { logger } from 'src/core/utils/logger';
import { EC500, EM100 } from 'src/core/constants';
import { Errors } from 'src/core/constants/error_enums';

@Injectable()
export class PatientsService extends BaseService<Patient> {
  protected repository: Repository<Patient>;

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {
    super(patientRepository.manager);
    this.repository = patientRepository;
  }

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      logger.info(`Patient_Create_Entry: ${JSON.stringify(createPatientDto)}`);

      const patient = this.patientRepository.create({
        ...createPatientDto,
        status: createPatientDto.status ?? 'ACTIVE',
        is_delete: false, // ensure new patients are not marked deleted
      });

      const savedPatient: Patient = await this.patientRepository.save(patient);

      const result = await this.patientRepository.findOne({
        where: { id: savedPatient.id, is_delete: false },
      });

      logger.info(`Patient_Create_Exit: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Patient_Create_Error: ${JSON.stringify(error?.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }



// Overloads
async findAll(options?: FindManyOptions<Patient>): Promise<Patient[]>;
async findAll(
  userCtx: { role: string; branches?: { branch_id: number }[] },
  options?: FindManyOptions<Patient>
): Promise<Patient[]>;

// Implementation
async findAll(
  userCtxOrOptions?: { role: string; branches?: { branch_id: number }[] } | FindManyOptions<Patient>,
  options?: FindManyOptions<Patient>
): Promise<Patient[]> {
  try {
    logger.info('Patient_FindAll_Entry');

    const query = this.patientRepository.createQueryBuilder('patient')
      .where('patient.is_delete = false');   // soft delete filter

    let userCtx: { role: string; branches?: { branch_id: number }[] } | undefined;

    // Distinguish overload call safely
    if (userCtxOrOptions && 'role' in userCtxOrOptions) {
      // called as (userCtx, options)
      userCtx = userCtxOrOptions;
    } else {
      // called as (options)
      options = userCtxOrOptions as FindManyOptions<Patient>;
    }

    // RBAC branch filter
    if (userCtx?.role !== 'super_admin' && userCtx?.branches?.length) {
      const branchIds = userCtx.branches.map(b => b.branch_id);
      query.andWhere('patient.branch_id IN (:...branchIds)', { branchIds });
    }

    if (options?.where) {
      query.andWhere(options.where as any);
    }

    const patients = await query.getMany();
    logger.info(`Patient_FindAll_Exit: Found ${patients.length} patients`);
    return patients;
  } catch (error) {
    logger.error(`Patient_FindAll_Error: ${error?.message}`);
    throw new HttpException(EM100, EC500);
  }
}




// Overload 1 - without userCtx
async findAllWithPagination(
  page: number,
  limit: number,
  options?: FindManyOptions<Patient> & {
    searchText?: string;
    branch?: string;
    fromDate?: string;
    toDate?: string;
  },
): Promise<{ data: Patient[]; total: number }>;

// Overload 2 - with userCtx
async findAllWithPagination(
  page: number,
  limit: number,
  options: (FindManyOptions<Patient> & {
    searchText?: string;
    branch?: string;
    fromDate?: string;
    toDate?: string;
  }) | undefined,
  userCtx: { role: string; branches?: { branch_id: number }[] },
): Promise<{ data: Patient[]; total: number }>;

// Implementation
async findAllWithPagination(
  page: number,
  limit: number,
  options?: FindManyOptions<Patient> & {
    searchText?: string;
    branch?: string;
    fromDate?: string;
    toDate?: string;
  },
  userCtx?: { role: string; branches?: { branch_id: number }[] },
): Promise<{ data: Patient[]; total: number }> {
  try {
    const query = this.patientRepository.createQueryBuilder('patient');
    query.where('patient.is_delete = false');

    if (options?.searchText) {
      const search = `%${options.searchText}%`;
      query.andWhere(
        `(patient.firstname ILIKE :search 
          OR patient.lastname ILIKE :search 
          OR patient.emails ILIKE :search 
          OR EXISTS (
            SELECT 1 FROM unnest(patient.phones) AS phone WHERE phone ILIKE :search
          ))`,
        { search },
      );
    }

    if (options?.branch) {
      query.andWhere('patient.source = :branch', { branch: options.branch });
    }

    if (options?.fromDate && options?.toDate) {
      query.andWhere(
        'DATE(patient.created_at) BETWEEN :fromDate AND :toDate',
        { fromDate: options.fromDate, toDate: options.toDate },
      );
    }

    // RBAC branch filter
    if (userCtx?.role !== 'super_admin' && userCtx?.branches?.length) {
      query.andWhere('patient.branch_id IN (:...branchIds)', {
        branchIds: userCtx.branches.map((b) => b.branch_id),
      });
    }

    const [data, total] = await query
      .orderBy('patient.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  } catch (error) {
    throw new HttpException(EM100, EC500);
  }
}

  

  async findOne(id: string): Promise<Patient> {
    try {
      logger.info(`Patient_FindOne_Entry: id=${id}`);
      const patient = await this.patientRepository.findOne({
        where: { id, is_delete: false }, // only fetch non-deleted
      });

      if (!patient) {
        logger.error(`Patient_FindOne_Error: No record found for ID ${id}`);
        throw new NotFoundException(Errors.NO_RECORD_FOUND);
      }

      logger.info(`Patient_FindOne_Exit: ${JSON.stringify(patient)}`);
      return patient;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Patient_FindOne_Error: ${JSON.stringify(error?.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }


async findOneByIdentifier(identifier: {
  id?: string;
  email?: string;
  phone?: string;
}): Promise<Patient> {
  try {
    let patient: Patient | null = null;

    if (identifier.id) {
      patient = await this.patientRepository.findOne({
        where: { id: identifier.id, is_delete: false },
      });
    } else if (identifier.email) {
      patient = await this.patientRepository.findOne({
        where: { emails: identifier.email, is_delete: false },
      });
    } else if (identifier.phone) {
      patient = await this.patientRepository
        .createQueryBuilder('patient')
        .where('patient.is_delete = false')
        .andWhere(':phone = ANY(patient.phones)', { phone: identifier.phone })
        .getOne();
    }

    if (!patient) {
      throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
    }

    return patient;
  } catch (error) {
    if (error instanceof HttpException) throw error;
    throw new HttpException(EM100, EC500);
  }
}



  async updatePatient(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    try {
      logger.info(`Patient_Service_Update_Entry: id=${id}, data=${JSON.stringify(updatePatientDto)}`);

      const patient = await this.findOne(id);
      if (!patient) {
        throw new HttpException(`Patient with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }

      await this.patientRepository.update(id, updatePatientDto);

      const updatedPatient = await this.findOne(id);
      logger.info(`Patient_Service_Update_Exit: ${JSON.stringify(updatedPatient)}`);

      return updatedPatient;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Patient_Service_Update_Error: ${error?.message || error}`);
      throw new HttpException(EM100, EC500);
    }
  }

  async removePatient(id: string): Promise<void> {
    try {
      logger.info(`Patient_Remove_Entry: id=${id}`);

      const patient = await this.findOne(id);
      if (!patient) {
        throw new HttpException(
          `Patient with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.patientRepository.update(id, {
        is_delete: true,
        deleted_at: new Date(),
      });

      logger.info(`Patient_Remove_Exit: Patient ${id} soft deleted`);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      logger.error(`Patient_Remove_Error: ${JSON.stringify(error?.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }
}
