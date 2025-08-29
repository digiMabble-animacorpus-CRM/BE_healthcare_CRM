// src/modules/appointments/dto/create-appointment.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 1, description: 'ID of the existing branch' })
  @IsNotEmpty()
  @IsNumber()
  branchId: number;

  @ApiProperty({ example: "db571dc0-1164-4528-bcd5-3d909aff3511", description: 'ID (UUID) of the existing customer' })
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @ApiProperty({ example: '2025-11-15', description: 'Date of appointment (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ example: '11:00', description: 'Start time of appointment (HH:MM)' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({ example: '11:30', description: 'End time of appointment (HH:MM)' })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({ 
    example: 'pending', 
    description: 'Status of the appointment',
    required: false,
    default: 'pending' 
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'consultation', description: 'Reason for the visit' })
  @IsNotEmpty()
  @IsString()
  purposeOfVisit: string;

  @ApiProperty({ example: 1, description: 'ID of the department' })
  @IsNotEmpty()
  @IsNumber()
  departmentId: number;

  @ApiProperty({ required: false, example: 1, description: 'ID of the specialization (optional)' })
  @IsOptional()
  @IsNumber()
  specializationId?: number;

  @ApiProperty({ required: false, example: 'Patient reports recurring back pain.', description: 'Optional details' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 4, description: 'ID of the appointed therapist' })
  @IsNotEmpty()
  @IsNumber()
  therapistId: number;

  @ApiProperty({ example:"db571dc0-1164-4528-bcd5-3d909aff3511",description: 'ID (UUID) of the team member creating the appointment (usually from auth token)' })
  @IsNotEmpty()
  @IsString()
  createdById: string;
}