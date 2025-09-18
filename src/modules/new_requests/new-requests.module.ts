import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewRequest } from './entities/new-request.entity';
import { NewRequestsService } from './new-requests.service';
import { NewRequestsController } from './new-requests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NewRequest])],
  providers: [NewRequestsService],
  controllers: [NewRequestsController],
})
export class NewRequestsModule {}
