import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Therapist } from 'src/modules/therapist/entities/therapist.entity';
import Appointment from 'src/modules/appointment/entities/appointment.entity';
// Adjust if your Patient path differs:
import { Patient } from 'src/modules/customers/entities/patient.entity';

// IMPORTANT: we need TeamMemberService to resolve user → branches
import { TeamMemberModule } from 'src/modules/team-member/team-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, Therapist, Appointment, Patient]),
    TeamMemberModule, // <-- must export TeamMemberService from this module
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
