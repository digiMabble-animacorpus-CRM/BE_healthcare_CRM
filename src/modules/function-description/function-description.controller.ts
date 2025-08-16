// src/modules/function-description/function-description.controller.ts

import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import HandleResponse from 'src/core/utils/handle_response';
import { EC200, EC404, EC500, EM100, EM119 } from 'src/core/constants';
import { FunctionDescriptionService } from './function-description.service';
import { FindAllFunctionDescriptionsQueryDto } from './dto/find-all-function-descriptions-query.dto';

@ApiTags('Function Descriptions')
@Controller('function-descriptions')
export class FunctionDescriptionController {
  constructor(private readonly functionDescriptionService: FunctionDescriptionService) {}

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
  async findAll(@Query() query: FindAllFunctionDescriptionsQueryDto) {
    const page = query.pagNo ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search;

    try {
      const { data, total } = await this.functionDescriptionService.findAllWithPagination(page, limit, search);
      return HandleResponse.buildSuccessObj(EC200, 'Function descriptions retrieved successfully.', {
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