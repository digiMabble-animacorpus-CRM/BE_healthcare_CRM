// src/modules/properties/properties.service.ts

import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, FindOneOptions, FindManyOptions } from 'typeorm';
import { BaseService } from 'src/base.service';
import Property from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { logger } from 'src/core/utils/logger';
import { EC404, EM119, EC500, EM100 } from 'src/core/constants';
import { Errors } from 'src/core/constants/error_enums';

@Injectable()
export class PropertiesService extends BaseService<Property> {
    protected repository: Repository<Property>;

    constructor(
        @InjectRepository(Property) private readonly propertyRepository: Repository<Property>,
    ) {
        super(propertyRepository.manager);
        this.repository = propertyRepository;
    }

    /**
     * Create a new property
     */
    async createProperty(createPropertyDto: CreatePropertyDto): Promise<Property> {
        try {
            logger.info(`Property_Create_Entry: ${JSON.stringify(createPropertyDto)}`);
            const property = await super.create(createPropertyDto);
            logger.info(`Property_Create_Exit: ${JSON.stringify(property)}`);
            return property;
        } catch (error) {
            logger.error(`Property_Create_Error: ${JSON.stringify(error?.message || error)}`);
            throw new HttpException(EM100, EC500);
        }
    }

    /**
     * Find all properties
     */
    async findAllProperties(options?: FindManyOptions<Property>): Promise<Property[]> {
        try {
            logger.info('Property_FindAll_Entry');
            const properties = await super.findAll(options);
            logger.info(`Property_FindAll_Exit: Found ${properties.length} properties`);
            return properties;
        } catch (error) {
            logger.error(`Property_FindAll_Error: ${JSON.stringify(error?.message || error)}`);
            throw new HttpException(EM100, EC500);
        }
    }

    /**
     * Find one property by ID
     */
    async findOneProperty(id: number, options?: FindOneOptions<Property>): Promise<Property | null> {
        try {
            logger.info(`Property_FindOne_Entry: id=${id}`);
            const property = await super.findOne(id, options);
            if (!property) {
                logger.error(`Property_FindOne_Error: No record found for ID ${id}`);
                throw new HttpException(EM119, EC404);
            }
            logger.info(`Property_FindOne_Exit: ${JSON.stringify(property)}`);
            return property;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Re-throw if it's already a HttpException
            }
            logger.error(`Property_FindOne_Error: ${JSON.stringify(error?.message || error)}`);
            throw new HttpException(EM100, EC500);
        }
    }

    /**
     * Update a property
     */
    async updateProperty(id: number, updatePropertyDto: UpdatePropertyDto): Promise<UpdateResult> {
        try {
            logger.info(`Property_Update_Entry: id=${id}, data=${JSON.stringify(updatePropertyDto)}`);
            
            // Check if property exists before updating
            const existingProperty = await this.findOne(id);
            if (!existingProperty) {
                logger.error(`Property_Update_Error: No record found for ID ${id}`);
                throw new HttpException(EM119, EC404);
            }
            
            const result = await super.update(id, updatePropertyDto);
            if (result.affected === 0) {
                logger.error(`Property_Update_Error: No record updated for ID ${id}`);
                throw new HttpException(EM119, EC404);
            }
            
            logger.info(`Property_Update_Exit: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            logger.error(`Property_Update_Error: ${JSON.stringify(error?.message || error)}`);
            throw new HttpException(EM100, EC500);
        }
    }

    /**
     * Soft delete a property
     */
    async removeProperty(id: number): Promise<UpdateResult> {
        try {
            logger.info(`Property_Remove_Entry: id=${id}`);
            
            // Check if property exists before removing
            const existingProperty = await this.findOne(id);
            if (!existingProperty) {
                logger.error(`Property_Remove_Error: No record found for ID ${id}`);
                throw new HttpException(EM119, EC404);
            }
            
            const result = await super.remove(id);
            if (result.affected === 0) {
                logger.error(`Property_Remove_Error: No record removed for ID ${id}`);
                throw new HttpException(EM119, EC404);
            }
            
            logger.info(`Property_Remove_Exit: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            logger.error(`Property_Remove_Error: ${JSON.stringify(error?.message || error)}`);
            throw new HttpException(EM100, EC500);
        }
    }

    /**
     * Hard delete a property
     */
    async destroyProperty(id: string): Promise<void> {
        try {
            logger.info(`Property_Destroy_Entry: id=${id}`);
            
            // Create a custom error for NO_RECORD_FOUND using the Errors enum
            const result = await this.repository.delete(id);
            if (result.affected === 0) {
                logger.error(`Property_Destroy_Error: No record found for ID ${id}`);
                throw new HttpException(Errors.NO_RECORD_FOUND, EC404);
            }
            
            logger.info('Property_Destroy_Exit: Successfully deleted');
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            logger.error(`Property_Destroy_Error: ${JSON.stringify(error?.message || error)}`);
            throw new HttpException(EM100, EC500);
        }
    }
}
