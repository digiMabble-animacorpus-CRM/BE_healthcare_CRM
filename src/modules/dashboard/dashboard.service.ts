import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Therapist } from 'src/modules/therapist/entities/therapist.entity';
import  Appointment  from 'src/modules/appointment/entities/appointment.entity';
import { Patient } from 'src/modules/customers/entities/patient.entity';

import { TeamMemberService } from 'src/modules/team-member/team-member.service';
import { BranchSummaryDto } from './dto/branch-summary.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
    @InjectRepository(Therapist) private readonly therapistRepo: Repository<Therapist>,
    @InjectRepository(Appointment) private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>, // not directly used but kept for clarity
    private readonly teamMemberService: TeamMemberService,
  ) {}

  private getMonthWindow() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { startOfMonth, nextMonthStart };
  }

  /** Main API for branch-wise summary restricted by the logged-in user */
  async getBranchesSummaryForUser(user: {
    user_id?: number;
    id?: number;
    role: string;              // 'super_admin' | 'admin' | 'staff'
    team_id?: string;
  }): Promise<BranchSummaryDto[]> {
    const userId = (user.user_id ?? user.id) as number | undefined;
    if (!userId) throw new ForbiddenException('Missing user id in token');

    const teamMember = await this.teamMemberService.findByUserId(userId);
    if (!teamMember) throw new ForbiddenException('No team member mapped to user');

    // Resolve allowed branches
    let branchRows: { branch_id: number; name: string }[];
    if (user.role === 'super_admin') {
      const all = await this.branchRepo.find({ select: ['branch_id', 'name'] as any });
      branchRows = all.map(b => ({ branch_id: (b as any).branch_id, name: (b as any).name }));
    } else {
      const allowed = teamMember.branches || [];
      if (!allowed.length) return []; // no branches assigned → nothing to show
      branchRows = allowed.map(b => ({ branch_id: b.branch_id, name: b.name }));
    }

    const branchIds = branchRows.map(b => b.branch_id);
    if (!branchIds.length) return [];

    // ---- Aggregate queries (efficient) ----
    // 1) Therapists per branch (use the M:M join table + therapists.isDelete = false)
    //    SELECT b.branch_id, COUNT(DISTINCT t.therapist_id)
    const therapistCountsRaw = await this.therapistRepo
      .createQueryBuilder('t')
      .innerJoin('t.branches', 'b') // via therapist_branches
      .where('t.isDelete = false')
      .andWhere('b.branch_id IN (:...branchIds)', { branchIds })
      .select('b.branch_id', 'branch_id')
      .addSelect('COUNT(DISTINCT t.therapistId)', 'count')
      .groupBy('b.branch_id')
      .getRawMany<{ branch_id: number; count: string }>();

    // 2) Distinct patients per branch (derive from appointments)
    //    SELECT b.branch_id, COUNT(DISTINCT p.id)
    const patientCountsRaw = await this.appointmentRepo
      .createQueryBuilder('a')
      .innerJoin('a.branch', 'b')
      .innerJoin('a.patient', 'p')
      .where('b.branch_id IN (:...branchIds)', { branchIds })
      .select('b.branch_id', 'branch_id')
      .addSelect('COUNT(DISTINCT p.id)', 'count')
      .groupBy('b.branch_id')
      .getRawMany<{ branch_id: number; count: string }>();

    // 3) Appointments this month per branch
    const { startOfMonth, nextMonthStart } = this.getMonthWindow();
    const apptMonthCountsRaw = await this.appointmentRepo
      .createQueryBuilder('a')
      .innerJoin('a.branch', 'b')
      .where('b.branch_id IN (:...branchIds)', { branchIds })
      .andWhere('a.startTime >= :startOfMonth AND a.startTime < :nextMonthStart', {
        startOfMonth,
        nextMonthStart,
      })
      .select('b.branch_id', 'branch_id')
      .addSelect('COUNT(*)', 'count')
      .groupBy('b.branch_id')
      .getRawMany<{ branch_id: number; count: string }>();

    // ---- Map raw results to dictionaries for quick lookup ----
    const toMap = (rows: { branch_id: number; count: string }[]) =>
      rows.reduce<Record<number, number>>((acc, r) => {
        acc[r.branch_id] = Number(r.count) || 0;
        return acc;
      }, {});

    const therapistByBranch = toMap(therapistCountsRaw);
    const patientByBranch   = toMap(patientCountsRaw);
    const apptByBranch      = toMap(apptMonthCountsRaw);

    // ---- Merge with branch list to ensure every branch appears ----
    const response: BranchSummaryDto[] = branchRows.map(b => ({
      branch_id: b.branch_id,
      branch_name: b.name,
      therapists_count: therapistByBranch[b.branch_id] ?? 0,
      patients_count: patientByBranch[b.branch_id] ?? 0,
      appointments_count: apptByBranch[b.branch_id] ?? 0,
    }));

    return response;
  }
}
