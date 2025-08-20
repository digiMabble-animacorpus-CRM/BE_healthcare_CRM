import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { TeamMember } from './entities/team-member.entity';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiTags('team-members')
@Controller('team-members')
export class TeamMemberController {
  constructor(private readonly service: TeamMemberService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active (non-deleted) team members' })
  @ApiResponse({ status: 200, description: 'List of team members', type: [TeamMember] })
  findAll(): Promise<TeamMember[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team member by ID (only if not deleted)' })
  @ApiResponse({ status: 200, description: 'Team member found', type: TeamMember })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  findOne(@Param('id') id: string): Promise<TeamMember> {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new team member' })
  @ApiResponse({ status: 201, description: 'Team member created', type: TeamMember })
  create(@Body() data: CreateTeamMemberDto): Promise<TeamMember> {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update team member (partial)' })
  @ApiResponse({ status: 200, description: 'Team member updated', type: TeamMember })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  update(@Param('id') id: string, @Body() data: UpdateTeamMemberDto): Promise<TeamMember> {
    return this.service.update(id, data);
  }

  @Get('search')
@ApiOperation({ summary: 'Search team members by name, job, specialization, etc.' })
@ApiResponse({ status: 200, description: 'List of matching team members', type: [TeamMember] })
search(@Query('q') q: string): Promise<TeamMember[]> {
  return this.service.search(q);
}

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a team member' })
  @ApiResponse({ status: 200, description: 'Team member soft deleted' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted team member' })
  restore(@Param('id') id: string): Promise<TeamMember> {
    return this.service.restore(id);
  }
}
