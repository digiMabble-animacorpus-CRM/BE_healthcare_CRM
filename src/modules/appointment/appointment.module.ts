import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentsController } from './appointment.controller';
import { AppointmentsService } from './appointment.service';
import Appointment from './entities/appointment.entity';
import { Therapist } from '../therapist/entities/therapist.entity';
import { TeamMember } from 'src/modules/team-member/entities/team-member.entity';
import { Patient } from '../customers/entities/patient.entity';
import { Branch } from '../branches/entities/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment,Therapist,Patient, TeamMember,Branch])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}