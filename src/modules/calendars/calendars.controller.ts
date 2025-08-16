// src/modules/calendars/calendars.controller.ts

import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import HandleResponse from 'src/core/utils/handle_response';
import { EC200, EC404, EC500, EM100, EM119 } from 'src/core/constants';
import { CalendarsService } from './calendars.service';
import { FindAllCalendarsQueryDto } from './dto/find-all-calendars-query.dto';

@ApiTags('Calendars')
@Controller('calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  /**
   * Handles common error responses.
   */
  private handleError(error: any) {
    if (error instanceof HttpException) {
      return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
    }
    if (error.message?.includes('not found')) {
      return HandleResponse.buildErrObj(EC404, EM119, error);
    }
    return HandleResponse.buildErrObj(EC500, EM100, error);
  }

  @Get()
  async findAll(@Query() query: FindAllCalendarsQueryDto) {
    const page = query.pagNo ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search;

    try {
      const { data, total } = await this.calendarsService.findAllWithPagination(page, limit, search);
      return HandleResponse.buildSuccessObj(EC200, 'Calendars retrieved successfully.', {
        data,
        total,
        page,
        limit,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
}