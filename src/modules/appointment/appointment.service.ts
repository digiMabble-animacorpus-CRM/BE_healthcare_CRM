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
import { Therapist } from '../therapist/entities/therapist.entity';
import { TeamMember } from 'src/modules/team-member/entities/team-member.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Department } from '../Department/entities/department.entity';
import { Specialization } from '../specialization/entities/specialization.entity';

@Injectable()
export class AppointmentsService extends BaseService<Appointment> {
  protected repository: Repository<Appointment>;

  constructor(
    @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Therapist) private readonly therapistRepository: Repository<Therapist>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(Branch) private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Specialization) private readonly specializationRepository: Repository<Specialization>,
  ) {
    super(appointmentRepository.manager);
    this.repository = appointmentRepository;
  }

  /**
   * Creates a base query with all necessary relations for appointments.
   */
  private getBaseQuery() {
    try {
      return this.repository.createQueryBuilder('a')
        .leftJoinAndSelect('a.branch', 'branch')
        .leftJoinAndSelect('a.patient', 'patient')
        .leftJoinAndSelect('a.therapist', 'therapist')
        .leftJoinAndSelect('a.department', 'department')
        .leftJoinAndSelect('a.specialization', 'specialization')
        .leftJoinAndSelect('a.createdBy', 'creator')
        .leftJoinAndSelect('a.modifiedBy', 'modifier');
    } catch (error) {
      logger.error(`Error creating base query: ${error?.message}`);
      throw error;
    }
  }

  /**
   * Handles errors, logs them, and throws a standardized HttpException.
   */
  private handleError(operation: string, error: any): never {
    logger.error(`Appointment_${operation}_Error: ${JSON.stringify(error?.message || error)}`);
    if (error instanceof HttpException) throw error;
    throw new HttpException(EM100, EC500);
  }

  /**
   * Validates datetime format and ensures end time is after start time.
   */
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

  /**
   * Validates the existence of related entities (Patient, Therapist, TeamMember, Department, Specialization).
   */
  private async validateRelations(
    branchId: number,
    patientId: string, // UUID for Patient
    therapistId: number, // ID field for Therapist
    teamMemberId: string, // team_id UUID for TeamMember
    departmentId: number, // ID for Department
    specializationId?: number // Optional ID for Specialization
  ): Promise<{ 
    branch: Branch; 
    patient: Patient; 
    therapist: Therapist; 
    teamMember: TeamMember; 
    department: Department; 
    specialization?: Specialization 
  }> {
    const [branch, patient, therapist, teamMember, department] = await Promise.all([
      this.branchRepository.findOne({ where: { branch_id: branchId } }),
      this.patientRepository.findOne({ where: { id: patientId } }),
      this.therapistRepository.findOne({ where: { therapistId: therapistId } }),
      this.teamMemberRepository.findOne({ where: { team_id: teamMemberId } }), // Using team_id instead of id
      this.departmentRepository.findOne({ where: { id: departmentId } })
    ]);

    if (!branch) throw new BadRequestException(`Branch with ID ${branchId} not found`);
    if (!patient) throw new BadRequestException(`Patient with ID ${patientId} not found`);
    if (!therapist) throw new BadRequestException(`Therapist with ID ${therapistId} not found`);
    if (!teamMember) throw new BadRequestException(`Team member with ID ${teamMemberId} not found`);
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
      // Validate that the specialization belongs to the specified department
      if (specialization.department.id !== departmentId) {
        throw new BadRequestException(`Specialization ${specializationId} does not belong to department ${departmentId}`);
      }
    }

    return { branch, patient, therapist, teamMember, department, specialization };
  }

  /**
   * Creates a new appointment.
   * @param createAppointmentDto - Data for creating the appointment.
   * @returns The newly created appointment.
   */
  async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      logger.info(`Appointment_Create_Entry: ${JSON.stringify(createAppointmentDto)}`);

      // Validate datetime slot
      this.validateDateTimeSlot(createAppointmentDto.startTime, createAppointmentDto.endTime);

      const { branch, patient, therapist, teamMember: createdBy, department, specialization } = await this.validateRelations(
        createAppointmentDto.branchId,
        createAppointmentDto.patientId, // string (UUID)
        createAppointmentDto.therapistId, // number
        createAppointmentDto.createdById, // string (UUID)
        createAppointmentDto.departmentId, // number
        createAppointmentDto.specializationId // optional number
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

  /**
   * Finds all appointments with optional pagination and search functionality.
   * @param page - Page number (optional, if not provided returns all data).
   * @param limit - Number of items per page (optional, if not provided returns all data).
   * @param search - Optional search term.
   * @param status - Optional status filter.
   * @param startDate - Optional start date for date range filter.
   * @param endDate - Optional end date for date range filter.
   * @param departmentId - Optional department filter.
   * @param branchId - Optional branch filter.
   * @param patientId - Optional patient filter.
   * @param therapistId - Optional therapist filter.
   * @returns A list of appointments and the total count.
   */
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

      // Start with a simple query and add joins step by step
      let query = this.repository.createQueryBuilder('a');
      
      // Add essential joins
      query = query
        .leftJoinAndSelect('a.branch', 'branch')
        .leftJoinAndSelect('a.patient', 'patient')
        .leftJoinAndSelect('a.therapist', 'therapist')
        .leftJoinAndSelect('a.department', 'department');
      
      // Add optional joins
      query = query
        .leftJoinAndSelect('a.specialization', 'specialization')
        .leftJoinAndSelect('a.createdBy', 'creator')
        .leftJoinAndSelect('a.modifiedBy', 'modifier');
      
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
              .orWhere('creator.first_name ILIKE :search')
              .orWhere('creator.last_name ILIKE :search')
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
      
      // Apply ordering
      query = query.orderBy('a.created_at', 'DESC');
      
      // Apply pagination only if both page and limit are provided
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

  /**
   * Finds a single appointment by its ID.
   * @param id - The ID of the appointment.
   * @returns The found appointment.
   */
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

  /**
   * Updates an existing appointment including its status.
   * @param id - The ID of the appointment to update.
   * @param updateAppointmentDto - The data to update.
   * @returns The updated appointment.
   */
  async updateAppointment(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    try {
      logger.info(`Appointment_Update_Entry: id=${id}, data=${JSON.stringify(updateAppointmentDto)}`);

      const existingAppointment = await this.findOneAppointment(id);
      const { modifiedById, branchId, patientId, therapistId, departmentId, specializationId, startTime, endTime, status, reason, ...restDto } = updateAppointmentDto;

      // Validate datetime slot if both startTime and endTime are provided
      if (startTime && endTime) {
        this.validateDateTimeSlot(startTime, endTime);
      } else if (startTime && !endTime) {
        this.validateDateTimeSlot(startTime, existingAppointment.endTime.toISOString());
      } else if (!startTime && endTime) {
        this.validateDateTimeSlot(existingAppointment.startTime.toISOString(), endTime);
      }

      // Validate the team member making the modification
      const modifiedBy = await this.teamMemberRepository.findOne({ where: { team_id: modifiedById } }); // Using team_id
      if (!modifiedBy) {
        throw new BadRequestException(`Team member with ID ${modifiedById} not found`);
      }

      const updateData: any = { ...restDto, modifiedBy };

      // Include datetime fields if provided (convert from ISO string to Date)
      if (startTime) updateData.startTime = new Date(startTime);
      if (endTime) updateData.endTime = new Date(endTime);

      // Handle status update with validation
      if (status !== undefined) {
        // Check if status change is valid
        if (existingAppointment.status === 'cancelled' && status !== 'cancelled') {
          throw new BadRequestException('Cannot change status of a cancelled appointment');
        }
        updateData.status = status;
        
        // If reason is provided for status change, add it to description
        if (reason) {
          updateData.description = `${existingAppointment.description || ''} [Status change: ${reason}]`.trim();
        }
      } else if (reason && !status) {
        // If only reason is provided without status change, add it as a general note
        updateData.description = `${existingAppointment.description || ''} [Update note: ${reason}]`.trim();
      }

      if (branchId && branchId !== existingAppointment.branch.branch_id) {
        const branch = await this.branchRepository.findOne({ where: { branch_id: branchId } });
        if (!branch) throw new BadRequestException(`Branch with ID ${branchId} not found`);
        updateData.branch = branch;
      }

      // If patientId is provided, validate and update the relation
      if (patientId && patientId !== existingAppointment.patient.id) {
        const patient = await this.patientRepository.findOne({ where: { id: patientId } });
        if (!patient) throw new BadRequestException(`Patient with ID ${patientId} not found`);
        updateData.patient = patient;
      }

      // If therapistId is provided, validate and update the relation
      if (therapistId && therapistId !== existingAppointment.therapist.therapistId) {
        const therapist = await this.therapistRepository.findOne({ where: { therapistId: therapistId } });
        if (!therapist) throw new BadRequestException(`Therapist with ID ${therapistId} not found`);
        updateData.therapist = therapist;
      }

      // If departmentId is provided, validate and update the relation
      if (departmentId && departmentId !== existingAppointment.department?.id) {
        const department = await this.departmentRepository.findOne({ where: { id: departmentId } });
        if (!department) throw new BadRequestException(`Department with ID ${departmentId} not found`);
        updateData.department = department;
      }

      // If specializationId is provided, validate and update the relation
      if (specializationId !== undefined) {
        if (specializationId === null || specializationId === 0) {
          // Clear the specialization
          updateData.specialization = null;
        } else {
          const specialization = await this.specializationRepository.findOne({ 
            where: { specialization_id: specializationId },
            relations: ['department']
          });
          if (!specialization) {
            throw new BadRequestException(`Specialization with ID ${specializationId} not found`);
          }
          
          // If departmentId is also being updated, use the new department, otherwise use existing
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

  /**
   * Deletes an appointment permanently.
   * @param id - The ID of the appointment to delete.
   * @returns The result of the delete operation.
   */
  async removeAppointment(id: number): Promise<DeleteResult> {
    try {
      logger.info(`Appointment_Remove_Entry: id=${id}`);
      await this.findOneAppointment(id); // Verify existence before attempting deletion

      const result = await this.repository.delete(id);

      logger.info(`Appointment_Remove_Exit: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.handleError('Remove', error);
    }
  }
}