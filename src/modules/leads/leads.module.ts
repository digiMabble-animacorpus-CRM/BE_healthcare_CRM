import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { Lead } from './entities/lead.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Address } from '../addresses/entities/address.entity';
import Property from '../properties/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Customer, Address, Property])],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}