import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {    TherapistService } from './therapists.service';
import { TherapistController } from './therapists.controller';
import { Therapist } from './entities/therapist.entity';
import { Address } from '../addresses/entities/address.entity';
import { Language } from 'src/modules/Language/entities/Language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Therapist, Address, Language])],
  controllers: [TherapistController],
  providers: [TherapistService],
  exports: [TherapistService],
})
export class TherapistsModule {}
