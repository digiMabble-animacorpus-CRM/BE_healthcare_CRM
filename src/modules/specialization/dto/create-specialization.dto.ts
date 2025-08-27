import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
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
}
