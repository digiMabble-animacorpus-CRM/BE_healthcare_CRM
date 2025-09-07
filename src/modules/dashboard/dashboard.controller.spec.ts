import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let dashboardService: DashboardService;

  const mockDashboardService = {
    getAllDoctors: jest.fn(),
    getAllBranches: jest.fn(),
    getAppointmentStats: jest.fn(),
    getAppointmentDistribution: jest.fn(),
    getCalendarEvents: jest.fn(),
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
});
