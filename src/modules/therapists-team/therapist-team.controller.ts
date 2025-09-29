import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { TherapistTeamService } from './therapist-team.service';
import { CreateTherapistMemberDto } from './dto/create-therapist-team.dto';
import { UpdateTherapistTeamDto } from 'src/modules/therapists-team/dto/update-therapiist-team.dto';
import { TherapistTeamFilterDto } from './dto/therapist-team-filter.dto';
import { TherapistMember } from 'src/modules/therapists-team/entities/therapist-team.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { BranchGuard } from 'src/common/guards/branch.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiTags('Therapist Team Members')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard, BranchGuard)
@Controller('therapist-team')
export class TherapistTeamController {
  constructor(private readonly therapistService: TherapistTeamService) {}

  @Post()
  @Roles('super_admin', 'admin')
  @Permissions({ module: 'therapists', action: 'create' })
  @ApiOperation({ summary: 'Create a new therapist team member' })
  @ApiBody({ type: CreateTherapistMemberDto })
  @ApiResponse({ status: 201, description: 'Therapist member created successfully', type: TherapistMember })
  create(@Body() dto: CreateTherapistMemberDto) {
    return this.therapistService.create(dto);
  }

  @Get()
  @Roles('super_admin', 'admin', 'staff')
  @Permissions({ module: 'therapists', action: 'view' })
  @ApiOperation({ summary: 'Get all therapist team members with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'searchText', required: false, type: String, description: 'Search by name or email' })
  @ApiQuery({ name: 'departmentIds', required: false, type: [Number], description: 'Filter by department IDs' })
  @ApiQuery({ name: 'branchIds', required: false, type: [Number], description: 'Filter by branch IDs' })
  @ApiResponse({ status: 200, description: 'List of therapist members', type: [TherapistMember] })
  findAll(@Query() filter: TherapistTeamFilterDto) {
    return this.therapistService.findAll(filter);
  }

  @Get(':id')
  @Roles('super_admin', 'admin', 'staff')
  @Permissions({ module: 'therapists', action: 'view' })
  @ApiOperation({ summary: 'Get a therapist team member by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Therapist member ID' })
  @ApiResponse({ status: 200, description: 'Therapist member found', type: TherapistMember })
  @ApiResponse({ status: 404, description: 'Therapist member not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.therapistService.findOne(id);
  }

  @Patch(':id')
  @Roles('super_admin', 'admin')
  @Permissions({ module: 'therapists', action: 'edit' })
  @ApiOperation({ summary: 'Partially update a therapist team member' })
  @ApiParam({ name: 'id', type: Number, description: 'Therapist member ID' })
  @ApiBody({ type: UpdateTherapistTeamDto })
  @ApiResponse({ status: 200, description: 'Therapist member updated successfully', type: TherapistMember })
  @ApiResponse({ status: 404, description: 'Therapist member not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTherapistTeamDto) {
    return this.therapistService.update(id, dto);
  }

  @Delete(':id')
   @Roles('super_admin')
   @Permissions({ module: 'therapists', action: 'delete' })
  @ApiOperation({ summary: 'Soft delete a therapist team member' })
  @ApiParam({ name: 'id', type: Number, description: 'Therapist member ID' })
  @ApiResponse({ status: 200, description: 'Therapist member deleted successfully' })
  @ApiResponse({ status: 404, description: 'Therapist member not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.therapistService.remove(id);
  }
}
