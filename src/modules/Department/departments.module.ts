import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { Department } from './entities/department.entity';
import { Therapist } from 'src/modules/therapist/entities/therapist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department,Therapist])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService], // in case you need it elsewhere
})
export class DepartmentsModule {}
