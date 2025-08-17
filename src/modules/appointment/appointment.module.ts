import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from '../customers/entities/customer.entity';
import { AppointmentsController } from './appointment.controller';
import { AppointmentsService } from './appointment.service';
import { Staff } from '../StaffType/entities/staff.entity';
import Appointment from './entities/appointment.entity';
import { Therapist } from '../therapist/entities/therapist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment,Therapist, Staff, Customer])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}