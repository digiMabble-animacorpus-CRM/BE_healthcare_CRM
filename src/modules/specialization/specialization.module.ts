import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecializationController } from './specialization.controller';
import { SpecializationService } from './specialization.service';
import { Specialization } from './entities/specialization.entity';
import { Department } from '../Department/entities/department.entity';
import { Therapist } from '../therapist/entities/therapist.entity';
import { Patient } from '../customers/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Specialization, Department, Therapist, Patient])],
  controllers: [SpecializationController],
  providers: [SpecializationService],
  exports: [SpecializationService],
})
export class SpecializationModule {}