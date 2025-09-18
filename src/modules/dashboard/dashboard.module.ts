import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import Appointment from '../appointment/entities/appointment.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Therapist } from 'src/modules/therapist/entities/therapist.entity';
import { Patient } from 'src/modules/customers/entities/patient.entity';
import { TeamMemberModule } from 'src/modules/team-member/team-member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      Branch,
      Therapist,
      Patient,
    ]),
    TeamMemberModule, // Required for user -> branches resolution
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
