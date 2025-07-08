import { Injectable, NotFoundException, ConflictException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Address } from '../addresses/entities/address.entity';
import { BaseService } from 'src/base.service';
import { logger } from 'src/core/utils/logger';
import { EC404, EC409, EC500, EM100, EM119 } from 'src/core/constants';
import { Errors } from 'src/core/constants/error_enums';

@Injectable()
export class CustomersService extends BaseService<Customer> {
  protected repository: Repository<Customer>;

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {
    super(customerRepository.manager);
    this.repository = customerRepository;
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      logger.info(`Customer_Create_Entry: ${JSON.stringify(createCustomerDto)}`);

      // Check if email already exists
      const existingCustomer = await this.customerRepository.findOne({
        where: { email: createCustomerDto.email },
      });

      if (existingCustomer) {
        logger.error(`Customer_Create_Error: Email already exists - ${createCustomerDto.email}`);
        throw new ConflictException(Errors.EMAIL_ID_ALREADY_EXISTS);
      }

      // Create address first
      const address = this.addressRepository.create(createCustomerDto.address);
      const savedAddress = await this.addressRepository.save(address);

   
          // Create customer with saved address
    const customer = this.customerRepository.create({
      ...createCustomerDto,
      status: createCustomerDto.status ?? 'new', // Set default manually
      address: savedAddress,
    });
      // Save customer

      const savedCustomer = await this.customerRepository.save(customer);

      // Reload with relations
      const result = await this.customerRepository.findOne({
        where: { id: savedCustomer.id },
        relations: ['address'],
      });

      logger.info(`Customer_Create_Exit: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error(`Customer_Create_Error: ${JSON.stringify(error?.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }

  async findAll(options?: FindManyOptions<Customer>): Promise<Customer[]> {
  try {
    logger.info('Customer_FindAll_Entry');
    const customers = await this.customerRepository.find({
      where: {
        ...(options?.where || {}),
        is_deleted: false, 
      },
      relations: ['address'],
      order: { created_at: 'DESC' },
      ...options,
    });
    logger.info(`Customer_FindAll_Exit: Found ${customers.length} customers`);
    return customers;
  } catch (error) {
    logger.error(`Customer_FindAll_Error: ${JSON.stringify(error?.message || error)}`);
    throw new HttpException(EM100, EC500);
  }
}


async findAllWithPaginationCustomer(
  page: number,
  limit: number,
  searchText?: string,
  branch?: string,
  fromDate?: string,
  toDate?: string,
): Promise<{ data: Customer[]; total: number }> {
  try {
    const query = this.customerRepository.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.address', 'address')
      .where('customer.is_deleted = :isDeleted', { isDeleted: false });

    if (searchText) {
      query.andWhere(
        `(customer.customer_name ILIKE :search OR customer.email ILIKE :search OR customer.phone_number ILIKE :search)`,
        { search: `%${searchText}%` },
      );
    }

    if (branch) {
      query.andWhere('customer.source = :branch', { branch });
    }

    if (fromDate && toDate) {
      query.andWhere('DATE(customer.created_at) BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      });
    }

    const [data, total] = await query
      .orderBy('customer.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  } catch (error) {
    throw new HttpException(EM100, EC500);
  }
}


  async findOne(id: number): Promise<Customer> {
  try {
    logger.info(`Customer_FindOne_Entry: id=${id}`);
    const customer = await this.customerRepository.findOne({
      where: {
        id,
        is_deleted: false, 
      },
      relations: ['address'],
    });

    if (!customer) {
      logger.error(`Customer_FindOne_Error: No record found for ID ${id}`);
      throw new NotFoundException(Errors.NO_RECORD_FOUND);
    }

    logger.info(`Customer_FindOne_Exit: ${JSON.stringify(customer)}`);
    return customer;
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    logger.error(`Customer_FindOne_Error: ${JSON.stringify(error?.message || error)}`);
    throw new HttpException(EM100, EC500);
  }
}


  async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    try {
      logger.info(`Customer_Update_Entry: id=${id}, data=${JSON.stringify(updateCustomerDto)}`);

      const customer = await this.findOne(id);

      // Update address if provided
      if (updateCustomerDto.address) {
        await this.addressRepository.update(customer.address.id, updateCustomerDto.address);
      }

      // Update customer
      await this.customerRepository.update(id, {
        ...updateCustomerDto,
        address: undefined, // Exclude address from customer update
      });

      const updatedCustomer = await this.findOne(id);
      logger.info(`Customer_Update_Exit: ${JSON.stringify(updatedCustomer)}`);
      return updatedCustomer;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error(`Customer_Update_Error: ${JSON.stringify(error?.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }

  async removeCustomer(id: number): Promise<void> {
    try {
      logger.info(`Customer_Remove_Entry: id=${id}`);

      const customer = await this.findOne(id);

      // Soft delete
      await this.customerRepository.update(id, {
        is_deleted: true,
        is_active: false,
      });

      logger.info('Customer_Remove_Exit: Successfully soft deleted');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      logger.error(`Customer_Remove_Error: ${JSON.stringify(error?.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }


}