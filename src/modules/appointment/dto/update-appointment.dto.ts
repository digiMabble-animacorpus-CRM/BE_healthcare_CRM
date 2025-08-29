// src/modules/appointments/dto/update-appointment.dto.ts

import { PartialType, ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

// Omit 'createdById' as it should not be updated. All other fields become optional.
export class UpdateAppointmentDto extends PartialType(
  OmitType(CreateAppointmentDto, ['createdById'] as const),
) {
  @ApiProperty({ description: 'ID of the team member modifying the appointment' })
  @IsNotEmpty()
  @IsString()
  modifiedById: string;

  @ApiProperty({ 
    enum: AppointmentStatus, 
    example: AppointmentStatus.CONFIRMED, 
    description: 'Status for the appointment',
    required: false 
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiProperty({ 
    description: 'Optional reason for status change or appointment modification',
    required: false 
  })
  @IsOptional()
  @IsString()
  reason?: string;
}