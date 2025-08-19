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
    // Only return non-deleted members
    return this.repo.find({
      where: { is_delete: false },
    });
  }

  async findOne(id: string): Promise<TeamMember> {
    const member = await this.repo.findOne({
      where: { team_id: id, is_delete: false },
    });
    if (!member) throw new NotFoundException(`Team member with ID ${id} not found`);
    return member;
  }

  async create(data: CreateTeamMemberDto): Promise<TeamMember> {
    const member = this.repo.create(data);
    return this.repo.save(member);
  }

  async update(id: string, data: UpdateTeamMemberDto): Promise<TeamMember> {
    const member = await this.findOne(id); // ensures record exists & not deleted
    Object.assign(member, data);
    return this.repo.save(member);
  }

  async remove(id: string): Promise<void> {
    const member = await this.findOne(id);
    member.is_delete = true;
    member.deleted_at = new Date();
    await this.repo.save(member);
  }

  // Optional: Restore soft-deleted record
  async restore(id: string): Promise<TeamMember> {
    const member = await this.repo.findOne({ where: { team_id: id, is_delete: true } });
    if (!member) throw new NotFoundException(`Team member with ID ${id} not found or not deleted`);
    member.is_delete = false;
    member.deleted_at = null;
    return this.repo.save(member);
  }
}
