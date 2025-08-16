// src/modules/function-description/function-description.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FunctionDescriptionController } from './function-description.controller';
import { FunctionDescriptionService } from './function-description.service';
import { FunctionDescription } from './entities/function-description.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FunctionDescription])],
  controllers: [FunctionDescriptionController],
  providers: [FunctionDescriptionService],
  exports: [FunctionDescriptionService],
})
export class FunctionDescriptionModule {}