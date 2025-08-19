import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpException,
  BadRequestException,
  HttpStatus,
 
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiParam,

} from '@nestjs/swagger';
import { PatientsService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import HandleResponse from 'src/core/utils/handle_response';
import {
  EC200,
  EC201,
  EC204,
  EC500,
  EM100,
  EM104,
  EM106,
  EM116,
  EM127,
} from 'src/core/constants';
import { PaginationDto } from 'src/core/interfaces/shared.dto';
import { validateOrReject } from 'class-validator';
import { plainToClass,  plainToInstance } from 'class-transformer';
import { logger } from 'src/core/utils/logger';

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly customersService: PatientsService) {}

  // CREATE
  @Post()
  @ApiOperation({ summary: 'Create a new customer (plain JSON only)' })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() reqBody: CreatePatientDto) {
    try {
      const createCustomerDto = plainToClass(CreatePatientDto, reqBody);
      await validateOrReject(createCustomerDto);

      const data = await this.customersService.create(createCustomerDto);
      return HandleResponse.buildSuccessObj(EC201, EM104, data);
    } catch (error) {
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(
          error.getStatus(),
          error.message,
          error,
        );
      }
      console.error('Create customer error:', error);
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }

@Get()
@ApiOperation({
  summary: 'Get all customers with pagination and filters (plain query only)',
})
@ApiResponse({ status: 200, description: 'Customers fetched successfully' })
@ApiResponse({ status: 400, description: 'Validation error' })
@ApiResponse({ status: 500, description: 'Internal server error' })
@ApiQuery({ name: 'pagNo', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
@ApiQuery({ name: 'searchText', required: false, type: String })
@ApiQuery({ name: 'branch', required: false, type: String })
@ApiQuery({ name: 'fromDate', required: false, type: String })
@ApiQuery({ name: 'toDate', required: false, type: String })
async findAll(@Query() queryParams: PaginationDto) {
  try {
    const paginationDto = plainToClass(PaginationDto, queryParams);
    await validateOrReject(paginationDto);

    if (paginationDto.pagNo && paginationDto.limit) {
      const { data, total } =
        await this.customersService.findAllWithPagination(
          paginationDto.pagNo,
          paginationDto.limit,
          {
            searchText: paginationDto.searchText,
            branch: paginationDto.branch,
            fromDate: paginationDto.fromDate,
            toDate: paginationDto.toDate,
          },
        );
      return HandleResponse.buildSuccessObj(EC200, EM106, { data, total });
    } else {
      const data = await this.customersService.findAll();
      return HandleResponse.buildSuccessObj(EC200, EM106, data);
    }
  } catch (error) {
    console.error('FindAll error:', error);
    if (error instanceof HttpException) {
      return HandleResponse.buildErrObj(
        error.getStatus(),
        error.message,
        error,
      );
    }
    return HandleResponse.buildErrObj(EC500, EM100, error);
  }
}


  // GET ONE
 @Get(':id')
@ApiOperation({ summary: 'Get patient by ID' })
@ApiParam({ name: 'id', required: true, type: String, example: 'a973e85c-c9d3-4566-b1a5-43b2ab61b614' })
@ApiResponse({ status: 200, description: 'Patient fetched successfully' })
@ApiResponse({ status: 400, description: 'Invalid ID or request format' })
@ApiResponse({ status: 500, description: 'Internal server error' })
async findOne(@Param('id') id: string) {
  try {
    const data = await this.customersService.findOne(id);
    return HandleResponse.buildSuccessObj(EC200, EM106, data);
  } catch (error) {
    console.error('FindOne error:', error);
    if (error instanceof HttpException) {
      return HandleResponse.buildErrObj(
        error.getStatus(),
        error.message,
        error,
      );
    }
    return HandleResponse.buildErrObj(EC500, EM100, error);
  }
}


@Patch(':id')
@ApiOperation({ summary: 'Update a patient by ID' })
@ApiParam({
  name: 'id',
  required: true,
  type: String,
  example: 'a973e85c-c9d3-4566-b1a5-43b2ab61b614',
})
@ApiBody({ type: UpdatePatientDto })
@ApiResponse({ status: 200, description: 'Patient updated successfully' })
@ApiResponse({ status: 400, description: 'Validation error or no fields provided' })
@ApiResponse({ status: 500, description: 'Internal server error' })
async update(
  @Param('id') id: string,
  @Body() reqBody: Partial<UpdatePatientDto>,
) {
  try {
    logger.info(`Patient_Update_Entry: id=${id}, rawBody=${JSON.stringify(reqBody)}`);

    // Transform to DTO & remove null/undefined automatically
    const dto = plainToClass(UpdatePatientDto, reqBody);

    // Check if any field is present
    if (Object.keys(dto).length === 0) {
      throw new HttpException('No fields provided to update', HttpStatus.BAD_REQUEST);
    }

    // Validate fields
    await validateOrReject(dto, { skipMissingProperties: true });

    // Perform update
    const data = await this.customersService.updatePatient(id, dto);

    logger.info(`Patient_Update_Exit: ${JSON.stringify(data)}`);
    return HandleResponse.buildSuccessObj(EC200, EM116, data);

  } catch (error) {
    logger.error(`Patient_Update_Error: ${error?.message || error}`);

    if (error instanceof HttpException) {
      return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
    }

    return HandleResponse.buildErrObj(EC500, EM100, error);
  }
}




// DELETE (Soft Delete)
@Delete(':id')
@ApiOperation({ summary: 'Soft delete a patient by ID' })
@ApiParam({
  name: 'id',
  required: true,
  type: String,
  example: 'a973e85c-c9d3-4566-b1a5-43b2ab61b614',
})
@ApiResponse({ status: 204, description: 'Patient soft deleted successfully' })
@ApiResponse({ status: 400, description: 'Invalid ID or input' })
@ApiResponse({ status: 500, description: 'Internal server error' })
async remove(@Param('id') id: string) {
  try {
    await this.customersService.removePatient(id);
    return HandleResponse.buildSuccessObj(EC204, EM127, null);
  } catch (error) {
    console.error('Delete error:', error);
    if (error instanceof HttpException) {
      return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
    }
    return HandleResponse.buildErrObj(EC500, EM100, error);
  }
}

}
