import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { TeamMember } from './entities/team-member.entity';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { BranchGuard } from 'src/common/guards/branch.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiTags('team-members')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard, BranchGuard)
@Controller('team-members')
export class TeamMemberController {
  constructor(private readonly service: TeamMemberService) {}

  @Get()
    @Roles('super_admin', 'admin', 'staff')
  @Permissions({ module: 'team_member', action: 'view' })
  @ApiOperation({ summary: 'Get all active (non-deleted) team members' })
  @ApiResponse({ status: 200, description: 'List of team members', type: [TeamMember] })
  findAll(@Req() req): Promise<TeamMember[]> {
    // Could filter by branch if user is Admin/Staff
    return this.service.findAll(req.user);
  }

  @Get(':id')
    @Roles('super_admin', 'admin', 'staff')
  @Permissions({ module: 'team_member', action: 'view' })
  @ApiOperation({ summary: 'Get team member by ID (only if not deleted)' })
  @ApiResponse({ status: 200, description: 'Team member found', type: TeamMember })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  findOne(@Param('id') id: string, @Req() req): Promise<TeamMember> {
    return this.service.findOne(id, req.user);
  }

  @Post()
@Roles('super_admin', 'admin')
 @Permissions({ module: 'team_member', action: 'create' })
  @ApiOperation({ summary: 'Create a new team member' })
  @ApiResponse({ status: 201, description: 'Team member created', type: TeamMember })
  create(@Body() data: CreateTeamMemberDto, @Req() req): Promise<TeamMember> {
    return this.service.create(data, req.user);
  }

  @Patch(':id')
  @Roles('super_admin', 'admin')
  @Permissions({ module: 'team_member', action: 'edit' })
  @ApiOperation({ summary: 'Update team member (partial)' })
  @ApiResponse({ status: 200, description: 'Team member updated', type: TeamMember })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  update(@Param('id') id: string, @Body() data: UpdateTeamMemberDto, @Req() req): Promise<TeamMember> {
    return this.service.update(id, data, req.user);
  }

  @Get('search')
    @Roles('super_admin', 'admin', 'staff')
  @Permissions({ module: 'team_member', action: 'view' })
  @ApiOperation({ summary: 'Search team members by name, job, specialization, etc.' })
  @ApiResponse({ status: 200, description: 'List of matching team members', type: [TeamMember] })
  search(@Query('q') q: string, @Req() req): Promise<TeamMember[]> {
    return this.service.search(q, req.user);
  }

  @Delete(':id')
  @Roles('super_admin')
  @Permissions({ module: 'team_member', action: 'delete' })
  @ApiOperation({ summary: 'Soft delete a team member' })
  @ApiResponse({ status: 200, description: 'Team member soft deleted' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  remove(@Param('id') id: string, @Req() req): Promise<void> {
    return this.service.remove(id, req.user);
  }

  @Patch(':id/restore')
@Roles('super_admin')
  @Permissions({ module: 'team_member', action: 'edit' })
  @ApiOperation({ summary: 'Restore a soft-deleted team member' })
  restore(@Param('id') id: string, @Req() req): Promise<TeamMember> {
    return this.service.restore(id, req.user);
  }
}
