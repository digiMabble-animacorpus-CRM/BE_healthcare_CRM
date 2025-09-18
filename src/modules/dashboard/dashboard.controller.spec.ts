import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Patient } from 'src/modules/customers/entities/patient.entity';
import { TeamMemberService } from 'src/modules/team-member/team-member.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let dashboardService: DashboardService;

  const mockDashboardService = {
    getAllDoctors: jest.fn(),
    getAllBranches: jest.fn(),
    getAppointmentStats: jest.fn(),
    getAppointmentDistribution: jest.fn(),
    getCalendarEvents: jest.fn(),
    gwtPatientsInsights: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: mockDashboardService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    dashboardService = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

//   describe('getDoctors', () => {
//     it('should return array of doctors', async () => {
//       const mockDoctors = [
//         { id: 1, name: 'Dr. Martin' },
//         { id: 2, name: 'Dr. Clara' },
//       ];
      
//       mockDashboardService.getAllDoctors.mockResolvedValue(mockDoctors);
      
//       const result = await controller.getDoctors();
      
//       expect(dashboardService.getAllDoctors).toHaveBeenCalled();
//       expect(result.data).toEqual(mockDoctors);
//     });
//   });

//   describe('getBranches', () => {
//     it('should return array of branches', async () => {
//       const mockBranches = [
//         { id: 1, name: 'Orneau' },
//         { id: 2, name: 'Tout Vent' },
//       ];
      
//       mockDashboardService.getAllBranches.mockResolvedValue(mockBranches);
      
//       const result = await controller.getBranches();
      
//       expect(dashboardService.getAllBranches).toHaveBeenCalled();
//       expect(result.data).toEqual(mockBranches);
//     });
//   });

  describe('getAppointmentStats', () => {
    it('should return appointment statistics', async () => {
      const mockStats = {
        total: 6,
        completed: 0,
        cancellations: 0,
        pending: 6,
      };
      
      const query = {
        startDate: '2025-09-01T00:00:00Z',
        endDate: '2025-09-30T23:59:59Z',
      };
      
      mockDashboardService.getAppointmentStats.mockResolvedValue(mockStats);
      
      const result = await controller.getAppointmentStats(query);
      
      expect(dashboardService.getAppointmentStats).toHaveBeenCalledWith(query);
      expect(result.data).toEqual(mockStats);
    });
  });

  describe('getAppointmentDistribution', () => {
    it('should return appointment distribution', async () => {
      const mockDistribution = {
        totalAppointments: 6,
        distribution: [
          { id: 1, name: 'Dr. Martin', count: 2, percentage: 33.3 },
          { id: 2, name: 'Dr. Clara', count: 2, percentage: 33.3 },
        ],
      };
      
      const query = {
        groupBy: 'doctor' as 'doctor',
        startDate: '2025-09-01T00:00:00Z',
        endDate: '2025-09-30T23:59:59Z',
      };
      
      mockDashboardService.getAppointmentDistribution.mockResolvedValue(mockDistribution);
      
      const result = await controller.getAppointmentDistribution(query);
      
      expect(dashboardService.getAppointmentDistribution).toHaveBeenCalledWith(query);
      expect(result.data).toEqual(mockDistribution);
    });
  });

  describe('getCalendarEvents', () => {
    it('should return calendar events', async () => {
      const mockEvents = [
        {
          id: 1,
          title: '2-4p Inte...',
          start: new Date('2025-09-05T14:00:00Z'),
          end: new Date('2025-09-05T16:00:00Z'),
          status: 'pending',
          doctor: { id: 1, name: 'Dr. Martin' },
          branch: { id: 1, name: 'Orneau' },
        },
      ];
      
      const query = {
        startDate: '2025-09-01T00:00:00Z',
        endDate: '2025-09-30T23:59:59Z',
      };
      
      mockDashboardService.getCalendarEvents.mockResolvedValue(mockEvents);
      
      const result = await controller.getCalendarEvents(query);
      
      expect(dashboardService.getCalendarEvents).toHaveBeenCalledWith(query);
      expect(result.data).toEqual(mockEvents);
    });
  });



describe('DashboardService - getPatientsInsights', () => {
    let service: DashboardService;
    let patientRepo: Repository<Patient>;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          DashboardService,
          {
            provide: getRepositoryToken(Patient),
            useValue: {
              count: jest.fn(),
              find: jest.fn(),
              createQueryBuilder: jest.fn().mockReturnValue({
                leftJoin: jest.fn().mockReturnThis(),
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                groupBy: jest.fn().mockReturnThis(),
                addGroupBy: jest.fn().mockReturnThis(),
                getRawMany: jest.fn().mockResolvedValue([
                  { branch_id: 1, branch_name: 'Main Branch', count: '5' },
                  { branch_id: 2, branch_name: 'Side Branch', count: '3' },
                ]),
                getMany: jest.fn(),
              }),
            },
          },
          {
            provide: TeamMemberService,
            useValue: { findByUserId: jest.fn() },
          },
        ],
      }).compile();

      service = module.get<DashboardService>(DashboardService);
      patientRepo = module.get<Repository<Patient>>(getRepositoryToken(Patient));
    });

    it('should return patients insights including age, gender, and branch distribution', async () => {
      // Mock count responses
      (patientRepo.count as jest.Mock).mockImplementation(({ where }) => {
        if (where.legalgender === 'M') return 10;
        if (where.legalgender === 'F') return 15;
        if (where.legalgender && Object.values(where).some(v => v instanceof Object)) return 5; // other
        return 20; // default for created_at
      });

      // Mock find for age distribution
      (patientRepo.find as jest.Mock).mockResolvedValue([
        { birthdate: new Date('2015-01-01T00:00:00.000Z') }, // 10 yrs
        { birthdate: new Date('2000-01-01T00:00:00.000Z') }, // 25 yrs
        { birthdate: new Date('1980-01-01T00:00:00.000Z') }, // 45 yrs
      ]);

      const result = await service.getPatientsInsights();
      console.log(result);

      expect(result.new_patients.week).toBeDefined();
      expect(result.gender_distribution.male).toBe(10);
      expect(result.age_distribution.length).toBeGreaterThan(0);
      expect(result.branch_distribution.length).toBe(2);
      expect(result.branch_distribution[0].branch_name).toBe('Main Branch');
    });
  });

  
});
