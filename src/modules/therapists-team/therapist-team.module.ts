import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TherapistTeamService } from './therapist-team.service';
import { TherapistTeamController } from './therapist-team.controller';
import { TherapistMember } from 'src/modules/therapists-team/entities/therapist-team.entity';
import { Department } from '../Department/entities/department.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Specialization } from 'src/modules/specialization/entities/specialization.entity';
import { AppLanguage } from 'src/modules/languages/entities/app-languages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TherapistMember, Department, Branch, Specialization, AppLanguage])],
  controllers: [TherapistTeamController],
  providers: [TherapistTeamService],
  exports: [TherapistTeamService, TypeOrmModule],
})
export class TherapistTeamModule {}
