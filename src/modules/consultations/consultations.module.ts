import { Module } from '@nestjs/common';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultation } from './entities/consultation.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Consultation])], 
  controllers: [ConsultationsController],
  providers: [ConsultationsService]
})
export class ConsultationsModule {}
