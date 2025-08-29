// src/modules/appointments/dto/update-appointment.dto.ts

import { PartialType, ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

// Omit 'createdById' as it should not be updated. All other fields become optional.
export class UpdateAppointmentDto extends PartialType(
  OmitType(CreateAppointmentDto, ['createdById'] as const),
) {
  @ApiProperty({ description: 'ID of the team member modifying the appointment' })
  @IsNotEmpty()
  @IsString()
  modifiedById: string;

  @ApiProperty({ 
    example: 'confirmed', 
    description: 'Status for the appointment',
    required: false 
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ 
    description: 'Optional reason for status change or appointment modification',
    required: false 
  })
  @IsOptional()
  @IsString()
  reason?: string;
}