import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
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
  @ApiOperation({ summary: 'Get all team members' })
  @ApiResponse({ status: 200, description: 'List of team members', type: [TeamMember] })
  findAll(): Promise<TeamMember[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team member by ID' })
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team member' })
  @ApiResponse({ status: 200, description: 'Team member deleted' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
