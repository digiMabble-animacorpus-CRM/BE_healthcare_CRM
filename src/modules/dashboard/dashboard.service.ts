import { Injectable, HttpException, ForbiddenException,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In ,Between , Not, IsNull} from 'typeorm';
import { logger } from 'src/core/utils/logger';
import { EC500, EM100 } from 'src/core/constants';
import Appointment from '../appointment/entities/appointment.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Patient } from 'src/modules/customers/entities/patient.entity';
import { DashboardQueryDto, DistributionQueryDto } from './dto/dashboard-query.dto';
import { BranchSummaryDto } from './dto/branch-summary.dto';
import { 
  AppointmentStats, 
  AppointmentDistribution, 
  CalendarEvent
} from './interfaces/dashboard.interface';
import User from 'src/modules/users/entities/user.entity';
import { TherapistMember } from 'src/modules/therapists-team/entities/therapist-team.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Appointment) private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(TherapistMember) private readonly therapistMemberRepo: Repository<TherapistMember>,
  ) {}

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

  private getDateRangeFromTimeFilter(timeFilter: string): { startDate: Date; endDate: Date } {
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    
    switch (timeFilter) {
      case 'thisWeek': {
        const dayOfWeek = today.getUTCDay();
        const mondayDiff = dayOfWeek === 0 ? -6 : -(dayOfWeek - 1);
        const startDate = new Date(today);
        startDate.setUTCDate(today.getUTCDate() + mondayDiff);
        startDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setUTCDate(startDate.getUTCDate() + 6);
        endDate.setUTCHours(23, 59, 59, 999);
        
        return { startDate, endDate };
      }
      
      case 'lastWeek': {
        const dayOfWeek = today.getUTCDay();
        const mondayDiff = dayOfWeek === 0 ? -6 : -(dayOfWeek - 1);
        const startDate = new Date(today);
        startDate.setUTCDate(today.getUTCDate() + mondayDiff - 7);
        startDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setUTCDate(startDate.getUTCDate() + 6);
        endDate.setUTCHours(23, 59, 59, 999);
        return { startDate, endDate };
      }
      
      case 'thisMonth': {
        const startDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
        startDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0));
        endDate.setUTCHours(23, 59, 59, 999);
        return { startDate, endDate };
      }
      
      case 'lastMonth': {
        const startDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));
        startDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 0));
        endDate.setUTCHours(23, 59, 59, 999);
        return { startDate, endDate };
      }
      
      default:
        logger.warn(`Dashboard_DateRangeCalculation: Unknown timeFilter="${timeFilter}"`);
        return null;
    }
  }

  private applyDateFilters(query: any, dashboardQuery: DashboardQueryDto): any {
    if (dashboardQuery.timeFilter) {
      const dateRange = this.getDateRangeFromTimeFilter(dashboardQuery.timeFilter);
      if (dateRange) {
        logger.info(`Dashboard_DateFilter: timeFilter=${dashboardQuery.timeFilter}, range=${dateRange.startDate.toISOString()} to ${dateRange.endDate.toISOString()}`);
        
        query.andWhere('a.startTime <= :endDate', { endDate: dateRange.endDate });
        query.andWhere('a.endTime >= :startDate', { startDate: dateRange.startDate });
        
        const sqlQuery = query.getSql();
        const parameters = query.getParameters();
        logger.info(`Dashboard_DateFilter_SQL: ${sqlQuery}`);
        logger.info(`Dashboard_DateFilter_Params: ${JSON.stringify(parameters)}`);
      } else {
        logger.warn(`Dashboard_DateFilter: No date range returned for timeFilter=${dashboardQuery.timeFilter}`);
      }
    } else {
      if (dashboardQuery.startDate) {
        query.andWhere('a.endTime >= :startDate', { startDate: new Date(dashboardQuery.startDate) });
      }
      if (dashboardQuery.endDate) {
        query.andWhere('a.startTime <= :endDate', { endDate: new Date(dashboardQuery.endDate) });
      }
    }
    return query;
  }

  async getAppointmentStats(query: DashboardQueryDto): Promise<AppointmentStats> {
    try {
      logger.info(`Dashboard_GetAppointmentStats_Entry: ${JSON.stringify(query)}`);

      let statsQuery = this.appointmentRepository.createQueryBuilder('a')
        .where('a.deleted_at IS NULL');

        console.log(`Dashboard_GetAppointmentStats_Query: ${statsQuery.getQuery()}`);
        
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

      const totalWithoutDateFilter = await this.appointmentRepository
        .createQueryBuilder('a')
        .where('a.deleted_at IS NULL')
        .getCount();
      
      logger.info(`Dashboard_AppointmentStats_Debug: Total appointments in DB (non-deleted): ${totalWithoutDateFilter}`);

      const total = await statsQuery.getCount();
      
      logger.info(`Dashboard_AppointmentStats_Debug: Total appointments after filters: ${total}`);

      const sampleAppointments = await this.appointmentRepository
        .createQueryBuilder('a')
        .select(['a.id', 'a.startTime', 'a.endTime', 'a.deleted_at'])
        .where('a.deleted_at IS NULL')
        .limit(3)
        .getMany();
      
      logger.info(`Dashboard_AppointmentStats_Debug: Sample appointments: ${JSON.stringify(sampleAppointments.map(a => ({
        id: a.id,
        startTime: a.startTime,
        endTime: a.endTime,
        deleted_at: a.deleted_at
      })))}`);

      let statusQuery = this.appointmentRepository
        .createQueryBuilder('a')
        .select('a.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .where('a.deleted_at IS NULL');

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

  async getAppointmentDistribution(query: DistributionQueryDto): Promise<AppointmentDistribution> {
    try {
      logger.info(`Dashboard_GetAppointmentDistribution_Entry: ${JSON.stringify(query)}`);

      const groupBy = query.groupBy || 'doctor';
      
      let distributionQuery = this.appointmentRepository.createQueryBuilder('a')
        .where('a.deleted_at IS NULL');

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

      distributionQuery = this.applyDateFilters(distributionQuery, query);

      if (query.doctorId && groupBy !== 'doctor') {
        distributionQuery
          .leftJoin('a.therapist', 'therapist')
          .andWhere('therapist.therapistId = :doctorId', { doctorId: query.doctorId });
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

  async getCalendarEvents(query: DashboardQueryDto): Promise<CalendarEvent[]> {
    try {
      logger.info(`Dashboard_GetCalendarEvents_Entry: ${JSON.stringify(query)}`);

      let calendarQuery = this.appointmentRepository.createQueryBuilder('a')
        .leftJoinAndSelect('a.therapist', 'therapist')
        .leftJoinAndSelect('a.branch', 'branch')
        .leftJoinAndSelect('a.patient', 'patient')
        .where('a.deleted_at IS NULL');

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
        title: appointment.purposeOfVisit || 'Appointment',
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




async getBranchesSummaryForUser(
  user: { user_id?: number; id?: number; role: string },
  query?: DashboardQueryDto
): Promise<BranchSummaryDto[]> {
  const userId = user.user_id ?? user.id;
  if (!userId) throw new ForbiddenException('Missing user id');

  const userEntity = await this.userRepo.findOne({
    where: { id: userId },
    relations: ['therapistTeamMembers', 'therapistTeamMembers.branches'],
  });

  if (!userEntity) throw new NotFoundException(`User not found`);

  // determine accessible branches
  let branchRows: { branch_id: number; branch_name: string }[] = [];
  if (user.role === 'super_admin') {
    const allBranches = await this.branchRepo.find();
    branchRows = allBranches.map(b => ({ branch_id: b.branch_id, branch_name: b.name }));
  } else {
    const branchesSet = new Map<number, string>();
    (Array.isArray(userEntity.therapistTeamMembers) ? userEntity.therapistTeamMembers : []).forEach(ttm => {
      (ttm?.branches || []).forEach(b => branchesSet.set(b.branch_id, b.branch_name));
    });
    branchRows = Array.from(branchesSet, ([branch_id, branch_name]) => ({ branch_id, branch_name }));
  }

  if (!branchRows.length) return [];
  const branchIds = branchRows.map(b => b.branch_id);

  // therapist count
  const therapistCountsRaw = await this.therapistMemberRepo
    .createQueryBuilder('ttm')
    .innerJoin('ttm.branches', 'b')
    .where('b.branch_id IN (:...branchIds)', { branchIds })
    .andWhere('ttm.deleted_at IS NULL')
    .select('b.branch_id', 'branch_id')
    .addSelect('COUNT(DISTINCT ttm.therapist_id)', 'count')
    .groupBy('b.branch_id')
    .getRawMany<{ branch_id: number; count: string }>();

  // patients count
  const patientCountsRaw = await this.appointmentRepository
    .createQueryBuilder('a')
    .innerJoin('a.branch', 'b')
    .innerJoin('a.patient', 'p')
    .where('b.branch_id IN (:...branchIds)', { branchIds })
    .andWhere('a.deleted_at IS NULL')
    .select('b.branch_id', 'branch_id')
    .addSelect('COUNT(DISTINCT p.id)', 'count')
    .groupBy('b.branch_id')
    .getRawMany<{ branch_id: number; count: string }>();

  // appointments count with dynamic date range
  let apptQuery = this.appointmentRepository
    .createQueryBuilder('a')
    .innerJoin('a.branch', 'b')
    .where('b.branch_id IN (:...branchIds)', { branchIds })
    .andWhere('a.deleted_at IS NULL');

  if (query?.timeFilter) {
    const { startDate, endDate } = this.getDateRangeFromTimeFilter(query.timeFilter);
    apptQuery.andWhere('a.startTime >= :startDate AND a.startTime <= :endDate', { startDate, endDate });
  } else if (query?.startDate && query?.endDate) {
    apptQuery.andWhere('a.startTime >= :startDate AND a.startTime <= :endDate', {
      startDate: new Date(query.startDate),
      endDate: new Date(query.endDate),
    });
  }

  const apptMonthCountsRaw = await apptQuery
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
  const patientByBranch = toMap(patientCountsRaw);
  const apptByBranch = toMap(apptMonthCountsRaw);

  return branchRows.map(b => ({
    branch_id: b.branch_id,
    branch_name: b.branch_name,
    therapists_count: therapistByBranch[b.branch_id] ?? 0,
    patients_count: patientByBranch[b.branch_id] ?? 0,
    appointments_count: apptByBranch[b.branch_id] ?? 0,
  }));
}



async getPatientsInsights(query?: DashboardQueryDto) {
  try {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);

    // Fetch all branches
    const branches = await this.branchRepo.find({ select: ['branch_id', 'name'] });
    if (!branches.length) return [];

    const branchInsights = [];

    for (const branch of branches) {
      // --- New Patients (This Week / This Month) ---
      const newPatientsWeek = await this.patientRepo
        .createQueryBuilder('p')
        .leftJoin('p.therapist', 't')
        .leftJoin('t.branches', 'b')
        .where('b.branch_id = :branchId', { branchId: branch.branch_id })
        .andWhere('p.created_at BETWEEN :weekAgo AND :now', { weekAgo, now })
        .getCount();

      const newPatientsMonth = await this.patientRepo
        .createQueryBuilder('p')
        .leftJoin('p.therapist', 't')
        .leftJoin('t.branches', 'b')
        .where('b.branch_id = :branchId', { branchId: branch.branch_id })
        .andWhere('p.created_at BETWEEN :monthAgo AND :now', { monthAgo, now })
        .getCount();

      // --- Gender Distribution ---
      const maleCount = await this.patientRepo
        .createQueryBuilder('p')
        .leftJoin('p.therapist', 't')
        .leftJoin('t.branches', 'b')
        .where('b.branch_id = :branchId', { branchId: branch.branch_id })
        .andWhere('LOWER(p.legalgender) IN (:...maleValues)', { maleValues: ['m', 'male'] })
        .getCount();

      const femaleCount = await this.patientRepo
        .createQueryBuilder('p')
        .leftJoin('p.therapist', 't')
        .leftJoin('t.branches', 'b')
        .where('b.branch_id = :branchId', { branchId: branch.branch_id })
        .andWhere('LOWER(p.legalgender) IN (:...femaleValues)', { femaleValues: ['f', 'female'] })
        .getCount();

      const otherCount = await this.patientRepo
        .createQueryBuilder('p')
        .leftJoin('p.therapist', 't')
        .leftJoin('t.branches', 'b')
        .where('b.branch_id = :branchId', { branchId: branch.branch_id })
        .andWhere('LOWER(p.legalgender) NOT IN (:...validValues)', { validValues: ['m', 'male', 'f', 'female'] })
        .getCount();

      // --- Age Distribution ---
      const patients = await this.patientRepo
        .createQueryBuilder('p')
        .leftJoin('p.therapist', 't')
        .leftJoin('t.branches', 'b')
        .where('b.branch_id = :branchId', { branchId: branch.branch_id })
        .select(['p.birthdate'])
        .getMany();

      const ageGroups = { '0-12': 0, '13-25': 0, '26-40': 0, '41-60': 0, '60+': 0 };
      const currentYear = now.getFullYear();

      patients.forEach(p => {
        if (!p.birthdate) return;
        const birthDate = new Date(p.birthdate);
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

      // --- Appointment Count (Branchwise) ---
      const appointmentCount = await this.appointmentRepository
        .createQueryBuilder('a')
        .leftJoin('a.branch', 'b')
        .where('b.branch_id = :branchId', { branchId: branch.branch_id })
        .andWhere('a.deleted_at IS NULL')
        .getCount();

      branchInsights.push({
        branch_id: branch.branch_id,
        branch_name: branch.name,
        new_patients: { week: newPatientsWeek, month: newPatientsMonth },
        gender_distribution: { male: maleCount, female: femaleCount, other: otherCount },
        age_distribution: ageDistribution,
        appointments_count: appointmentCount,
      });
    }

    return branchInsights;
  } catch (error) {
    this.handleError('GetPatientsInsights', error);
  }
}




}
