import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember } from './entities/team-member.entity';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

@Injectable()
export class TeamMemberService {
  constructor(
    @InjectRepository(TeamMember)
    private repo: Repository<TeamMember>,
  ) {}

  async findAll(): Promise<TeamMember[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<TeamMember> {
    const member = await this.repo.findOneBy({ team_id: id });
    if (!member) throw new NotFoundException(`Team member with ID ${id} not found`);
    return member;
  }

  async create(data: CreateTeamMemberDto): Promise<TeamMember> {
    const member = this.repo.create(data);
    return this.repo.save(member);
  }

  async update(id: string, data: UpdateTeamMemberDto): Promise<TeamMember> {
    const member = await this.findOne(id); // ensures record exists
    Object.assign(member, data);
    return this.repo.save(member);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete({ team_id: id });
    if (result.affected === 0) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }
  }
}
