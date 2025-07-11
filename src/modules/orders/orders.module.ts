import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import Property from '../properties/entities/property.entity';
import { Customer } from '../customers/entities/customer.entity';
import Order from './entities/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Property, Customer])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}