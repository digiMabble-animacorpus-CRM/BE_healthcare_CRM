import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  IsEnum,
  IsInt,
} from 'class-validator';
import { SpecializationType } from '../entities/specialization.entity';

export class CreateSpecializationDto {
  @ApiProperty({ description: 'Reference to Department' })
  @IsInt()
  @IsNotEmpty()
  department_id: number;

  @ApiProperty({ description: 'ID of the doctor (therapist)' })
  @IsInt()
  @IsNotEmpty()
  doctor_id: number;

  @ApiProperty({ description: 'ID of the patient' })
  @IsUUID()
  @IsNotEmpty()
  patient_id: string;

  @ApiProperty({
    enum: SpecializationType,
    description: 'Type of specialization',
  })
  @IsEnum(SpecializationType)
  @IsNotEmpty()
  specialization_type: SpecializationType;

  @ApiProperty({
    description: 'Extra info about this specialization',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The ID of the consultation this specialization belongs to.',
  })
  @IsUUID()
  @IsNotEmpty()
  consultation_id: string;
}
