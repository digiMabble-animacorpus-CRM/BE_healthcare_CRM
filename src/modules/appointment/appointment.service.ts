import { Injectable, ConflictException, HttpException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, Brackets, DeleteResult } from 'typeorm';
import { BaseService } from 'src/base.service';
import { Patient } from 'src/modules/customers/entities/patient.entity';
import { logger } from 'src/core/utils/logger';
import { EC404, EM119, EC500, EM100 } from 'src/core/constants';
import Appointment from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { FindAllAppointmentsQueryDto } from './dto/find-all-appointments-query.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { TherapistMember } from '../therapists-team/entities/therapist-team.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Department } from '../Department/entities/department.entity';
import { Specialization } from '../specialization/entities/specialization.entity';

@Injectable()
export class AppointmentsService extends BaseService<Appointment> {
  protected repository: Repository<Appointment>;

  constructor(
    @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    @InjectRepository(TherapistMember) private readonly therapistMemberRepository: Repository<TherapistMember>,
    @InjectRepository(Branch) private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Specialization) private readonly specializationRepository: Repository<Specialization>,
  ) {
    super(appointmentRepository.manager);
    this.repository = appointmentRepository;
  }

  private getBaseQuery() {
    try {
      return this.repository.createQueryBuilder('a')
        .leftJoinAndSelect('a.branch', 'branch')
        .leftJoinAndSelect('a.patient', 'patient')
        .leftJoinAndSelect('a.therapist', 'therapist')
        .leftJoinAndSelect('a.department', 'department')
        .leftJoinAndSelect('a.specialization', 'specialization')
        .leftJoinAndSelect('a.createdBy', 'creator')
        .leftJoinAndSelect('a.modifiedBy', 'modifier')
        .where('a.deleted_at IS NULL');
    } catch (error) {
      logger.error(`Error creating base query: ${error?.message}`);
      throw error;
    }
  }

  private handleError(operation: string, error: any): never {
    logger.error(`Appointment_${operation}_Error: ${JSON.stringify(error?.message || error)}`);
    if (error instanceof HttpException) throw error;
    throw new HttpException(EM100, EC500);
  }

  private validateDateTimeSlot(startTime: string, endTime: string): void {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('Start time must be a valid ISO datetime string');
    }
    
    if (isNaN(endDate.getTime())) {
      throw new BadRequestException('End time must be a valid ISO datetime string');
    }
    
    if (endDate <= startDate) {
      throw new BadRequestException('End time must be after start time');
    }
  }

  private async validateRelations(
    branchId: number,
    patientId: string,
    therapistId: number,
    createdById: number,
    departmentId: number,
    specializationId?: number
  ): Promise<{ 
    branch: Branch; 
    patient: Patient; 
    therapist: TherapistMember; 
    createdBy: TherapistMember; 
    department: Department; 
    specialization?: Specialization 
  }> {
    const [branch, patient, therapist, createdBy, department] = await Promise.all([
      this.branchRepository.findOne({ where: { branch_id: branchId } }),
      this.patientRepository.findOne({ where: { id: patientId } }),
      this.therapistMemberRepository.findOne({ where: { therapistId: therapistId } }),
      this.therapistMemberRepository.findOne({ where: { therapistId: createdById } }),
      this.departmentRepository.findOne({ where: { id: departmentId } })
    ]);

    if (!branch) throw new BadRequestException(`Branch with ID ${branchId} not found`);
    if (!patient) throw new BadRequestException(`Patient with ID ${patientId} not found`);
    if (!therapist) throw new BadRequestException(`Therapist with ID ${therapistId} not found`);
    if (!createdBy) throw new BadRequestException(`Team member with ID ${createdById} not found`);
    if (!department) throw new BadRequestException(`Department with ID ${departmentId} not found`);

    let specialization: Specialization | undefined;
    if (specializationId) {
      specialization = await this.specializationRepository.findOne({ 
        where: { specialization_id: specializationId },
        relations: ['department']
      });
      if (!specialization) {
        throw new BadRequestException(`Specialization with ID ${specializationId} not found`);
      }
      if (specialization.department.id !== departmentId) {
        throw new BadRequestException(`Specialization ${specializationId} does not belong to department ${departmentId}`);
      }
    }

    return { branch, patient, therapist, createdBy, department, specialization };
  }

  async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      logger.info(`Appointment_Create_Entry: ${JSON.stringify(createAppointmentDto)}`);

      this.validateDateTimeSlot(createAppointmentDto.startTime, createAppointmentDto.endTime);

      const { branch, patient, therapist, createdBy, department, specialization } = await this.validateRelations(
        createAppointmentDto.branchId,
        createAppointmentDto.patientId,
        createAppointmentDto.therapistId,
        createAppointmentDto.createdById,
        createAppointmentDto.departmentId,
        createAppointmentDto.specializationId
      );

      const appointment = this.repository.create({
        ...createAppointmentDto,
        startTime: new Date(createAppointmentDto.startTime),
        endTime: new Date(createAppointmentDto.endTime),
        status: createAppointmentDto.status || 'pending',
        branch,
        patient,
        therapist,
        createdBy,
        department,
        specialization,
      });

      const savedAppointment = await this.repository.save(appointment);
      logger.info(`Appointment_Create_Exit: ${JSON.stringify(savedAppointment)}`);
      return savedAppointment;
    } catch (error) {
      this.handleError('Create', error);
    }
  }

  async findAllWithPaginationAppointments(
    page?: number, 
    limit?: number, 
    search?: string, 
    status?: string,
    startDate?: string,
    endDate?: string,
    departmentId?: number,
    branchId?: number,
    patientId?: string,
    therapistId?: number
  ): Promise<{ data: Appointment[], total: number }> {
    try {
      logger.info(`Appointment_FindAllPaginated_Entry: page=${page}, limit=${limit}, search=${search}, status=${status}, startDate=${startDate}, endDate=${endDate}, departmentId=${departmentId}, branchId=${branchId}, patientId=${patientId}, therapistId=${therapistId}`);

      let query = this.repository.createQueryBuilder('a');
      
      query = query
        .leftJoinAndSelect('a.branch', 'branch')
        .leftJoinAndSelect('a.patient', 'patient')
        .leftJoinAndSelect('a.therapist', 'therapist')
        .leftJoinAndSelect('a.department', 'department');
      
      query = query
        .leftJoinAndSelect('a.specialization', 'specialization')
        .leftJoinAndSelect('a.createdBy', 'creator')
        .leftJoinAndSelect('a.modifiedBy', 'modifier')
        .where('a.deleted_at IS NULL');
      
      logger.info('Base query with joins created successfully');

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query.andWhere(
          new Brackets(qb => {
            qb.where('patient.firstname ILIKE :search')
              .orWhere('patient.lastname ILIKE :search')
              .orWhere('patient.emails ILIKE :search')
              .orWhere('therapist.firstName ILIKE :search')
              .orWhere('therapist.lastName ILIKE :search')
              .orWhere('creator.firstName ILIKE :search')
              .orWhere('creator.lastName ILIKE :search')
              .orWhere('department.name ILIKE :search')
              .orWhere('specialization.specialization_type::text ILIKE :search');
          })
        );
        query.setParameter('search', searchTerm);
      }

      if (status) {
        query.andWhere('a.status = :status', { status });
      }

      if (startDate) {
        query.andWhere('a.startTime >= :startDate', { startDate: new Date(startDate) });
      }

      if (endDate) {
        query.andWhere('a.endTime <= :endDate', { endDate: new Date(endDate) });
      }

      if (departmentId) {
        query.andWhere('department.id = :departmentId', { departmentId });
      }

      if (branchId) {
        query.andWhere('branch.branch_id = :branchId', { branchId });
      }

      if (patientId) {
        query.andWhere('patient.id = :patientId', { patientId });
      }

      if (therapistId) {
        query.andWhere('therapist.therapistId = :therapistId', { therapistId });
      }

      logger.info('About to execute query with filters applied');
      
      query = query.orderBy('a.created_at', 'DESC');
      
      if (page && limit) {
        query = query.skip((page - 1) * limit).take(limit);
      }
      
      const [data, total] = await query.getManyAndCount();

      logger.info(`Appointment_FindAllPaginated_Exit: Found ${data.length} appointments, total: ${total}`);
      return { data, total };
    } catch (error) {
      logger.error(`Detailed error in findAllWithPaginationAppointments: ${error?.message}, Stack: ${error?.stack}`);
      this.handleError('FindAllPaginated', error);
    }
  }

  async findOneAppointment(id: number): Promise<Appointment> {
    try {
      logger.info(`Appointment_FindOne_Entry: id=${id}`);

      const appointment = await this.getBaseQuery()
        .andWhere('a.id = :id', { id })
        .getOne();

      if (!appointment) {
        throw new NotFoundException(EM119);
      }

      logger.info(`Appointment_FindOne_Exit: ${JSON.stringify(appointment)}`);
      return appointment;
    } catch (error) {
      this.handleError('FindOne', error);
    }
  }

  async updateAppointment(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    try {
      logger.info(`Appointment_Update_Entry: id=${id}, data=${JSON.stringify(updateAppointmentDto)}`);

      const existingAppointment = await this.findOneAppointment(id);
      const { modifiedById, branchId, patientId, therapistId, departmentId, specializationId, startTime, endTime, status, reason, ...restDto } = updateAppointmentDto;

      if (startTime && endTime) {
        this.validateDateTimeSlot(startTime, endTime);
      } else if (startTime && !endTime) {
        this.validateDateTimeSlot(startTime, existingAppointment.endTime.toISOString());
      } else if (!startTime && endTime) {
        this.validateDateTimeSlot(existingAppointment.startTime.toISOString(), endTime);
      }

      const modifiedBy = await this.therapistMemberRepository.findOne({ where: { therapistId: modifiedById } });
      if (!modifiedBy) {
        throw new BadRequestException(`Team member with ID ${modifiedById} not found`);
      }

      const updateData: any = { ...restDto, modifiedBy };

      if (startTime) updateData.startTime = new Date(startTime);
      if (endTime) updateData.endTime = new Date(endTime);

      if (status !== undefined) {
        if (existingAppointment.status === 'cancelled' && status !== 'cancelled') {
          throw new BadRequestException('Cannot change status of a cancelled appointment');
        }
        updateData.status = status;
        
        if (reason) {
          updateData.description = `${existingAppointment.description || ''} [Status change: ${reason}]`.trim();
        }
      } else if (reason && !status) {
        updateData.description = `${existingAppointment.description || ''} [Update note: ${reason}]`.trim();
      }

      if (branchId && branchId !== existingAppointment.branch.branch_id) {
        const branch = await this.branchRepository.findOne({ where: { branch_id: branchId } });
        if (!branch) throw new BadRequestException(`Branch with ID ${branchId} not found`);
        updateData.branch = branch;
      }

      if (patientId && patientId !== existingAppointment.patient.id) {
        const patient = await this.patientRepository.findOne({ where: { id: patientId } });
        if (!patient) throw new BadRequestException(`Patient with ID ${patientId} not found`);
        updateData.patient = patient;
      }

      if (therapistId && therapistId !== existingAppointment.therapist.therapistId) {
        const therapist = await this.therapistMemberRepository.findOne({ where: { therapistId: therapistId } });
        if (!therapist) throw new BadRequestException(`Therapist with ID ${therapistId} not found`);
        updateData.therapist = therapist;
      }

      if (departmentId && departmentId !== existingAppointment.department?.id) {
        const department = await this.departmentRepository.findOne({ where: { id: departmentId } });
        if (!department) throw new BadRequestException(`Department with ID ${departmentId} not found`);
        updateData.department = department;
      }

      if (specializationId !== undefined) {
        if (specializationId === null || specializationId === 0) {
          updateData.specialization = null;
        } else {
          const specialization = await this.specializationRepository.findOne({ 
            where: { specialization_id: specializationId },
            relations: ['department']
          });
          if (!specialization) {
            throw new BadRequestException(`Specialization with ID ${specializationId} not found`);
          }
          
          const targetDepartmentId = departmentId || existingAppointment.department?.id;
          if (specialization.department.id !== targetDepartmentId) {
            throw new BadRequestException(`Specialization ${specializationId} does not belong to department ${targetDepartmentId}`);
          }
          updateData.specialization = specialization;
        }
      }

      await this.repository.update(id, updateData);
      const updatedAppointment = await this.findOneAppointment(id);
      logger.info(`Appointment_Update_Exit: ${JSON.stringify(updatedAppointment)}`);
      return updatedAppointment;
    } catch (error) {
      this.handleError('Update', error);
    }
  }

  async removeAppointment(id: number): Promise<UpdateResult> {
    try {
      logger.info(`Appointment_SoftDelete_Entry: id=${id}`);
      await this.findOneAppointment(id);

      const result = await this.repository.update(id, {
        deleted_at: new Date(),
        is_deleted: true
      });

      logger.info(`Appointment_SoftDelete_Exit: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.handleError('SoftDelete', error);
    }
  }

  async permanentlyDeleteAppointment(id: number): Promise<DeleteResult> {
    try {
      logger.info(`Appointment_PermanentDelete_Entry: id=${id}`);
      
      const appointment = await this.repository.findOne({ 
        where: { id }, 
        withDeleted: true 
      });
      
      if (!appointment) {
        throw new NotFoundException(EM119);
      }

      const result = await this.repository.delete(id);

      logger.info(`Appointment_PermanentDelete_Exit: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.handleError('PermanentDelete', error);
    }
  }

  async restoreAppointment(id: number): Promise<Appointment> {
    try {
      logger.info(`Appointment_Restore_Entry: id=${id}`);
      
      const appointment = await this.repository.findOne({ 
        where: { id }, 
        withDeleted: true 
      });
      
      if (!appointment) {
        throw new NotFoundException(EM119);
      }

      if (!appointment.deleted_at) {
        throw new BadRequestException('Appointment is not deleted');
      }

      await this.repository.update(id, {
        deleted_at: null,
        is_deleted: false
      });

      const restoredAppointment = await this.findOneAppointment(id);
      logger.info(`Appointment_Restore_Exit: ${JSON.stringify(restoredAppointment)}`);
      return restoredAppointment;
    } catch (error) {
      this.handleError('Restore', error);
    }
  }

  async findAllDeletedAppointments(
    page?: number, 
    limit?: number
  ): Promise<{ data: Appointment[], total: number }> {
    try {
      logger.info(`Appointment_FindAllDeleted_Entry: page=${page}, limit=${limit}`);

      let query = this.repository.createQueryBuilder('a')
        .leftJoinAndSelect('a.branch', 'branch')
        .leftJoinAndSelect('a.patient', 'patient')
        .leftJoinAndSelect('a.therapist', 'therapist')
        .leftJoinAndSelect('a.department', 'department')
        .leftJoinAndSelect('a.specialization', 'specialization')
        .leftJoinAndSelect('a.createdBy', 'creator')
        .leftJoinAndSelect('a.modifiedBy', 'modifier')
        .where('a.deleted_at IS NOT NULL')
        .orderBy('a.deleted_at', 'DESC');

      if (page && limit) {
        query = query.skip((page - 1) * limit).take(limit);
      }
      
      const [data, total] = await query.getManyAndCount();

      logger.info(`Appointment_FindAllDeleted_Exit: Found ${data.length} deleted appointments, total: ${total}`);
      return { data, total };
    } catch (error) {
      this.handleError('FindAllDeleted', error);
    }
  }
}