// src/modules/calendars/calendars.service.ts

import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { logger } from 'src/core/utils/logger';
import { EM100, EC500 } from 'src/core/constants';
import { Calendar } from './entities/calendar.entity';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
  ) {}

  /**
   * Handles errors, logs them, and throws a standardized HttpException.
   */
  private handleError(operation: string, error: any): never {
    logger.error(`Calendar_${operation}_Error: ${JSON.stringify(error?.message || error)}`);
    if (error instanceof HttpException) throw error;
    throw new HttpException(EM100, EC500);
  }

  /**
   * Finds all calendars with pagination and search functionality.
   * @param page - Page number.
   * @param limit - Number of items per page.
   * @param search - Optional search term.
   * @returns A list of calendars and the total count.
   */
  async findAllWithPagination(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: Calendar[]; total: number }> {
    try {
      logger.info(`Calendar_FindAllPaginated_Entry: page=${page}, limit=${limit}, search=${search}`);

      const query = this.calendarRepository.createQueryBuilder('c');

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query.where(
          new Brackets((qb) => {
            qb.where('c.label ILIKE :search', { search: searchTerm })
              .orWhere('c.siteid ILIKE :search', { search: searchTerm })
              .orWhere('c.ownerid ILIKE :search', { search: searchTerm });
          }),
        );
      }

      const [data, total] = await query
        .orderBy('c.id', 'ASC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      logger.info(`Calendar_FindAllPaginated_Exit: Found ${data.length} calendars, total: ${total}`);
      return { data, total };
    } catch (error) {
      this.handleError('FindAllPaginated', error);
    }
  }
}