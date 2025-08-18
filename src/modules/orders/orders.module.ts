import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import Property from '../properties/entities/property.entity';
import { Patient } from '../customers/entities/patient.entity';
import Order from './entities/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Property, Patient])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
