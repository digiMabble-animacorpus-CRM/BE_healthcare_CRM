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
  BadRequestException,
  NotFoundException,
  UseGuards,
  Req,
  
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffFilterDto } from './dto/staff-filter.dto';
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
import { AES } from 'src/core/utils/encryption.util';
import { validateOrReject  } from 'class-validator';
import { plainToClass,plainToInstance } from 'class-transformer';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import {  enc } from 'crypto-js';
import * as CryptoJS from 'crypto-js';
import { Between, ILike, FindManyOptions } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { logger } from 'src/core/utils/logger';



@ApiTags('Staff')
@UseGuards(AuthGuard('jwt'),PermissionGuard, RolesGuard) //  Apply both guards globally
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

@Post()
@UseGuards(AuthGuard('jwt'), PermissionGuard, RolesGuard)
@Permissions('create:staff')
@Roles('super-admin', 'branch-admin')
@ApiOperation({ summary: 'Create a new staff' })
@ApiBody({ type: CreateStaffDto })
async create(@Body() body: CreateStaffDto, @Req() req) {
  logger.debug('Incoming staff body:', body);
  logger.debug('Current user role:', req.user?.user_type);

  try {
    // Step 1: Validate DTO (ensures no partial/bad data)
    await validateOrReject(body);

    // Step 2: Pass to service
    const createdStaff = await this.staffService.createStaff(body, req.user);

    return HandleResponse.buildSuccessObj(EC201, EM104, createdStaff);
  } catch (error) {
    logger.error('Staff Create Error:', error);
    return HandleResponse.buildErrObj(
      error.status || EC500,
      EM100,
      error.message || error,
    );
  }
}


@Get()
@Permissions('read:staff')
@Roles('super-admin', 'branch-admin')
@ApiOperation({ summary: 'Get all staff' })
@ApiQuery({ name: 'page', required: false, description: 'Page number' })
@ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
@ApiQuery({ name: 'branch', required: false, description: 'Branch ID' })
@ApiQuery({ name: 'from', required: false, description: 'Start date' })
@ApiQuery({ name: 'to', required: false, description: 'End date' })
@ApiQuery({ name: 'search', required: false, description: 'Search text' })
async findAll(
  @Query('page') page: string,
  @Query('limit') limit: string,
  @Query('branch') branch?: string,
  @Query('from') from?: string,
  @Query('to') to?: string,
  @Query('search') search?: string,
) {
  try {
    //  Decrypt the input query

    // const where: any = { is_deleted: false };

    // if (branch) {
    //   where.selected_branch = { id: branch };
    // }

    // if (from && to) {
    //   where.created_at = Between(new Date(from), new Date(to));
    // }

    // if (search) {
    //   where.name = ILike(`%${search}%`);
    // }

   const filterDto: StaffFilterDto = {
      page: page || '1',
      limit: limit || '10',
      searchText: search,
      branch,
      fromDate: from,
      toDate: to,
    };

const { data, total } = await this.staffService.findAllWithFilters(filterDto);

      return {
      status: true,
      totalCount: total,
      data,
    };

  } catch (error) {
    console.error('StaffController Decrypt Error:', error);
    throw new BadRequestException('Invalid encrypted query or bad format');
  }
}



@Get(':id')
@UseGuards(AuthGuard('jwt'), PermissionGuard, RolesGuard)
@Permissions('read:staff')
@Roles('super-admin', 'branch-admin')
@ApiOperation({ summary: 'Get staff by ID' })
@ApiParam({ name: 'id', type: Number, description: 'Staff ID' })
async findOne(@Param('id') id: string) {
  try {
    logger.debug(` Staff ID received: ${id}`);

    const numericId = Number(id);
    if (!numericId || isNaN(numericId)) {
      logger.warn(` Invalid staff ID: "${id}"`);
      throw new BadRequestException('Invalid staff ID');
    }

    logger.debug(` Searching for staff with ID: ${numericId}`);
    const staff = await this.staffService.findOne(numericId);

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    logger.debug(` Staff fetched: ${JSON.stringify(staff)}`);
    return HandleResponse.buildSuccessObj(EC200, EM106, staff);

  } catch (error) {
    logger.error(` Error in findOne: ${error.message}`);
    return HandleResponse.buildErrObj(
      error.status || EC500,
      error.message || EM100,
      [],
    );
  }
}




@Patch(':id')
@UseGuards(AuthGuard('jwt'), PermissionGuard, RolesGuard)
@Permissions('update:staff')
@Roles('super-admin', 'branch-admin')
@ApiOperation({ summary: 'Update a staff member by encrypted ID (AES)' })
@ApiParam({ name: 'id', type: String, description: 'AES Encrypted Staff ID' })
async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateStaffDto) {
  try {
    // Validate input
    await validateOrReject(body);

    const data = await this.staffService.updateStaff(id, body);
    return HandleResponse.buildSuccessObj(EC200, EM116, data);
  } catch (error) {
    console.error('Staff Update Error:', error);
    return HandleResponse.buildErrObj(
      error.status || EC500,
      EM100,
      error.message || error,
    );
  }
}


  @Delete(':id')
  @UseGuards(AuthGuard('jwt'),PermissionGuard, RolesGuard)
  @Permissions('delete:staff')
  @Roles('super-admin') // Only super-admin can delete
  @ApiOperation({ summary: 'Soft delete staff' })
  @ApiParam({ name: 'id', type: Number })
async remove(@Param('id', ParseIntPipe) id: number) {
  try {
    await this.staffService.removeStaff(id);
    return HandleResponse.buildSuccessObj(EC204, EM127, null);
  } catch (error) {
    return HandleResponse.buildErrObj(
      error.status || EC500,
      EM100,
      error.message || error,
    );
  }
}
}
