import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { BranchSummaryDto } from './dto/branch-summary.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { BranchGuard } from 'src/common/guards/branch.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard, BranchGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('branches/summary')
  @Roles('super_admin', 'admin', 'staff') // restrict roles if needed
  @Permissions({ module: 'dashboard', action: 'view' })
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
}
