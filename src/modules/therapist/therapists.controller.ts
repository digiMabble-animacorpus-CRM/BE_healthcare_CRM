import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TherapistService } from './therapists.service';
import { CreateTherapistDto } from './dto/create-therapist.dto';
import { UpdateTherapistDto } from './dto/update-therapist.dto';
import { TherapistFilterDto } from './dto/therapist-filter.dto';
import { Therapist } from './entities/therapist.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { BranchGuard } from 'src/common/guards/branch.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';


@ApiTags('Therapists')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard, BranchGuard)
@Controller('therapists')
export class TherapistController {
  constructor(private readonly therapistService: TherapistService) {}

  // CREATE
    @Post()
    @Roles('super_admin', 'admin')
  @Permissions({ module: 'therapists', action: 'create' })
  @ApiOperation({ summary: 'Create a new therapist' })
  @ApiBody({ type: CreateTherapistDto })
  @ApiResponse({ status: 201, description: 'Therapist created successfully', type: Therapist })
  async create(@Body() dto: CreateTherapistDto): Promise<Therapist> {
    return this.therapistService.create(dto);
  }

  // GET ALL WITH FILTERS
  @Get()
    @Roles('super_admin', 'admin', 'staff')
  @Permissions({ module: 'therapists', action: 'view' })
  @ApiOperation({ summary: 'Get all therapists with optional filters' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiQuery({ name: 'searchText', required: false, example: 'John' })
  @ApiQuery({ name: 'branch', required: false, example: 'Main Clinic' })
  @ApiQuery({ name: 'departmentId', required: false, example: 1 })
  @ApiQuery({ name: 'specializationIds', required: false, isArray: true, type: Number, example: [2, 3] })
  @ApiQuery({ name: 'languageNames', required: false, isArray: true, type: String, example: ['English', 'French'] })
  @ApiQuery({ name: 'fromDate', required: false, example: '2025-07-01' })
  @ApiQuery({ name: 'toDate', required: false, example: '2025-07-31' })
  @ApiResponse({ status: 200, description: 'List of therapists', type: [Therapist] })
  async findAll(@Query() filter: TherapistFilterDto): Promise<Therapist[]> {
    return this.therapistService.findAll(filter);
  }

  // SEARCH
  @Get('search')
    @Roles('super_admin', 'admin', 'staff')
  @Permissions({ module: 'therapists', action: 'view' })
  @ApiOperation({ summary: 'Search therapists by name, specialization, language, etc.' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search keyword (name, specialization, language, etc.)',
    example: 'psychologist',
  })
  @ApiResponse({ status: 200, description: 'List of therapists matching search criteria', type: [Therapist] })
  async search(@Query('q') q: string): Promise<Therapist[]> {
    if (!q) return [];
    return this.therapistService.search(q);
  }

  // GET BY ID
  @Get(':id')
    @Roles('super_admin', 'admin', 'staff')
  @Permissions({ module: 'therapists', action: 'view' })
  @ApiOperation({ summary: 'Get a therapist by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Therapist ID' })
  @ApiResponse({ status: 200, description: 'Therapist found', type: Therapist })
  @ApiResponse({ status: 404, description: 'Therapist not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Therapist> {
    return this.therapistService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
    @Roles('super_admin', 'admin')
  @Permissions({ module: 'therapists', action: 'edit' })
  @ApiOperation({ summary: 'Update a therapist by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTherapistDto })
  @ApiResponse({ status: 200, description: 'Therapist updated successfully', type: Therapist })
  @ApiResponse({ status: 404, description: 'Therapist not found' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTherapistDto): Promise<Therapist> {
    return this.therapistService.update(id, dto);
  }

  // DELETE BY ID
  @Delete(':id')
   @Roles('super_admin')
  @Permissions({ module: 'therapists', action: 'delete' })
  @ApiOperation({ summary: 'Soft delete a therapist by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Therapist deleted successfully' })
  @ApiResponse({ status: 404, description: 'Therapist not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: boolean }> {
    return this.therapistService.remove(id);
  }

  // RESTORE SOFT-DELETED
  @Patch(':id/restore')
    @Roles('super_admin')
  @Permissions({ module: 'therapists', action: 'edit' })
  @ApiOperation({ summary: 'Restore a soft-deleted therapist' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Therapist restored successfully', type: Therapist })
  @ApiResponse({ status: 404, description: 'Therapist not found or not deleted' })
  async restore(@Param('id', ParseIntPipe) id: number): Promise<Therapist> {
    return this.therapistService.restore(id);
  }
}
