import { Injectable, ConflictException, HttpException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, Brackets } from 'typeorm';
import { BaseService } from 'src/base.service';
import Property from 'src/modules/properties/entities/property.entity';
import { Patient } from 'src/modules/customers/entities/patient.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { logger } from 'src/core/utils/logger';
import { EC404, EM119, EC500, EM100 } from 'src/core/constants';
import Order from './entities/orders.entity';

@Injectable()
export class OrdersService extends BaseService<Order> {
  protected repository: Repository<Order>;

  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(Property) private readonly propertyRepository: Repository<Property>,
    @InjectRepository(Patient) private readonly customerRepository: Repository<Patient>,
  ) {
    super(orderRepository.manager);
    this.repository = orderRepository;
  }

  private getBaseQuery() {
    return this.repository.createQueryBuilder('o')
      .leftJoinAndSelect('o.customer', 'customer')
      .leftJoinAndSelect('customer.address', 'customerAddress')
      .leftJoinAndSelect('o.property', 'property')
      .where('o.is_deleted = :isDeleted', { isDeleted: false });
  }

  private handleError(operation: string, error: any): never {
    logger.error(`Order_${operation}_Error: ${JSON.stringify(error?.message || error)}`);
    if (error instanceof HttpException) throw error;
    throw new HttpException(EM100, EC500);
  }

  private async validateRelations(customerId: number, propertyId: number): Promise<{ customer: Patient, property: Property }> {
    const [customer, property] = await Promise.all([
      this.customerRepository.findOne({ where: { id: customerId.toString(),  } }),
      this.propertyRepository.findOne({ where: { id: propertyId, is_deleted: false } })
    ]);

    if (!customer) throw new BadRequestException(`Customer with ID ${customerId} not found`);
    if (!property) throw new BadRequestException(`Property with ID ${propertyId} not found`);

    return { customer, property };
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      logger.info(`Order_Create_Entry: ${JSON.stringify(createOrderDto)}`);

      const { customer, property } = await this.validateRelations(
        createOrderDto.customer_id,
        createOrderDto.property_id
      );

      const existingOrder = await this.repository.findOne({
        where: { order_id: createOrderDto.order_id, is_deleted: false }
      });

      if (existingOrder) {
        throw new ConflictException(`Order with ID ${createOrderDto.order_id} already exists`);
      }

      const order = this.repository.create({
        ...createOrderDto,
        customer,
        property,
        amount_status: createOrderDto.amount_status || 'Pending',
      });

      const savedOrder = await this.repository.save(order);
      logger.info(`Order_Create_Exit: ${JSON.stringify(savedOrder)}`);
      return savedOrder;
    } catch (error) {
      this.handleError('Create', error);
    }
  }

  async findAllWithPaginationOrders(page: number, limit: number, search?: string): Promise<{ data: Order[], total: number }> {
    try {
      logger.info(`Order_FindAllPaginated_Entry: page=${page}, limit=${limit}, search=${search}`);

      const query = this.getBaseQuery();

      if (search?.trim()) {
        const searchTerm = search.trim();
        query.andWhere(
          new Brackets(qb => {
            qb.where('o.order_id::text ILIKE :search')
              .orWhere('customer.customer_name ILIKE :search');
          })
        );
        query.setParameter('search', `%${searchTerm}%`);
      }

      const [data, total] = await query
        .orderBy('o.created_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      logger.info(`Order_FindAllPaginated_Exit: Found ${data.length} orders, total: ${total}`);
      return { data, total };
    } catch (error) {
      logger.error(`Order_FindAllPaginated_Error: ${error?.message}`);
      throw error instanceof HttpException ? error : new HttpException(EM100, EC500);
    }
  }

  async findOneOrder(id: number): Promise<Order> {
    try {
      logger.info(`Order_FindOne_Entry: id=${id}`);

      const order = await this.getBaseQuery()
        .andWhere('o.id = :id', { id })
        .getOne();

      if (!order) {
        throw new HttpException(EM119, EC404);
      }

      logger.info(`Order_FindOne_Exit: ${JSON.stringify(order)}`);
      return order;
    } catch (error) {
      this.handleError('FindOne', error);
    }
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<UpdateResult> {
    try {
      logger.info(`Order_Update_Entry: id=${id}, data=${JSON.stringify(updateOrderDto)}`);

      const existingOrder = await this.findOneOrder(id);

      const updateData: any = { ...updateOrderDto };

      if (updateOrderDto.customer_id || updateOrderDto.property_id) {
        const { customer, property } = await this.validateRelations(
          Number(updateOrderDto.customer_id ?? existingOrder.customer.id),
          Number(updateOrderDto.property_id ?? existingOrder.property.id)
        );

        if (updateOrderDto.customer_id) {
          updateData.customer = customer;
          delete updateData.customer_id;
        }

        if (updateOrderDto.property_id) {
          updateData.property = property;
          delete updateData.property_id;
        }
      }

      if (updateOrderDto.order_id && updateOrderDto.order_id !== existingOrder.order_id) {
        const conflict = await this.repository.findOne({
          where: { order_id: updateOrderDto.order_id, is_deleted: false }
        });

        if (conflict) {
          throw new ConflictException(`Order with ID ${updateOrderDto.order_id} already exists`);
        }
      }

      const result = await this.repository.update(id, updateData);
      logger.info(`Order_Update_Exit: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.handleError('Update', error);
    }
  }

  async removeOrder(id: number): Promise<UpdateResult> {
    try {
      logger.info(`Order_Remove_Entry: id=${id}`);

      await this.findOneOrder(id); // Verify existence

      const result = await this.repository.update(id, {
        is_deleted: true,
        is_active: false,
        deleted_at: new Date()
      });

      logger.info(`Order_Remove_Exit: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.handleError('Remove', error);
    }
  }
}
