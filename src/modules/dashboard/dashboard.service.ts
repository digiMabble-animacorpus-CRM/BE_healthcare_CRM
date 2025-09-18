import { Injectable, HttpException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In ,Between , Not} from 'typeorm';
import { logger } from 'src/core/utils/logger';
import { EC500, EM100 } from 'src/core/constants';
import Appointment from '../appointment/entities/appointment.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Therapist } from 'src/modules/therapist/entities/therapist.entity';
import { Patient } from 'src/modules/customers/entities/patient.entity';
import { TeamMemberService } from 'src/modules/team-member/team-member.service';
import { DashboardQueryDto, DistributionQueryDto } from './dto/dashboard-query.dto';
import { BranchSummaryDto } from './dto/branch-summary.dto';
import { 
  AppointmentStats, 
  AppointmentDistribution, 
  CalendarEvent
} from './interfaces/dashboard.interface';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
    @InjectRepository(Therapist) private readonly therapistRepo: Repository<Therapist>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    private readonly teamMemberService: TeamMemberService,
  ) {}

  /**
   * Handles errors, logs them, and throws a standardized HttpException.
   */
  private handleError(operation: string, error: any): never {
    logger.error(`Dashboard_${operation}_Error: ${JSON.stringify(error?.message || error)}`);
    if (error instanceof HttpException) throw error;
    throw new HttpException(EM100, EC500);
  }

  private getMonthWindow() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { startOfMonth, nextMonthStart };
  }

  /**
   * Calculate date range based on time filter preset
   */
  private getDateRangeFromTimeFilter(timeFilter: string): { startDate: Date; endDate: Date } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (timeFilter) {
      case 'thisWeek': {
        const dayOfWeek = today.getDay();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek); // Start of week (Sunday)
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)
        endDate.setHours(23, 59, 59, 999);
        return { startDate, endDate };
      }
      
      case 'lastWeek': {
        const dayOfWeek = today.getDay();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek - 7); // Start of last week
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // End of last week
        endDate.setHours(23, 59, 59, 999);
        return { startDate, endDate };
      }
      
      case 'thisMonth': {
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        return { startDate, endDate };
      }
      
      case 'lastMonth': {
        const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        endDate.setHours(23, 59, 59, 999);
        return { startDate, endDate };
      }
      
      default:
        return null;
    }
  }

  /**
   * Apply date filters to query, prioritizing timeFilter over custom dates
   */
  private applyDateFilters(query: any, dashboardQuery: DashboardQueryDto): any {
    if (dashboardQuery.timeFilter) {
      const dateRange = this.getDateRangeFromTimeFilter(dashboardQuery.timeFilter);
      if (dateRange) {
        query.andWhere('a.startTime >= :startDate', { startDate: dateRange.startDate });
        query.andWhere('a.endTime <= :endDate', { endDate: dateRange.endDate });
      }
    } else {
      if (dashboardQuery.startDate) {
        query.andWhere('a.startTime >= :startDate', { startDate: new Date(dashboardQuery.startDate) });
      }
      if (dashboardQuery.endDate) {
        query.andWhere('a.endTime <= :endDate', { endDate: new Date(dashboardQuery.endDate) });
      }
    }
    return query;
  }

  /**
   * Get appointment statistics for dashboard summary cards
   */
  async getAppointmentStats(query: DashboardQueryDto): Promise<AppointmentStats> {
    try {
      logger.info(`Dashboard_GetAppointmentStats_Entry: ${JSON.stringify(query)}`);

      let statsQuery = this.appointmentRepository.createQueryBuilder('a');

      // Apply date filters (timeFilter takes priority over custom dates)
      statsQuery = this.applyDateFilters(statsQuery, query);

      if (query.doctorId) {
        statsQuery
          .leftJoin('a.therapist', 'therapist')
          .andWhere('therapist.therapistId = :doctorId', { doctorId: query.doctorId });
      }

      if (query.branchId) {
        statsQuery
          .leftJoin('a.branch', 'branch')
          .andWhere('branch.branch_id = :branchId', { branchId: query.branchId });
      }

      // Get total count
      const total = await statsQuery.getCount();

      // Build status counts query with same filters
      let statusQuery = this.appointmentRepository
        .createQueryBuilder('a')
        .select('a.status', 'status')
        .addSelect('COUNT(*)', 'count');

      // Apply the same filters for status counts
      statusQuery = this.applyDateFilters(statusQuery, query);

      if (query.doctorId) {
        statusQuery
          .leftJoin('a.therapist', 'therapist')
          .andWhere('therapist.therapistId = :doctorId', { doctorId: query.doctorId });
      }

      if (query.branchId) {
        statusQuery
          .leftJoin('a.branch', 'branch')
          .andWhere('branch.branch_id = :branchId', { branchId: query.branchId });
      }

      const statusCounts = await statusQuery
        .groupBy('a.status')
        .getRawMany();

      const completed = statusCounts.find(sc => sc.status === 'completed')?.count || 0;
      const cancellations = statusCounts.find(sc => sc.status === 'cancelled')?.count || 0;
      const pending = statusCounts.find(sc => sc.status === 'pending')?.count || 0;

      const result: AppointmentStats = {
        total: parseInt(total.toString()),
        completed: parseInt(completed.toString()),
        cancellations: parseInt(cancellations.toString()),
        pending: parseInt(pending.toString())
      };

      logger.info(`Dashboard_GetAppointmentStats_Exit: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.handleError('GetAppointmentStats', error);
    }
  }

  /**
   * Get appointment distribution for charts and breakdown cards
   */
  async getAppointmentDistribution(query: DistributionQueryDto): Promise<AppointmentDistribution> {
    try {
      logger.info(`Dashboard_GetAppointmentDistribution_Entry: ${JSON.stringify(query)}`);

      const groupBy = query.groupBy || 'doctor';
      
      let distributionQuery = this.appointmentRepository.createQueryBuilder('a');

      if (groupBy === 'doctor') {
        distributionQuery = distributionQuery
          .leftJoin('a.therapist', 'therapist')
          .select('therapist.therapistId', 'id')
          .addSelect('therapist.fullName', 'name')
          .addSelect('COUNT(*)', 'count');
      } else {
        distributionQuery = distributionQuery
          .leftJoin('a.branch', 'branch')
          .select('branch.branch_id', 'id')
          .addSelect('branch.name', 'name')
          .addSelect('COUNT(*)', 'count');
      }

      // Apply date filters (timeFilter takes priority over custom dates)
      distributionQuery = this.applyDateFilters(distributionQuery, query);

      if (query.doctorId && groupBy !== 'doctor') {
        distributionQuery.andWhere('therapist.therapistId = :doctorId', { doctorId: query.doctorId });
      }

      if (query.branchId && groupBy !== 'branch') {
        distributionQuery.andWhere('branch.branch_id = :branchId', { branchId: query.branchId });
      }

      if (groupBy === 'doctor') {
        distributionQuery = distributionQuery.groupBy('therapist.therapistId, therapist.fullName');
      } else {
        distributionQuery = distributionQuery.groupBy('branch.branch_id, branch.name');
      }

      const distribution = await distributionQuery
        .orderBy('count', 'DESC')
        .getRawMany();

      const totalAppointments = distribution.reduce((sum, item) => sum + parseInt(item.count), 0);

      const distributionWithPercentage = distribution.map(item => ({
        id: parseInt(item.id),
        name: item.name,
        count: parseInt(item.count),
        percentage: totalAppointments > 0 ? Math.round((parseInt(item.count) / totalAppointments) * 100 * 10) / 10 : 0
      }));

      const result: AppointmentDistribution = {
        totalAppointments,
        distribution: distributionWithPercentage
      };

      logger.info(`Dashboard_GetAppointmentDistribution_Exit: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.handleError('GetAppointmentDistribution', error);
    }
  }

  /**
   * Get appointments for calendar view
   */
  async getCalendarEvents(query: DashboardQueryDto): Promise<CalendarEvent[]> {
    try {
      logger.info(`Dashboard_GetCalendarEvents_Entry: ${JSON.stringify(query)}`);

      let calendarQuery = this.appointmentRepository.createQueryBuilder('a')
        .leftJoinAndSelect('a.therapist', 'therapist')
        .leftJoinAndSelect('a.branch', 'branch')
        .leftJoinAndSelect('a.patient', 'patient');

      // Apply date filters (timeFilter takes priority over custom dates)
      calendarQuery = this.applyDateFilters(calendarQuery, query);

      if (query.doctorId) {
        calendarQuery.andWhere('therapist.therapistId = :doctorId', { doctorId: query.doctorId });
      }

      if (query.branchId) {
        calendarQuery.andWhere('branch.branch_id = :branchId', { branchId: query.branchId });
      }

      const appointments = await calendarQuery
        .orderBy('a.startTime', 'ASC')
        .getMany();

      const events: CalendarEvent[] = appointments.map(appointment => ({
        id: appointment.id,
        title: appointment.purposeOfVisit || 'Appointment', // Simple title or use purpose
        start: appointment.startTime,
        end: appointment.endTime,
        status: appointment.status,
        doctor: {
          id: appointment.therapist.therapistId,
          name: appointment.therapist.fullName || `${appointment.therapist.firstName} ${appointment.therapist.lastName}`
        },
        branch: {
          id: appointment.branch.branch_id,
          name: appointment.branch.name
        },
        patient: appointment.patient ? {
          id: appointment.patient.id,
          name: `${appointment.patient.firstname} ${appointment.patient.lastname}`
        } : undefined
      }));

      logger.info(`Dashboard_GetCalendarEvents_Exit: Found ${events.length} events`);
      return events;
    } catch (error) {
      this.handleError('GetCalendarEvents', error);
    }
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


    const therapistCountsRaw = await this.therapistRepo
      .createQueryBuilder('t')
      .innerJoin('t.branches', 'b') 
      .where('t.isDelete = false')
      .andWhere('b.branch_id IN (:...branchIds)', { branchIds })
      .select('b.branch_id', 'branch_id')
      .addSelect('COUNT(DISTINCT t.therapistId)', 'count')
      .groupBy('b.branch_id')
      .getRawMany<{ branch_id: number; count: string }>();


    const patientCountsRaw = await this.appointmentRepository
      .createQueryBuilder('a')
      .innerJoin('a.branch', 'b')
      .innerJoin('a.patient', 'p')
      .where('b.branch_id IN (:...branchIds)', { branchIds })
      .select('b.branch_id', 'branch_id')
      .addSelect('COUNT(DISTINCT p.id)', 'count')
      .groupBy('b.branch_id')
      .getRawMany<{ branch_id: number; count: string }>();


    const { startOfMonth, nextMonthStart } = this.getMonthWindow();
    const apptMonthCountsRaw = await this.appointmentRepository
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


    const toMap = (rows: { branch_id: number; count: string }[]) =>
      rows.reduce<Record<number, number>>((acc, r) => {
        acc[r.branch_id] = Number(r.count) || 0;
        return acc;
      }, {});

    const therapistByBranch = toMap(therapistCountsRaw);
    const patientByBranch   = toMap(patientCountsRaw);
    const apptByBranch      = toMap(apptMonthCountsRaw);


    const response: BranchSummaryDto[] = branchRows.map(b => ({
      branch_id: b.branch_id,
      branch_name: b.name,
      therapists_count: therapistByBranch[b.branch_id] ?? 0,
      patients_count: patientByBranch[b.branch_id] ?? 0,
      appointments_count: apptByBranch[b.branch_id] ?? 0,
    }));

    return response;
  }



    // ---------- Patients Insights ----------
  async getPatientsInsights() {
    try {
      const now = new Date();

      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);

      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);

      // New patients
      const newPatientsWeek = await this.patientRepo.count({ where: { created_at: Between(weekAgo, now) } });
      const newPatientsMonth = await this.patientRepo.count({ where: { created_at: Between(monthAgo, now) } });

      // Gender distribution
      const maleCount = await this.patientRepo.count({ where: { legalgender: 'M' } });
      const femaleCount = await this.patientRepo.count({ where: { legalgender: 'F' } });
      const otherCount = await this.patientRepo.count({ where: { legalgender: Not(In(['M', 'F'])) } });

      // Branch distribution (patients → therapist → branch)
      const branchDistribution = await this.patientRepo
        .createQueryBuilder('p')
        .leftJoin('p.therapist', 't')
        .leftJoin('t.branches', 'b')
        .select('b.branch_id', 'branch_id')
        .addSelect('b.name', 'branch_name')
        .addSelect('COUNT(p.id)', 'count')
        .groupBy('b.branch_id')
        .addGroupBy('b.name')
        .getRawMany();

      // Age distribution
      const patients = await this.patientRepo.find({ select: ['birthdate'] });
      const ageGroups = { '0-12': 0, '13-25': 0, '26-40': 0, '41-60': 0, '60+': 0 };
      const currentYear = now.getFullYear();

    patients.forEach((p) => {
  if (!p.birthdate) return;

  const birthDate = new Date(p.birthdate); // <-- convert to Date
  const age = currentYear - birthDate.getFullYear();

  if (age <= 12) ageGroups['0-12']++;
  else if (age <= 25) ageGroups['13-25']++;
  else if (age <= 40) ageGroups['26-40']++;
  else if (age <= 60) ageGroups['41-60']++;
  else ageGroups['60+']++;
});

      const totalPatients = patients.length;
      const ageDistribution = Object.entries(ageGroups).map(([range, count]) => ({
        range,
        count,
        percentage: totalPatients ? Math.round((count / totalPatients) * 100) : 0,
      }));

      return {
        new_patients: { week: newPatientsWeek, month: newPatientsMonth },
        gender_distribution: { male: maleCount, female: femaleCount, other: otherCount },
        branch_distribution: branchDistribution.map(b => ({ branch_name: b.branch_name, count: Number(b.count) })),
        age_distribution: ageDistribution,
      };
    } catch (error) {
      this.handleError('GetPatientsInsights', error);
    }
  }
}
