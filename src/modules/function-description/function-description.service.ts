// src/modules/function-description/function-description.service.ts

import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { logger } from 'src/core/utils/logger';
import { EM100, EC500 } from 'src/core/constants';
import { FunctionDescription } from './entities/function-description.entity';

@Injectable()
export class FunctionDescriptionService {
  constructor(
    @InjectRepository(FunctionDescription)
    private readonly functionDescriptionRepository: Repository<FunctionDescription>,
  ) {}

  /**
   * Handles errors, logs them, and throws a standardized HttpException.
   */
  private handleError(operation: string, error: any): never {
    logger.error(`FunctionDescription_${operation}_Error: ${JSON.stringify(error?.message || error)}`);
    if (error instanceof HttpException) throw error;
    throw new HttpException(EM100, EC500);
  }

  /**
   * Finds all function descriptions with pagination and search functionality.
   * @param page - Page number.
   * @param limit - Number of items per page.
   * @param search - Optional search term.
   * @returns A list of function descriptions and the total count.
   */
  async findAllWithPagination(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: FunctionDescription[]; total: number }> {
    try {
      logger.info(`FunctionDescription_FindAllPaginated_Entry: page=${page}, limit=${limit}, search=${search}`);

      const query = this.functionDescriptionRepository.createQueryBuilder('fd');

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query.where(
          new Brackets((qb) => {
            qb.where('fd.fonction ILIKE :search', { search: searchTerm });
          }),
        );
      }

      const [data, total] = await query
        .orderBy('fd.fonction', 'ASC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      logger.info(`FunctionDescription_FindAllPaginated_Exit: Found ${data.length} descriptions, total: ${total}`);
      return { data, total };
    } catch (error) {
      this.handleError('FindAllPaginated', error);
    }
  }
}