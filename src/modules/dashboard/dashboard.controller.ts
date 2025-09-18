import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import HandleResponse from 'src/core/utils/handle_response';
import { EC200 } from 'src/core/constants';
import { DashboardService } from './dashboard.service';
import { DashboardQueryDto, DistributionQueryDto } from './dto/dashboard-query.dto';
import { BranchSummaryDto } from './dto/branch-summary.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { BranchGuard } from 'src/common/guards/branch.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiTags('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard, BranchGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Handles common error responses.
   */
  private handleError(error: any) {
    if (error instanceof Error) {
      return HandleResponse.buildErrObj(500, error.message, error);
    }
    return HandleResponse.buildErrObj(500, 'Internal server error', error);
  }

  @Get('appointments/stats')
  @Roles('super_admin', 'admin', 'staff')
  @Permissions({ module: 'appointments', action: 'view' })
  @ApiOperation({ summary: 'Get appointment statistics for dashboard summary cards' })
  @ApiResponse({ 
    status: 200, 
    description: 'Appointment statistics retrieved successfully. Supports timeFilter (thisWeek, lastWeek, thisMonth, lastMonth) or custom date ranges.',
    schema: {
      example: {
        total: 6,
        completed: 0,
        cancellations: 0,
        pending: 6
      }
    }
  })
  async getAppointmentStats(@Query() query: DashboardQueryDto) {
    try {
      const data = await this.dashboardService.getAppointmentStats(query);
      return HandleResponse.buildSuccessObj(EC200, 'Appointment statistics retrieved successfully.', data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('appointments/distribution')
  @Roles('super_admin', 'admin', 'staff')
  @Permissions({ module: 'appointments', action: 'view' })
  @ApiOperation({ summary: 'Get appointment distribution for charts and breakdown cards' })
  @ApiResponse({ 
    status: 200, 
    description: 'Appointment distribution retrieved successfully. Supports timeFilter (thisWeek, lastWeek, thisMonth, lastMonth) or custom date ranges.',
    schema: {
      example: {
        totalAppointments: 6,
        distribution: [
          { id: 1, name: "Dr. Martin", count: 2, percentage: 33.3 },
          { id: 2, name: "Dr. Clara", count: 2, percentage: 33.3 },
          { id: 3, name: "Dr. Paul", count: 2, percentage: 33.3 }
        ]
      }
    }
  })
  async getAppointmentDistribution(@Query() query: DistributionQueryDto) {
    try {
      const data = await this.dashboardService.getAppointmentDistribution(query);
      return HandleResponse.buildSuccessObj(EC200, 'Appointment distribution retrieved successfully.', data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('appointments/calendar')
  @Roles('super_admin', 'admin', 'staff')
  @Permissions({ module: 'appointments', action: 'view' })
  @ApiOperation({ summary: 'Get appointments for calendar view' })
  @ApiResponse({ 
    status: 200, 
    description: 'Calendar events retrieved successfully. Supports timeFilter (thisWeek, lastWeek, thisMonth, lastMonth) or custom date ranges.',
    schema: {
      example: [
        {
          id: 1,
          title: "Internal Medicine",
          start: "2025-09-05T14:00:00Z",
          end: "2025-09-05T16:00:00Z",
          status: "pending",
          doctor: { id: 1, name: "Dr. Martin" },
          branch: { id: 1, name: "Orneau" },
          patient: { id: "uuid-123", name: "John Doe" }
        }
      ]
    }
  })
  async getCalendarEvents(@Query() query: DashboardQueryDto) {
    try {
      const data = await this.dashboardService.getCalendarEvents(query);
      return HandleResponse.buildSuccessObj(EC200, 'Calendar events retrieved successfully.', data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get('branches/summary')
  @Roles('super_admin', 'admin', 'staff')
  // @Permissions({ module: 'dashboard', action: 'view' })
  @ApiOperation({ summary: 'Get branch-wise dashboard stats (therapists, patients, appointments)' })
  @ApiResponse({ status: 200, description: 'Branch summary counts', type: [BranchSummaryDto] })
  async getBranchSummary(@Req() req): Promise<BranchSummaryDto[]> {
    const user = {
      user_id: req.user?.user_id ?? req.user?.id,
      role: req.user?.role,
      team_id: req.user?.team_id,
    };
    return this.dashboardService.getBranchesSummaryForUser(user);
  }



  @Get('patients')
@Roles('super_admin', 'admin', 'staff')
@ApiOperation({ summary: 'Get patients insights for dashboard' })
async getPatientsInsights() {
  try {
    const data = await this.dashboardService.getPatientsInsights();
    return HandleResponse.buildSuccessObj(EC200, 'Patients insights retrieved successfully.', data);
  } catch (error) {
    return this.handleError(error);
  }
}

}
