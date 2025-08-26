// src/modules/appointments/dto/create-appointment.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { PurposeOfVisit, Department } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @ApiProperty({ example: "db571dc0-1164-4528-bcd5-3d909aff3511", description: 'ID (UUID) of the existing branch' })
  @IsNotEmpty()
  @IsString()
  branchId: string;

  @ApiProperty({ example: "db571dc0-1164-4528-bcd5-3d909aff3511", description: 'ID (UUID) of the existing customer' })
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @ApiProperty({ example: '2025-11-15', description: 'Date of appointment (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ example: '11:00 - 11:30', description: 'Time slot for the appointment' })
  @IsNotEmpty()
  @IsString()
  timeslot: string;

  @ApiProperty({ enum: PurposeOfVisit, example: PurposeOfVisit.CONSULTATION, description: 'Reason for the visit' })
  @IsNotEmpty()
  @IsEnum(PurposeOfVisit)
  purposeOfVisit: PurposeOfVisit;

  @ApiProperty({ enum: Department, example: Department.PHYSIOTHERAPY, description: 'Relevant department' })
  @IsNotEmpty()
  @IsEnum(Department)
  department: Department;

  @ApiProperty({ required: false, example: 'Patient reports recurring back pain.', description: 'Optional details' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 4, description: 'ID of the appointed therapist' })
  @IsNotEmpty()
  @IsNumber()
  therapistKey: number;

  @ApiProperty({ example:"db571dc0-1164-4528-bcd5-3d909aff3511",description: 'ID (UUID) of the team member creating the appointment (usually from auth token)' })
  @IsNotEmpty()
  @IsString()
  createdById: string;
}