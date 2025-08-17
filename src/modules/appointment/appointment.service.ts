import { Injectable, ConflictException, HttpException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, Brackets, DeleteResult } from 'typeorm';
import { BaseService } from 'src/base.service';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { logger } from 'src/core/utils/logger';
import { EC404, EM119, EC500, EM100 } from 'src/core/constants';
import Appointment from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Therapist } from '../therapist/entities/therapist.entity';
import { Staff } from '../StaffType/entities/staff.entity';

@Injectable()
export class AppointmentsService extends BaseService<Appointment> {
  protected repository: Repository<Appointment>;

  constructor(
    @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Therapist) private readonly therapistRepository: Repository<Therapist>,
    @InjectRepository(Staff) private readonly staffRepository: Repository<Staff>,
  ) {
    super(appointmentRepository.manager);
    this.repository = appointmentRepository;
  }

  /**
   * Creates a base query with all necessary relations for appointments.
   */
  private getBaseQuery() {
    return this.repository.createQueryBuilder('a')
      .leftJoinAndSelect('a.customer', 'customer')
      .leftJoinAndSelect('customer.address', 'customerAddress')
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
   * Validates the existence of related entities (Customer, Therapist, Staff).
   */
  private async validateRelations(
    customerId: number, 
    therapistId: number, 
    staffId: number
  ): Promise<{ customer: Customer; therapist: Therapist; staff: Staff }> {
    const [customer, therapist, staff] = await Promise.all([
      this.customerRepository.findOne({ where: { id: customerId } }),
      this.therapistRepository.findOne({ where: { id: therapistId } }),
      this.staffRepository.findOne({ where: { id: staffId } })
    ]);

    if (!customer) throw new BadRequestException(`Customer with ID ${customerId} not found`);
    if (!therapist) throw new BadRequestException(`Therapist with ID ${therapistId} not found`);
    if (!staff) throw new BadRequestException(`Staff with ID ${staffId} not found`);

    return { customer, therapist, staff };
  }

  /**
   * Creates a new appointment.
   * @param createAppointmentDto - Data for creating the appointment.
   * @returns The newly created appointment.
   */
  async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      logger.info(`Appointment_Create_Entry: ${JSON.stringify(createAppointmentDto)}`);

      const { customer, therapist, staff: createdBy } = await this.validateRelations(
        createAppointmentDto.customerId,
        createAppointmentDto.therapistId,
        createAppointmentDto.createdById
      );

      const appointment = this.repository.create({
        ...createAppointmentDto,
        customer,
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
            qb.where('customer.name ILIKE :search')
              .orWhere('customer.email ILIKE :search')
              .orWhere('therapist.name ILIKE :search')
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
      const { modifiedById, customerId, therapistId, ...restDto } = updateAppointmentDto;

      // Validate the staff member making the modification
      const modifiedBy = await this.staffRepository.findOne({ where: { id: modifiedById } });
      if (!modifiedBy) {
        throw new BadRequestException(`Staff with ID ${modifiedById} not found`);
      }

      const updateData: any = { ...restDto, modifiedBy };

      // If customerId is provided, validate and update the relation
      if (customerId && customerId !== existingAppointment.customer.id) {
        const customer = await this.customerRepository.findOne({ where: { id: customerId } });
        if (!customer) throw new BadRequestException(`Customer with ID ${customerId} not found`);
        updateData.customer = customer;
      }

      // If therapistId is provided, validate and update the relation
      if (therapistId && therapistId !== existingAppointment.therapist.id) {
        const therapist = await this.therapistRepository.findOne({ where: { id: therapistId } });
        if (!therapist) throw new BadRequestException(`Therapist with ID ${therapistId} not found`);
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
