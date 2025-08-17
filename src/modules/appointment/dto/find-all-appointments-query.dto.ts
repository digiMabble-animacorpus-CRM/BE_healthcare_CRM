// src/modules/appointments/dto/findAll-appointments-query.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class FindAllAppointmentsQueryDto {
  @ApiProperty({ required: false, description: 'Search by customer name, email, etc.' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Page number for pagination' })
  @IsOptional()
  @IsNumber()
  pagNo?: number;

  @ApiProperty({ required: false, description: 'Number of items per page' })
  @IsOptional()
  @IsNumber()
  limit?: number;
}