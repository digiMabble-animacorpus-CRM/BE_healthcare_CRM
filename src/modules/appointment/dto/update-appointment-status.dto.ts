// src/modules/appointments/dto/update-appointment-status.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentStatusDto {
  @ApiProperty({ 
    enum: AppointmentStatus, 
    example: AppointmentStatus.CONFIRMED, 
    description: 'New status for the appointment' 
  })
  @IsNotEmpty()
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @ApiProperty({ 
    description: 'ID of the team member updating the status',
    example: "db571dc0-1164-4528-bcd5-3d909aff3511" 
  })
  @IsNotEmpty()
  @IsString()
  modifiedById: string;

  @ApiProperty({ 
    description: 'Optional reason for status change',
    required: false 
  })
  @IsString()
  reason?: string;
}
