// src/modules/appointments/dto/findAll-appointments-query.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class FindAllAppointmentsQueryDto {
  @ApiProperty({ required: false, description: 'Search by patient name, email, etc.' })
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

  @ApiProperty({ 
    required: false, 
    example: 'pending',
    description: 'Filter by appointment status' 
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Filter by start date and time (ISO format) - beginning of date range' 
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Filter by end date and time (ISO format) - end of date range' 
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Filter by department ID' 
  })
  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @ApiProperty({ 
    required: false, 
    description: 'Filter by branch ID' 
  })
  @IsOptional()
  @IsNumber()
  branchId?: number;

  @ApiProperty({ 
    required: false, 
    description: 'Filter by patient ID (UUID)' 
  })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Filter by therapist ID' 
  })
  @IsOptional()
  @IsNumber()
  therapistId?: number;
}