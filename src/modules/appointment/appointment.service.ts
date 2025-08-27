import { Injectable, ConflictException, HttpException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, Brackets, DeleteResult } from 'typeorm';
import { BaseService } from 'src/base.service';
import { Patient } from 'src/modules/customers/entities/patient.entity';
import { logger } from 'src/core/utils/logger';
import { EC404, EM119, EC500, EM100 } from 'src/core/constants';
import Appointment from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Therapist } from '../therapist/entities/therapist.entity';
import { TeamMember } from 'src/modules/team-member/entities/team-member.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';

@Injectable()
export class AppointmentsService extends BaseService<Appointment> {
  protected repository: Repository<Appointment>;

  constructor(
    @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Therapist) private readonly therapistRepository: Repository<Therapist>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(Branch) private readonly branchRepository: Repository<Branch>,
  ) {
    super(appointmentRepository.manager);
    this.repository = appointmentRepository;
  }

  /**
   * Creates a base query with all necessary relations for appointments.
   */
  private getBaseQuery() {
    return this.repository.createQueryBuilder('a')
      .leftJoinAndSelect('a.patient', 'patient')
      .leftJoinAndSelect('a.therapist', 'therapist')
      .leftJoinAndSelect('a.createdBy', 'creator')
      .leftJoinAndSelect('a.modifiedBy', 'modifier');
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
   * Validates the existence of related entities (Patient, Therapist, TeamMember).
   */
  private async validateRelations(
    branchId: number,
    patientId: string, // UUID for Patient
    therapistKey: number, // _key field for Therapist
    teamMemberId: string // team_id UUID for TeamMember
  ): Promise<{ branch: Branch; patient: Patient; therapist: Therapist; teamMember: TeamMember }> {
    const [branch, patient, therapist, teamMember] = await Promise.all([
      this.branchRepository.findOne({ where: { branch_id: branchId } }),
      this.patientRepository.findOne({ where: { id: patientId } }),
      this.therapistRepository.findOne({ where: { _key: therapistKey } }),
      this.teamMemberRepository.findOne({ where: { team_id: teamMemberId } }) // Using team_id instead of id
    ]);

    if (!branch) throw new BadRequestException(`Branch with ID ${branchId} not found`);
    if (!patient) throw new BadRequestException(`Patient with ID ${patientId} not found`);
    if (!therapist) throw new BadRequestException(`Therapist with key ${therapistKey} not found`);
    if (!teamMember) throw new BadRequestException(`Team member with ID ${teamMemberId} not found`);

    return { branch, patient, therapist, teamMember };
  }

  /**
   * Creates a new appointment.
   * @param createAppointmentDto - Data for creating the appointment.
   * @returns The newly created appointment.
   */
  async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      logger.info(`Appointment_Create_Entry: ${JSON.stringify(createAppointmentDto)}`);

      const { branch, patient, therapist, teamMember: createdBy } = await this.validateRelations(
        createAppointmentDto.branchId,
        createAppointmentDto.patientId, // string (UUID)
        createAppointmentDto.therapistKey, // number
        createAppointmentDto.createdById // string (UUID)
      );

      const appointment = this.repository.create({
        ...createAppointmentDto,
        branch,
        patient,
        therapist,
        createdBy,
      });

      const savedAppointment = await this.repository.save(appointment);
      logger.info(`Appointment_Create_Exit: ${JSON.stringify(savedAppointment)}`);
      return savedAppointment;
    } catch (error) {
      this.handleError('Create', error);
    }
  }

  /**
   * Finds all appointments with pagination and search functionality.
   * @param page - Page number.
   * @param limit - Number of items per page.
   * @param search - Optional search term.
   * @returns A list of appointments and the total count.
   */
  async findAllWithPaginationAppointments(page: number, limit: number, search?: string): Promise<{ data: Appointment[], total: number }> {
    try {
      logger.info(`Appointment_FindAllPaginated_Entry: page=${page}, limit=${limit}, search=${search}`);

      const query = this.getBaseQuery();

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
              .orWhere('a.department::text ILIKE :search');
          })
        );
        query.setParameter('search', searchTerm);
      }

      const [data, total] = await query
        .orderBy('a.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      logger.info(`Appointment_FindAllPaginated_Exit: Found ${data.length} appointments, total: ${total}`);
      return { data, total };
    } catch (error) {
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
   * Updates an existing appointment.
   * @param id - The ID of the appointment to update.
   * @param updateAppointmentDto - The data to update.
   * @returns The result of the update operation.
   */
  async updateAppointment(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<UpdateResult> {
    try {
      logger.info(`Appointment_Update_Entry: id=${id}, data=${JSON.stringify(updateAppointmentDto)}`);

      const existingAppointment = await this.findOneAppointment(id);
      const { modifiedById, branchId, patientId, therapistKey, ...restDto } = updateAppointmentDto;

      // Validate the team member making the modification
      const modifiedBy = await this.teamMemberRepository.findOne({ where: { team_id: modifiedById } }); // Using team_id
      if (!modifiedBy) {
        throw new BadRequestException(`Team member with ID ${modifiedById} not found`);
      }

      const updateData: any = { ...restDto, modifiedBy };

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

      // If therapistKey is provided, validate and update the relation
      if (therapistKey && therapistKey !== existingAppointment.therapist._key) {
        const therapist = await this.therapistRepository.findOne({ where: { _key: therapistKey } });
        if (!therapist) throw new BadRequestException(`Therapist with key ${therapistKey} not found`);
        updateData.therapist = therapist;
      }

      const result = await this.repository.update(id, updateData);
      logger.info(`Appointment_Update_Exit: ${JSON.stringify(result)}`);
      return result;
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