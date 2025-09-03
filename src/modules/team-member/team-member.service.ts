import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In ,DeepPartial} from 'typeorm';
import { TeamMember } from './entities/team-member.entity';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { Branch } from '../branches/entities/branch.entity';
import User from '../users/entities/user.entity';
import { TeamMemberRole, TeamMemberStatus } from './entities/team-member.entity';


@Injectable()
export class TeamMemberService {
  constructor(
    @InjectRepository(TeamMember)
    private readonly repo: Repository<TeamMember>,

    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /** Get all team members with optional branch filtering */
  async findAll(userCtx: { role: string; branches?: { branch_id: number }[] }): Promise<TeamMember[]> {
    const qb = this.repo.createQueryBuilder('tm')
      .leftJoinAndSelect('tm.branches', 'branch')
      .leftJoinAndSelect('tm.primary_branch', 'primaryBranch')
      .where('tm.is_delete = false');

    if (userCtx.role !== 'super_admin' && userCtx.branches?.length) {
      qb.andWhere('branch.branch_id IN (:...branchIds)', {
        branchIds: userCtx.branches.map(b => b.branch_id),
      });
    }

    return qb.getMany();
  }

  /** Get one team member with RBAC check */
  async findOne(id: string, userCtx: { role: string; branches?: { branch_id: number }[] }): Promise<TeamMember> {
    const member = await this.repo.findOne({
      where: { team_id: id, is_delete: false },
      relations: ['branches', 'primary_branch'],
    });

    if (!member) throw new NotFoundException(`Team member with ID ${id} not found`);

    if (
      userCtx.role !== 'super_admin' &&
      userCtx.branches?.length &&
      !member.branches?.some(b => userCtx.branches!.map(x => x.branch_id).includes(b.branch_id))
    ) {
      throw new ForbiddenException('You do not have access to this team member');
    }

    return member;
  }

  /** Create with RBAC and branch restriction */
async create(
  data: CreateTeamMemberDto,
  creator: { role: string; branches?: { branch_id: number }[] }
): Promise<TeamMember> {

  if (creator.role === 'staff') throw new ForbiddenException('Staff cannot create team members');
  if (creator.role === 'admin' && data.role === 'admin') throw new ForbiddenException('Admin cannot create another admin');

  // Load branches (ensure they exist)
  const branches = data.branches?.length
    ? await this.branchRepo.findBy({ branch_id: In(data.branches) })
    : [];

  const primaryBranch = data.primary_branch_id
    ? await this.branchRepo.findOneBy({ branch_id: data.primary_branch_id })
    : null;

const member = this.repo.create({
  ...data,
  branches,
  primary_branch: primaryBranch,
});
return this.repo.save(member);

}




  /** Update with RBAC */
async update(
  id: string,
  data: UpdateTeamMemberDto,
  updater: { role: string; branches?: { branch_id: number }[] }
): Promise<TeamMember> {
  const member = await this.findOne(id, updater);

  if (updater.role === 'staff') {
    throw new ForbiddenException('Staff cannot update team members');
  }
  if (updater.role === 'admin' && member.role === 'admin') {
    throw new ForbiddenException('Admin cannot update another admin');
  }

  // Handle branches
  if (data.branches !== undefined) {
    if (updater.role === 'admin') {
      const allowed = new Set((updater.branches || []).map(b => b.branch_id));
      if (!data.branches.every(id => allowed.has(id))) {
        throw new ForbiddenException('Admin can only assign their own branches');
      }
    }
    member.branches = data.branches.length
      ? await this.branchRepo.findBy({ branch_id: In(data.branches) })
      : [];
    delete (data as any).branches; // prevent overwrite
  }

  // Handle primary branch
  if (data.primary_branch_id !== undefined) {
    if (data.primary_branch_id === null) {
      member.primary_branch = null; // allow clearing
    } else {
      const pb = await this.branchRepo.findOneBy({ branch_id: data.primary_branch_id });
      if (!pb) throw new NotFoundException('Primary branch not found');
      member.primary_branch = pb;
    }
    delete (data as any).primary_branch_id; // prevent overwrite
  }

  Object.assign(member, data);
  return this.repo.save(member);
}


  /** Search with branch filtering */
  async search(query: string, userCtx: { role: string; branches?: { branch_id: number }[] }): Promise<TeamMember[]> {
    const where = [
      { first_name: ILike(`%${query}%`), is_delete: false },
      { last_name: ILike(`%${query}%`), is_delete: false },
      { full_name: ILike(`%${query}%`), is_delete: false },
      { job_1: ILike(`%${query}%`), is_delete: false },
      { job_2: ILike(`%${query}%`), is_delete: false },
      { job_3: ILike(`%${query}%`), is_delete: false },
      { job_4: ILike(`%${query}%`), is_delete: false },
      { specialization_1: ILike(`%${query}%`), is_delete: false },
      { office_address: ILike(`%${query}%`), is_delete: false },
      { contact_email: ILike(`%${query}%`), is_delete: false },
      { contact_phone: ILike(`%${query}%`), is_delete: false },
      { about: ILike(`%${query}%`), is_delete: false },
    ];

    const members = await this.repo.find({ where, relations: ['branches', 'primary_branch'] });

    if (userCtx.role !== 'super_admin') {
      const allowed = new Set((userCtx.branches || []).map(b => b.branch_id));
      return members.filter(m => m.branches?.some(b => allowed.has(b.branch_id)));
    }
    return members;
  }

/** Soft delete with RBAC */
async remove(
  id: string,
  userCtx: { role: string; branches?: { branch_id: number }[] }
): Promise<void> {
  const member = await this.findOne(id, userCtx);

  // RBAC restrictions
  if (userCtx.role === 'staff') {
    throw new ForbiddenException('Staff cannot delete team members');
  }
  if (userCtx.role === 'admin' && member.role === 'admin') {
    throw new ForbiddenException('Admin cannot delete another admin');
  }

  // Branch restriction for admins
  if (
    userCtx.role === 'admin' &&
    userCtx.branches?.length &&
    !member.branches?.some(b => userCtx.branches!.map(x => x.branch_id).includes(b.branch_id))
  ) {
    throw new ForbiddenException('Admin can only delete team members in their own branches');
  }

  // Soft delete
  member.is_delete = true;
  member.deleted_at = new Date();
  await this.repo.save(member);
}


/** Restore with RBAC */
async restore(
  id: string,
  userCtx: { role: string; branches?: { branch_id: number }[] }
): Promise<TeamMember> {
  const member = await this.repo.findOne({
    where: { team_id: id, is_delete: true },
    relations: ['branches', 'primary_branch'],
  });

  if (!member) {
    throw new NotFoundException(`Team member with ID ${id} not found or not deleted`);
  }

  // RBAC restrictions
  if (userCtx.role === 'staff') {
    throw new ForbiddenException('Staff cannot restore team members');
  }
  if (userCtx.role === 'admin' && member.role === 'admin') {
    throw new ForbiddenException('Admin cannot restore another admin');
  }

  // Branch restriction for admins
  if (
    userCtx.role === 'admin' &&
    userCtx.branches?.length &&
    !member.branches?.some(b =>
      userCtx.branches!.map(x => x.branch_id).includes(b.branch_id)
    )
  ) {
    throw new ForbiddenException('Admin can only restore team members in their own branches');
  }

  // Perform restore
  member.is_delete = false;
  member.deleted_at = null;
  return this.repo.save(member);
}


  /** Lookup by team_id (uuid in team_member_list) */
  async findByTeamId(teamId: string): Promise<TeamMember | null> {
    if (!teamId) return null;
    return this.repo.findOne({
      where: { team_id: teamId, is_delete: false },
      relations: ['branches', 'primary_branch'],
    });
  }

  /** Resolve team member by user_id (users.id → users.team_id → team_member_list.team_id) */
  async findByUserId(userId: string | number): Promise<TeamMember | null> {
    const u = await this.userRepo.findOne({
      where: { id: Number(userId) },
      // relation name is `team` in your entity, but we don't need to load it to get team_id
    });
    if (!u?.team_id) return null;
    return this.findByTeamId(u.team_id);
  }




  /** Resolve team member by user_id + team_id (JOIN users.team_id → team_member_list.team_id) */
// async findByUserIdAndTeamId(userId: number, teamId: string): Promise<TeamMember | null> {
//   if (!userId || !teamId) return null;

//   return this.repo
//     .createQueryBuilder('tm')
//     .innerJoin(User, 'u', 'u.team_id = tm.team_id')
//     .where('u.id = :userId', { userId })
//     .andWhere('tm.team_id = :teamId', { teamId })
//     .andWhere('tm.is_delete = false')
//     .leftJoinAndSelect('tm.branches', 'branch')
//     .leftJoinAndSelect('tm.primary_branch', 'primaryBranch')
//     .getOne();
// }


async findByUserIdAndTeamId(userId: number, teamId: string): Promise<TeamMember | null> {
  if (!userId || !teamId) return null;

  return this.repo.findOne({
    where: { team_id: teamId, is_delete: false },
    relations: ['branches', 'primary_branch','users'],
  });
}


}
