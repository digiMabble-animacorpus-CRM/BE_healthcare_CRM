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
  Req,
  UseGuards,
 
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
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { BranchGuard } from 'src/common/guards/branch.guard';

@ApiTags('Patients')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard, BranchGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  // CREATE
  @Roles('super_admin', 'admin')
 @Permissions({ module: 'patients', action: 'create' })
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

      const data = await this.patientsService.create(createCustomerDto);
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
@ApiOperation({ summary: 'Get all patients (with branch RBAC)' })
async findAll(@Req() req, @Query() queryParams: PaginationDto) {
  try {
    const paginationDto = plainToClass(PaginationDto, queryParams);
    await validateOrReject(paginationDto);

    if (paginationDto.pagNo && paginationDto.limit) {
      const { data, total } =
        await this.patientsService.findAllWithPagination(
          paginationDto.pagNo,
          paginationDto.limit,
          {
            searchText: paginationDto.searchText,
            branch: paginationDto.branch,
            fromDate: paginationDto.fromDate,
            toDate: paginationDto.toDate,
          },
          req.user, // 👈 pass user context here
        );
      return HandleResponse.buildSuccessObj(EC200, EM106, { data, total });
    } else {
      const data = await this.patientsService.findAll(req.user); // 👈 RBAC applied
      return HandleResponse.buildSuccessObj(EC200, EM106, data);
    }
  } catch (error) {
    logger.error(`FindAll error: ${error?.message}`);
    return HandleResponse.buildErrObj(
      error instanceof HttpException ? error.getStatus() : EC500,
      error.message || EM100,
      error,
    );
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
    const data = await this.patientsService.findOne(id);
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



 @Get('find/:value')
  @ApiOperation({ summary: 'Get patient by ID, email, or phone' })
  @ApiParam({
    name: 'value',
    description: 'Patient ID (UUID), email, or phone number',
    example: 'a973e85c-c9d3-4566-b1a5-43b2ab61b614',
  })
  @ApiResponse({ status: 200, description: 'Patient fetched successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findPatient(@Param('value') value: string) {
    try {
      let patient;

      if (this.isUUID(value)) {
        patient = await this.patientsService.findOneByIdentifier({ id: value });
      } else if (value.includes('@')) {
        patient = await this.patientsService.findOneByIdentifier({ email: value });
      } else {
        patient = await this.patientsService.findOneByIdentifier({ phone: value });
      }

      return HandleResponse.buildSuccessObj(EC200, EM106, patient);
    } catch (error) {
      console.error('FindPatient error:', error);
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

  private isUUID(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }


  @Roles('super_admin', 'admin')
@Permissions({ module: 'patients', action: 'edit' })
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
    const data = await this.patientsService.updatePatient(id, dto);

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
  @Roles('super_admin')
@Permissions({ module: 'patients', action: 'delete' })
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
    await this.patientsService.removePatient(id);
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
