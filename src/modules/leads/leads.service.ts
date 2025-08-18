import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, FindManyOptions } from 'typeorm';
import { BaseService } from 'src/base.service';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Patient } from '../customers/entities/patient.entity';
import Property from '../properties/entities/property.entity';
import { logger } from 'src/core/utils/logger';
import { EC404, EM119, EC500, EM100 } from 'src/core/constants';

@Injectable()
export class LeadsService extends BaseService<Lead> {
    protected repository: Repository<Lead>;

    constructor(
        @InjectRepository(Lead) private readonly leadRepository: Repository<Lead>,
        @InjectRepository(Patient) private readonly customerRepository: Repository<Patient>,
        @InjectRepository(Property) private readonly propertyRepository: Repository<Property>,
    ) {
        super(leadRepository.manager);
        this.repository = leadRepository;
    }

    private readonly relations = ['customer', 'customer.address', 'interested_property'];

    async createLead(dto: CreateLeadDto): Promise<Lead> {
        try {
            logger.info(`Lead_Create: ${JSON.stringify(dto)}`);

            // Check for duplicate lead
            const existingLead = await this.leadRepository.findOne({
                where: {
                    customer: { id: String(dto.customer_id) },
                    interested_property: { id: dto.interested_property_id },
                    is_deleted: false
                }
            });

            if (existingLead) {
                throw new HttpException('A lead with the same customer, property, and inquiry date already exists', 409);
            }

            const customer = await this.customerRepository.findOne({ where: { id: String(dto.customer_id) } });
            if (!customer) {
                throw new HttpException('Customer not found', 404);
            }

            const property = await this.propertyRepository.findOne({ where: { id: dto.interested_property_id } });
            if (!property) {
                throw new HttpException('Property not found', 404);
            }

            const { customer_id, interested_property_id, ...leadFields } = dto;
            const leadData = {
                ...leadFields,
                customer,
                interested_property: property
            };

            const lead = await this.leadRepository.save(this.leadRepository.create(leadData));
            logger.info(`Lead_Created: ${lead.id}`);
            return lead;
        } catch (error) {
            logger.error(`Lead_Create_Error: ${error?.message}`);
            throw error instanceof HttpException ? error : new HttpException(EM100, EC500);
        }
    }

    async findLeadsWithPagination(
        page: number,
        limit: number,
        searchText?: string,
        status?: string
    ): Promise<{ data: Lead[]; total: number }> {
        try {
            const query = this.leadRepository
                .createQueryBuilder('lead')
                .leftJoinAndSelect('lead.customer', 'customer')
                .leftJoinAndSelect('customer.address', 'address')
                .leftJoinAndSelect('lead.interested_property', 'property')
                .where('lead.is_deleted = false')
                .orderBy('lead.created_at', 'DESC');

            if (searchText?.trim()) {
                query.andWhere(
                    `(customer.fullName ILIKE :search OR customer.email ILIKE :search OR 
            customer.phoneNumber ILIKE :search OR property.name ILIKE :search OR 
            lead.notes ILIKE :search OR address.city ILIKE :search OR address.country ILIKE :search)`,
                    { search: `%${searchText.trim()}%` }
                );
            }

            if (status) {
                query.andWhere('lead.lead_status = :status', { status });
            }

            const [data, total] = await query
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();

            return { data, total };
        } catch (error) {
            logger.error(`Find_Pagination_Error: ${error?.message}`);
            throw error instanceof HttpException ? error : new HttpException(EM100, EC500);
        }
    }

    async findOne(id: number): Promise<Lead> {
        try {
            const lead = await this.leadRepository.findOne({
                where: { id, is_deleted: false },
                relations: this.relations,
            });

            if (!lead) {
                throw new HttpException(EM119, EC404);
            }

            return lead;
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(EM100, EC500);
        }
    }

    async update(id: number, dto: UpdateLeadDto): Promise<UpdateResult> {
        try {
            const existing = await this.findOne(id);
            if (!existing) {
                throw new HttpException(EM119, EC404);
            }

            const updateData: any = { ...dto };

            if (dto.customer_id) {
                const customer = await this.customerRepository.findOne({ where: { id: String(dto.customer_id) } });
                if (!customer) {
                    throw new HttpException('Customer not found', 404);
                }
                updateData.customer = customer;
                delete updateData.customer_id;
            }

            if (dto.interested_property_id) {
                const property = await this.propertyRepository.findOne({ where: { id: dto.interested_property_id } });
                if (!property) {
                    throw new HttpException('Property not found', 404);
                }
                updateData.interested_property = property;
                delete updateData.interested_property_id;
            }

            return this.leadRepository.update(id, updateData);
        } catch (error) {
            throw error instanceof HttpException ? error : new HttpException(EM100, EC500);
        }
    }

    async remove(id: number): Promise<UpdateResult> {
        try {
            const existing = await this.findOne(id);
            if (!existing) {
                throw new HttpException(EM119, EC404);
            }
            return super.remove(id);
        } catch (error) {
            throw error instanceof HttpException ? error : new HttpException(EM100, EC500);
        }
    }
}
