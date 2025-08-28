import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecializationController } from './specialization.controller';
import { SpecializationService } from './specialization.service';
import { Specialization } from './entities/specialization.entity';
import { Department } from '../Department/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Specialization, Department])],
  controllers: [SpecializationController],
  providers: [SpecializationService],
  exports: [SpecializationService],
})
export class SpecializationModule {}