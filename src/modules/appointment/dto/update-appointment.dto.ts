// src/modules/appointments/dto/update-appointment.dto.ts

import { PartialType, ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// Omit 'createdById' as it should not be updated. All other fields become optional.
export class UpdateAppointmentDto extends PartialType(
  OmitType(CreateAppointmentDto, ['createdById'] as const),
) {
  @ApiProperty({ description: 'ID of the team member modifying the appointment' })
  @IsNotEmpty()
  @IsString()
  modifiedById: string;
}