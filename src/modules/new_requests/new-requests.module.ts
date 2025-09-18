import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewRequest } from './entities/new-request.entity';
import { NewRequestsService } from './new-requests.service';
import { NewRequestsController } from './new-requests.controller';
import { AppointmentManagement } from './entities/appointment-management.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewRequest, AppointmentManagement])],
  providers: [NewRequestsService],
  controllers: [NewRequestsController],
})
export class NewRequestsModule {}
