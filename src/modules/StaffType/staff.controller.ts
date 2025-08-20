// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   Query,
//   ParseIntPipe,
//   BadRequestException,
//   NotFoundException,
//   UseGuards,
//   Req,
  
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiBody,
//   ApiQuery,
//   ApiResponse,
//   ApiParam,
// } from '@nestjs/swagger';
// import { StaffService } from './staff.service';
// import { CreateStaffDto } from './dto/create-staff.dto';
// import { UpdateStaffDto } from './dto/update-staff.dto';
// import { StaffFilterDto } from './dto/staff-filter.dto';
// import HandleResponse from 'src/core/utils/handle_response';
// import {
//   EC200,
//   EC201,
//   EC204,
//   EC500,
//   EM100,
//   EM104,
//   EM106,
//   EM116,
//   EM127,
// } from 'src/core/constants';
// import { AES } from 'src/core/utils/encryption.util';
// import { validateOrReject  } from 'class-validator';
// import { plainToClass,plainToInstance } from 'class-transformer';
// import { Permissions } from 'src/common/decorators/permissions.decorator';
// import { PermissionGuard } from 'src/common/guards/permission.guard';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { AuthGuard } from '@nestjs/passport';
// import {  enc } from 'crypto-js';
// import * as CryptoJS from 'crypto-js';
// import { Between, ILike, FindManyOptions } from 'typeorm';
// import { Staff } from './entities/staff.entity';
// import { logger } from 'src/core/utils/logger';

// @ApiTags('Staff')
// @UseGuards(AuthGuard('jwt'), PermissionGuard, RolesGuard) // Protect all routes
// @Controller('staff')
// export class StaffController {
//   constructor(private readonly staffService: StaffService) {}

//   // CREATE
//   @Post()
//   @Permissions('create:staff')
//   @Roles('super-admin', 'branch-admin')
//   @ApiOperation({ summary: 'Create a new staff member' })
//   @ApiBody({ type: CreateStaffDto })
//   @ApiResponse({ status: 201, description: 'Staff created successfully', type: Staff })
//   @ApiResponse({ status: 403, description: 'Forbidden' })
//   async create(@Body() dto: CreateStaffDto): Promise<Staff> {
//   console.log('📥 Incoming DTO:', dto);
//   return this.staffService.create(dto);
// }
//   // GET ALL
//   @Get()
//   @Permissions('read:staff')
//   @Roles('super-admin', 'branch-admin')
//   @ApiOperation({ summary: 'Get all staff members' })
//   @ApiResponse({ status: 200, description: 'List of staff', type: [Staff] })
//   async findAll(): Promise<Staff[]> {
//     return this.staffService.findAll();
//   }

//   // GET BY ID
//   @Get(':key')
//   @Permissions('read:staff')
//   @Roles('super-admin', 'branch-admin')
//   @ApiOperation({ summary: 'Get a staff member by key' })
//   @ApiParam({ name: 'key', type: Number, description: 'Staff key' })
//   @ApiResponse({ status: 200, description: 'Staff found', type: Staff })
//   @ApiResponse({ status: 404, description: 'Staff not found' })
// async findOne(@Param('key', ParseIntPipe) key: number) {
//   return this.staffService.findOne(key);
// }


//   // PATCH / UPDATE
//   @Patch(':key')
//   @Permissions('update:staff')
//   @Roles('super-admin', 'branch-admin')
//   @ApiOperation({ summary: 'Update a staff member by key' })
//   @ApiParam({ name: 'key', type: Number })
//   @ApiBody({ type: UpdateStaffDto })
//   @ApiResponse({ status: 200, description: 'Staff updated successfully', type: Staff })
//   @ApiResponse({ status: 404, description: 'Staff not found' })
//   async update(
//     @Param('key', ParseIntPipe) key: number,
//     @Body() dto: UpdateStaffDto,
//   ): Promise<Staff> {
//     return this.staffService.update(key, dto);
//   }

//   // DELETE BY ID
//   @Delete(':key')
//   @Permissions('delete:staff')
//   @Roles('super-admin', 'branch-admin')
//   @ApiOperation({ summary: 'Delete a staff member by key' })
//   @ApiParam({ name: 'key', type: Number })
//   @ApiResponse({ status: 200, description: 'Staff deleted successfully' })
//   @ApiResponse({ status: 404, description: 'Staff not found' })
//   async remove(@Param('key', ParseIntPipe) key: number): Promise<{ deleted: boolean }> {
//     return this.staffService.remove(key);
//   }

//   // DELETE ALL
//   @Delete()
//   @Permissions('delete:staff')
//   @Roles('super-admin', 'branch-admin')
//   @ApiOperation({ summary: 'Delete all staff members' })
//   @ApiResponse({ status: 200, description: 'All staff deleted successfully' })
//   async removeAll(): Promise<{ deleted: boolean }> {
//     return this.staffService.removeAll();
//   }
// }
