import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  PatientsService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Address } from '../addresses/entities/address.entity';
import { Patient } from './entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Address])],
  controllers: [CustomersController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class CustomersModule { }