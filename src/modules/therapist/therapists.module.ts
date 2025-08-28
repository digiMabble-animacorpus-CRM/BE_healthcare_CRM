import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {    TherapistService } from './therapists.service';
import { TherapistController } from './therapists.controller';
import { Therapist } from './entities/therapist.entity';
import { Address } from '../addresses/entities/address.entity';
import { Language } from 'src/modules/language/entities/language.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Specialization } from 'src/modules/specialization/entities/specialization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Therapist, Address, Language,Branch,Specialization])],
  controllers: [TherapistController],
  providers: [TherapistService],
  exports: [TherapistService],
})
export class TherapistsModule {}
